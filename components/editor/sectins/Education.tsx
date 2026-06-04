"use client";
import { nanoid } from "nanoid";
import { useResumeStore } from "@/store/resume";
import RichText from "@/components/editor/RichText";

export default function EducationSection() {
  const list = useResumeStore((s) => s.content.education ?? []);
  const setList = useResumeStore((s) => s.setEducation);

  const add = () =>
    setList([...list, { id: nanoid(8), school: "", major: "", degree: "", startDate: "", endDate: "", description: "" }]);
  const remove = (id: string) => setList(list.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<typeof list[number]>) =>
    setList(list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">教育经历</h3>
        <button onClick={add} className="btn-primary">+ 添加</button>
      </div>

      {list.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="学校" value={item.school} onChange={(e) => patch(item.id, { school: e.target.value })} />
            <input className="input" placeholder="专业" value={item.major ?? ""} onChange={(e) => patch(item.id, { major: e.target.value })} />
            <select className="select" value={item.degree ?? ""} onChange={(e) => patch(item.id, { degree: e.target.value })}>
              <option value="">学历</option>
              <option value="高中">高中</option>
              <option value="大专">大专</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
            <div className="flex gap-2">
              <input type="month" className="input" value={item.startDate ?? ""} onChange={(e) => patch(item.id, { startDate: e.target.value })} />
              <input type="month" className="input" value={item.endDate ?? ""} onChange={(e) => patch(item.id, { endDate: e.target.value })} />
            </div>
          </div>
          <RichText value={item.description ?? ""} onChange={(v) => patch(item.id, { description: v })} placeholder="主修课程、GPA、奖项..." />
          <div className="text-right">
            <button onClick={() => remove(item.id)} className="text-red-600 text-sm hover:underline">删除</button>
          </div>
        </div>
      ))}
    </div>
  );
}