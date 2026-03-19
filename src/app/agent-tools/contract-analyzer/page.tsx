import { getCurrentUser, requireApprovedUser } from "@/lib/contract-analyzer/auth";
import { redirect } from "next/navigation";
import UploadForm from "@/components/contract-analyzer/UploadForm";
import Link from "next/link";
import { History, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract Analyzer | DMV Title Guy",
  description:
    "AI-powered real estate contract compliance checker for NVAR, GCAAR, and MAR contracts.",
};

export default async function ContractAnalyzerPage() {
  const user = await requireApprovedUser();

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container-xl max-w-3xl">
        <Link
          href="/agent-tools"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Agent Tools
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">
              Contract Analyzer
            </h1>
            <p className="text-sm text-gray-500">
              Upload a contract PDF to check for compliance issues
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/agent-tools/contract-analyzer/history"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-brand-blue/30"
            >
              <History className="h-4 w-4" />
              History
            </Link>
            <span className="text-sm text-gray-400">{user.email}</span>
          </div>
        </div>

        <UploadForm />
      </div>
    </section>
  );
}
