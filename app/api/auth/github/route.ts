import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const state = crypto.randomBytes(16).toString("hex");
  await redis.set(`oauth:gh:${state}`, "1", "EX", 600);
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
  url.searchParams.set("redirect_uri", process.env.GITHUB_CALLBACK_URL!);
  url.searchParams.set("scope", "read:user user:email");
  url.searchParams.set("state", state);
  return NextResponse.redirect(url.toString());
}