import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { TIER1_LOCATIONS, COUNTIES } from "@/data/locations";

export const metadata: Metadata = {
  title: "DMV Title Guy | Title Insurance & Closing Services — DC, Maryland & Virginia",
  description:
    "Pruitt Title LLC — professional title insurance and closing services across Washington DC, Maryland, and Virginia. Top 5% title executive.",
  alternates: { canonical: "/" },
};

const BLOG_POSTS = [
  { title: "Using Zillow Traffic Data to Close More Deals", date: "Nov 14, 2025", slug: "using-zillow-traffic-data-to-close-more-deals" },
  { title: "How to Choose the Right Title Company in the DMV", date: "Nov 12, 2025", slug: "how-to-choose-right-title-company-dmv" },
  { title: "Closing Costs in the DMV: What Buyers and Sellers Need to Know", date: "Oct 28, 2025", slug: "closing-costs-dmv-buyers-sellers" },
  { title: "Title Insurance Requirements in DC, MD, and VA: A Comparison", date: "Oct 15, 2025", slug: "title-insurance-requirements-dc-md-va" },
  { title: "The Role of Title Companies in New Construction Transactions", date: "Sep 10, 2025", slug: "title-companies-new-construction" },
  { title: "Why Title Insurance Matters for Real Estate Lenders in the DMV", date: "Aug 14, 2025", slug: "title-insurance-real-estate-lenders-dmv" },
];

const SERVICES = [
  { title: "Title Search & Examination", desc: "Thorough examination of public records to verify clear title and identify any liens or encumbrances before closing." },
  { title: "Title Insurance", desc: "Owner's and lender's title insurance policies for residential, commercial, and investor transactions across the DMV." },
  { title: "Settlement & Escrow", desc: "Professional coordination of all parties, funds, and documents from contract to keys. Residential, commercial, and new construction." },
  { title: "All Transaction Types", desc: "First-time buyers, investors, refinances, new construction, commercial — we handle every type of closing with the same professional care." },
];

const WHY_CHOOSE = [
  { num: "01", title: "Top 5% Title Executive Nationwide", body: "Will Rapuano is recognized among the top 5% of title professionals in the country, with deep expertise in the DMV's unique market dynamics." },
  { num: "02", title: "Comprehensive Title Insurance Coverage", body: "Ironclad protection on every transaction — owner's and lender's policies for all deal types across DC, Maryland, and Virginia." },
  { num: "03", title: "Dedicated to Real Estate Professionals", body: "From CE classes to panel events, we invest in the DMV agent and lender community year-round. We're a partner, not just a vendor." },
];

