import type { TemplateProps } from "./index";
import Watermark from "./_Watermark";

export default function Modern({ content, watermark }: TemplateProps) {
  const { basic, experience = [], education = [], projects = [], skills = [] } = content;

  return (
    <div className="resume-page relative font-sans text-[13px] text-gray-900">
      <Watermark text={watermark} />

      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight">{basic.name || "你的姓名"}</h1>
        {basic.title && <p className="text-brand-600 mt-1 text-lg">{basic.title}</p>}
        <div className="text-xs text-gray-500 mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {basic.email && <span>{basic.email}</span>}
          {basic.phone && <span>{basic.phone}</span>}
          {basic.location && <span>{basic.location}</span>}
          {basic.website && <span>{basic.website}</span>}
        </div>
      </header>

      {basic.summary && (
        <Block title="ABOUT">
          <p className="text-gray-700 whitespace-pre-wrap">{basic.summary}</p>
        </Block>
      )}

      {experience.length > 0 && (
        <Block title="EXPERIENCE">
          {experience.map((e) => (
            <div key={e.id} className="mb-4 grid grid-cols-[120px_1fr] gap-4">
              <div className="text-xs text-gray-500">{e.startDate}<br />{e.current ? "Present" : e.endDate}</div>
              <div>
                <div className="font-semibold">{e.position}</div>
                <div className="text-sm text-brand-600">{e.company}{e.location && ` · ${e.location}`}</div>
                <div className="prose prose-sm max-w-none mt-1" dangerouslySetInnerHTML={{ __html: e.description ?? "" }} />
              </div>
            </div>
          ))}
        </Block>
      )}

      {projects.length > 0 && (
        <Block title="PROJECTS">
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="font-semibold">{p.name} <span className="text-xs text-gray-500">{p.startDate} ~ {p.endDate}</span></div>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: p.description ?? "" }} />
            </div>
          ))}
        </Block>
      )}

      {education.length > 0 && (
        <Block title="EDUCATION">
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="font-semibold">{e.school}</div>
              <div className="text-sm text-gray-600">{e.degree} {e.major} · {e.startDate} ~ {e.endDate}</div>
            </div>
          ))}
        </Block>
      )}

      {skills.length > 0 && (
        <Block title="SKILLS">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="px-3 py-1 border border-gray-300 rounded-full text-xs">{s.name}</span>
            ))}
          </div>
        </Block>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-3">{title}</h2>
      {children}
    </section>
  );
}