"use client";
import { useEffect, useRef, useState } from "react";
import { useResumeStore, selectResumePayload } from "@/store/resume";
import BasicSection from "./sections/Basic";
import ExperienceSection from "./sections/Experience";
import EducationSection from "./sections/Education";
import ProjectSection from "./sections/Project";
import SkillsSection from "./sections/Skills";
import TemplateRenderer from "@/components/templates";

const TABS = [
  { key: "basic", label: "基本信息" },
  { key: "experience", label: "工作经历" },
  { key: "project", label: "项目" },
  { key: "education", label: "教育" },
  { key: "skills", label: "技能" },
] as const;

const TEMPLATES = [
  { key: "classic", label: "经典" },
  { key: "modern", label: "现代" },
  { key: "elegant", label: "优雅(深色)" },
  { key: "academic", label: "学术" },
  { key: "creative", label: "创意" },
];

interface Props {
  resumeId: string;
}

export default function ResumeEditor({ resumeId }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("basic");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = useResumeStore((s) => s.meta);
  const content = useResumeStore((s) => s.content);
  const dirty = useResumeStore((s) => s.dirty);
  const saving = useResumeStore((s) => s.saving);
  const lastSavedAt = useResumeStore((s) => s.lastSavedAt);
  const hydrate = useResumeStore((s) => s.hydrate);
  const setTitle = useResumeStore((s) => s.setTitle);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const markSaving = useResumeStore((s) => s.markSaving);
  const markSaved = useResumeStore((s) => s.markSaved);

  // 初始加载
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}`);
        if (!res.ok) throw new Error("加载失败");
        const data = await res.json();
        if (cancel) return;
        hydrate({
          meta: {
            id: data.id,
            title: data.title,
            templateKey: data.templateKey ?? "classic",
            language: data.language ?? "zh-CN",
            updatedAt: data.updatedAt,
          },
          content: data.content ?? {},
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [resumeId, hydrate]);

  // 自动保存（防抖 1.5s）
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!dirty || loading) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void doSave();
    }, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, loading, content, meta.title, meta.templateKey, meta.language]);

  // 离开页面提示
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const doSave = async () => {
    const payload = selectResumePayload(useResumeStore.getState());
    markSaving();
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "保存失败");
      markSaved();
    } catch (e: any) {
      setError(e.message);
      markSaved(); // 防止一直 saving
    }
  };

  const exportPdf = async () => {
    if (dirty) await doSave();
    window.open(`/api/resumes/${resumeId}/export-pdf`, "_blank");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">加载中…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部工具栏 */}
      <header className="border-b border-gray-200 bg-white px-4 py-2 flex items-center gap-3">
        <input
          className="flex-1 max-w-sm px-2 py-1 text-sm border border-transparent hover:border-gray-200 focus:border-brand-400 rounded outline-none"
          value={meta.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="简历标题"
        />

        <select
          className="select w-32 text-sm"
          value={meta.templateKey}
          onChange={(e) => setTemplate(e.target.value)}
        >
          {TEMPLATES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <span className="text-xs text-gray-500">
          {saving ? "保存中…" : dirty ? "未保存" : lastSavedAt ? "已保存" : ""}
        </span>

        <div className="flex-1" />

        <button onClick={doSave} className="btn text-sm">手动保存</button>
        <button onClick={exportPdf} className="btn-primary text-sm">导出 PDF</button>
      </header>

      {/* 主体：左编辑 / 右预览 */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden">
        {/* 左侧编辑区 */}
        <div className="overflow-y-auto bg-gray-50 p-4 space-y-4">
          <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2 sticky top-0 bg-gray-50 z-10">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 text-sm rounded transition ${
                  tab === t.key
                    ? "bg-brand-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "basic" && <BasicSection />}
          {tab === "experience" && <ExperienceSection />}
          {tab === "project" && <ProjectSection />}
          {tab === "education" && <EducationSection />}
          {tab === "skills" && <SkillsSection />}
        </div>

        {/* 右侧预览 */}
        <div className="overflow-y-auto bg-gray-200 p-6">
          <div className="mx-auto bg-white shadow-lg" style={{ width: "210mm", minHeight: "297mm", padding: "16mm" }}>
            <TemplateRenderer templateKey={meta.templateKey} content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}