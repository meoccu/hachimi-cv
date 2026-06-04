import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { wechatNativePay, PLAN_PRICE } from "@/lib/wechat";

const schema = z.object({
  plan: z.enum(["PRO", "ENTERPRISE"]),
  periodMonths: z.number().int().min(1).max(12).default(1),
});

export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  const { plan, periodMonths } = schema.parse(await req.json());
  const amount = PLAN_PRICE[plan] * periodMonths;
  const outTradeNo = `RP${Date.now()}${nanoid(6)}`;

  const order = await prisma.order.create({
    data: { userId: user.id, outTradeNo, amount, plan, periodMonths, provider: "WECHAT", status: "PENDING" },
  });

  const codeUrl = await wechatNativePay({
    outTradeNo, amount, description: `Resume ${plan} ${periodMonths}月`,
  });
  return NextResponse.json({ codeUrl, orderId: order.id });
}