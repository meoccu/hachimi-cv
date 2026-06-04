"use client";
import { useEffect, useState } from "react";

export default function AdminResumesPage() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { fetch("/api/admin/resumes").then(r => r.json()).then(j => setList(j.data || [])); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">简历管理</h1>
      <table className="w-full text-sm bg-white">
        <thead><tr className="border-b text-left"><th>标题</th><th>用户</th><th>公开</th><th>更新时间</th></tr></thead>
        <tbody>
          {list.map(r => (
            <tr key={r.id} className="border-b">
              <td>{r.title}</td><td>{r.user?.email}</td>
              <td>{r.isPublic ? "是" : "否"}</td>
              <td>{new Date(r.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}