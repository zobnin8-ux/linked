import { jsonOnlySystem } from "./shared";

export { jsonOnlySystem as analyzeHeadlineSystem };

export function analyzeHeadlineUser(profileJson: string): string {
  return `Сфокусируйся на headline и public_identifier. JSON профиля:
${profileJson}`;
}
