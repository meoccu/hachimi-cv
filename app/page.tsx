import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
        <Link href="/" className="font-bold text-xl text-brand-600">Resume Platform</Link>
        <nav className="flex gap-3">
          <Link href="/login" className="btn">登录</Link>
          <Link href="/register" className="btn-primary">免费注册</Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">让简历，<span className="text-brand-600">更出色</span></h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          多模板、AI 润色、PDF 导出、访问统计、隐私分享 —— 所有你需要的功能，一个平台搞定。
        </p>
        <div className="flex gap-3">
          <Link href="/register" className="btn-primary px-6 py-3">立即开始</Link>
          <Link href="/templates" className="btn px-6 py-3">查看模板</Link>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 py-6 border-t bg-white">
        © {new Date().getFullYear()} Resume Platform.
      </footer>
    </main>
  );
}