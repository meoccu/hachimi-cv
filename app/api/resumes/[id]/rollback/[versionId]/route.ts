import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string; versionId: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.userId !== user.id) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  const v = await prisma.resumeVersion.findUnique({ where: { id: params.versionId } });
  if (!v || v.resumeId !== r.id) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  // 先把当前状态存为新版本
  await prisma.resumeVersion.create({
    data: { resumeId: r.id, content: r.content as any, title: r.title, templateId: r.templateId },
  });
  const updated = await prisma.resume.update({
    where: { id: r.id },
    data: { content: v.content as any, title: v.title, templateId: v.templateId },
  });
  return NextResponse.json({ data: updated });
}