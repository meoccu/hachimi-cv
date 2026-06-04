import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

// 价格单位: 分（人民币）
export const PLAN_PRICE: Record<"PRO" | "ENTERPRISE", number> = {
  PRO: 2900,        // ¥29 / 月
  ENTERPRISE: 9900, // ¥99 / 月
};

export const PLAN_LABEL = {
  FREE: "免费版",
  PRO: "专业版",
  ENTERPRISE: "企业版",
} as const;