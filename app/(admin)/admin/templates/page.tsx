"use client";
import { useEffect, useState } from "react";

export default function AdminTemplatesPage() {
  const [list, setList] = useState<any[]>([]);
  const load = () => fetch("/api/admin/templates").then(r => r.json()).then(j => setList(j.data || []));
  useEffect(() => { load(); }, []);
  const toggle = async (id: string, field: string, value: boolean) => {
    await fetch(`/api/admin/templates/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
    load();
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">模板管理</h1>
      <table className="w-full text-sm bg-white">
        <thead><tr className="border-b text-left"><th>名称</th><th>官方</th><th>付费</th><th>公开</th><th>状态</th></tr></thead>
        <tbody>
          {list.map(t => (
            <tr key={t.id} className="border-b">
              <td>{t.name}</td>
              <td><input type="checkbox" checked={t.isOfficial} onChange={e => toggle(t.id, "isOfficial", e.target.checked)} /></td>
              <td><input type="checkbox" checked={t.isPremium} onChange={e => toggle(t.id, "isPremium", e.target.checked)} /></td>
              <td><input type="checkbox" checked={t.isPublic} onChange={e => toggle(t.id, "isPublic", e.target.checked)} /></td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}