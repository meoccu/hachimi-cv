"use client";
import { nanoid } from "nanoid";
import { useResumeStore } from "@/store/resume";
import RichText from "@/components/editor/RichText";

export default function ExperienceSection() {
  const list = useResumeStore((s) => s.content.experience ?? []);
  const setList = useResumeStore((s) => s.setExperience);

  const add = () =>
    setList([
      ...list,
      { id: nanoid(8), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" },
    ]);
  const remove = (id: string) => setList(list.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<typeof list[number]>) =>
    setList(list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">工作经历</h3>
        <button onClick={add} className="btn-primary">+ 添加</button>
      </div>

      {list.length === 0 && <p className="text-sm text-gray-400">暂无内容，点击添加</p>}

      {list.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="公司" value={item.company} onChange={(e) => patch(item.id, { company: e.target.value })} />
            <input className="input" placeholder="职位" value={item.position} onChange={(e) => patch(item.id, { position: e.target.value })} />
            <input className="input" placeholder="城市" value={item.location ?? ""} onChange={(e) => patch(item.id, { location: e.target.value })} />
            <div className="flex gap-2">
              <input type="month" className="input" value={item.startDate ?? ""} onChange={(e) => patch(item.id, { startDate: e.target.value })} />
              <input type="month" className="input" disabled={item.current} value={item.endDate ?? ""} onChange={(e) => patch(item.id, { endDate: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={item.current} onChange={(e) => patch(item.id, { current: e.target.checked, endDate: e.target.checked ? "" : item.endDate })} />
            至今
          </label>
          <RichText value={item.description ?? ""} onChange={(v) => patch(item.id, { description: v })} placeholder="工作内容、业绩、技术栈..." />
          <div className="text-right">
            <button onClick={() => remove(item.id)} className="text-red-600 text-sm hover:underline">删除</button>
          </div>
        </div>
      ))}
    </div>
  );
}