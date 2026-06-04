import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const resumes = await prisma.resume.findMany({
    where: { isPublic: true, deletedAt: null },
    select: { slug: true, updatedAt: true },
    take: 5000,
  });

  const urls = [
    `<url><loc>${baseUrl}/</loc></url>`,
    ...resumes.map(r => `<url><loc>${baseUrl}/r/${r.slug}</loc><lastmod>${r.updatedAt.toISOString()}</lastmod></url>`),
  ].join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(body, { headers: { "Content-Type": "application/xml" } });
}