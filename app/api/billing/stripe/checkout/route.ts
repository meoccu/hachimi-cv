import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PLAN_PRICE } from "@/lib/stripe";

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
    data: {
      userId: user.id, outTradeNo, amount, plan,
      periodMonths, provider: "STRIPE", status: "PENDING",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency: "cny",
        product_data: { name: `Resume ${plan} (${periodMonths}月)` },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?ok=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?cancel=1`,
    metadata: { orderId: order.id, userId: user.id, plan, periodMonths: String(periodMonths) },
  });

  await prisma.order.update({ where: { id: order.id }, data: { providerOrderId: session.id } });
  return NextResponse.json({ url: session.url });
}