import { z } from "zod";

const linkedInProfileUrl = z
  .string()
  .trim()
  .min(1, "Вставь ссылку на профиль")
  .refine(
    (u) => {
      try {
        const url = u.startsWith("http") ? new URL(u) : new URL(`https://${u}`);
        const host = url.hostname.replace(/^www\./, "");
        if (host !== "linkedin.com" && host !== "www.linkedin.com") return false;
        const parts = url.pathname.split("/").filter(Boolean);
        return parts[0] === "in" && parts.length >= 2 && parts[1].length > 0;
      } catch {
        return false;
      }
    },
    { message: "Нужна ссылка вида linkedin.com/in/username" },
  );

export const startAuditSchema = z.object({
  linkedin_url: linkedInProfileUrl,
  email: z.string().trim().email({ message: "Некорректный email" }),
  target_role: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z
      .enum([
        "SWE",
        "Engineering Manager",
        "Product Manager",
        "Data",
        "Design",
        "Marketing",
        "Sales",
        "Other",
      ])
      .optional(),
  ),
  consent: z.boolean().refine((v) => v === true, {
    message: "Нужно согласие на обработку данных",
  }),
});

export type StartAuditInput = z.infer<typeof startAuditSchema>;

export const auditIdSchema = z.string().uuid("Некорректный идентификатор аудита");
