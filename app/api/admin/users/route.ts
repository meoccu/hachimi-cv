import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../_guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  await requireAdmin(req);
  const q = req.nextUrl.searchParams.get("q") || "";
  const list = await prisma.user.findMany({
    where: q ? { OR: [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ]} : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, email: true, name: true, plan: true, status: true, isAdmin: true, createdAt: true },
  });
  return NextResponse.json({ data: list });
}