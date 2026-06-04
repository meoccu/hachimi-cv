import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canEditResume, limitsOf } from "@/lib/permissions";
import { renderResumePdf } from "@/lib/pdf";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.deletedAt) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const cookie = req.cookies.get(process.env.COOKIE_NAME || "rp_token")?.value;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const url = `${baseUrl}/resume/print/${r.id}`;
  const pdf = await renderResumePdf({
    url,
    cookie,
    watermark: limitsOf(user).watermark,
  });

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(r.title)}.pdf"`,
    },
  });
}