import { Phone, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Investor Title & Closing Guide | DMV Title Guy",
  description:
    "Investor-focused title and closing education for DC, Maryland, and Virginia, with eligible transaction requests reviewed before provider referral.",
  alternates: { canonical: "/investor-friendly-title-company" },
};

const TRANSACTION_TYPES = [
  {
    title: "Residential Purchases",
    desc: "Common title, funding, survey, and settlement questions for residential purchases.",
  },
  {
    title: "Refinances",
    desc: "How prior policies, payoff information, lender requirements, and title updates affect a refinance.",
  },
  {
    title: "New Construction",
    desc: "Questions to raise about lien waivers, surveys, construction draws, and builder documents.",
  },
  {
    title: "Investment Properties",
    desc: "Due-diligence considerations for cash purchases, rental acquisitions, and portfolio transactions.",
  },
  {
    title: "Commercial Transactions",
    desc: "A starting point for title, entity, survey, escrow, and lender questions in commercial matters.",
  },
  {
    title: "Cash & Time-Sensitive Transactions",
    desc: "Factors that determine whether a requested timeline is realistic before a provider accepts the matter.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do you work with real estate investors?",
    a: "DMV Title Guy provides investor-focused title and closing education. Eligible service requests can be referred to Pruitt Title LLC for review and transaction-specific acceptance.",
  },
  {
    q: "How fast can you close a cash deal?",
    a: "Timing depends on title findings, funding, document readiness, jurisdiction, and the provider that accepts the transaction. Submit the details for a transaction-specific timeline rather than relying on a generic rush-closing promise.",
  },
  {
    q: "What areas do you serve?",
    a: "DMV Title Guy publishes transaction guidance for Washington, DC, Maryland, and Virginia. Eligible title and settlement requests can be referred to Pruitt Title LLC for review.",
  },
  {
    q: "Who provides your title insurance?",
    a: "DMV Title Guy is Will Rapuano's personal education and business-development site, separate from Pruitt Title LLC's corporate website. When a request is eligible and accepted, the title and settlement provider is identified before services begin.",
  },
];

export default function AllTransactionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      {/* HERO */}
      <section
        className="page-hero"
      >
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Investor Closing Guide</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">
              Investor and transaction education
            </p>
            <h1 className="t-h1 text-white mb-4">
              Title and Closing Guidance for Complex DMV Transactions
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Use these resources to understand common title and settlement questions. Will can review an initial request and refer an eligible matter to Pruitt Title LLC for transaction-specific acceptance.
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
                <Phone size={15} strokeWidth={2.25} className="mr-2 inline-block align-[-2px]" aria-hidden="true" />(703) 859-1467
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
              <h2 className="prose-title mb-4">Transaction Scenarios Covered</h2>
              <p className="text-brand-muted text-sm mb-6 max-w-[68ch] mx-auto leading-relaxed">
                These topics explain common issues. They do not promise that a particular provider will accept every transaction or timeline.
              </p>
              <ul className="space-y-4">
                {TRANSACTION_TYPES.map((s) => (
                  <li key={s.title} className="flex gap-3">
                    <Check size={16} strokeWidth={2.5} className="mt-1 flex-shrink-0 text-brand-blue-deep" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-brand-navy text-sm">
                        {s.title}
                      </h3>
                      <p className="text-brand-muted text-sm leading-relaxed max-w-[68ch]">
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
              "Submit non-sensitive deal details through DMV Title Guy or call (703) 859-1467.",
              "Will reviews the initial request and can refer an eligible matter to Pruitt Title LLC.",
              "The provider confirms acceptance, scope, required documents, pricing, and a transaction-specific timeline.",
              "After acceptance, the provider coordinates the applicable title, settlement, recording, and post-closing steps.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-brand-action text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-brand-dark-text text-sm leading-relaxed pt-1 max-w-[68ch]">
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
                <p className="text-brand-muted text-sm leading-relaxed max-w-[68ch]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED SERVICES — Investor */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Related Services</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/investor-title-services" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Title Services</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Title searches, auction support & wholesale closings.</p>
            </Link>
            <Link href="/auction-property-title-search" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Pre-auction title search & risk assessment.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Surviving liens & chain-of-title review.</p>
            </Link>
            <Link href="/blog/firpta-explained-dmv" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">FIRPTA Withholding Guide</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Federal withholding basics for transactions involving a foreign seller.</p>
            </Link>
            <Link href="/investor-due-diligence" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Submit property info & start your title search.</p>
            </Link>
            <Link href="/upload-contract" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Start Contract Intake</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Begin intake and receive secure transfer instructions.</p>
            </Link>
            <Link href="/request-title-review" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Request Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Get clarity on a property's title status.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-4">
            Helpful Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/virginia-closing-cost-calculator"
              className="text-sm border border-brand-blue-deep text-brand-blue-deep rounded-full px-4 py-1.5 hover:bg-brand-action hover:text-white transition-colors"
            >
              VA Closing Cost Calculator
            </Link>
            <Link
              href="/maryland-closing-cost-calculator"
              className="text-sm border border-brand-blue-deep text-brand-blue-deep rounded-full px-4 py-1.5 hover:bg-brand-action hover:text-white transition-colors"
            >
              MD Closing Cost Calculator
            </Link>
            <Link
              href="/dc-closing-cost-calculator"
              className="text-sm border border-brand-blue-deep text-brand-blue-deep rounded-full px-4 py-1.5 hover:bg-brand-action hover:text-white transition-colors"
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
