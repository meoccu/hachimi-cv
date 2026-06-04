"use client";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { fetch("/api/admin/orders").then(r => r.json()).then(j => setList(j.data || [])); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">订单管理</h1>
      <table className="w-full text-sm bg-white">
        <thead><tr className="border-b text-left"><th>订单号</th><th>用户</th><th>金额</th><th>套餐</th><th>渠道</th><th>状态</th><th>时间</th></tr></thead>
        <tbody>
          {list.map(o => (
            <tr key={o.id} className="border-b">
              <td className="font-mono text-xs">{o.outTradeNo}</td>
              <td>{o.user?.email}</td>
              <td>¥{(o.amount/100).toFixed(2)}</td>
              <td>{o.plan}</td><td>{o.provider}</td><td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}