"use client";
import { useEffect, useState } from "react";

export default function TemplateSelector({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { fetch("/api/templates").then(r => r.json()).then(j => setList(j.data || [])); }, []);
  return (
    <div className="grid grid-cols-3 gap-3">
      {list.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`border rounded overflow-hidden ${value === t.id ? "ring-2 ring-blue-500" : ""}`}>
          <img src={t.thumbnail || "/template-default.png"} alt="" className="w-full h-40 object-cover" />
          <div className="p-2 text-sm flex items-center justify-between">
            <span>{t.name}</span>
            {t.isPremium && <span className="px-1 text-xs bg-yellow-100 text-yellow-700 rounded">PRO</span>}
          </div>
        </button>
      ))}
    </div>
  );
}