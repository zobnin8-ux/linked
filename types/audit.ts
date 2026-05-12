export type AuditStatus = "pending" | "processing" | "ready" | "failed";

export type Severity = "critical" | "high" | "medium" | "low";

export type Category =
  | "headline"
  | "about"
  | "experience"
  | "skills"
  | "activity"
  | "visual";

export interface Insight {
  category: Category;
  severity: Severity;
  what_recruiter_sees: string;
  why_it_hurts: string;
  fix_example: string;
}

export interface FullReport {
  severity_score: number;
  top_3_insights: Insight[];
  all_issues: Insight[];
  estimated_impact: string;
  recommendations_priority: string[];
}

export interface Audit {
  id: string;
  linkedin_url: string;
  email: string;
  target_role?: string;
  status: AuditStatus;
  severity_score?: number;
  top_3_insights?: Insight[];
  full_report?: FullReport;
  created_at: string;
  completed_at?: string;
}
