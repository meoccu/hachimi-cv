import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  const list = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }, take: 50,
  });
  return NextResponse.json({ data: list });
}