"use client";

import { motion } from "framer-motion";
import { AuditForm } from "@/components/audit-form";

export function Hero({ auditsCount }: { auditsCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-[#2a241c] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-3xl space-y-4"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#E8B14B]">Бесплатный AI-аудит</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F5EFE6] sm:text-4xl lg:text-5xl">
            Твой LinkedIn кричит &apos;иммигрант&apos;.
          </h1>
          <h2 className="text-lg font-medium text-[#A39588] sm:text-xl">
            Западные рекрутеры это видят за 3 секунды и скроллят дальше.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[#F5EFE6]/90 sm:text-lg">
            Бесплатный AI-аудит покажет 12+ признаков, которые мешают тебе получать офферы в US/EU. Без регистрации,
            результат за 60 секунд.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="mt-10 max-w-xl"
        >
          <AuditForm />
          <p className="mt-3 text-center text-xs text-[#A39588] sm:text-left">
            Уже проанализировали профили <span className="font-semibold text-[#F5EFE6]">{auditsCount}</span>{" "}
            специалистов
          </p>
        </motion.div>
      </div>
    </section>
  );
}
