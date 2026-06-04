"use client";
import { useEffect, useRef, useState } from "react";

export default function AutoSave({ resumeId, data }: { resumeId: string; data: any }) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (timer.current) clearTimeout(timer.current);
    setState("idle");
    timer.current = setTimeout(async () => {
      setState("saving");
      try {
        const r = await fetch(`/api/resumes/${resumeId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data }),
        });
        if (!r.ok) throw new Error();
        setState("saved");
        setTimeout(() => setState("idle"), 1500);
      } catch { setState("error"); }
    }, 1200);
  }, [data, resumeId]);

  const label = state === "saving" ? "保存中…" : state === "saved" ? "已保存" : state === "error" ? "保存失败" : "";
  return <div className="text-xs text-gray-500 h-4">{label}</div>;
}