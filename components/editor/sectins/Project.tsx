"use client";
import { nanoid } from "nanoid";
import { useResumeStore } from "@/store/resume";
import RichText from "@/components/editor/RichText";

export default function ProjectSection() {
  const list = useResumeStore((s) => s.content.projects ?? []);
  const setList = useResumeStore((s) => s.setProjects);

  const add = () =>
    setList([...list, { id: nanoid(8), name: "", role: "", link: "", startDate: "", endDate: "", description: "" }]);
  const remove = (id: string) => setList(list.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<typeof list[number]>) =>
    setList(list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">项目经历</h3>
        <button onClick={add} className="btn-primary">+ 添加</button>
      </div>

      {list.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="项目名称" value={item.name} onChange={(e) => patch(item.id, { name: e.target.value })} />
            <input className="input" placeholder="担任角色" value={item.role ?? ""} onChange={(e) => patch(item.id, { role: e.target.value })} />
            <input className="input col-span-2" placeholder="项目链接" value={item.link ?? ""} onChange={(e) => patch(item.id, { link: e.target.value })} />
            <input type="month" className="input" value={item.startDate ?? ""} onChange={(e) => patch(item.id, { startDate: e.target.value })} />
            <input type="month" className="input" value={item.endDate ?? ""} onChange={(e) => patch(item.id, { endDate: e.target.value })} />
          </div>
          <RichText value={item.description ?? ""} onChange={(v) => patch(item.id, { description: v })} placeholder="项目简介、技术栈、成果..." />
          <div className="text-right">
            <button onClick={() => remove(item.id)} className="text-red-600 text-sm hover:underline">删除</button>
          </div>
        </div>
      ))}
    </div>
  );
}