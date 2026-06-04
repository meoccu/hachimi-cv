import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canEditResume } from "@/lib/permissions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.deletedAt) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ data: r });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.deletedAt) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();

  // 保存版本快照
  const last = await prisma.resumeVersion.findFirst({
    where: { resumeId: r.id },
    orderBy: { versionNo: "desc" },
  });
  const versionNo = (last?.versionNo ?? 0) + 1;
  await prisma.resumeVersion.create({
    data: {
      resumeId: r.id,
      versionNo,
      content: r.content as any,
      message: body.message ?? null,
      createdBy: user.id,
    },
  });

  const updated = await prisma.resume.update({
    where: { id: r.id },
    data: {
      title: body.title ?? r.title,
      content: body.content ?? r.content,
      templateId: body.templateId ?? r.templateId,
      themeConfig: body.themeConfig ?? r.themeConfig,
      locale: body.locale ?? r.locale,
    },
  });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await prisma.resume.update({ where: { id: r.id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}