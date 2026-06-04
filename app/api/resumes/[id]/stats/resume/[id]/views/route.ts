import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.userId !== user.id) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const rows = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
    SELECT to_char("createdAt"::date, 'YYYY-MM-DD') as date, COUNT(*) as count
    FROM "ResumeView"
    WHERE "resumeId" = ${r.id} AND "createdAt" >= ${since}
    GROUP BY 1 ORDER BY 1 ASC
  `;
  return NextResponse.json({ data: rows.map(r => ({ date: r.date, count: Number(r.count) })) });
}