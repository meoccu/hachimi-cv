import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ResumePreview from "@/components/preview/ResumePreview";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = await prisma.resume.findUnique({ where: { slug: params.slug } });
  if (!r || !r.isPublic) return { title: "未找到" };
  const c: any = r.content;
  const title = `${c?.basic?.name || "简历"} - ${c?.basic?.title || ""}`;
  const desc = (c?.summary?.text || "在线简历").slice(0, 140);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  return {
    title, description: desc,
    alternates: { canonical: `${baseUrl}/r/${r.slug}` },
    openGraph: { title, description: desc, url: `${baseUrl}/r/${r.slug}`, type: "profile" },
  };
}

export default async function PublicResume({ params }: { params: { slug: string } }) {
  const r = await prisma.resume.findUnique({ where: { slug: params.slug } });
  if (!r || !r.isPublic) return <div>未找到</div>;
  // 此处可结合 templateId 拉取并渲染模板，否则用默认结构
  return <ResumePreview html={`<h1>${(r.content as any).basic.name}</h1>`} />;
}