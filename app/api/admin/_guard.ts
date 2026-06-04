import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";

export async function requireAdmin(req: NextRequest) {
  const u = await requireUser(req);
  if (!u.isAdmin) throw new Response("FORBIDDEN", { status: 403 });
  return u;
}