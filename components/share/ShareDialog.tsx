"use client";
import { useEffect, useState } from "react";

interface Props {
  resumeId: string;
  slug: string;
  isPublic: boolean;
  hasPassword: boolean;
  expiresAt?: string | null;
  watermark?: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function ShareDialog({
  resumeId, slug, isPublic, hasPassword, expiresAt, watermark, onClose, onUpdated,
}: Props) {
  const [pub, setPub] = useState(isPublic);
  const [pwd, setPwd] = useState("");
  const [removePwd, setRemovePwd] = useState(false);
  const [exp, setExp] = useState(expiresAt?.slice(0, 10) ?? "");
  const [wm, setWm] = useState(watermark ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/s/${slug}` : "";

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublic: pub,
          password: removePwd ? null : pwd || undefined,
          expiresAt: exp ? new Date(exp).toISOString() : null,
          watermark: wm || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "保存失败");
      onUpdated?.();
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg w-[420px] max-w-full p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">分享简历</h2>

        <div className="flex items-center gap-2">
          <input className="input flex-1 text-xs" value={url} readOnly />
          <button onClick={copy} className="btn-primary text-xs">{copied ? "已复制" : "复制"}</button>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} />
          公开访问（关闭后链接失效）
        </label>

        <div>
          <label className="label">访问密码 {hasPassword && <span className="text-xs text-green-600">（已设置）</span>}</label>
          <input
            type="password"
            className="input"
            placeholder={hasPassword ? "留空表示不修改" : "可选"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          {hasPassword && (
            <label className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <input type="checkbox" checked={removePwd} onChange={(e) => setRemovePwd(e.target.checked)} />
              移除密码
            </label>
          )}
        </div>

        <div>
          <label className="label">过期时间</label>
          <input type="date" className="input" value={exp} onChange={(e) => setExp(e.target.value)} />
        </div>

        <div>
          <label className="label">水印（仅 Pro+ 可用）</label>
          <input
            className="input"
            placeholder="例如：仅供 XX 公司投递"
            value={wm}
            onChange={(e) => setWm(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn">取消</button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? "保存中…" : "保存设置"}
          </button>
        </div>
      </div>
    </div>
  );
}