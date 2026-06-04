export interface Basic {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  avatar?: string;
  summary?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate?: string;   // YYYY-MM
  endDate?: string;
  current?: boolean;
  description?: string; // HTML
}

export interface EducationItem {
  id: string;
  school: string;
  major?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface ResumeContent {
  basic: Basic;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  // 可扩展：certifications / languages / awards / customSections
  customSections?: Array<{ id: string; title: string; html: string }>;
}