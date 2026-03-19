export type Severity = "critical" | "warning" | "info";

export type RuleFinding = {
  section: string;
  severity: Severity;
  title: string;
  description: string;
  pageRef?: string;
  lineRef?: string;
};

export type SectionStatus = {
  section: string;
  passed: boolean;
  issueCount: number;
};

export type AnalysisPayload = {
  summary: string;
  findings: RuleFinding[];
  sections: SectionStatus[];
  metadata: Record<string, unknown>;
  aiSource: "claude" | "fallback";
};
