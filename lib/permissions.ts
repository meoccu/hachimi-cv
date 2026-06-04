import { Plan, User } from "@prisma/client";

export const PLAN_LIMITS = {
  FREE:       { resumes: 3,   aiPerDay: 3,   premiumTemplate: false, watermark: true,  sharePassword: false, statsDays: 7 },
  PRO:        { resumes: 999, aiPerDay: 100, premiumTemplate: true,  watermark: false, sharePassword: true,  statsDays: 365 },
  ENTERPRISE: { resumes: 9999,aiPerDay: 1000,premiumTemplate: true,  watermark: false, sharePassword: true,  statsDays: 3650 },
} as const;

export function planOf(user: User): Plan {
  if (!user.planExpiresAt || user.planExpiresAt > new Date()) return user.plan;
  return "FREE";
}

export function limitsOf(user: User) {
  return PLAN_LIMITS[planOf(user)];
}

export function canEditResume(user: User, resume: { userId: string }) {
  return user.isAdmin || resume.userId === user.id;
}