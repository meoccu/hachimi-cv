import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { setAuthCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code || !state) return NextResponse.json({ error: "missing code/state" }, { status: 400 });
  const ok = await redis.del(`oauth:gh:${state}`);
  if (!ok) return NextResponse.json({ error: "invalid state" }, { status: 400 });

  const tokRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code, redirect_uri: process.env.GITHUB_CALLBACK_URL,
    }),
  });
  const tokJson = await tokRes.json();
  const accessToken = tokJson.access_token;
  if (!accessToken) return NextResponse.json({ error: "no access_token" }, { status: 400 });

  const ghUser = await (await fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${accessToken}` } })).json();
  const emails = await (await fetch("https://api.github.com/user/emails", { headers: { Authorization: `Bearer ${accessToken}` } })).json();
  const primaryEmail = (emails.find?.((e: any) => e.primary)?.email) || ghUser.email || `${ghUser.id}@users.noreply.github.com`;

  const acct = await prisma.oAuthAccount.findUnique({ where: { provider_providerUid: { provider: "github", providerUid: String(ghUser.id) } } });
  let userId: string;
  if (acct) {
    userId = acct.userId;
    await prisma.oAuthAccount.update({ where: { id: acct.id }, data: { accessToken, raw: ghUser } });
  } else {
    let user = await prisma.user.findUnique({ where: { email: primaryEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: primaryEmail, name: ghUser.name || ghUser.login, avatarUrl: ghUser.avatar_url, emailVerifiedAt: new Date() },
      });
    }
    await prisma.oAuthAccount.create({
      data: { userId: user.id, provider: "github", providerUid: String(ghUser.id), accessToken, raw: ghUser },
    });
    userId = user.id;
  }
  await setAuthCookie(userId);
  return NextResponse.redirect(new URL("/dashboard", req.url));
}