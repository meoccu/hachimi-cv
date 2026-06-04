"use client";
import { useState } from "react";

const STYLES = [
  { value: "professional", label: "专业正式" },
  { value: "concise",      label: "简洁有力" },
  { value: "star",         label: "STAR 法则" },
  { value: "quantified",   label: "量化成果" },
  { value: "english",      label: "英文优化" },
];

export default function AiPolishPanel({ resumeId, text, onApply }: { resumeId: string; text: string; onApply: (s: string) => void }) {
  const [style, setStyle] = useState("professional");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true); setError(""); setOut("");
    const res = await fetch(`/api/resumes/${resumeId}/ai-polish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, style }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) { setError(json.error || "失败"); return; }
    setOut(json.data.text);
  };

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center gap-2">
        <select value={style} onChange={e => setStyle(e.target.value)} className="select">
          {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button className="btn" disabled={loading} onClick={run}>{loading ? "生成中…" : "AI 润色"}</button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {out && (
        <>
          <textarea className="w-full border rounded p-2" rows={6} value={out} onChange={e => setOut(e.target.value)} />
          <button className="btn-primary" onClick={() => onApply(out)}>应用到简历</button>
        </>
      )}
    </div>
  );
}