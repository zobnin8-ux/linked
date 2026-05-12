import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";
import type { ReactElement } from "react";
import type { FullReport, Insight } from "@/types/audit";

function severityRu(s: Insight["severity"]): string {
  switch (s) {
    case "critical":
      return "Критично";
    case "high":
      return "Высокий";
    case "medium":
      return "Средний";
    case "low":
      return "Низкий";
    default:
      return s;
  }
}

export function FullReportEmail({
  auditId,
  report,
}: {
  auditId: string;
  report: FullReport;
}): ReactElement {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/audit/${auditId}`;

  return (
    <Html lang="ru">
      <Head />
      <Preview>Твой Severity Score: {report.severity_score}/100</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Аудит готов</Heading>
          <Text style={text}>
            Severity Score: <strong>{report.severity_score}/100</strong>
          </Text>
          <Text style={text}>{report.estimated_impact}</Text>
          <Hr style={hr} />
          <Heading as="h2" style={h2}>
            Топ-3 проблемы
          </Heading>
          {report.top_3_insights.map((i, idx) => (
            <Section key={idx} style={card}>
              <Text style={badge}>
                {severityRu(i.severity)} · {i.category}
              </Text>
              <Text style={mono}>{i.what_recruiter_sees}</Text>
              <Text style={text}>{i.why_it_hurts}</Text>
              <Text style={fix}>Как лучше: {i.fix_example}</Text>
            </Section>
          ))}
          <Hr style={hr} />
          <Heading as="h2" style={h2}>
            Все замечания ({report.all_issues.length})
          </Heading>
          {report.all_issues.slice(0, 12).map((i, idx) => (
            <Text key={idx} style={listItem}>
              <strong>[{i.category}]</strong> {i.why_it_hurts}
            </Text>
          ))}
          {report.all_issues.length > 12 ? (
            <Text style={muted}>…и ещё {report.all_issues.length - 12} в веб-версии.</Text>
          ) : null}
          <Hr style={hr} />
          <Text style={text}>Приоритеты:</Text>
          {report.recommendations_priority.map((r, idx) => (
            <Text key={idx} style={listItem}>
              • {r}
            </Text>
          ))}
          <Text style={muted}>
            Открыть страницу аудита: <Link href={link}>{link}</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#0E0B08", color: "#F5EFE6", padding: "24px" };
const container = { maxWidth: "560px", margin: "0 auto" };
const h1 = { fontSize: "24px", letterSpacing: "-0.02em", margin: "0 0 12px" };
const h2 = { fontSize: "18px", margin: "20px 0 8px" };
const text = { fontSize: "15px", lineHeight: "1.5", margin: "8px 0" };
const muted = { ...text, color: "#A39588", fontSize: "13px" };
const mono = {
  ...text,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  backgroundColor: "#1A1612",
  padding: "10px",
  borderRadius: "8px",
};
const fix = { ...text, color: "#7DB35B" };
const badge = { ...text, color: "#E8B14B", fontWeight: 600, marginBottom: "4px" };
const card = {
  border: "1px solid #2a241c",
  borderRadius: "12px",
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#14110e",
};
const listItem = { fontSize: "14px", lineHeight: "1.45", margin: "6px 0" };
const hr = { borderColor: "#2a241c", margin: "20px 0" };
