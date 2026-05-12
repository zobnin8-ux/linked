import { jsonOnlySystem } from "./shared";

export { jsonOnlySystem as analyzeAboutSystem };

export function analyzeAboutUser(profileJson: string): string {
  return `Сфокусируйся на поле summary (About). JSON профиля:
${profileJson}`;
}
