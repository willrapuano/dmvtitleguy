import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Why Choose DMV Title Guy | Pruitt Title LLC",
  description:
    "Learn why DMV Title Guy — Pruitt Title LLC is the trusted title partner for real estate agents, lenders, and investors across DC, Maryland & Virginia.",
  alternates: { canonical: "/why-choose-us" },
};

const DIFFERENTIATORS = [
  {
    num: "01",
    title: "Top 5% Title Executive Nationwide",
    desc: "Will Rapuano is recognized among the top 5% of title professionals in the country. That means faster problem resolution, deeper market knowledge, and smoother closings for every transaction.",
  },
  {
    num: "02",
    title: "Ironclad Title Insurance Coverage",
    desc: "Every policy provides comprehensive protection for your clients. Ironclad coverage on every deal, period.",
  },
  {
    num: "03",
    title: "Woman-Owned, Community-Driven",
    desc: "Pruitt Title LLC was founded in 2007 as a woman-owned business. We're embedded in the DMV real estate community — sponsoring events, teaching CE classes, and partnering with agents year-round.",
  },
  {
    num: "04",
    title: "All Transaction Types Welcome",
    desc: "Residential, commercial, new construction, refinances, investor deals — we handle every type of closing with the same speed and professionalism. No deal is too simple or too complex.",
  },
  {
    num: "05",
    title: "Fast Turnarounds, Clear Communication",
    desc: "We know time kills deals. Title searches within 24–48 hours, proactive status updates, and a team that picks up the phone when you call.",
  },
  {
    num: "06",
    title: "Tri-State Coverage",
    desc: "One title company for the entire DMV region. Washington DC, Maryland, and Virginia — no matter where your deal is, we've got it covered from our Vienna, VA headquarters.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Will is the most responsive title professional I've worked with in 15 years. My clients always have a smooth closing.",
    author: "— NoVA Real Estate Agent",
  },
  {
    quote: "Fast title searches, clear communication, and zero surprises at the closing table. That's what we need as lenders.",
    author: "— Mortgage Lender, Northern Virginia",
  },
  {
    quote: "Whether it's a first-time buyer or a 10-property investor, Pruitt Title handles every deal professionally.",
    author: "— DMV Real Estate Investor",
  },
];

export default function WhyChooseUsPage() {
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
              <span className="text-gray-200">Why Choose Us</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
              Why Pruitt Title
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Why Choose DMV Title Guy?
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              When your clients&apos; largest financial transaction is on the line, you need a title partner who delivers — every single time. Here&apos;s why agents, lenders, and investors across the DMV trust Will Rapuano and Pruitt Title LLC.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/why-choose-us#quote" className="btn-primary">
                Partner With Us →
              </Link>
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy">
                📞 (703) 859-1467
              </a>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact location="why-choose-us-hero" />
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="prose-title">What Sets Us Apart</h2>
            <p className="prose-subtitle max-w-2xl mx-auto">
              Pruitt Title LLC has been closing deals across the DMV since 2007. Here&apos;s what makes us different.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.num}>
                <div className="text-5xl font-bold text-brand-blue/20 mb-3">{d.num}</div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{d.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-10">What Our Partners Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-brand-dark-text text-sm leading-relaxed italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-brand-muted text-xs font-medium">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="quote" className="section-navy">
        <div className="container-xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Work Together?</h2>
            <p className="text-gray-300 mb-4">
              Whether you&apos;re an agent looking for a reliable title partner, a lender needing fast turnarounds, or an investor who needs someone who understands your deals — we&apos;re here.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 1900 Gallows Rd Suite 230, Vienna, VA 22182</p>
              <p>📞 <a href="tel:+17038591467" className="text-brand-blue">(703) 859-1467</a></p>
              <p>✉️ <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">wrapuano@pruitt-title.com</a></p>
            </div>
          </div>
          <LeadCaptureForm location="why-choose-us-form" />
        </div>
      </section>
    </>
  );
}
