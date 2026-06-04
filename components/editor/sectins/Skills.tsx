"use client";
import { nanoid } from "nanoid";
import { useResumeStore } from "@/store/resume";

const LEVELS = ["了解", "熟悉", "掌握", "精通", "专家"];

export default function SkillsSection() {
  const list = useResumeStore((s) => s.content.skills ?? []);
  const setList = useResumeStore((s) => s.setSkills);

  const add = () => setList([...list, { id: nanoid(8), name: "", level: 3 }]);
  const remove = (id: string) => setList(list.filter((i) => i.id !== id));
  const patch = (id: string, p: Partial<typeof list[number]>) =>
    setList(list.map((i) => (i.id === id ? { ...i, ...p } : i)));

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">技能</h3>
        <button onClick={add} className="btn-primary">+ 添加</button>
      </div>

      <div className="space-y-2">
        {list.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input
              className="input flex-1"
              placeholder="技能名称（如 React）"
              value={item.name}
              onChange={(e) => patch(item.id, { name: e.target.value })}
            />
            <select
              className="select w-32"
              value={item.level}
              onChange={(e) => patch(item.id, { level: Number(e.target.value) })}
            >
              {LEVELS.map((lv, idx) => (
                <option key={idx} value={idx + 1}>{lv}</option>
              ))}
            </select>
            <button onClick={() => remove(item.id)} className="text-red-600 text-sm">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}