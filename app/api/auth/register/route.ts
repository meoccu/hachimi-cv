import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { sendVerifyEmail } from "@/lib/mail";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
  name: z.string().min(1).max(40).optional(),
  inviteCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid input" }, { status: 400 });
  const { email, password, name, inviteCode } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "email already used" }, { status: 409 });

  let inviteId: string | undefined;
  if (inviteCode) {
    const ic = await prisma.inviteCode.findUnique({ where: { code: inviteCode } });
    if (!ic || (ic.expiresAt && ic.expiresAt < new Date()) || ic.uses >= ic.maxUses) {
      return NextResponse.json({ error: "invalid invite code" }, { status: 400 });
    }
    inviteId = ic.id;
    await prisma.inviteCode.update({ where: { id: ic.id }, data: { uses: { increment: 1 } } });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password),
      inviteCodeId: inviteId,
    },
  });

  // 发送邮箱验证
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.emailToken.create({
    data: {
      userId: user.id,
      token,
      type: "verify",
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
    },
  });
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;
  sendVerifyEmail(email, link).catch(console.error);

  await setAuthCookie(user.id);
  return NextResponse.json({ ok: true, userId: user.id });
}