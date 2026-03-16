import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Advertising & Marketing Services for Real Estate Agents | DMV Title Guy",
  description:
    "Marketing and advertising services for real estate agents and lenders in DC, Maryland & Virginia. SEO, social media, content creation, and lead generation by DMV Title Guy.",
  alternates: { canonical: "/advertising-services" },
};

const SERVICES = [
  {
    title: "Real Estate SEO",
    desc: "Get found by buyers and sellers searching for agents in your market. Local SEO, Google Business Profile optimization, and content strategy tailored to your farm area.",
  },
  {
    title: "Social Media Content",
    desc: "Professional content creation for Instagram, Facebook, and LinkedIn. Market updates, listing promotions, and brand-building posts that actually get engagement.",
  },
  {
    title: "Video Marketing",
    desc: "Property walkthroughs, market update videos, and personal brand content for YouTube and social platforms.",
  },
  {
    title: "Website & Landing Pages",
    desc: "High-converting websites and landing pages designed to capture leads and showcase your brand — built on modern, fast frameworks.",
  },
  {
    title: "Email Marketing & CRM",
    desc: "Automated drip campaigns, market updates, and lead nurture sequences that keep you top of mind with your database.",
  },
  {
    title: "AI-Powered Lead Generation",
    desc: "Leverage the latest AI tools for prospecting, content creation, and follow-up automation — we'll build the systems so you can focus on closing.",
  },
];

export default function AdvertisingServicesPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}
      >
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Advertising Services</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
              Velocity Builders LLC
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Marketing & Advertising for Real Estate Professionals
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Through Velocity Builders LLC, Will Rapuano helps agents and lenders across the DMV grow their business with modern marketing — SEO, social media, AI tools, and lead generation systems that actually work.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/advertising-services#contact" className="btn-primary">
                Let&apos;s Talk Marketing →
              </Link>
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy">
                📞 (703) 859-1467
              </a>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact title="Get a Marketing Consultation" location="advertising-hero" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="prose-title">What We Offer</h2>
            <p className="prose-subtitle max-w-2xl mx-auto">
              Full-service marketing for real estate professionals. Whether you need a complete brand overhaul or just help with one channel — we&apos;ve got you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="card p-6">
                <h3 className="font-bold text-brand-navy text-lg mb-2">{s.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl text-center">
          <h2 className="prose-title mb-6">Why Work With Us?</h2>
          <p className="text-brand-muted leading-relaxed mb-6">
            Most marketing agencies don&apos;t understand real estate. We do — because we live it every day. Will works directly with agents and lenders at the closing table, which means every marketing strategy is built on real-world insight, not theory.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {[
              { stat: "18+", label: "Years in DMV Real Estate" },
              { stat: "Top 5%", label: "Title Executive Nationwide" },
              { stat: "3 States", label: "DC, Maryland & Virginia" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-brand-blue">{s.stat}</p>
                <p className="text-sm text-brand-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="section-navy">
        <div className="container-xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
            <p className="text-gray-300 mb-4">
              Let&apos;s talk about what&apos;s working in your market and where you can improve. No pressure, no pitch — just a conversation about what&apos;s possible.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📞 <a href="tel:+17038591467" className="text-brand-blue">(703) 859-1467</a></p>
              <p>✉️ <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">wrapuano@pruitt-title.com</a></p>
            </div>
          </div>
          <LeadCaptureForm title="Schedule a Marketing Consultation" location="advertising-contact" />
        </div>
      </section>
    </>
  );
}
