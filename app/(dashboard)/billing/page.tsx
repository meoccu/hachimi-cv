"use client";
import { useEffect, useState } from "react";

export default function BillingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    fetch("/api/billing/orders").then(r => r.json()).then(j => setOrders(j.data || []));
    fetch("/api/billing/subscription").then(r => r.json()).then(j => setSub(j.data || null));
  }, []);

  const upgrade = async (provider: "stripe" | "wechat") => {
    const path = provider === "stripe" ? "/api/billing/stripe/checkout" : "/api/billing/wechat/native";
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: "PRO", periodMonths: 1 }) });
    const j = await res.json();
    if (provider === "stripe") window.location.href = j.url;
    else alert("微信扫码：" + j.codeUrl);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">会员与订单</h1>

      <div className="card">
        <h3 className="font-semibold mb-3">当前订阅</h3>
        {sub ? (
          <div>{sub.plan} · 到期：{new Date(sub.expiresAt).toLocaleDateString()}</div>
        ) : <div className="text-gray-500">尚未订阅</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["FREE","PRO","ENTERPRISE"].map(plan => (
          <div key={plan} className="card text-center">
            <h3 className="text-xl font-bold mb-3">{plan}</h3>
            <div className="text-3xl font-extrabold mb-3">{plan === "FREE" ? "¥0" : plan === "PRO" ? "¥39" : "¥199"}<span className="text-sm font-normal text-gray-500">/月</span></div>
            <ul className="text-sm text-gray-600 space-y-1 mb-4 text-left">
              <li>✓ {plan === "FREE" ? "3 份简历" : "无限简历"}</li>
              <li>✓ {plan === "FREE" ? "3 次/日 AI" : "100+ 次/日 AI"}</li>
              <li>✓ {plan === "FREE" ? "基础模板" : "全部高级模板"}</li>
              <li>✓ {plan === "FREE" ? "带水印 PDF" : "无水印 PDF"}</li>
            </ul>
            {plan !== "FREE" && (
              <div className="space-y-2">
                <button className="btn-primary w-full" onClick={() => upgrade("stripe")}>Stripe 支付</button>
                <button className="btn w-full" onClick={() => upgrade("wechat")}>微信扫码</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">订单历史</h3>
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th>订单号</th><th>金额</th><th>套餐</th><th>状态</th><th>时间</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b">
                <td className="font-mono text-xs">{o.outTradeNo}</td>
                <td>¥{(o.amount/100).toFixed(2)}</td>
                <td>{o.plan}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={5} className="py-3 text-center text-gray-500">暂无订单</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}