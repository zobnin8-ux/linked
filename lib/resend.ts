import "server-only";
import { Resend } from "resend";
import { FullReportEmail } from "./email-templates/full-report";
import type { FullReport } from "@/types/audit";

export async function sendFullReportEmail(params: {
  to: string;
  auditId: string;
  report: FullReport;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY или RESEND_FROM_EMAIL не заданы");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Твой LinkedIn-аудит готов",
    react: FullReportEmail({ auditId: params.auditId, report: params.report }),
  });

  if (error) throw new Error(error.message);
}
