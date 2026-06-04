import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string; versionId: string } }) {
  const user = await requireUser(req);
  const v = await prisma.resumeVersion.findUnique({
    where: { id: params.versionId },
    include: { resume: true },
  });
  if (!v || v.resumeId !== params.id || v.resume.userId !== user.id) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ data: v });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; versionId: string } }) {
  const user = await requireUser(req);
  const v = await prisma.resumeVersion.findUnique({
    where: { id: params.versionId },
    include: { resume: true },
  });
  if (!v || v.resumeId !== params.id || v.resume.userId !== user.id) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  await prisma.resumeVersion.delete({ where: { id: v.id } });
  return NextResponse.json({ ok: true });
}