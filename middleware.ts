import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const COOKIE_NAME = process.env.COOKIE_NAME || "rp_token";

const PROTECTED = ["/dashboard", "/resumes", "/templates", "/billing", "/settings"];
const ADMIN_PREFIX = "/admin";
const AUTH_PAGES = ["/login", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  // 登录态访问登录/注册页 -> 跳转 dashboard
  if (payload && AUTH_PAGES.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 受保护页面未登录 -> 跳登录
  const needAuth = PROTECTED.some(p => pathname.startsWith(p)) || pathname.startsWith(ADMIN_PREFIX);
  if (needAuth && !payload) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 管理员校验
  if (pathname.startsWith(ADMIN_PREFIX) && !payload?.isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resumes/:path*",
    "/templates/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};