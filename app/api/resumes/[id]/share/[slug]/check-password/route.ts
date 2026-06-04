import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signShareToken } from "@/lib/jwt";

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const r = await prisma.resume.findUnique({ where: { slug: params.slug } });
  if (!r || !r.isPublic || r.deletedAt) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  if (r.expiresAt && r.expiresAt < new Date()) return NextResponse.json({ error: "EXPIRED" }, { status: 410 });
  if (!r.sharePasswordHash) return NextResponse.json({ ok: true });

  const { password } = schema.parse(await req.json());
  const ok = await bcrypt.compare(password, r.sharePasswordHash);
  if (!ok) return NextResponse.json({ error: "WRONG_PASSWORD" }, { status: 401 });

  const token = signShareToken(r.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(`share_${r.id}`, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 * 2 });
  return res;
}