export default function HomePage() {
  const vaLocations = TIER1_LOCATIONS.filter((l) => l.state === "VA");
  const mdDcLocations = TIER1_LOCATIONS.filter((l) => l.state === "MD" || l.state === "DC");

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative bg-brand-navy text-white py-20 md:py-32"
        style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}
      >
        <div className="container-xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-3">
              Pruitt Title LLC
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Are You a Real Estate Agent or Mortgage Lender?
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              DMV Title Guy is one of the DMV&apos;s leading title insurance professionals, serving Washington DC, Maryland, and Virginia. As a licensed producer at Pruitt Title LLC, Will is backed by First American Title Insurance Company — Fortune 500 — and delivers top-tier professional expertise for residential, commercial, luxury, and new construction transactions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contact" className="btn-primary text-base px-7 py-3">
                Get a Free Quote →
              </Link>
              <Link href="/title-insurance" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy text-base px-7 py-3">
                Our Services
              </Link>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact title="Start Your Order" location="homepage-hero" />
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ───────────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl text-center">
          <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Who We Work With</p>
          <h2 className="prose-title mb-4">Are You a Real Estate Agent or Mortgage Lender?</h2>
          <p className="prose-subtitle max-w-2xl mx-auto mb-12">
            DMV Title Guy is one of the DMV's leading title insurance professionals, serving Washington DC, Maryland, and Virginia. As a licensed producer at Pruitt Title LLC, Will delivers top-tier professional expertise for residential, commercial, luxury, and new construction transactions.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { role: "Real Estate Agents", desc: "We understand your workflow and make every closing smooth, on-time, and stress-free." },
              { role: "Mortgage Lenders", desc: "We understand your workflow and make every closing smooth, on-time, and stress-free." },
              { role: "Banks & Credit Unions", desc: "Institutional-grade title services with the reliability and compliance your organization demands." },
              { role: "Home Builders", desc: "From lot closings to final sales, we handle every phase of your new construction pipeline." },
              { role: "Real Estate Investors", desc: "We understand your workflow and make every closing smooth, on-time, and stress-free." },
            ].map((item) => (
              <div key={item.role} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-blue text-xl">✓</span>
                </div>
                <h3 className="font-bold text-brand-navy text-lg mb-2">{item.role}</h3>
                <p className="text-brand-muted text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────── */}
      <section className="section-navy">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Get Access to Real Estate Title Tools, Classes, and Marketing Ideas</h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Comprehensive title services for every transaction type across the DMV.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ─────────────────────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Why DMV Title Guy</p>
            <h2 className="prose-title">Why Choose DMV Title Guy?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {WHY_CHOOSE.map((w) => (
              <div key={w.num} className="relative">
                <div className="text-5xl font-bold text-brand-blue/20 mb-3">{w.num}</div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{w.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATORS CTA ────────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Free Tools</p>
            <h2 className="prose-title">Closing Cost Calculators</h2>
            <p className="prose-subtitle max-w-xl mx-auto">
              Interactive calculators for buyers, sellers, and investors across DC, Maryland, and Virginia.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { state: "Virginia", href: "/virginia-closing-cost-calculator", desc: "Transfer taxes, recordation fees, agent commissions, and more." },
              { state: "Maryland", href: "/maryland-closing-cost-calculator", desc: "State and county transfer taxes, title insurance estimates, and lender fees." },
              { state: "Washington DC", href: "/dc-closing-cost-calculator", desc: "DC recordation tax, transfer tax, and closing cost breakdown." },
            ].map((c) => (
              <div key={c.state} className="card p-6 text-center">
                <h3 className="text-lg font-bold text-brand-navy mb-2">{c.state} Closing Costs</h3>
                <p className="text-brand-muted text-sm mb-4">{c.desc}</p>
                <Link href={c.href} className="btn-primary text-sm py-2 px-5">
                  Use Calculator →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE MAP ───────────────────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Service Area</p>
            <h2 className="prose-title">Serving the Entire DMV Region</h2>
            <p className="prose-subtitle max-w-xl mx-auto">
              From Northern Virginia's tech corridor to suburban Maryland and the District — we close deals everywhere.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-brand-navy mb-4 text-lg">Virginia</h3>
              <div className="grid grid-cols-2 gap-2">
                {vaLocations.map((l) => (
                  <Link key={l.slug} href={`/${l.slug}`} className="text-sm text-brand-blue hover:underline">
                    → {l.city}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {COUNTIES.filter((c) => c.state === "VA").map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} className="text-xs bg-brand-gray-bg border border-gray-200 rounded-full px-3 py-1 text-brand-muted hover:border-brand-blue hover:text-brand-blue transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-brand-navy mb-4 text-lg">Maryland &amp; DC</h3>
              <div className="grid grid-cols-2 gap-2">
                {mdDcLocations.map((l) => (
                  <Link key={l.slug} href={`/${l.slug}`} className="text-sm text-brand-blue hover:underline">
                    → {l.city}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {COUNTIES.filter((c) => c.state === "MD").map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} className="text-xs bg-brand-gray-bg border border-gray-200 rounded-full px-3 py-1 text-brand-muted hover:border-brand-blue hover:text-brand-blue transition-colors">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ───────────────────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Latest Insights</p>
            <h2 className="prose-title">Latest Blog Posts</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card hover:shadow-lg transition-shadow">
                <div className="bg-brand-navy h-40 flex items-end p-4">
                  <span className="text-xs text-brand-blue font-medium">{post.date}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-brand-navy text-sm leading-snug">{post.title}</h3>
                  <span className="text-brand-blue text-xs mt-2 block">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog" className="btn-outline">View All Posts</Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────── */}
      <section id="contact" className="section-navy">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-brand-blue font-semibold mb-2">Let&apos;s Chat</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Any Help?<br />Feel Free to Get in Touch</h2>
              <p className="text-gray-300 mb-6">
                Whether you&apos;re an agent looking for a reliable title partner, a lender needing fast turnarounds, or an investor who needs someone who understands your deals — we&apos;re here.
              </p>
              <div className="space-y-3 text-sm text-gray-300">
                <p>📍 1900 Gallows Rd Suite 230, Vienna, VA 22182</p>
                <p>📞 <a href="tel:+17038591467" className="text-brand-blue hover:underline">(703) 859-1467</a></p>
                <p>✉️ <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue hover:underline">wrapuano@pruitt-title.com</a></p>
              </div>
            </div>
            <LeadCaptureForm location="homepage-contact" />
          </div>
        </div>
      </section>
    </>
  );
}
