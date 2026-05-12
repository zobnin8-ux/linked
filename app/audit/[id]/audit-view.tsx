"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { ProgressStages } from "@/components/progress-stages";
import { TeaserResult } from "@/components/teaser-result";
import type { AuditStatus, Insight } from "@/types/audit";

type StatusPayload = {
  status: AuditStatus;
  severity_score?: number;
  top_3_insights?: Insight[];
  email_masked?: string;
  error?: string;
};

export function AuditView({ auditId }: { auditId: string }) {
  const router = useRouter();
  const [data, setData] = useState<StatusPayload | null>(null);
  const [slow, setSlow] = useState(false);
  const trackedProcessing = useRef(false);
  const trackedReady = useRef(false);
  const trackedFailed = useRef(false);

  const poll = useCallback(async () => {
    const res = await fetch(`/api/audit/status?id=${encodeURIComponent(auditId)}`, { cache: "no-store" });
    if (!res.ok) return;
    const json = (await res.json()) as StatusPayload;
    setData(json);
  }, [auditId]);

  useEffect(() => {
    void poll();
    const id = window.setInterval(() => void poll(), 3000);
    return () => window.clearInterval(id);
  }, [poll]);

  useEffect(() => {
    const t = window.setTimeout(() => setSlow(true), 90_000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!data) return;
    if ((data.status === "pending" || data.status === "processing") && !trackedProcessing.current) {
      trackedProcessing.current = true;
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture("audit_processing_started", { audit_id: auditId });
      }
    }
    if (data.status === "ready" && !trackedReady.current) {
      trackedReady.current = true;
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture("audit_ready_viewed", {
          audit_id: auditId,
          severity_score: data.severity_score ?? null,
        });
      }
    }
    if (data.status === "failed" && !trackedFailed.current) {
      trackedFailed.current = true;
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture("audit_failed", { audit_id: auditId, error: data.error ?? "unknown" });
      }
    }
  }, [auditId, data]);

  const scoreColor = useMemo(() => {
    const s = data?.severity_score ?? 0;
    if (s >= 70) return "text-[#E85A4B]";
    if (s >= 40) return "text-[#E8B14B]";
    return "text-[#7DB35B]";
  }, [data?.severity_score]);

  const subtitle = useMemo(() => {
    const s = data?.severity_score ?? 0;
    if (s >= 70) return "Профиль сильно «пахнет» иммигрантом. Большинство рекрутеров не дочитывают.";
    if (s >= 40) return "Профиль среднего качества, но есть критичные моменты, которые отсекают.";
    return "Профиль в неплохом состоянии, но есть точки роста.";
  }, [data?.severity_score]);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-[#A39588]">Загружаем статус…</p>
      </main>
    );
  }

  if (data.status === "pending" || data.status === "processing") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#F5EFE6] sm:text-3xl">Анализируем твой профиль</h1>
          <p className="mt-2 text-sm text-[#A39588]">Обычно 30–50 секунд. Страница обновится сама.</p>
        </div>
        <ProgressStages active />
        {slow ? (
          <p className="max-w-md text-center text-sm text-[#A39588]">
            Анализ занимает дольше обычного — не закрывай вкладку. Если совсем затянулось, результат всё равно придёт
            на email.
          </p>
        ) : null}
      </main>
    );
  }

  if (data.status === "failed") {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#F5EFE6]">Упс, не вышло</h1>
        <p className="text-sm text-[#A39588]">{data.error ?? "Попробуй ещё раз чуть позже."}</p>
        <Button type="button" onClick={() => router.push("/")}>
          Попробовать снова
        </Button>
      </main>
    );
  }

  const insights = data.top_3_insights ?? [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8B14B]">Готово</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F5EFE6] sm:text-4xl">
          Твой Severity Score:{" "}
          <span className={scoreColor}>
            {data.severity_score ?? 0}
            /100
          </span>
        </h1>
        <p className="text-base text-[#A39588]">{subtitle}</p>
      </div>

      <div className="mt-10">
        <TeaserResult insights={insights} />
      </div>

      <div className="mt-10 rounded-[12px] border border-[#2a241c] bg-[#1A1612] p-5 text-sm leading-relaxed text-[#A39588]">
        <p>
          Полный отчёт с 12+ инсайтами и конкретными переписками отправлен на{" "}
          <strong className="text-[#F5EFE6]">{data.email_masked ?? "***"}</strong>.
        </p>
        <p className="mt-2">Проверь почту через минуту. Не пришло? Загляни в спам.</p>
      </div>

      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={async () => {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
              posthog.capture("share_clicked", { audit_id: auditId });
            }
          }}
        >
          Поделиться этой страницей
        </Button>
      </div>
    </main>
  );
}
