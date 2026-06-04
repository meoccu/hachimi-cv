"use client";
import { useEffect, useState } from "react";

export default function TemplatesPage() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { fetch("/api/templates").then(r => r.json()).then(j => setList(j.data || [])); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">模板市场</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map(t => (
          <div key={t.id} className="card">
            <img src={t.thumbnail || "/template-default.png"} alt="" className="w-full h-48 object-cover rounded mb-3" />
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t.name}</h3>
              {t.isPremium && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">PRO</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}