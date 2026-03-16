"use client";

import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, source: "dmvtitleguy-subscribe" }),
        });
      }
      await new Promise((r) => setTimeout(r, 800));
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
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
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
          <div className="accent-divider" />

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mt-8">
            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="text-brand-blue font-bold text-lg mt-0.5">✓</span>
                  <span className="text-brand-dark-text">{b}</span>
                </li>
              ))}
            </ul>

            {/* Form */}
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">You&apos;re subscribed!</h3>
                <p className="text-brand-muted text-sm">
                  Welcome to the community. Watch your inbox for exclusive resources and updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sub-name" className="block text-sm font-medium text-brand-dark-text mb-1">
                    Full Name
                  </label>
                  <input
                    id="sub-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="sub-email" className="block text-sm font-medium text-brand-dark-text mb-1">
                    Email Address
                  </label>
                  <input
                    id="sub-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
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
                  <p className="text-red-600 text-sm text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            )}

            <p className="text-xs text-brand-muted text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
