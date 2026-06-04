import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canEditResume } from "@/lib/permissions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const versions = await prisma.resumeVersion.findMany({
    where: { resumeId: r.id },
    orderBy: { versionNo: "desc" },
    select: { id: true, versionNo: true, message: true, createdAt: true },
  });
  return NextResponse.json({ data: versions });
}