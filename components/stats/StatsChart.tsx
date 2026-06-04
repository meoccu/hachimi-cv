"use client";
import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function StatsChart({ data }: { data: { date: string; views: number; uv: number }[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = new Chart(ref.current, {
      type: "line",
      data: {
        labels: data.map(d => d.date),
        datasets: [
          { label: "浏览量", data: data.map(d => d.views), borderColor: "#3b82f6", fill: false },
          { label: "独立访客", data: data.map(d => d.uv), borderColor: "#10b981", fill: false },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
    return () => chart.destroy();
  }, [data]);
  return <div className="h-72"><canvas ref={ref} /></div>;
}