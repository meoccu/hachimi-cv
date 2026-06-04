"use client";
import { useEffect, useState } from "react";

export default function VersionHistory({ resumeId }: { resumeId: string }) {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/resumes/${resumeId}/versions`).then(r => r.json()).then(j => setList(j.data || []));
  }, [resumeId]);

  const rollback = async (versionId: string) => {
    if (!confirm("确认回滚到此版本?")) return;
    await fetch(`/api/resumes/${resumeId}/rollback/${versionId}`, { method: "POST" });
    alert("已回滚");
    location.reload();
  };

  return (
    <ul className="divide-y">
      {list.map(v => (
        <li key={v.id} className="flex items-center justify-between py-2">
          <div>
            <div className="font-mono">#v{v.versionNo}</div>
            <div className="text-xs text-gray-500">{new Date(v.createdAt).toLocaleString()} · {v.message || "无备注"}</div>
          </div>
          <button className="btn" onClick={() => rollback(v.id)}>回滚</button>
        </li>
      ))}
    </ul>
  );
}