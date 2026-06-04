import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { cleanCss, cleanTemplateHtml } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  const list = await prisma.template.findMany({
    where: { isPublic: true, deletedAt: null, status: "ACTIVE" },
    select: { id: true, name: true, thumbnail: true, isOfficial: true, isPremium: true, locale: true },
    orderBy: [{ isOfficial: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ data: list });
}

const schema = z.object({
  name: z.string().min(1).max(60),
  description: z.string().max(500).optional(),
  thumbnail: z.string().url().optional(),
  html: z.string().min(1).max(100_000),
  css: z.string().max(100_000).default(""),
  locale: z.string().default("zh-CN"),
});

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  const b = schema.parse(await req.json());

  const safeHtml = cleanTemplateHtml(b.html);
  const safeCss = cleanCss(b.css);

  const t = await prisma.template.create({
    data: {
      ownerId: user.id,
      name: b.name,
      description: b.description,
      thumbnail: b.thumbnail,
      html: safeHtml,
      css: safeCss,
      locale: b.locale,
      isOfficial: false,
      isPremium: false,
      isPublic: false,
    },
  });
  return NextResponse.json({ data: t });
}