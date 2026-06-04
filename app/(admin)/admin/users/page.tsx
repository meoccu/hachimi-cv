"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const r = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
    const j = await r.json(); setList(j.data || []);
  };
  useEffect(() => { load(); }, []);

  const setPlan = async (id: string, plan: string) => {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    load();
  };
  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">用户管理</h1>
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="搜索邮箱或姓名" value={q} onChange={e => setQ(e.target.value)} />
        <button className="btn" onClick={load}>搜索</button>
      </div>
      <table className="w-full text-sm bg-white">
        <thead><tr className="border-b text-left"><th>邮箱</th><th>姓名</th><th>套餐</th><th>状态</th><th>注册时间</th><th>操作</th></tr></thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id} className="border-b">
              <td>{u.email}</td><td>{u.name}</td>
              <td>
                <select className="select" value={u.plan} onChange={e => setPlan(u.id, e.target.value)}>
                  <option>FREE</option><option>PRO</option><option>ENTERPRISE</option>
                </select>
              </td>
              <td>
                <select className="select" value={u.status} onChange={e => setStatus(u.id, e.target.value)}>
                  <option>ACTIVE</option><option>DISABLED</option><option>PENDING</option>
                </select>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}