import type { Insight } from "@/types/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categoryLabel: Record<Insight["category"], string> = {
  headline: "Headline",
  about: "About",
  experience: "Experience",
  skills: "Skills",
  activity: "Activity",
  visual: "Visual",
};

function severityStyles(s: Insight["severity"]) {
  switch (s) {
    case "critical":
      return "bg-[#E85A4B]/15 text-[#E85A4B] border-[#E85A4B]/40";
    case "high":
      return "bg-[#E8B14B]/15 text-[#E8B14B] border-[#E8B14B]/40";
    case "medium":
      return "bg-[#A39588]/15 text-[#F5EFE6] border-[#A39588]/40";
    case "low":
      return "bg-[#7DB35B]/10 text-[#7DB35B] border-[#7DB35B]/35";
    default:
      return "bg-[#2a241c] text-[#F5EFE6]";
  }
}

function severityRu(s: Insight["severity"]) {
  switch (s) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return s;
  }
}

export function TeaserResult({ insights }: { insights: Insight[] }) {
  const sorted = [...insights].sort((a, b) => {
    const order = { critical: 4, high: 3, medium: 2, low: 1 };
    return (order[b.severity] ?? 0) - (order[a.severity] ?? 0);
  });

  return (
    <div className="space-y-4">
      {sorted.map((i, idx) => (
        <Card key={idx} className="border-[#2a241c] bg-[#14110e]">
          <CardHeader className="space-y-3 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-[6px] border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  severityStyles(i.severity),
                )}
              >
                {severityRu(i.severity)}
              </span>
              <span className="text-xs text-[#A39588]">{categoryLabel[i.category]}</span>
            </div>
            <CardTitle className="text-base text-[#F5EFE6]">Что видит рекрутер</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-[6px] bg-[#0E0B08] p-3 font-mono text-xs leading-relaxed text-[#F5EFE6]/90">
              {i.what_recruiter_sees}
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#A39588]">Почему это бьёт</p>
              <p className="mt-1 text-[#F5EFE6]/90">{i.why_it_hurts}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7DB35B]">Как должно быть</p>
              <p className="mt-1 font-mono text-xs text-[#7DB35B]">{i.fix_example}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
