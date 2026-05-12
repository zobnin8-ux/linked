"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = { id: string; label: string; doneAtMs: number };

const stages: Stage[] = [
  { id: "parse", label: "Парсим профиль", doneAtMs: 5000 },
  { id: "ai", label: "AI-анализ", doneAtMs: 30000 },
  { id: "report", label: "Формируем отчёт", doneAtMs: 50000 },
];

export function ProgressStages({ active }: { active: boolean }) {
  const [t0] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [active]);

  const elapsed = now - t0;

  const stageState = useMemo(() => {
    return stages.map((s, idx) => {
      const prevDone = idx === 0 ? true : elapsed >= stages[idx - 1]!.doneAtMs;
      const done = elapsed >= s.doneAtMs;
      const running = prevDone && !done;
      return { ...s, done, running };
    });
  }, [elapsed]);

  return (
    <div className="mx-auto max-w-md space-y-4">
      {stageState.map((s) => (
        <motion.div
          key={s.id}
          layout
          className={cn(
            "flex items-center gap-3 rounded-[12px] border px-4 py-3",
            s.done
              ? "border-[#7DB35B]/40 bg-[#7DB35B]/10"
              : s.running
                ? "border-[#E8B14B]/40 bg-[#E8B14B]/10"
                : "border-[#2a241c] bg-[#14110e]",
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2a241c] bg-[#0E0B08]">
            <AnimatePresence mode="wait" initial={false}>
              {s.done ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                >
                  <Check className="h-5 w-5 text-[#7DB35B]" />
                </motion.span>
              ) : s.running ? (
                <motion.span key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Loader2 className="h-5 w-5 animate-spin text-[#E8B14B]" />
                </motion.span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-[#A39588]/50" />
              )}
            </AnimatePresence>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F5EFE6]">{s.label}</p>
            <p className="text-xs text-[#A39588]">
              {s.done ? "Готово" : s.running ? "В процессе…" : "В очереди"}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
