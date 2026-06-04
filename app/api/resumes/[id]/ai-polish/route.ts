import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canEditResume, limitsOf } from "@/lib/permissions";
import { polishWithLLM } from "@/lib/llm";
import { checkDailyLimit } from "@/lib/rateLimit";

const schema = z.object({
  text: z.string().min(1).max(3000),
  style: z.string().default("professional"),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const limit = limitsOf(user).aiPerDay;
  const rl = await checkDailyLimit(`ai:${user.id}`, limit);
  if (!rl.allowed) {
    return NextResponse.json({ error: "AI_DAILY_LIMIT", used: rl.used, limit }, { status: 429 });
  }

  const { text, style } = schema.parse(await req.json());

  try {
    const { text: out, tokens } = await polishWithLLM({ text, style });
    await prisma.aiUsageLog.create({
      data: {
        userId: user.id,
        resumeId: r.id,
        style,
        inputLen: text.length,
        outputLen: out.length,
        tokensUsed: tokens,
        success: true,
      },
    });
    return NextResponse.json({ data: { text: out } });
  } catch (e: any) {
    await prisma.aiUsageLog.create({
      data: {
        userId: user.id, resumeId: r.id, style,
        inputLen: text.length, outputLen: 0, success: false,
        errorMsg: String(e?.message ?? e).slice(0, 500),
      },
    });
    return NextResponse.json({ error: "LLM_FAILED" }, { status: 500 });
  }
}