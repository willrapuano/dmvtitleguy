import { getCurrentUser } from "@/lib/contract-analyzer/auth";
import { redirect } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pending Approval | Contract Analyzer | DMV Title Guy",
};

export default async function PendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/agent-tools/contract-analyzer/login");
  if (user.approved) redirect("/agent-tools/contract-analyzer");

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container-xl max-w-md">
        <Link
          href="/agent-tools"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Agent Tools
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>

          <h1 className="text-xl font-bold text-brand-navy mb-2">
            Pending Approval
          </h1>

          <p className="text-gray-600 mb-4">
            Your account <strong>{user.email}</strong> has been registered.
            Access to the Contract Analyzer requires approval.
          </p>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">What happens next?</p>
            <p>
              We&apos;ll review your request and grant access shortly. You&apos;ll be
              able to use the tool as soon as your account is approved.
            </p>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Questions? Email{" "}
            <a
              href="mailto:will@pruitt-title.com"
              className="text-brand-blue hover:underline"
            >
              will@pruitt-title.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
