import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "../_guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  await requireAdmin(req);
  const c = await prisma.siteConfig.findFirst();
  return NextResponse.json({ data: c });
}

const schema = z.object({
  siteName: z.string().optional(),
  siteUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.coerce.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  mailFrom: z.string().optional(),
  llmApiUrl: z.string().optional(),
  llmApiKey: z.string().optional(),
  llmModel: z.string().optional(),
}).partial();

export async function PUT(req: NextRequest) {
  await requireAdmin(req);
  const data = schema.parse(await req.json());
  const exist = await prisma.siteConfig.findFirst();
  const c = exist
    ? await prisma.siteConfig.update({ where: { id: exist.id }, data })
    : await prisma.siteConfig.create({ data });
  return NextResponse.json({ data: c });
}