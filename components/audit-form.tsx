"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StartAuditInput } from "@/lib/validators";

const roles: NonNullable<StartAuditInput["target_role"]>[] = [
  "SWE",
  "Engineering Manager",
  "Product Manager",
  "Data",
  "Design",
  "Marketing",
  "Sales",
  "Other",
];

export function AuditForm() {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [email, setEmail] = useState("");
  const [targetRole, setTargetRole] = useState<string | undefined>(undefined);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/audit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedin_url: linkedinUrl,
          email,
          target_role: targetRole,
          consent,
        }),
      });
      const data = (await res.json()) as { audit_id?: string; error?: string; field?: string };
      if (!res.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.error ?? "Ошибка" });
        } else {
          setErrors({ form: data.error ?? "Ошибка отправки" });
        }
        return;
      }
      if (data.audit_id) {
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          posthog.capture("audit_form_submitted", {
            target_role: targetRole ?? null,
            has_email: Boolean(email),
          });
        }
        router.push(`/audit/${data.audit_id}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-[#2a241c] bg-[#1A1612] shadow-xl shadow-black/30">
      <CardContent className="p-5 sm:p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="linkedin">Ссылка на LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin_url"
              autoComplete="url"
              placeholder="https://www.linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            {errors.linkedin_url ? <p className="text-xs text-[#E85A4B]">{errors.linkedin_url}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email для отчёта</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email ? <p className="text-xs text-[#E85A4B]">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label>Целевая роль (опционально)</Label>
            <Select
              value={targetRole ?? "__none__"}
              onValueChange={(v) => setTargetRole(v === "__none__" ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выбери роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Не указывать</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.target_role ? <p className="text-xs text-[#E85A4B]">{errors.target_role}</p> : null}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm font-normal leading-snug text-[#A39588]">
              Согласен на обработку данных для аудита и отправки отчёта на email. Политика — на странице{" "}
              <a className="text-[#E8B14B] underline underline-offset-2" href="/privacy">
                Privacy
              </a>
              .
            </Label>
          </div>
          {errors.consent ? <p className="text-xs text-[#E85A4B]">{errors.consent}</p> : null}
          {errors.form ? <p className="text-xs text-[#E85A4B]">{errors.form}</p> : null}

          <Button type="submit" size="full" disabled={submitting}>
            {submitting ? "Отправляем…" : "Получить аудит бесплатно"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
