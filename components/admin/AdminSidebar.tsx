"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin/dashboard", label: "数据概览", icon: "📈" },
  { href: "/admin/users", label: "用户管理", icon: "👥" },
  { href: "/admin/templates", label: "模板管理", icon: "🎨" },
  { href: "/admin/orders", label: "订单管理", icon: "💰" },
  { href: "/admin/settings", label: "站点设置", icon: "🛠" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-slate-900 text-slate-100 h-screen sticky top-0 flex flex-col">
      <div className="px-4 py-4 border-b border-slate-700">
        <Link href="/admin" className="text-lg font-bold text-white">⚡ Admin</Link>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV.map((n) => {
          const active = pathname?.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                active ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <Link href="/dashboard" className="px-4 py-3 border-t border-slate-700 text-xs text-slate-400 hover:text-white">
        ← 返回用户端
      </Link>
    </aside>
  );
}