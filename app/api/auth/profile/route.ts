import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().max(40).optional(),
  locale: z.string().max(10).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function PUT(req: NextRequest) {
  const user = await requireUser(req);
  const body = schema.parse(await req.json());
  const updated = await prisma.user.update({ where: { id: user.id }, data: body });
  const { passwordHash, ...safe } = updated as any;
  return NextResponse.json({ data: safe });
}