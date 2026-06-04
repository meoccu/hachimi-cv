import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { limitsOf } from "@/lib/permissions";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  const list = await prisma.resume.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, slug: true, locale: true, isPublic: true, updatedAt: true },
  });
  return NextResponse.json({ data: list });
}

const createSchema = z.object({
  title: z.string().min(1).max(60).optional(),
  locale: z.string().optional(),
  templateId: z.string().optional(),
  content: z.any().optional(),
});

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  const limits = limitsOf(user);
  const count = await prisma.resume.count({ where: { userId: user.id, deletedAt: null } });
  if (count >= limits.resumes) {
    return NextResponse.json({ error: "RESUME_LIMIT_REACHED" }, { status: 403 });
  }

  const body = createSchema.parse(await req.json());
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: body.title ?? "我的简历",
      slug: nanoid(),
      locale: body.locale ?? user.locale,
      templateId: body.templateId,
      content: body.content ?? {},
    },
  });

  return NextResponse.json({ data: resume });
}