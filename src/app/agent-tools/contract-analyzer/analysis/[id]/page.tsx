import { requireApprovedUser } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { SectionStatus } from "@/lib/contract-analyzer/types";
import { CheckCircle, XCircle, AlertTriangle, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";

const severityConfig = {
  critical: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700" },
};

export default async function AnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireApprovedUser();

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: user.id },
    include: { findings: { orderBy: { severity: "asc" } } },
  });

  if (!analysis) notFound();

  const sections: SectionStatus[] = JSON.parse(analysis.sectionsJson);
  const metadata: Record<string, unknown> = JSON.parse(analysis.metadataJson);

  const criticalCount = analysis.findings.filter((f) => f.severity === "critical").length;
  const warningCount = analysis.findings.filter((f) => f.severity === "warning").length;
  const infoCount = analysis.findings.filter((f) => f.severity === "info").length;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container-xl max-w-4xl">
        <Link
          href="/agent-tools/contract-analyzer/history"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-brand-navy">{analysis.fileName}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {analysis.formType} · Analyzed{" "}
                {new Date(analysis.createdAt).toLocaleString()}
              </p>
            </div>
            <div
              className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                analysis.overallStatus === "PASS"
                  ? "bg-green-100 text-green-800"
                  : analysis.overallStatus === "FAIL"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {analysis.overallStatus}
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-700">{analysis.summary}</p>

          <div className="mt-4 flex gap-4 text-sm">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" /> {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-4 w-4" /> {warningCount} warnings
              </span>
            )}
            {infoCount > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <Info className="h-4 w-4" /> {infoCount} info
              </span>
            )}
            <span className="text-gray-400">
              Source: {analysis.aiSource === "claude" ? "Claude AI" : "Regex fallback"}
            </span>
          </div>

          {metadata && Object.keys(metadata).length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-xs sm:grid-cols-3">
              {Object.entries(metadata)
                .filter(([, v]) => v && typeof v === "string")
                .map(([k, v]) => (
                  <div key={k}>
                    <span className="font-medium text-gray-500">
                      {k.replace(/([A-Z])/g, " $1").trim()}:
                    </span>{" "}
                    <span className="text-gray-800">{v as string}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Section Overview */}
        <h2 className="mb-3 text-lg font-semibold text-brand-navy">Section Overview</h2>
        <div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <div
              key={s.section}
              className={`flex items-center gap-2 rounded-lg border p-3 ${
                s.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              {s.passed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="text-sm font-medium">{s.section}</p>
                <p className="text-xs text-gray-500">
                  {s.issueCount === 0
                    ? "No issues"
                    : `${s.issueCount} issue${s.issueCount > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Findings */}
        <h2 className="mb-3 text-lg font-semibold text-brand-navy">
          Findings ({analysis.findings.length})
        </h2>
        <div className="space-y-3">
          {analysis.findings.map((f) => {
            const cfg = severityConfig[f.severity as keyof typeof severityConfig] || severityConfig.info;
            const Icon = cfg.icon;
            return (
              <div
                key={f.id}
                className={`rounded-lg border p-4 ${cfg.bg}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{f.title}</h3>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${cfg.badge}`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{f.description}</p>
                    <div className="mt-2 flex gap-3 text-xs text-gray-500">
                      <span>Section: {f.section}</span>
                      {f.pageRef && <span>{f.pageRef}</span>}
                      {f.lineRef && <span>{f.lineRef}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
