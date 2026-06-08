"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Check, Info } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  tone: "ok" | "info";
}

const ToastCtx = createContext<(message: string, tone?: "ok" | "info") => void>(
  () => {}
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, tone: "ok" | "info" = "ok") => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-fade-in flex items-center gap-2.5 rounded-xl border border-line bg-ink px-4 py-2.5 text-[13.5px] font-medium text-white shadow-xl shadow-black/20"
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: "var(--accent)" }}
            >
              {t.tone === "ok" ? <Check size={12} /> : <Info size={12} />}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
