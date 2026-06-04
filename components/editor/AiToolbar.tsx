"use client";
import { useState } from "react";

type Mode = "polish" | "shorten" | "expand" | "translate";

const MODES: { key: Mode; label: string }[] = [
  { key: "polish", label: "润色" },
  { key: "shorten", label: "缩短" },
  { key: "expand", label: "扩写" },
  { key: "translate", label: "翻译" },
];

interface Props {
  text: string;
  onApply: (result: string) => void;
  targetLang?: string;
}

export default function AiToolbar({ text, onApply, targetLang = "en" }: Props) {
  const [loading, setLoading] = useState<Mode | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (mode: Mode) => {
    if (!text?.trim()) { setError("请先输入内容"); return; }
    setLoading(mode); setError(null); setPreview(null);
    try {
      const res = await fetch("/api/ai/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, text, targetLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI 处理失败");
      setPreview(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border border-dashed border-brand-300 rounded p-2 space-y-2 bg-brand-50/30">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => run(m.key)}
            disabled={loading !== null}
            className="btn text-xs"
          >
            {loading === m.key ? "处理中…" : `AI ${m.label}`}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {preview && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">预览：</div>
          <div className="bg-white border rounded p-2 text-sm whitespace-pre-wrap max-h-48 overflow-auto">
            {preview}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onApply(preview); setPreview(null); }} className="btn-primary text-xs">
              应用结果
            </button>
            <button onClick={() => setPreview(null)} className="btn text-xs">放弃</button>
          </div>
        </div>
      )}
    </div>
  );
}