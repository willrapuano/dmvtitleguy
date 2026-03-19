import { requireApprovedUser } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis History | Contract Analyzer | DMV Title Guy",
};

export default async function HistoryPage() {
  const user = await requireApprovedUser();

  const analyses = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { findings: true } } },
  });

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container-xl max-w-3xl">
        <Link
          href="/agent-tools/contract-analyzer"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Upload
        </Link>

        <h1 className="mb-6 text-2xl font-bold text-brand-navy">Analysis History</h1>

        {analyses.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white py-16">
            <FileText className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">No analyses yet</p>
            <Link
              href="/agent-tools/contract-analyzer"
              className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
            >
              Upload a Contract
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => (
              <Link
                key={a.id}
                href={`/agent-tools/contract-analyzer/analysis/${a.id}`}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-brand-blue/30"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    a.overallStatus === "PASS"
                      ? "bg-green-100"
                      : a.overallStatus === "FAIL"
                      ? "bg-red-100"
                      : "bg-amber-100"
                  }`}
                >
                  {a.overallStatus === "PASS" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : a.overallStatus === "FAIL" ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-navy">{a.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {a.formType} · {a._count.findings} finding
                    {a._count.findings !== 1 ? "s" : ""} ·{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    a.overallStatus === "PASS"
                      ? "bg-green-100 text-green-800"
                      : a.overallStatus === "FAIL"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {a.overallStatus}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
