import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isPublic: z.boolean(),
  password: z.string().min(4).max(64).nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  watermark: z.string().max(40).nullable().optional(),
  regenerateSlug: z.boolean().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.userId !== user.id) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const body = schema.parse(await req.json());
  const passwordHash = body.password === null ? null
    : body.password ? await bcrypt.hash(body.password, 10) : r.sharePasswordHash;

  const updated = await prisma.resume.update({
    where: { id: r.id },
    data: {
      isPublic: body.isPublic,
      sharePasswordHash: passwordHash,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : body.expiresAt as any,
      watermark: body.watermark ?? r.watermark,
      slug: body.regenerateSlug ? nanoid(10) : r.slug,
    },
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/s/${updated.slug}`;
  return NextResponse.json({ data: { ...updated, shareUrl: url } });
}