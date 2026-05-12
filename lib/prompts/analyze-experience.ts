import { jsonOnlySystem } from "./shared";

export { jsonOnlySystem as analyzeExperienceSystem };

export function analyzeExperienceUser(profileJson: string): string {
  return `Сфокусируйся на experiences (описания позиций, буллеты). JSON профиля:
${profileJson}`;
}
