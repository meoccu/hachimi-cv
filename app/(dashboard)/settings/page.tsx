"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [me, setMe] = useState<any>(null);
  const [name, setName] = useState("");
  const [locale, setLocale] = useState("zh-CN");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(j => {
      setMe(j.data); setName(j.data.name || ""); setLocale(j.data.locale || "zh-CN");
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/auth/profile", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, locale }),
    });
    setSaving(false); alert("已保存");
  };

  if (!me) return <div>加载中…</div>;
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">设置</h1>
      <div className="card space-y-4">
        <div>
          <label className="block text-sm mb-1">邮箱</label>
          <input className="input" value={me.email} disabled />
        </div>
        <div>
          <label className="block text-sm mb-1">姓名</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">语言</label>
          <select className="select" value={locale} onChange={e => setLocale(e.target.value)}>
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en-US">English</option>
            <option value="ja-JP">日本語</option>
            <option value="ko-KR">한국어</option>
          </select>
        </div>
        <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "保存中…" : "保存"}</button>
      </div>
    </div>
  );
}