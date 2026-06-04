"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "概览", icon: "📊" },
  { href: "/resumes", label: "我的简历", icon: "📄" },
  { href: "/billing", label: "套餐与账单", icon: "💳" },
  { href: "/settings", label: "设置", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="px-4 py-4 border-b border-gray-200">
        <Link href="/" className="text-lg font-bold text-brand-600">Resume</Link>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV.map((n) => {
          const active = pathname === n.href || pathname?.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                active ? "bg-brand-50 text-brand-700 font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t text-xs text-gray-400">v1.0.0</div>
    </aside>
  );
}