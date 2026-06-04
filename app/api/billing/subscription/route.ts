import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: "desc" },
  });
  return NextResponse.json({ data: sub });
}