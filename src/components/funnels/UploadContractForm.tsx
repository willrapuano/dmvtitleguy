"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { trackLeadConversion } from "@/lib/client-analytics";

interface UploadContractFormProps {
  location?: string;
}

export function UploadContractForm({ location = "upload-contract" }: UploadContractFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submissionIdRef = useRef<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionType: "Purchase",
    closingTimeline: "",
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
      const res = await fetch("/api/funnels/upload-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submissionId: submissionIdRef.current,
          website,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        trackLeadConversion("upload-contract", location);
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
        <h3 className="t-h5 text-brand-navy mb-2">Intake Request Received!</h3>
        <p className="text-brand-muted text-sm mb-4 max-w-[68ch] leading-relaxed">
          We&apos;ll contact you within one business hour with a secure way to send your contract.
        </p>
        <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
          Questions? Call{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="uc-website">Website</label>
        <input id="uc-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-brand-navy">
        <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-brand-blue-deep" aria-hidden="true" />
        <p className="leading-relaxed">
          For your privacy, contracts are not uploaded through this public form. Submit your contact details and we&apos;ll send secure transfer instructions.
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="uc-name" className="block text-sm font-medium text-brand-dark-text mb-1">Full Name *</label>
          <input id="uc-name" name="name" autoComplete="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Jane Smith" />
        </div>
        <div>
          <label htmlFor="uc-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
          <input id="uc-email" name="email" autoComplete="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="jane@example.com" />
        </div>
        <div>
          <label htmlFor="uc-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone *</label>
          <input id="uc-phone" name="phone" autoComplete="tel" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="(703) 555-0100" />
        </div>
      </div>

      {/* Transaction Type & Timeline */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="uc-type" className="block text-sm font-medium text-brand-dark-text mb-1">Transaction Type</label>
          <select id="uc-type" value={formData.transactionType} onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
            <option value="Purchase">Purchase</option>
            <option value="Refinance">Refinance</option>
            <option value="Investor">Investor</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="uc-timeline" className="block text-sm font-medium text-brand-dark-text mb-1">Closing Timeline</label>
          <input id="uc-timeline" type="text" value={formData.closingTimeline} onChange={(e) => setFormData({ ...formData, closingTimeline: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="e.g., March 15, 2026" />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="uc-notes" className="block text-sm font-medium text-brand-dark-text mb-1">Additional Notes (optional)</label>
        <textarea id="uc-notes" rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Anything we should know about this transaction..." />
      </div>

      {/* Submit */}
      <button type="submit" disabled={status === "submitting"} className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60">
        {status === "submitting" ? "Submitting…" : "Start Secure Intake →"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">Something went wrong. Please call us at (703) 859-1467.</p>
      )}
    </form>
  );
}
