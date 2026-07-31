"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackLeadConversion } from "@/lib/client-analytics";

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  location?: string; // for tracking which page the lead came from
  compact?: boolean;
}

export function LeadCaptureForm({
  title = "Get a Free Closing Cost Quote",
  subtitle = "Serving DC, Maryland & Virginia. Response within one business day.",
  location = "site",
  compact = false,
}: LeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionType: "purchase",
    message: "",
  });
  const submissionIdRef = useRef<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const idPrefix = `lead-${location.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}`;

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
        body: JSON.stringify({ ...formData, formType: "quote", submissionId: submissionIdRef.current, website }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Lead delivery failed");
      trackLeadConversion("quote");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className={`bg-white rounded-xl shadow-lg p-8 text-center focus:outline-none ${compact ? "p-6" : ""}`}
      >
        <div className="mb-3"><CheckCircle2 size={34} strokeWidth={1.5} className="text-emerald-600" aria-hidden="true" /></div>
        <h3 className="t-h5 text-brand-navy mb-2">Got it — we&apos;ll be in touch!</h3>
        <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
          Will typically responds within one business day. You can also call directly at{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${compact ? "p-6" : "p-8"}`}>
      <div className={compact ? "mb-5" : "mb-6"}>
        <h3 className={`${compact ? "text-lg font-bold" : "t-h5"} text-brand-navy`}>{title}</h3>
        <p className="text-brand-muted text-sm mt-1 max-w-[68ch] leading-relaxed">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${idPrefix}-website`}>Website</label>
          <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-name`} className="block text-sm font-medium text-brand-dark-text mb-1">
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder="Jane Smith"
          />
        </div>

        <div className={compact ? "" : "grid grid-cols-2 gap-4"}>
          <div>
            <label htmlFor={`${idPrefix}-email`} className="block text-sm font-medium text-brand-dark-text mb-1">
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="block text-sm font-medium text-brand-dark-text mb-1">
              Phone
            </label>
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="(703) 555-0100"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-type`} className="block text-sm font-medium text-brand-dark-text mb-1">
            Transaction Type
          </label>
          <select
            id={`${idPrefix}-type`}
            name="transactionType"
            value={formData.transactionType}
            onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
          >
            <option value="purchase">Purchase</option>
            <option value="refinance">Refinance</option>
            <option value="investor">Investor / Wholesale</option>
            <option value="commercial">Commercial</option>
            <option value="new-construction">New Construction</option>
            <option value="other">Other</option>
          </select>
        </div>

        {!compact && (
          <div>
            <label htmlFor={`${idPrefix}-message`} className="block text-sm font-medium text-brand-dark-text mb-1">
              Message (optional)
            </label>
            <textarea
              id={`${idPrefix}-message`}
              name="message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Tell us about your transaction..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Get Your Free Quote →"}
        </button>

        {status === "error" && (
          <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">We couldn&apos;t deliver your request. Please call (703) 859-1467 or email wrapuano@pruitt-title.com.</p>
        )}
      </form>
    </div>
  );
}
