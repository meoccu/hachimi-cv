import type { TemplateProps } from "./index";
import Watermark from "./_Watermark";

export default function Elegant({ content, watermark }: TemplateProps) {
  const { basic, experience = [], education = [], projects = [], skills = [] } = content;

  return (
    <div className="resume-page relative bg-slate-900 text-slate-100 font-sans text-[13px]">
      <Watermark text={watermark} />

      <header className="mb-6 pb-4 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-amber-400">{basic.name || "你的姓名"}</h1>
        {basic.title && <p className="text-slate-300 mt-1">{basic.title}</p>}
        <div className="text-xs text-slate-400 mt-2 flex flex-wrap gap-3">
          {basic.email && <span>{basic.email}</span>}
          {basic.phone && <span>{basic.phone}</span>}
          {basic.location && <span>{basic.location}</span>}
        </div>
      </header>

      {basic.summary && <Section title="简介"><p className="whitespace-pre-wrap text-slate-200">{basic.summary}</p></Section>}

      {experience.length > 0 && (
        <Section title="工作经历">
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <strong className="text-amber-300">{e.position} @ {e.company}</strong>
                <span className="text-xs text-slate-400">{e.startDate} ~ {e.current ? "至今" : e.endDate}</span>
              </div>
              <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: e.description ?? "" }} />
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="项目">
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <strong className="text-amber-300">{p.name}</strong>
              <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: p.description ?? "" }} />
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="教育">
          {education.map((e) => (
            <div key={e.id} className="text-slate-200">
              <strong>{e.school}</strong> · {e.degree} {e.major} <span className="text-xs text-slate-400">({e.startDate} ~ {e.endDate})</span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="技能">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="px-2 py-1 bg-slate-800 border border-amber-500/30 rounded text-xs">{s.name}</span>
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
      <h2 className="text-sm font-semibold text-amber-400 border-l-2 border-amber-400 pl-2 mb-2">{title}</h2>
      {children}
    </section>
  );
}