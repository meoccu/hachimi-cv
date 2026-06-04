import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "../../_guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED", "PENDING"]).optional(),
  isAdmin: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin(req);
  const data = schema.parse(await req.json());
  const u = await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ data: u });
}