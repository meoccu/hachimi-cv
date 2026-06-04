import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import PdfPreview from "@/components/preview/PdfPreview";
import Link from "next/link";

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const r = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!r || r.deletedAt || r.userId !== user.id) notFound();

  const pdfUrl = `/api/resumes/${r.id}/export-pdf`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{r.title} - 预览</h1>
        <div className="flex gap-2">
          <Link className="btn" href={`/resumes/${r.id}/edit`}>返回编辑</Link>
          <a className="btn-primary" href={pdfUrl} download>下载 PDF</a>
        </div>
      </div>
      <PdfPreview url={pdfUrl} />
    </div>
  );
}