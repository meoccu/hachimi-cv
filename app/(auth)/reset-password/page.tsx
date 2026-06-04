"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setError("两次输入不一致");
    setLoading(true); setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "重置失败"); return;
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">重置密码</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="password" required minLength={8}
            placeholder="新密码（≥ 8 位）" value={password} onChange={e => setPassword(e.target.value)} />
          <input className="input" type="password" required placeholder="确认密码"
            value={confirm} onChange={e => setConfirm(e.target.value)} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="btn-primary w-full" disabled={loading || !token}>
            {loading ? "提交中…" : "重置密码"}
          </button>
        </form>
      </div>
    </div>
  );
}