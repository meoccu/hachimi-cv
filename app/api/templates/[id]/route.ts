import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const t = await prisma.template.findUnique({ where: { id: params.id } });
  if (!t || t.status !== "PUBLISHED" || !t.isPublic) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ data: t });
}