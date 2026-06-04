import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "../../_guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  isOfficial: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin(req);
  const data = schema.parse(await req.json());
  const t = await prisma.template.update({ where: { id: params.id }, data });
  return NextResponse.json({ data: t });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin(req);
  await prisma.template.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}