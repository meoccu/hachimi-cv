import { NextRequest, NextResponse } from "next/server";
import UAParser from "ua-parser-js";
import { prisma } from "@/lib/prisma";
import { hashIp } from "@/lib/crypto";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const r = await prisma.resume.findUnique({ where: { slug: params.slug } });
  if (!r || !r.isPublic) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const body = await req.json().catch(() => ({} as any));
  const ua = new UAParser(req.headers.get("user-agent") || "");
  const ipRaw = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

  await prisma.resumeView.create({
    data: {
      resumeId: r.id,
      ipHash: hashIp(ipRaw),
      referer: req.headers.get("referer") || body.referer || null,
      device: ua.getDevice().type || (ua.getOS().name?.includes("Android") || ua.getOS().name === "iOS" ? "mobile" : "desktop"),
      browser: ua.getBrowser().name || null,
      os: ua.getOS().name || null,
      country: req.headers.get("x-vercel-ip-country") || null,
      durationMs: body.durationMs ?? null,
      clickType: body.clickType ?? null,
    },
  });
  return NextResponse.json({ ok: true });
}