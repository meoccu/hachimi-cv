import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, clearAuthCookie } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "仪表盘" },
  { href: "/resumes", label: "简历" },
  { href: "/templates", label: "模板" },
  { href: "/billing", label: "会员/订单" },
  { href: "/settings", label: "设置" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-white border-r flex flex-col">
        <div className="p-5 font-bold text-xl text-brand-600">Resume</div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="block px-3 py-2 rounded hover:bg-gray-100">{n.label}</Link>
          ))}
          {user.isAdmin && (
            <Link href="/admin/users" className="block px-3 py-2 rounded text-red-600 hover:bg-red-50">管理后台</Link>
          )}
        </nav>
        <div className="p-4 border-t text-sm">
          <div className="font-medium truncate">{user.name || user.email}</div>
          <div className="text-xs text-gray-500 mb-3">{user.plan}</div>
          <form action={async () => { "use server"; await clearAuthCookie(); redirect("/login"); }}>
            <button className="btn w-full" type="submit">退出</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}