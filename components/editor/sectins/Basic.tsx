"use client";
import { useResumeStore } from "@/store/resume";

export default function BasicSection() {
  const basic = useResumeStore((s) => s.content.basic);
  const update = useResumeStore((s) => s.updateBasic);

  const field = (key: keyof typeof basic, label: string, type = "text") => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        value={(basic as any)[key] ?? ""}
        onChange={(e) => update({ [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="card space-y-4">
      <h3 className="text-base font-semibold">基本信息</h3>
      <div className="grid grid-cols-2 gap-3">
        {field("name", "姓名")}
        {field("title", "职位 / 头衔")}
        {field("email", "邮箱", "email")}
        {field("phone", "电话")}
        {field("location", "城市")}
        {field("website", "个人网站", "url")}
      </div>
      <div>
        <label className="label">头像 URL</label>
        <input
          className="input"
          value={basic.avatar ?? ""}
          onChange={(e) => update({ avatar: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="label">个人简介</label>
        <textarea
          className="input min-h-[100px]"
          value={basic.summary ?? ""}
          onChange={(e) => update({ summary: e.target.value })}
        />
      </div>
    </div>
  );
}