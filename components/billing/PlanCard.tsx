"use client";
import { useState } from "react";

export interface PlanCardProps {
  planKey: "FREE" | "PRO" | "ENTERPRISE";
  name: string;
  price: number;            // 分
  period?: string;          // "/月"
  features: string[];
  highlight?: boolean;
  current?: boolean;
  disabled?: boolean;
}

export default function PlanCard({
  planKey, name, price, period = "/月", features,
  highlight, current, disabled,
}: PlanCardProps) {
  const [loading, setLoading] = useState(false);

  const subscribe = async (provider: "stripe" | "wechat") => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, provider, periodMonths: 1 }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.qrcode) alert("请使用微信扫码: " + data.qrcode);
      else throw new Error(data.error || "下单失败");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card relative flex flex-col ${highlight ? "ring-2 ring-brand-500" : ""}`}>
      {highlight && (
        <span className="absolute -top-2 right-4 bg-brand-600 text-white text-xs px-2 py-0.5 rounded">推荐</span>
      )}
      <h3 className="text-lg font-bold">{name}</h3>
      <div className="mt-2 mb-4">
        <span className="text-3xl font-bold">¥{(price / 100).toFixed(0)}</span>
        <span className="text-gray-500 text-sm ml-1">{period}</span>
      </div>
      <ul className="flex-1 space-y-2 text-sm text-gray-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2">
        {current ? (
          <button disabled className="btn w-full">当前套餐</button>
        ) : planKey === "FREE" ? (
          <button disabled className="btn w-full">免费可用</button>
        ) : (
          <>
            <button
              onClick={() => subscribe("stripe")}
              disabled={disabled || loading}
              className="btn-primary w-full"
            >
              {loading ? "处理中…" : "信用卡支付"}
            </button>
            <button
              onClick={() => subscribe("wechat")}
              disabled={disabled || loading}
              className="btn w-full"
            >
              微信支付
            </button>
          </>
        )}
      </div>
    </div>
  );
}