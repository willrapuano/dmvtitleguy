"use client";

import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      // TODO: wire to GHL webhook
      const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, source: `dmvtitleguy-${location}` }),
        });
      }
      // Simulate success for now
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 text-center ${compact ? "p-6" : ""}`}>
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-brand-navy mb-2">Got it — we&apos;ll be in touch!</h3>
        <p className="text-brand-muted text-sm">
          Will typically responds within one business day. You can also call directly at{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${compact ? "p-6" : "p-8"}`}>
      {!compact && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-brand-navy">{title}</h3>
          <p className="text-brand-muted text-sm mt-1">{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-dark-text mb-1">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder="Jane Smith"
          />
        </div>

        <div className={compact ? "" : "grid grid-cols-2 gap-4"}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-dark-text mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brand-dark-text mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="(703) 555-0100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-brand-dark-text mb-1">
            Transaction Type
          </label>
          <select
            id="type"
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
            <label htmlFor="message" className="block text-sm font-medium text-brand-dark-text mb-1">
              Message (optional)
            </label>
            <textarea
              id="message"
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
          <p className="text-red-600 text-sm text-center">Something went wrong. Please call us at (703) 859-1467.</p>
        )}
      </form>
    </div>
  );
}
