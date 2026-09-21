"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { trackLeadConversion } from "@/lib/client-analytics";
import { getLeadAttribution } from "@/lib/client-lead-attribution";
import { LeadRoutingNotice } from "@/components/LeadRoutingNotice";

interface InvestorDueDiligenceFormProps {
  location?: string;
}

export function InvestorDueDiligenceForm({ location = "investor-due-diligence" }: InvestorDueDiligenceFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submissionIdRef = useRef<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    buyerType: "LLC",
    source: "MLS",
    timeframe: "Timing to be confirmed",
    notes: "",
  });

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      submissionIdRef.current ||= crypto.randomUUID();
      const website = String(new FormData(e.currentTarget as HTMLFormElement).get("website") || "");
      const res = await fetch("/api/funnels/investor-due-diligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...getLeadAttribution(),
          submissionId: submissionIdRef.current,
          website,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        trackLeadConversion("investor-due-diligence", location);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div ref={successRef} role="status" aria-live="polite" tabIndex={-1} className="bg-white rounded-xl shadow-lg p-8 text-center focus:outline-none">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="t-h5 text-brand-navy mb-2">Request Submitted!</h3>
        <p className="text-brand-muted text-sm mb-4 max-w-[68ch] leading-relaxed">
          Will will review the information and may follow up. Any provider independently confirms acceptance, scope, timing, pricing, and terms.
        </p>
        <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
          For immediate assistance, call{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-lg sm:p-8">
      <h3 className="t-h5 text-brand-navy mb-2">Start Your Due Diligence</h3>
      <p className="text-brand-muted text-sm mb-6 max-w-[68ch] mx-auto leading-relaxed">Share the property details with Will to request an educational review or a possible provider introduction.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="idd-website">Website</label>
          <input id="idd-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        {/* Full Name */}
        <div>
          <label htmlFor="idd-name" className="block text-sm font-medium text-brand-dark-text mb-1">Full Name *</label>
          <input id="idd-name" name="name" autoComplete="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" placeholder="Jane Smith" />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="idd-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
            <input id="idd-email" name="email" autoComplete="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-control" placeholder="jane@example.com" />
          </div>
          <div>
            <label htmlFor="idd-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone *</label>
            <input id="idd-phone" name="phone" autoComplete="tel" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-control" placeholder="(703) 555-0100" />
          </div>
        </div>

        {/* Property Address */}
        <div>
          <label htmlFor="idd-address" className="block text-sm font-medium text-brand-dark-text mb-1">Property Address *</label>
          <input id="idd-address" name="propertyAddress" autoComplete="street-address" type="text" required value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} className="form-control" placeholder="123 Main St, Arlington, VA 22201" />
        </div>

        {/* Buyer Type */}
        <div>
          <label className="block text-sm font-medium text-brand-dark-text mb-2">Buyer Type *</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["LLC", "Individual", "Trust", "Other"].map((type) => (
              <label key={type} className={`flex cursor-pointer items-center justify-center rounded border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-brand-blue focus-within:ring-offset-2 ${formData.buyerType === type ? "border-brand-blue bg-blue-50 text-brand-blue font-medium" : "border-gray-300 text-gray-600 hover:border-brand-blue"}`}>
                <input type="radio" name="buyerType" value={type} checked={formData.buyerType === type} onChange={(e) => setFormData({ ...formData, buyerType: e.target.value })} className="sr-only" />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Source & Timeframe */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="idd-source" className="block text-sm font-medium text-brand-dark-text mb-1">Source</label>
            <select id="idd-source" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="form-control">
              <option value="Auction">Auction</option>
              <option value="MLS">MLS</option>
              <option value="Off-market">Off-market</option>
              <option value="Wholesaler">Wholesaler</option>
            </select>
          </div>
          <div>
            <label htmlFor="idd-timeframe" className="block text-sm font-medium text-brand-dark-text mb-1">Timeframe</label>
            <select id="idd-timeframe" value={formData.timeframe} onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })} className="form-control">
              <option value="Timing to be confirmed">Timing to be confirmed</option>
              <option value="Time-sensitive request">Time-sensitive request</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-brand-navy">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-brand-blue-deep" aria-hidden="true" />
          <p className="leading-relaxed">
            Have contracts, deeds, or prior policies? We&apos;ll provide secure transfer instructions after we receive your request.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="idd-notes" className="block text-sm font-medium text-brand-dark-text mb-1">Notes / Comments (optional)</label>
          <textarea id="idd-notes" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="form-control" placeholder="Any additional details about the property or transaction..." />
        </div>

        {/* Submit */}
        <button type="submit" disabled={status === "submitting"} className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60">
          {status === "submitting" ? "Submitting…" : "Start Your Due Diligence →"}
        </button>
        <LeadRoutingNotice />

        {status === "error" && (
          <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">Something went wrong. Please call us at (703) 859-1467.</p>
        )}
      </form>
    </div>
  );
}
