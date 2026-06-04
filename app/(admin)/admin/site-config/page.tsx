"use client";
import { useEffect, useState } from "react";

export default function SiteConfigPage() {
  const [cfg, setCfg] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/site-config").then(r => r.json()).then(j => setCfg(j.data || {})); }, []);
  if (!cfg) return <div>加载中…</div>;

  const save = async () => {
    await fetch("/api/admin/site-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg) });
    alert("已保存");
  };

  const F = ({ k, label, type = "text" }: any) => (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input className="input" type={type} value={cfg[k] ?? ""} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} />
    </div>
  );

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">站点配置</h1>
      <div className="card space-y-3">
        <F k="siteName" label="站点名称" />
        <F k="siteUrl" label="站点 URL" />
        <F k="logoUrl" label="Logo URL" />
        <h3 className="font-semibold pt-2">SMTP</h3>
        <F k="smtpHost" label="主机" />
        <F k="smtpPort" label="端口" type="number" />
        <F k="smtpUser" label="用户" />
        <F k="smtpPass" label="密码" type="password" />
        <F k="mailFrom" label="发件地址" />
        <h3 className="font-semibold pt-2">LLM</h3>
        <F k="llmApiUrl" label="API URL" />
        <F k="llmApiKey" label="API Key" type="password" />
        <F k="llmModel" label="模型" />
        <button className="btn-primary" onClick={save}>保存</button>
      </div>
    </div>
  );
}