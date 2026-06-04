"use client";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  ResumeContent,
  Basic,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillItem,
} from "@/types/resume";

interface ResumeMeta {
  id: string;
  title: string;
  templateKey: string;
  language: string;
  updatedAt?: string;
}

interface ResumeState {
  // 元数据
  meta: ResumeMeta;
  content: ResumeContent;

  // 状态
  dirty: boolean;
  saving: boolean;
  lastSavedAt: number | null;

  // 元数据更新
  setMeta: (m: Partial<ResumeMeta>) => void;
  setTemplate: (key: string) => void;
  setLanguage: (lang: string) => void;
  setTitle: (title: string) => void;

  // 整体加载
  hydrate: (data: { meta: ResumeMeta; content: ResumeContent }) => void;

  // Basic
  updateBasic: (p: Partial<Basic>) => void;

  // Experience
  setExperience: (list: ExperienceItem[]) => void;
  // Education
  setEducation: (list: EducationItem[]) => void;
  // Projects
  setProjects: (list: ProjectItem[]) => void;
  // Skills
  setSkills: (list: SkillItem[]) => void;

  // 保存
  markSaving: () => void;
  markSaved: () => void;
  markDirty: () => void;
}

const EMPTY_CONTENT: ResumeContent = {
  basic: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    avatar: "",
    summary: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
};

export const useResumeStore = create<ResumeState>()(
  subscribeWithSelector((set) => ({
    meta: { id: "", title: "未命名简历", templateKey: "classic", language: "zh-CN" },
    content: EMPTY_CONTENT,
    dirty: false,
    saving: false,
    lastSavedAt: null,

    setMeta: (m) => set((s) => ({ meta: { ...s.meta, ...m }, dirty: true })),
    setTemplate: (key) => set((s) => ({ meta: { ...s.meta, templateKey: key }, dirty: true })),
    setLanguage: (lang) => set((s) => ({ meta: { ...s.meta, language: lang }, dirty: true })),
    setTitle: (title) => set((s) => ({ meta: { ...s.meta, title }, dirty: true })),

    hydrate: ({ meta, content }) =>
      set({
        meta,
        content: { ...EMPTY_CONTENT, ...content },
        dirty: false,
        saving: false,
        lastSavedAt: Date.now(),
      }),

    updateBasic: (p) =>
      set((s) => ({
        content: { ...s.content, basic: { ...s.content.basic, ...p } },
        dirty: true,
      })),

    setExperience: (list) =>
      set((s) => ({ content: { ...s.content, experience: list }, dirty: true })),
    setEducation: (list) =>
      set((s) => ({ content: { ...s.content, education: list }, dirty: true })),
    setProjects: (list) =>
      set((s) => ({ content: { ...s.content, projects: list }, dirty: true })),
    setSkills: (list) =>
      set((s) => ({ content: { ...s.content, skills: list }, dirty: true })),

    markSaving: () => set({ saving: true }),
    markSaved: () => set({ saving: false, dirty: false, lastSavedAt: Date.now() }),
    markDirty: () => set({ dirty: true }),
  }))
);

/** 选择器助手 */
export const selectResumePayload = (s: ResumeState) => ({
  title: s.meta.title,
  templateKey: s.meta.templateKey,
  language: s.meta.language,
  content: s.content,
});