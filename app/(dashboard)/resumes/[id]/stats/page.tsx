"use client";
import { useEffect, useState } from "react";
import StatsChart from "@/components/stats/StatsChart";

export default function StatsPage({ params }: { params: { id: string } }) {
  const [views, setViews] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [clicks, setClicks] = useState<any[]>([]);

  useEffect(() => {
    const base = `/api/stats/resume/${params.id}`;
    fetch(`${base}/views`).then(r => r.json()).then(j => setViews(j.data || []));
    fetch(`${base}/referrers`).then(r => r.json()).then(j => setReferrers(j.data || []));
    fetch(`${base}/devices`).then(r => r.json()).then(j => setDevices(j.data || []));
    fetch(`${base}/clicks`).then(r => r.json()).then(j => setClicks(j.data || []));
  }, [params.id]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">访问统计</h1>

      <div className="card">
        <h3 className="font-semibold mb-3">访问趋势</h3>
        <StatsChart data={views} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SimpleTable title="访问来源" rows={referrers} keyLabel="referer" />
        <SimpleTable title="设备分布" rows={devices} keyLabel="device" />
        <SimpleTable title="点击行为" rows={clicks} keyLabel="clickType" />
      </div>
    </div>
  );
}

function SimpleTable({ title, rows, keyLabel }: { title: string; rows: any[]; keyLabel: string }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">{title}</h3>
      {rows.length === 0 ? <div className="text-gray-500 text-sm">暂无数据</div> :
        <ul className="divide-y text-sm">
          {rows.map((r, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span className="truncate">{r[keyLabel] || "未知"}</span>
              <span className="font-mono">{r.count}</span>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}