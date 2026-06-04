import type { TemplateProps } from "./index";
import Watermark from "./_Watermark";

export default function Classic({ content, watermark }: TemplateProps) {
  const { basic, experience = [], education = [], projects = [], skills = [] } = content;

  return (
    <div className="resume-page relative font-sans text-[13px] text-gray-800 leading-relaxed">
      <Watermark text={watermark} />

      <header className="border-b-2 border-gray-800 pb-3 mb-4">
        <h1 className="text-3xl font-bold">{basic.name || "你的姓名"}</h1>
        {basic.title && <p className="text-gray-600 mt-1">{basic.title}</p>}
        <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-3">
          {basic.email && <span>✉ {basic.email}</span>}
          {basic.phone && <span>☎ {basic.phone}</span>}
          {basic.location && <span>📍 {basic.location}</span>}
          {basic.website && <span>🌐 {basic.website}</span>}
        </div>
      </header>

      {basic.summary && (
        <Section title="个人简介">
          <p className="whitespace-pre-wrap">{basic.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="工作经历">
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <strong>{e.company} · {e.position}</strong>
                <span className="text-xs text-gray-500">{e.startDate} ~ {e.current ? "至今" : e.endDate}</span>
              </div>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: e.description ?? "" }} />
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="项目经历">
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex justify-between">
                <strong>{p.name} {p.role && `· ${p.role}`}</strong>
                <span className="text-xs text-gray-500">{p.startDate} ~ {p.endDate}</span>
              </div>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: p.description ?? "" }} />
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="教育经历">
          {education.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <strong>{e.school} · {e.degree} {e.major}</strong>
                <span className="text-xs text-gray-500">{e.startDate} ~ {e.endDate}</span>
              </div>
              {e.description && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: e.description }} />}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="技能">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                {s.name}{s.level ? ` · ${"★".repeat(s.level)}` : ""}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2 uppercase tracking-wider">{title}</h2>
      {children}
    </section>
  );
}