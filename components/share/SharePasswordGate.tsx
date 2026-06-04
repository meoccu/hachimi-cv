"use client";
import { useState } from "react";

export default function SharePasswordGate({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch(`/api/share/${slug}/check-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!r.ok) { setError("密码错误"); return; }
    location.reload();
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-3">
        <h2 className="font-bold text-lg text-center">该简历受密码保护</h2>
        <input className="input" type="password" required placeholder="访问密码"
          value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button className="btn-primary w-full">进入</button>
      </form>
    </div>
  );
}