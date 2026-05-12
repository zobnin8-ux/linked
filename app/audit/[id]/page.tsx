import { AuditView } from "./audit-view";

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AuditView auditId={id} />;
}
