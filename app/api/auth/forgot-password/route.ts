import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/mail";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const { email } = schema.parse(await req.json());
  const user = await prisma.user.findUnique({ where: { email } });
  // 即使不存在也返回 ok，避免暴露
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600_000) },
    });
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    sendResetPasswordEmail(email, link).catch(console.error);
  }
  return NextResponse.json({ ok: true });
}