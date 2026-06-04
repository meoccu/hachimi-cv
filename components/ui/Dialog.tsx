"use client";
import { ReactNode, useEffect } from "react";

export function Dialog({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title?: string;
  children: ReactNode; footer?: ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        {title && <div className="px-5 py-3 border-b font-semibold">{title}</div>}
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t bg-gray-50 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}