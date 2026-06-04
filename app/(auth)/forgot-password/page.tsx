"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false); setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">忘记密码</h1>
        {sent ? (
          <p className="text-green-600">如果该邮箱已注册，您将收到密码重置邮件。</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input className="input" type="email" required placeholder="注册邮箱"
              value={email} onChange={e => setEmail(e.target.value)} />
            <button className="btn-primary w-full" disabled={loading}>{loading ? "发送中…" : "发送重置邮件"}</button>
          </form>
        )}
      </div>
    </div>
  );
}