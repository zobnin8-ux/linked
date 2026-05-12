import "server-only";
import { createServiceSupabase } from "./supabase";

export async function getCompletedAuditsCount(): Promise<number> {
  try {
    const supabase = createServiceSupabase();
    const { count, error } = await supabase
      .from("audits")
      .select("*", { count: "exact", head: true })
      .eq("status", "ready");
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
