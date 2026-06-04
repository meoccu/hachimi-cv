import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.userId !== user.id) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const grouped = await prisma.resumeView.groupBy({
    by: ["device"],
    where: { resumeId: r.id },
    _count: { _all: true },
  });
  return NextResponse.json({ data: grouped.map(g => ({ device: g.device || "未知", count: g._count._all })) });
}