"use client";
import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; msg: string; type: "info" | "success" | "error" };
const Ctx = createContext<{ push: (msg: string, type?: Toast["type"]) => void }>({ push: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((msg: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setList(l => [...l, { id, msg, type }]);
    setTimeout(() => setList(l => l.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {list.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-sm text-white ${
            t.type === "error" ? "bg-red-600" : t.type === "success" ? "bg-green-600" : "bg-gray-800"
          }`}>{t.msg}</div>
        ))}
      </div>
    </Ctx.Provider>
  );
}