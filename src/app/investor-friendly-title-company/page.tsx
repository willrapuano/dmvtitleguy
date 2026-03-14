import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "All Transaction Types | Title & Closing Services | DMV Title Guy",
  description:
    "Pruitt Title LLC handles every type of real estate transaction — first-time buyers, seasoned investors, refinances, new construction, and everything in between. Professional title services in DC, Maryland & Virginia.",
  alternates: { canonical: "/investor-friendly-title-company" },
};

const TRANSACTION_TYPES = [
  {
    title: "Residential Purchases",
    desc: "First-time buyers, move-up buyers, downsizers — we guide every client through a smooth closing experience.",
  },
  {
    title: "Refinances",
    desc: "Rate-and-term or cash-out refinances with fast turnaround and clear communication with your lender.",
  },
  {
    title: "New Construction",
    desc: "Builder closings with proper lien waiver coordination, survey review, and phased disbursement handling.",
  },
  {
    title: "Investment Properties",
    desc: "Cash purchases, rental acquisitions, and portfolio transactions — handled with the same professionalism as any closing.",
  },
  {
    title: "Commercial Transactions",
    desc: "Multi-family, mixed-use, and commercial closings with experienced title examination and escrow management.",
  },
  {
    title: "Cash & Quick-Close Transactions",
    desc: "No lender delays — we can close in as few as 5–7 business days with clean title.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do you work with real estate investors?",
    a: "Absolutely. We work with all types of buyers and sellers — whether it's your first home or your fiftieth investment property. Every transaction gets the same level of professional attention.",
  },
  {
    q: "How fast can you close a cash deal?",
    a: "With clean title, we can typically close in 5–7 business days. Rush closings in 3 days are possible in certain situations — call us to discuss.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the entire DMV region — Washington DC, Maryland, and Virginia. Our office is in Vienna, VA, but we handle closings throughout the tri-state area.",
  },
  {
    q: "Who underwrites your title insurance?",
    a: "All policies are underwritten by First American Title Insurance Company — a Fortune 500 company providing industry-leading protection.",
  },
];

export default function AllTransactionsPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)",
        }}
      >
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">All Transaction Types</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
              Professional Title Services
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              We Handle Every Type of Real Estate Transaction
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Whether you&apos;re a first-time homebuyer, a seasoned investor, or
              anything in between — Pruitt Title LLC delivers the same fast,
              professional closing experience on every deal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/investor-friendly-title-company#quote"
                className="btn-primary"
              >
                Start Your Order →
              </Link>
              <a
                href="tel:+17038591467"
                className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy"
              >
                📞 (703) 859-1467
              </a>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact location="all-transactions-hero" />
          </div>
        </div>
      </section>

      {/* TRANSACTION TYPES */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="prose-title mb-4">What We Handle</h2>
              <p className="text-brand-muted text-sm mb-6">
                We don&apos;t specialize in one type of deal — we specialize in
                getting every deal closed professionally and on time.
              </p>
              <ul className="space-y-4">
                {TRANSACTION_TYPES.map((s) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="text-brand-blue flex-shrink-0 mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-brand-navy text-sm">
                        {s.title}
                      </h3>
                      <p className="text-brand-muted text-sm leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div id="quote">
              <LeadCaptureForm
                title="Start Your Order"
                location="all-transactions-form"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-8">How It Works</h2>
          <ol className="max-w-2xl mx-auto space-y-4">
            {[
              "Submit your deal details — purchase contract, loan documents, or transaction summary via our contact form or call (703) 859-1467.",
              "We run a full title search and confirm clear title, typically within 24–48 hours.",
              "We issue a title commitment and coordinate with all parties — buyer, seller, agents, and lender.",
              "You close on your timeline. We handle deed prep, recording, escrow, and fund disbursement.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-brand-dark-text text-sm leading-relaxed pt-1">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((faq) => (
              <div
                key={faq.q}
                className="border-b border-gray-100 pb-6"
              >
                <h3 className="font-bold text-brand-navy mb-2 text-base">
                  {faq.q}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-4">
            Helpful Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/virginia-closing-cost-calculator"
              className="text-sm border border-brand-blue text-brand-blue rounded-full px-4 py-1.5 hover:bg-brand-blue hover:text-white transition-colors"
            >
              VA Closing Cost Calculator
            </Link>
            <Link
              href="/maryland-closing-cost-calculator"
              className="text-sm border border-brand-blue text-brand-blue rounded-full px-4 py-1.5 hover:bg-brand-blue hover:text-white transition-colors"
            >
              MD Closing Cost Calculator
            </Link>
            <Link
              href="/dc-closing-cost-calculator"
              className="text-sm border border-brand-blue text-brand-blue rounded-full px-4 py-1.5 hover:bg-brand-blue hover:text-white transition-colors"
            >
              DC Closing Cost Calculator
            </Link>
            <Link
              href="/blog"
              className="text-sm border border-gray-200 text-brand-muted rounded-full px-4 py-1.5 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              Blog & Resources
            </Link>
            <Link
              href="/"
              className="text-sm border border-gray-200 text-brand-muted rounded-full px-4 py-1.5 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
