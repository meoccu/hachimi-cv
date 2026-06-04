import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { signToken, verifyToken } from "./jwt";

const COOKIE_NAME = process.env.COOKIE_NAME || "rp_token";

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function setAuthCookie(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("user not found");
  const token = signToken({
    uid: user.id,
    email: user.email,
    plan: user.plan,
    isAdmin: user.isAdmin,
  });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentUser(req?: NextRequest) {
  const token = req
    ? req.cookies.get(COOKIE_NAME)?.value
    : cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.uid } });
}

export async function requireUser(req?: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}