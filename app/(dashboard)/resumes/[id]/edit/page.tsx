import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ResumeEditor from "@/components/editor/ResumeEditor";
import AiPolishPanel from "@/components/ai/AiPolishPanel";
import VersionHistory from "@/components/versions/VersionHistory";
import ShareSettings from "@/components/share/ShareSettings";
import TemplateSelector from "@/components/templates/TemplateSelector";
import Link from "next/link";

export default async function EditPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.deletedAt || r.userId !== user.id) notFound();

  const initialContent: any = r.content || {
    basic: { name: "", title: "", email: user.email, phone: "" },
    summary: { html: "" }, skills: [],
    experiences: [], projects: [], educations: [],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">编辑简历</h1>
          <div className="flex gap-2">
            <Link className="btn" href={`/resumes/${r.id}/preview`}>预览</Link>
            <a className="btn-primary" href={`/api/resumes/${r.id}/export-pdf`} target="_blank">导出 PDF</a>
          </div>
        </div>
        <ResumeEditor resumeId={r.id} initial={initialContent} />
      </div>

      <aside className="space-y-4">
        <div className="card">
          <h3 className="font-semibold mb-3">选择模板</h3>
          <TemplateSelector value={r.templateId || undefined} onChange={() => {}} />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">AI 润色</h3>
          <AiPolishPanel resumeId={r.id} text="" onApply={() => {}} />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">分享设置</h3>
          <ShareSettings resume={r} />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">历史版本</h3>
          <VersionHistory resumeId={r.id} />
        </div>
      </aside>
    </div>
  );
}