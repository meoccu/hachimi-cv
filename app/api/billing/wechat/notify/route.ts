import { NextRequest, NextResponse } from "next/server";
import { verifyWechatNotify } from "@/lib/wechat";
import { prisma } from "@/lib/prisma";
import { activateSubscription } from "@/lib/billing";

export async function POST(req: NextRequest) {
  try {
    const headers = Object.fromEntries(req.headers);
    const body = await req.text();
    const event = await verifyWechatNotify(headers, body);

    if (event.event_type === "TRANSACTION.SUCCESS") {
      const { out_trade_no, transaction_id } = event.resource;
      const order = await prisma.order.findUnique({ where: { outTradeNo: out_trade_no } });
      if (order && order.status !== "PAID") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID", paidAt: new Date(), providerOrderId: transaction_id },
        });
        await activateSubscription(order.userId, order.plan, order.periodMonths);
      }
    }
    return NextResponse.json({ code: "SUCCESS", message: "成功" });
  } catch (e: any) {
    return NextResponse.json({ code: "FAIL", message: e.message }, { status: 400 });
  }
}