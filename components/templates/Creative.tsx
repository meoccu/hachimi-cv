import type { TemplateProps } from "./index";
import Watermark from "./_Watermark";

export default function Creative({ content, watermark }: TemplateProps) {
  const { basic, experience = [], education = [], projects = [], skills = [] } = content;

  return (
    <div className="resume-page relative font-sans text-[13px] p-0 grid grid-cols-[35%_65%]">
      <Watermark text={watermark} />

      {/* 左侧 */}
      <aside className="bg-brand-600 text-white p-6 space-y-5">
        {basic.avatar && (
          <img src={basic.avatar} alt={basic.name} className="w-24 h-24 rounded-full mx-auto border-4 border-white object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{basic.name || "你的姓名"}</h1>
          {basic.title && <p className="text-brand-100 text-sm mt-1">{basic.title}</p>}
        </div>

        <SidebarBlock title="联系方式">
          {basic.email && <p className="text-xs">✉ {basic.email}</p>}
          {basic.phone && <p className="text-xs">☎ {basic.phone}</p>}
          {basic.location && <p className="text-xs">📍 {basic.location}</p>}
          {basic.website && <p className="text-xs break-all">🌐 {basic.website}</p>}
        </SidebarBlock>

        {skills.length > 0 && (
          <SidebarBlock title="技能">
            {skills.map((s) => (
              <div key={s.id} className="mb-2">
                <div className="text-xs flex justify-between"><span>{s.name}</span><span>{s.level}/5</span></div>
                <div className="h-1 bg-brand-300/40 rounded">
                  <div className="h-1 bg-white rounded" style={{ width: `${(s.level / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </SidebarBlock>
        )}

        {education.length > 0 && (
          <SidebarBlock title="教育">
            {education.map((e) => (
              <div key={e.id} className="mb-2 text-xs">
                <div className="font-semibold">{e.school}</div>
                <div>{e.degree} {e.major}</div>
                <div className="text-brand-100">{e.startDate} ~ {e.endDate}</div>
              </div>
            ))}
          </SidebarBlock>
        )}
      </aside>

      {/* 右侧 */}
      <main className="p-6 bg-white">
        {basic.summary && (
          <MainBlock title="关于我">
            <p className="whitespace-pre-wrap text-gray-700">{basic.summary}</p>
          </MainBlock>
        )}

        {experience.length > 0 && (
          <MainBlock title="工作经历">
            {experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="font-semibold text-gray-800">{e.position}</div>
                <div className="text-brand-600 text-sm">{e.company} · {e.startDate} ~ {e.current ? "至今" : e.endDate}</div>
                <div className="prose prose-sm max-w-none mt-1" dangerouslySetInnerHTML={{ __html: e.description ?? "" }} />
              </div>
            ))}
          </MainBlock>
        )}

        {projects.length > 0 && (
          <MainBlock title="项目经历">
            {projects.map((p) => (
              <div key={p.id} className="mb-2">
                <div className="font-semibold">{p.name}</div>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: p.description ?? "" }} />
              </div>
            ))}
          </MainBlock>
        )}
      </main>
    </div>
  );
}

function SidebarBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1 mb-2">{title}</h3>
      {children}
    </div>
  );
}
function MainBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-base font-bold text-brand-600 mb-2">{title}</h2>
      {children}
    </section>
  );
}