import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 });
  const t = await prisma.emailToken.findUnique({ where: { token } });
  if (!t || t.usedAt || t.expiresAt < new Date()) return NextResponse.json({ error: "invalid or expired" }, { status: 400 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: t.userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.emailToken.update({ where: { id: t.id }, data: { usedAt: new Date() } }),
  ]);
  return NextResponse.redirect(new URL("/dashboard?verified=1", req.url));
}