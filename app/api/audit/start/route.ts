import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { runAuditPipeline } from "@/lib/audit-pipeline";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServiceSupabase } from "@/lib/supabase";
import { startAuditSchema } from "@/lib/validators";

export const maxDuration = 300;

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = startAuditSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const field = Object.keys(first)[0];
    const msg = field ? (first as Record<string, string[]>)[field]?.[0] : parsed.error.message;
    return NextResponse.json({ error: msg ?? "Ошибка валидации", field }, { status: 400 });
  }

  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") ?? "";

  try {
    await checkRateLimit(ip, "audit_start");
  } catch (e) {
    const status = (e as Error & { status?: number }).status;
    if (status === 429) {
      return NextResponse.json({ error: (e as Error).message }, { status: 429 });
    }
    return NextResponse.json({ error: "Rate limit недоступен" }, { status: 500 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("audits")
    .insert({
      linkedin_url: parsed.data.linkedin_url,
      email: parsed.data.email,
      target_role: parsed.data.target_role ?? null,
      status: "pending",
      ip_address: ip,
      user_agent: ua,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Не удалось создать аудит" }, { status: 500 });
  }

  waitUntil(
    (async () => {
      await runAuditPipeline(data.id);
    })(),
  );

  return NextResponse.json({ audit_id: data.id });
}
