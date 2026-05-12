import "server-only";
import { createServiceSupabase } from "./supabase";
import { fetchLinkedInProfile } from "./proxycurl";
import {
  aggregateFullReport,
  analyzeWithClaude,
  mergeInsights,
  type BranchAnalysis,
} from "./claude";
import { detectSignalsSystem, detectSignalsUser } from "./prompts/detect-signals";
import { analyzeHeadlineSystem, analyzeHeadlineUser } from "./prompts/analyze-headline";
import { analyzeAboutSystem, analyzeAboutUser } from "./prompts/analyze-about";
import { analyzeExperienceSystem, analyzeExperienceUser } from "./prompts/analyze-experience";
import { sendFullReportEmail } from "./resend";
import { captureServerEvent } from "./posthog";
import type { FullReport } from "@/types/audit";

function compactProfileJson(profile: unknown): string {
  const s = JSON.stringify(profile);
  const max = 52000;
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n/* truncated */";
}

function friendlyErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/404/.test(msg) && /Proxycurl|nubela|linkedin/i.test(msg)) {
    return "Не удалось получить данные профиля. Проверь, что профиль публичный и ссылка верная.";
  }
  if (/Proxycurl|PROXYCURL|nubela/i.test(msg)) {
    return "Не удалось получить данные профиля. Проверь, что профиль публичный.";
  }
  return "Что-то пошло не так при анализе. Попробуй ещё раз позже.";
}

async function runClaude(auditId: string, prompt: string, system: string, user: string): Promise<BranchAnalysis> {
  try {
    return await analyzeWithClaude({
      auditId,
      promptName: prompt,
      system,
      user,
    });
  } catch (e) {
    await captureServerEvent({
      distinctId: auditId,
      event: "claude_failed",
      properties: {
        audit_id: auditId,
        prompt,
        error: e instanceof Error ? e.message : String(e),
      },
    });
    throw e;
  }
}

export async function runAuditPipeline(auditId: string): Promise<void> {
  const startedAt = Date.now();
  const supabase = createServiceSupabase();

  await captureServerEvent({
    distinctId: auditId,
    event: "audit_pipeline_started",
    properties: { audit_id: auditId },
  });

  try {
    await supabase.from("audits").update({ status: "processing" }).eq("id", auditId);

    const { data: audit, error: auditErr } = await supabase
      .from("audits")
      .select("id, linkedin_url, email, target_role")
      .eq("id", auditId)
      .single();

    if (auditErr || !audit) throw auditErr ?? new Error("Аудит не найден");

    let profile: unknown;
    try {
      profile = await fetchLinkedInProfile(audit.linkedin_url);
    } catch (e) {
      await captureServerEvent({
        distinctId: auditId,
        event: "proxycurl_failed",
        properties: {
          audit_id: auditId,
          error: e instanceof Error ? e.message : String(e),
        },
      });
      throw e;
    }

    await supabase.from("audits").update({ raw_profile: profile as object }).eq("id", auditId);

    const profileJson = compactProfileJson(profile);

    const [signals, headline, about, experience] = await Promise.all([
      runClaude(auditId, "detect_signals", detectSignalsSystem, detectSignalsUser(profileJson, audit.target_role ?? undefined)),
      runClaude(auditId, "analyze_headline", analyzeHeadlineSystem, analyzeHeadlineUser(profileJson)),
      runClaude(auditId, "analyze_about", analyzeAboutSystem, analyzeAboutUser(profileJson)),
      runClaude(auditId, "analyze_experience", analyzeExperienceSystem, analyzeExperienceUser(profileJson)),
    ]);

    const merged = mergeInsights([signals, headline, about, experience]);
    const fullReport: FullReport = aggregateFullReport(merged);

    await supabase
      .from("audits")
      .update({
        status: "ready",
        severity_score: fullReport.severity_score,
        top_3_insights: fullReport.top_3_insights,
        full_report: fullReport,
        completed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", auditId);

    await sendFullReportEmail({
      to: audit.email,
      auditId: audit.id,
      report: fullReport,
    });

    await captureServerEvent({
      distinctId: audit.email,
      event: "audit_pipeline_completed",
      properties: {
        audit_id: auditId,
        duration_ms: Date.now() - startedAt,
        severity_score: fullReport.severity_score,
      },
    });
  } catch (error) {
    const message = friendlyErrorMessage(error);
    await supabase
      .from("audits")
      .update({
        status: "failed",
        error_message: message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", auditId);

    await captureServerEvent({
      distinctId: auditId,
      event: "audit_failed",
      properties: {
        audit_id: auditId,
        stage: "pipeline",
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}
