import type { StartAuditInput } from "@/lib/validators";
import { jsonOnlySystem } from "./shared";

export { jsonOnlySystem as detectSignalsSystem };

export function detectSignalsUser(
  profileJson: string,
  targetRole: StartAuditInput["target_role"],
): string {
  const role = targetRole ? `Целевая роль кандидата: ${targetRole}.` : "";
  return `${role}
Ниже JSON профиля LinkedIn. Найди «иммигрантские» сигналы для рекрутера US/EU: кальки, вежливая скромность вместо impact, несоответствие заголовка рынку, странные формулировки, визуальные/активность маркеры если видно из данных.
${profileJson}`;
}
