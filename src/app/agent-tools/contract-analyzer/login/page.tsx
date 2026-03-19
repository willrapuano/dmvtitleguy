"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function requestCode() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/agent-tools/contract-analyzer/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("code");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/agent-tools/contract-analyzer/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/agent-tools/contract-analyzer");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container-xl max-w-md">
        <Link
          href="/agent-tools"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Agent Tools
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-brand-navy/5 p-2.5">
              <Shield className="h-6 w-6 text-brand-navy" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-brand-navy">Sign In</h1>
              <p className="text-sm text-gray-500">
                Access the Contract Analyzer
              </p>
            </div>
          </div>

          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestCode();
              }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-navy/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Get Login Code"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyCode();
              }}
            >
              <p className="mb-3 text-sm text-gray-600">
                Code sent to <strong>{email}</strong>
              </p>
              <input
                type="text"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-center font-mono text-lg tracking-widest focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                maxLength={6}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-navy/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="mt-2 w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Use a different email
              </button>
            </form>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
}
