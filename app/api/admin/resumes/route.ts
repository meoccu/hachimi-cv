import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../_guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  await requireAdmin(req);
  const list = await prisma.resume.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" }, take: 100,
    include: { user: { select: { email: true, name: true } } },
  });
  return NextResponse.json({ data: list });
}