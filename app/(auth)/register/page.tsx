"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, inviteCode: inviteCode || undefined }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "注册失败");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">注册</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="姓名（可选）" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" type="email" required placeholder="邮箱"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" type="password" required minLength={8}
            placeholder="密码（至少 8 位）" value={password} onChange={e => setPassword(e.target.value)} />
          <input className="input" placeholder="邀请码（可选）"
            value={inviteCode} onChange={e => setInviteCode(e.target.value)} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "注册中…" : "注册"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          已有账号？<Link href="/login" className="text-brand-600 hover:underline">登录</Link>
        </div>
      </div>
    </div>
  );
}