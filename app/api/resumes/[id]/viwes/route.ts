import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { canEditResume, limitsOf } from "@/lib/permissions";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser(req);
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canEditResume(user, r)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const days = limitsOf(user).statsDays;
  const since = new Date(Date.now() - days * 86400_000);

  // 按天聚合
  const rows: { date: string; views: bigint; uv: bigint }[] = await prisma.$queryRaw`
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS date,
           COUNT(*)::bigint AS views,
           COUNT(DISTINCT "uaHash")::bigint AS uv
    FROM "ResumeView"
    WHERE "resumeId" = ${r.id} AND "createdAt" >= ${since}
    GROUP BY 1
    ORDER BY 1 ASC;
  `;
  return NextResponse.json({
    data: rows.map(r => ({ date: r.date, views: Number(r.views), uv: Number(r.uv) })),
  });
}