"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Resume { id: string; title: string; slug: string; updatedAt: string; isPublic: boolean; }

export default function ResumesPage() {
  const router = useRouter();
  const [list, setList] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const r = await fetch("/api/resumes"); const j = await r.json();
    setList(j.data || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    const r = await fetch("/api/resumes", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    if (!r.ok) { alert((await r.json()).error || "创建失败"); return; }
    const j = await r.json();
    router.push(`/resumes/${j.data.id}/edit`);
  };

  const del = async (id: string) => {
    if (!confirm("删除该简历？")) return;
    await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">我的简历</h1>
        <button className="btn-primary" onClick={create}>+ 新建简历</button>
      </div>
      {loading ? <div>加载中…</div> :
        list.length === 0 ? <div className="card text-gray-500">还没有简历</div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(r => (
            <div key={r.id} className="card">
              <h3 className="font-semibold truncate">{r.title}</h3>
              <div className="text-xs text-gray-500 my-2">
                更新时间：{new Date(r.updatedAt).toLocaleString()} {r.isPublic && <span className="text-green-600 ml-2">已公开</span>}
              </div>
              <div className="flex gap-2">
                <Link className="btn" href={`/resumes/${r.id}/edit`}>编辑</Link>
                <Link className="btn" href={`/resumes/${r.id}/preview`}>预览</Link>
                <Link className="btn" href={`/resumes/${r.id}/stats`}>统计</Link>
                <button className="btn-danger ml-auto" onClick={() => del(r.id)}>删除</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}