import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentSuccessEmail } from "@/lib/mail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return NextResponse.json({ error: `invalid signature: ${e.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const outTradeNo = session.metadata?.outTradeNo;
    if (outTradeNo) {
      const order = await prisma.order.findUnique({ where: { outTradeNo } });
      if (order && order.status !== "PAID") {
        const expiresAt = new Date(Date.now() + order.periodMonths * 30 * 86400_000);
        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { status: "PAID", paidAt: new Date(), providerPayId: session.id, rawNotify: event as any },
          }),
          prisma.subscription.create({
            data: {
              userId: order.userId, plan: order.plan, provider: "STRIPE",
              providerSubId: session.subscription as string | undefined,
              expiresAt,
            },
          }),
          prisma.user.update({
            where: { id: order.userId },
            data: { plan: order.plan, planExpiresAt: expiresAt },
          }),
        ]);
        const user = await prisma.user.findUnique({ where: { id: order.userId } });
        if (user) sendPaymentSuccessEmail(user.email, order.plan, expiresAt).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}