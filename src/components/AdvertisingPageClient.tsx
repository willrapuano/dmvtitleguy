"use client";

import { Rocket, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackLeadConversion } from "@/lib/client-analytics";

const FEATURE_CARDS = [
  { title: "Traffic-Generating Ads", desc: "Strategic Facebook and Instagram ad campaigns that drive real buyer traffic to your listings.", icon: "Target" },
  { title: "Sphere-Based Advertising", desc: "Custom audience targeting to reach your sphere of influence with compelling listing promotions.", icon: "Repeat" },
  { title: "Data-Driven Results", desc: "Detailed performance reports and analytics so you can prove ROI to your sellers.", icon: "BarChart3" },
];

const STEPS = [
  { num: "1", title: "Submit Your Listing", desc: "Fill out the form with your listing details and MLS number. We'll take it from there." },
  { num: "2", title: "We Launch Your Campaign", desc: "Our team creates and launches targeted ad campaigns across Facebook and Instagram within 48 hours." },
  { num: "3", title: "Track & Leverage Results", desc: "Receive weekly performance reports with data you can share with your sellers to demonstrate value." },
];

const LISTING_BOOST_FEATURES = [
  "Targeted Facebook & Instagram ads",
  "2,000-5,000+ listing views",
  "Weekly performance reports",
  "30-day campaign duration",
  "Seller-ready data reports",
];

const SPHERE_FEATURES = [
  "Custom audience targeting",
  "Facebook & Instagram campaigns",
  "Multiple listing promotion",
  "Monthly engagement reports",
  "Ongoing campaign optimization",
];

const WHY_ADVERTISE = [
  { title: "Impress Sellers With Data", desc: "Show sellers exactly how many people are viewing their listing with detailed traffic reports and analytics." },
  { title: "Support Pricing Conversations", desc: "Use real traffic data to have informed pricing discussions with sellers based on actual buyer interest." },
  { title: "Generate Real Buyer Interest", desc: "Drive genuine buyer traffic to your listings, increasing showing requests and offers." },
  { title: "Win More Listings", desc: "Differentiate yourself from other agents by offering complimentary advertising as part of your listing presentation." },
];

export function AdvertisingPageClient() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", listing: "", email: "", phone: "" });
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
        body: JSON.stringify({ ...form, formType: "advertising", submissionId: submissionIdRef.current, website }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Listing submission failed");
      trackLeadConversion("advertising");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Hero + Form + Feature Cards */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h1 className="t-h1 text-brand-navy mb-4">
              Amplify Your Listings With Strategic Ad Campaigns
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto">
              Generate measurable traffic, impress your sellers with data-driven results, and win more listings with complimentary advertising services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Listing Submission Form */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="t-h5 text-brand-navy mb-4">Get Started</h2>
              {status === "success" ? (
                <div ref={successRef} role="status" aria-live="polite" tabIndex={-1} className="text-center py-8 focus:outline-none">
                  <div className="mb-3"><Rocket size={30} strokeWidth={1.5} className="text-brand-blue-deep" aria-hidden="true" /></div>
                  <h3 className="t-h6 text-brand-navy mb-2">We&apos;re on it!</h3>
                  <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">Your listing has been submitted. We&apos;ll launch your campaign within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="ad-website">Website</label>
                    <input id="ad-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div>
                    <label htmlFor="ad-name" className="block text-sm font-medium text-brand-dark-text mb-1">Your Name *</label>
                    <input id="ad-name" name="name" type="text" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-control" placeholder="Your full name" />
                  </div>
                  <div>
                    <label htmlFor="ad-listing" className="block text-sm font-medium text-brand-dark-text mb-1">Listing Address or MLS # *</label>
                    <input id="ad-listing" name="listing" type="text" required value={form.listing} onChange={(e) => setForm({ ...form, listing: e.target.value })} className="form-control" placeholder="123 Main St or MLS# 12345678" />
                  </div>
                  <div>
                    <label htmlFor="ad-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
                    <input id="ad-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-control" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="ad-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone</label>
                    <input id="ad-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="(703) 555-0100" />
                  </div>
                  <button type="submit" disabled={status === "submitting"} className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-60">
                    {status === "submitting" ? "Submitting…" : "Start Running Ads Today!"}
                  </button>
                  {status === "error" && <p role="alert" className="text-red-600 text-sm text-center max-w-[68ch] mx-auto leading-relaxed">We couldn&apos;t deliver your listing. Please try again or email wrapuano@pruitt-title.com.</p>}
                </form>
              )}
            </div>

            {/* Feature Cards */}
            <div className="space-y-5">
              {FEATURE_CARDS.map((card) => (
                <div key={card.title} className="surface-card p-6 flex gap-4">
                  <span className="text-3xl flex-shrink-0">{card.icon}</span>
                  <div>
                    <h3 className="font-bold text-brand-navy mb-1">{card.title}</h3>
                    <p className="text-brand-muted text-sm leading-relaxed max-w-[68ch]">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-2">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-brand-action rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">{step.num}</span>
                </div>
                <h3 className="font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed max-w-[68ch]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising Packages */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-2">Advertising Packages</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-10 max-w-4xl mx-auto">
            {/* Listing Traffic Boost */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-brand-blue overflow-hidden">
              <div className="bg-brand-action text-white p-5 text-center">
                <h3 className="t-h5">Listing Traffic Boost</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {LISTING_BOOST_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-brand-blue-deep" aria-hidden="true" />
                      <span className="text-brand-muted text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-brand-blue-deep font-semibold text-center italic max-w-[68ch]">
                  Complimentary service for our referral partners
                </p>
              </div>
            </div>

            {/* Sphere Marketing */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-brand-blue overflow-hidden">
              <div className="bg-brand-action text-white p-5 text-center">
                <h3 className="t-h5">Sphere Marketing</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {SPHERE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-brand-blue-deep" aria-hidden="true" />
                      <span className="text-brand-muted text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-brand-blue-deep font-semibold text-center italic max-w-[68ch]">
                  Complimentary service for our referral partners
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-2">Why Advertise Your Listings?</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-10 max-w-4xl mx-auto">
            {WHY_ADVERTISE.map((item) => (
              <div key={item.title} className="surface-card p-6">
                <h3 className="font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed max-w-[68ch]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-blue">
        <div className="container-xl text-center">
          <h2 className="t-h2 text-white mb-4">Ready to Amplify Your Listings?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Submit your listing above or contact us to get started. Complimentary for our referral partners.
          </p>
          <Link href="/advertising-services" className="btn-light px-8 py-3.5">
            Start Running Ads Today! →
          </Link>
        </div>
      </section>
    </>
  );
}
