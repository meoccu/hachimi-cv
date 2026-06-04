"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "登录失败");
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" type="email" required placeholder="邮箱"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" required minLength={8} placeholder="密码"
            value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
        <div className="my-4 text-center text-xs text-gray-400">或</div>
        <div className="grid grid-cols-2 gap-2">
          <a href="/api/auth/github" className="btn justify-center">GitHub</a>
          <a href="/api/auth/wechat" className="btn justify-center">微信</a>
        </div>
        <div className="mt-6 flex justify-between text-sm">
          <Link href="/forgot-password" className="text-brand-600 hover:underline">忘记密码？</Link>
          <Link href="/register" className="text-brand-600 hover:underline">注册账号</Link>
        </div>
      </div>
    </div>
  );
}