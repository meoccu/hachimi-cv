import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../_guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  await requireAdmin(req);
  const list = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }, take: 200,
    include: { user: { select: { email: true } } },
  });
  return NextResponse.json({ data: list });
}