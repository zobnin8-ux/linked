import "server-only";
import { jsonrepair } from "jsonrepair";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { Insight, Severity } from "@/types/audit";

const insightSchema = z.object({
  category: z.enum(["headline", "about", "experience", "skills", "activity", "visual"]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  what_recruiter_sees: z.string(),
  why_it_hurts: z.string(),
  fix_example: z.string(),
});

const branchSchema = z.object({
  insights: z.array(insightSchema),
});

export type BranchAnalysis = z.infer<typeof branchSchema>;

function extractJsonObject(text: string): string {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("В ответе нет JSON-объекта");
  return trimmed.slice(start, end + 1);
}

async function parseBranchJson(raw: string): Promise<BranchAnalysis> {
  const tryParse = (s: string) => {
    const sliced = extractJsonObject(s);
    return branchSchema.parse(JSON.parse(sliced));
  };

  try {
    return tryParse(raw);
  } catch {
    try {
      const repaired = jsonrepair(extractJsonObject(raw));
      return branchSchema.parse(JSON.parse(repaired));
    } catch (e) {
      throw e;
    }
  }
}

const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

export async function analyzeWithClaude(options: {
  auditId: string;
  promptName: string;
  system: string;
  user: string;
}): Promise<BranchAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY не задан");

  const client = new Anthropic({ apiKey });
  const runOnce = async () => {
    const msg = await client.messages.create({
      model,
      max_tokens: 4096,
      temperature: 0.2,
      system: options.system,
      messages: [{ role: "user", content: options.user }],
    });
    const block = msg.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") throw new Error("Пустой ответ Claude");
    return block.text;
  };

  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt === 1) await new Promise((r) => setTimeout(r, 2000));
      const text = await runOnce();
      return await parseBranchJson(text);
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export function mergeInsights(parts: BranchAnalysis[]): Insight[] {
  const merged: Insight[] = [];
  for (const p of parts) merged.push(...p.insights);
  return merged;
}

export function severityRank(s: Severity): number {
  switch (s) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

export function pickTopInsights(insights: Insight[], n: number): Insight[] {
  return [...insights].sort((a, b) => severityRank(b.severity) - severityRank(a.severity)).slice(0, n);
}

export function scoreFromInsights(insights: Insight[]): number {
  const weights: Record<Severity, number> = {
    critical: 26,
    high: 16,
    medium: 9,
    low: 4,
  };
  let sum = 0;
  for (const i of insights) sum += weights[i.severity] ?? 0;
  return Math.min(100, sum);
}

export function aggregateFullReport(insights: Insight[]): import("@/types/audit").FullReport {
  const deduped = dedupeInsights(insights);
  const score = scoreFromInsights(deduped);
  const top3 = pickTopInsights(deduped, 3);
  return {
    severity_score: score,
    top_3_insights: top3,
    all_issues: deduped,
    estimated_impact:
      score >= 70
        ? "Высокий риск отсечения на первом экране."
        : score >= 40
          ? "Средний риск: часть рекрутеров отвалится до опыта."
          : "Низкий риск, но шероховатости всё равно стоят денег в переговорах.",
    recommendations_priority: [
      "Перепиши headline под результат, а не должность.",
      "В опыте — глаголы силы + метрики, без «participated».",
      "About: первые 2 строки = оффер ценности, не биография.",
    ],
  };
}

function dedupeInsights(insights: Insight[]): Insight[] {
  const seen = new Set<string>();
  const out: Insight[] = [];
  for (const i of insights) {
    const key = `${i.category}:${i.what_recruiter_sees.slice(0, 120)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(i);
  }
  return out;
}
