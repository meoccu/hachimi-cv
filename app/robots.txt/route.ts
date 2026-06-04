import { NextResponse } from "next/server";
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  return new NextResponse(
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nSitemap: ${baseUrl}/sitemap.xml\n`,
    { headers: { "Content-Type": "text/plain" } },
  );
}