import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyShareToken } from "@/lib/jwt";
import SharePasswordGate from "@/components/share/SharePasswordGate";
import PublicResumeView from "@/components/share/PublicResumeView";

export default async function SharePage({ params }: { params: { slug: string } }) {
  const r = await prisma.resume.findUnique({
    where: { slug: params.slug },
    include: { template: true, user: { select: { name: true } } },
  });
  if (!r || !r.isPublic || r.deletedAt) notFound();
  if (r.expiresAt && r.expiresAt < new Date()) {
    return <div className="p-10 text-center text-gray-500">该简历已过期</div>;
  }

  if (r.sharePasswordHash) {
    const token = cookies().get(`share_${r.id}`)?.value;
    const ok = token && verifyShareToken(token)?.rid === r.id;
    if (!ok) return <SharePasswordGate slug={params.slug} />;
  }

  return <PublicResumeView resume={r as any} />;
}