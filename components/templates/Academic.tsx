import type { TemplateProps } from "./index";
import Watermark from "./_Watermark";

export default function Academic({ content, watermark }: TemplateProps) {
  const { basic, experience = [], education = [], projects = [], skills = [] } = content;

  return (
    <div className="resume-page relative font-serif text-[13px] text-gray-900 leading-relaxed">
      <Watermark text={watermark} />

      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">{basic.name || "你的姓名"}</h1>
        {basic.title && <p className="italic text-gray-700 mt-1">{basic.title}</p>}
        <div className="text-xs text-gray-600 mt-2">
          {[basic.email, basic.phone, basic.location, basic.website].filter(Boolean).join(" · ")}
        </div>
      </header>

      {basic.summary && (
        <Section title="Research Interests">
          <p className="whitespace-pre-wrap">{basic.summary}</p>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <strong>{e.school}</strong>
                <span>{e.startDate} – {e.endDate}</span>
              </div>
              <div className="italic">{e.degree} in {e.major}</div>
              {e.description && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: e.description }} />}
            </div>
          ))}
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Academic Experience">
          {experience.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between">
                <strong>{e.position}</strong>
                <span>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
              </div>
              <div className="italic">{e.company}</div>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: e.description ?? "" }} />
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Publications & Projects">
          <ol className="list-decimal pl-5 space-y-1">
            {projects.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                <div className="prose prose-sm inline" dangerouslySetInnerHTML={{ __html: p.description ?? "" }} />
              </li>
            ))}
          </ol>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p>{skills.map((s) => s.name).join(", ")}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-base font-bold border-b border-gray-800 pb-1 mb-2">{title}</h2>
      {children}
    </section>
  );
}