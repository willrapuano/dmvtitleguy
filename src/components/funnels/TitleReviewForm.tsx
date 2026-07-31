"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { trackLeadConversion } from "@/lib/client-analytics";

interface TitleReviewFormProps {
  location?: string;
}

export function TitleReviewForm({ location = "request-title-review" }: TitleReviewFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submissionIdRef = useRef<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    reviewType: "Full Title Search",
    urgency: "Standard",
    message: "",
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
      const res = await fetch("/api/funnels/request-title-review", {
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
        trackLeadConversion("request-title-review", location);
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
          Our title team will review your request and respond within one business day.
        </p>
        <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
          Need it faster? Call{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-lg sm:p-8">
      <h3 className="t-h5 text-brand-navy mb-2">Request a Title Review</h3>
      <p className="text-brand-muted text-sm mb-6 max-w-[68ch] mx-auto leading-relaxed">Tell us about the property and what you need. We&apos;ll take it from here.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="tr-website">Website</label>
          <input id="tr-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        {/* Full Name */}
        <div>
          <label htmlFor="tr-name" className="block text-sm font-medium text-brand-dark-text mb-1">Full Name *</label>
          <input id="tr-name" name="name" autoComplete="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" placeholder="Jane Smith" />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tr-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
            <input id="tr-email" name="email" autoComplete="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-control" placeholder="jane@example.com" />
          </div>
          <div>
            <label htmlFor="tr-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone *</label>
            <input id="tr-phone" name="phone" autoComplete="tel" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-control" placeholder="(703) 555-0100" />
          </div>
        </div>

        {/* Property Address */}
        <div>
          <label htmlFor="tr-address" className="block text-sm font-medium text-brand-dark-text mb-1">Property Address *</label>
          <input id="tr-address" name="propertyAddress" autoComplete="street-address" type="text" required value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} className="form-control" placeholder="123 Main St, Arlington, VA 22201" />
        </div>

        {/* Review Type & Urgency */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tr-type" className="block text-sm font-medium text-brand-dark-text mb-1">Review Type</label>
            <select id="tr-type" value={formData.reviewType} onChange={(e) => setFormData({ ...formData, reviewType: e.target.value })} className="form-control">
              <option value="Full Title Search">Full Title Search</option>
              <option value="Title Search Update">Title Search Update</option>
              <option value="Lien Search">Lien Search</option>
              <option value="Foreclosure Review">Foreclosure Review</option>
            </select>
          </div>
          <div>
            <label htmlFor="tr-urgency" className="block text-sm font-medium text-brand-dark-text mb-1">Urgency</label>
            <select id="tr-urgency" value={formData.urgency} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="form-control">
              <option value="Standard">Standard</option>
              <option value="Rush">Rush</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-brand-navy">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-brand-blue-deep" aria-hidden="true" />
          <p className="leading-relaxed">
            Have supporting documents? We&apos;ll provide secure transfer instructions after we receive your request.
          </p>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="tr-message" className="block text-sm font-medium text-brand-dark-text mb-1">Message (optional)</label>
          <textarea id="tr-message" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="form-control" placeholder="Tell us about the property or your concerns..." />
        </div>

        {/* Submit */}
        <button type="submit" disabled={status === "submitting"} className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60">
          {status === "submitting" ? "Submitting…" : "Request Title Review →"}
        </button>

        {status === "error" && (
          <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">Something went wrong. Please call us at (703) 859-1467.</p>
        )}
      </form>
    </div>
  );
}
