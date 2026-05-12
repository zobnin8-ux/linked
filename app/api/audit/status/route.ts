import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase";
import { auditIdSchema } from "@/lib/validators";
import { maskEmail } from "@/lib/mask-email";
import type { AuditStatus, Insight } from "@/types/audit";

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  const parsed = auditIdSchema.safeParse(id ?? "");
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("audits")
    .select("status, severity_score, top_3_insights, email, error_message")
    .eq("id", parsed.data)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const payload: {
    status: AuditStatus;
    severity_score?: number;
    top_3_insights?: Insight[];
    email_masked?: string;
    error?: string;
  } = {
    status: data.status as AuditStatus,
    severity_score: data.severity_score ?? undefined,
    top_3_insights: (data.top_3_insights as Insight[] | null) ?? undefined,
    email_masked: maskEmail(data.email as string),
    error: data.error_message ?? undefined,
  };

  return NextResponse.json(payload);
}
