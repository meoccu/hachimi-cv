export default function Watermark({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden>
      <div className="absolute inset-0 grid grid-cols-3 gap-12 rotate-[-30deg] opacity-[0.06] text-2xl font-bold">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}