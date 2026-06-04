import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(64),
});

export async function POST(req: NextRequest) {
  const { token, password } = schema.parse(await req.json());
  const t = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!t || t.usedAt || t.expiresAt < new Date()) {
    return NextResponse.json({ error: "invalid or expired token" }, { status: 400 });
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: t.userId }, data: { passwordHash: await hashPassword(password) } }),
    prisma.passwordResetToken.update({ where: { id: t.id }, data: { usedAt: new Date() } }),
  ]);
  return NextResponse.json({ ok: true });
}