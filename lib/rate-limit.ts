import "server-only";
import { createServiceSupabase } from "./supabase";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

export async function checkRateLimit(ip: string, endpoint: string): Promise<void> {
  const supabase = createServiceSupabase();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error: countError } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .eq("endpoint", endpoint)
    .gte("window_start", since);

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_REQUESTS) {
    const err = new Error("Слишком много запросов. Попробуй через час.");
    (err as Error & { status: number }).status = 429;
    throw err;
  }

  const { error: insertError } = await supabase.from("rate_limits").insert({
    ip_address: ip,
    endpoint,
    count: 1,
    window_start: new Date().toISOString(),
  });

  if (insertError) throw insertError;
}
