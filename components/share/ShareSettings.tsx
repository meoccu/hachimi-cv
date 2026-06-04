"use client";
import { useState } from "react";

export default function ShareSettings({ resume }: { resume: any }) {
  const [isPublic, setIsPublic] = useState(resume.isPublic);
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/r/${resume.slug}` : "";

  const save = async () => {
    await fetch(`/api/resumes/${resume.id}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isPublic,
        password: password || undefined,
        expiresAt: expiresAt || undefined,
        maxViews: maxViews || undefined,
      }),
    });
    alert("已保存");
  };

  return (
    <div className="space-y-3">
      <label className="flex gap-2 items-center">
        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        <span>公开分享</span>
      </label>
      <div><input className="input" placeholder="访问密码 (Pro)" value={password} onChange={e => setPassword(e.target.value)} /></div>
      <div><input type="datetime-local" className="input" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} /></div>
      <div><input type="number" className="input" placeholder="最大访问次数" value={maxViews} onChange={e => setMaxViews(e.target.value ? Number(e.target.value) : "")} /></div>
      <div className="flex items-center gap-2">
        <input readOnly className="input flex-1" value={shareUrl} />
        <button className="btn" onClick={() => navigator.clipboard.writeText(shareUrl)}>复制</button>
      </div>
      <button className="btn-primary" onClick={save}>保存</button>
    </div>
  );
}