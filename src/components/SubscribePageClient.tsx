"use client";

import { CheckCircle2, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackLeadConversion } from "@/lib/client-analytics";

const BENEFITS = [
  "Exclusive real estate marketing strategies and tips",
  "Early access to new classes and workshops",
  "Industry insights and market updates",
  "Free downloadable resources and tools",
  "Invitations to exclusive networking events",
];

export function SubscribePageClient() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const submissionIdRef = useRef<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      submissionIdRef.current ||= crypto.randomUUID();
      const website = String(new FormData(e.currentTarget as HTMLFormElement).get("website") || "");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "subscribe", submissionId: submissionIdRef.current, name, email, website }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Subscription failed");
      trackLeadConversion("subscribe");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="section-blue py-20 md:py-28">
        <div className="container-xl text-center">
          <h1 className="t-h1 text-white mb-4">
            Subscribe
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Get exclusive access to real estate tools, classes, marketing strategies, and industry insights delivered directly to your inbox.
          </p>
        </div>
      </section>

      {/* Join Our Community */}
      <section className="section-light">
        <div className="container-xl max-w-2xl">
          <h2 className="prose-title text-center mb-2">Join Our Community</h2>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-8">
            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check size={17} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-brand-blue-deep" aria-hidden="true" />
                  <span className="text-brand-dark-text">{b}</span>
                </li>
              ))}
            </ul>

            {/* Form */}
            {status === "success" ? (
              <div ref={successRef} role="status" aria-live="polite" tabIndex={-1} className="text-center py-8 focus:outline-none">
                <div className="mb-3"><CheckCircle2 size={34} strokeWidth={1.5} className="text-emerald-600" aria-hidden="true" /></div>
                <h3 className="t-h5 text-brand-navy mb-2">You&apos;re subscribed!</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
                  Welcome to the community. Watch your inbox for exclusive resources and updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="sub-website">Website</label>
                  <input id="sub-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="sub-name" className="block text-sm font-medium text-brand-dark-text mb-1">
                    Full Name
                  </label>
                  <input
                    id="sub-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="sub-email" className="block text-sm font-medium text-brand-dark-text mb-1">
                    Email Address
                  </label>
                  <input
                    id="sub-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-60"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe Now"}
                </button>
                {status === "error" && (
                  <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">We couldn&apos;t complete your subscription. Please try again or email wrapuano@pruitt-title.com.</p>
                )}
              </form>
            )}

            <p className="text-xs text-brand-muted text-center mt-4 max-w-[68ch] mx-auto">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
