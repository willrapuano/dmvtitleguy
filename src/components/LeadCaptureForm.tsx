"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent, trackLeadConversion } from "@/lib/client-analytics";
import { getLeadAttribution } from "@/lib/client-lead-attribution";

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  location?: string; // for tracking which page the lead came from
  compact?: boolean;
  context?: "firpta" | "survey";
}

export function LeadCaptureForm({
  title = "Get a Free Closing Cost Quote",
  subtitle = "Serving DC, Maryland & Virginia. Response within one business day.",
  location = "site",
  compact = false,
  context,
}: LeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionType: "purchase",
    role: "",
    jurisdiction: "",
    closingDate: "",
    message: "",
  });
  const submissionIdRef = useRef<string | null>(null);
  const formStartedRef = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const idPrefix = `lead-${location.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`;
  const Heading = compact ? "h2" : "h3";

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    trackAnalyticsEvent("lead_form_submit", { form_type: "quote", page_context: location });
    try {
      submissionIdRef.current ||= crypto.randomUUID();
      const website = String(new FormData(e.currentTarget as HTMLFormElement).get("website") || "");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...getLeadAttribution(), formType: "quote", submissionId: submissionIdRef.current, website }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Lead delivery failed");
      trackLeadConversion("quote", location);
      trackAnalyticsEvent("lead_form_submit_success", { form_type: "quote", page_context: location });
      setStatus("success");
    } catch {
      trackAnalyticsEvent("lead_form_submit_failure", { form_type: "quote", page_context: location });
      setStatus("error");
    }
  };

  const handleFormInteraction = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackAnalyticsEvent("lead_form_start", { form_type: "quote", page_context: location });
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className={`surface-card-elevated text-center focus:outline-none ${compact ? "p-6" : "p-5 sm:p-8"}`}
      >
        <div className="mb-3"><CheckCircle2 size={34} strokeWidth={1.5} className="text-emerald-600" aria-hidden="true" /></div>
        <Heading className="t-h5 text-brand-navy mb-2">Got it — we&apos;ll be in touch!</Heading>
        <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
          Will typically responds within one business day. You can also call directly at{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className={`surface-card-elevated ${compact ? "p-6" : "p-5 sm:p-8"}`}>
      <div className={compact ? "mb-5" : "mb-6"}>
        <Heading className={`${compact ? "text-lg font-bold" : "t-h5"} text-brand-navy`}>{title}</Heading>
        <p className="text-brand-muted text-sm mt-1 max-w-[68ch] leading-relaxed">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} onFocus={handleFormInteraction} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${idPrefix}-website`}>Website</label>
          <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-name`} className="form-label">
            Full Name *
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-control"
            placeholder="Jane Smith"
          />
        </div>

        {context && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${idPrefix}-role`} className="form-label">Your role</label>
              <select
                id={`${idPrefix}-role`}
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-control"
              >
                <option value="">Select one</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="agent">Real estate agent</option>
                <option value="lender">Lender</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${idPrefix}-jurisdiction`} className="form-label">Property jurisdiction</label>
              <select
                id={`${idPrefix}-jurisdiction`}
                name="jurisdiction"
                value={formData.jurisdiction}
                onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="form-control"
              >
                <option value="">Select one</option>
                <option value="dc">Washington DC</option>
                <option value="md">Maryland</option>
                <option value="va">Virginia</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-closing-date`} className="form-label">Expected closing date (optional)</label>
              <input
                id={`${idPrefix}-closing-date`}
                name="closingDate"
                type="date"
                value={formData.closingDate}
                onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                className="form-control"
              />
            </div>
          </div>
        )}

        <div className={compact ? "space-y-4" : "grid grid-cols-1 gap-4 sm:grid-cols-2"}>
          <div>
            <label htmlFor={`${idPrefix}-email`} className="form-label">
              Email *
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-control"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="form-label">
              Phone
            </label>
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-control"
              placeholder="(703) 555-0100"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-type`} className="form-label">
            Transaction Type
          </label>
          <select
            id={`${idPrefix}-type`}
            name="transactionType"
            value={formData.transactionType}
            onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
            className="form-control"
          >
            <option value="purchase">Purchase</option>
            <option value="refinance">Refinance</option>
            <option value="investor">Investor / Wholesale</option>
            <option value="commercial">Commercial</option>
            <option value="new-construction">New Construction</option>
            <option value="other">Other</option>
          </select>
        </div>

        {(!compact || context) && (
          <div>
            <label htmlFor={`${idPrefix}-message`} className="form-label">
              {context ? "Question or concern (optional)" : "Message (optional)"}
            </label>
            <textarea
              id={`${idPrefix}-message`}
              name="message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="form-control min-h-28 resize-y"
              placeholder={context === "firpta" ? "Describe the timing and the non-sensitive FIRPTA question..." : "Tell us about your transaction..."}
            />
          </div>
        )}

        {context === "firpta" && (
          <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            Do not submit an SSN, TIN, bank information, wire instructions, or tax documents here. Will can connect an
            accepted transaction with the appropriate secure intake process.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Get Your Free Quote →"}
        </button>

        <p className="text-center text-xs leading-relaxed text-slate-500">
          We use your information to respond to this request. Read our{" "}
          <Link href="/privacy-policy" className="font-medium text-brand-blue-deep underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>

        {status === "error" && (
          <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">We couldn&apos;t deliver your request. Please call (703) 859-1467 or email wrapuano@pruitt-title.com.</p>
        )}
      </form>
    </div>
  );
}
