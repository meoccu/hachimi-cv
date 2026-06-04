import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function GET(req: NextRequest) {
  const u = await getCurrentUser(req);
  if (!u) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { passwordHash, ...safe } = u as any;
  return NextResponse.json({ data: safe });
}