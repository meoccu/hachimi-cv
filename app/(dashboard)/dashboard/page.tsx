import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const [resumeCount, totalViews, aiCount] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id, deletedAt: null } }),
    prisma.resumeView.count({ where: { resume: { userId: user.id } } }),
    prisma.aiUsageLog.count({ where: { userId: user.id } }),
  ]);
  const recent = await prisma.resume.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { updatedAt: "desc" }, take: 5,
    select: { id: true, title: true, updatedAt: true, isPublic: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">欢迎，{user.name || user.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="简历数量" value={resumeCount} />
        <Card title="累计访问" value={totalViews} />
        <Card title="AI 使用次数" value={aiCount} />
      </div>

      <div className="card">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold">最近简历</h2>
          <Link href="/resumes" className="text-brand-600 text-sm">查看全部</Link>
        </div>
        <ul className="divide-y">
          {recent.map(r => (
            <li key={r.id} className="py-2 flex justify-between">
              <Link href={`/resumes/${r.id}/edit`} className="hover:text-brand-600">{r.title}</Link>
              <span className="text-xs text-gray-500">{new Date(r.updatedAt).toLocaleString()}</span>
            </li>
          ))}
          {!recent.length && <li className="text-sm text-gray-500 py-3">还没有简历，<Link href="/resumes" className="text-brand-600">立即创建</Link></li>}
        </ul>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}