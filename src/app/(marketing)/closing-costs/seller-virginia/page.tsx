import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Seller Closing Costs in Virginia: What to Expect in 2026 | DMV Title Guy",
  description: "Complete guide to seller closing costs in Virginia. Learn about real estate commissions, transfer taxes, title insurance, and what to expect at settlement.",
  alternates: { canonical: "/closing-costs/seller-virginia" },
};

const faqs = [
  {
    question: "Can I negotiate closing costs as a seller?",
    answer: "Some costs, like real estate agent commissions, may be negotiable. Discuss options with your agent.",
  },
  {
    question: "Are there any seller concessions in Virginia?",
    answer: "Yes, sellers can agree to pay for certain buyer costs, such as inspection fees or repairs.",
  },
  {
    question: "How much is the Virginia transfer tax?",
    answer: "The state transfer tax is $1 per $1,000 of the sale price. Localities may add additional fees.",
  },
  {
    question: "When do I pay closing costs?",
    answer: "All closing costs are paid at the settlement table when the sale is finalized.",
  },
];

export default function SellerVirginiaClosingCostsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/virginia-closing-cost-calculator" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Seller Costs</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Seller Closing Costs in Virginia: What to Expect in 2026
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Selling a home in Virginia involves several closing costs that sellers should be aware of. Understanding these expenses can help you budget effectively and avoid surprises at closing.
          </p>
        </div>
      </section>

      {/* LOCAL INSIGHT */}
      <section className="bg-brand-action py-10 text-white">
        <div className="container-xl max-w-3xl">
          {/* The label previously used an undefined brand colour utility, so it
              inherited the band's white and carried no emphasis at all. Now an
              eyebrow with a real icon, matching the homepage pattern. */}
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-100">
            <Lightbulb size={14} strokeWidth={2} aria-hidden="true" />
            Local insight
          </p>
          <p className="mt-3 max-w-[68ch] text-lg leading-relaxed">
            Virginia's transfer tax is $1 per $1,000 of sale price—one of the lowest in the DMV region. However, real estate commissions typically run 5-6% of the sale price, making this your largest closing cost.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Common Seller Closing Costs in Virginia</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <ul className="list-disc list-inside space-y-3">
              <li><strong>Real Estate Agent Commission:</strong> Typically 5-6% of the sale price, split between the buyer's and seller's agents.</li>
              <li><strong>Title Insurance:</strong> Protects the buyer and lender from title disputes. Sellers often pay for the owner's title insurance policy.</li>
              <li><strong>Transfer Taxes:</strong> Virginia charges a state transfer tax, and some localities may add additional fees.</li>
              <li><strong>Attorney Fees:</strong> If you hire an attorney to handle the closing, expect to pay $500-$1,500.</li>
              <li><strong>Recording Fees:</strong> Paid to the county to record the deed transfer.</li>
              <li><strong>Outstanding Mortgage Balance:</strong> Any remaining mortgage balance will be paid off at closing.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TRANSFER TAX INFO */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Virginia Transfer Tax</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Virginia's state transfer tax is <strong>$1 per $1,000</strong> of the sale price (0.1%). Some localities may add additional transfer taxes or fees on top of the state rate.
            </p>
            <p className="max-w-[68ch]">
              <strong>Example:</strong> On a $500,000 home, the Virginia state transfer tax would be $500. Localities like Fairfax County may add additional fees.
            </p>
            <p className="max-w-[68ch]">
              Unlike Maryland and DC, Virginia does not have a recordation tax based on loan amount—this makes Virginia one of the more affordable jurisdictions for closing costs in the DMV region.
            </p>
          </div>
        </div>
      </section>

      {/* ESTIMATING COSTS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">How to Estimate Your Closing Costs</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Use our Virginia Closing Cost Calculator to get a personalized estimate based on your home's sale price and location.
            </p>
            <div className="bg-brand-navy text-white p-6 rounded-lg">
              <h3 className="t-h6 mb-2">Estimated Seller Costs Example</h3>
              <p className="text-gray-300 max-w-[68ch] leading-relaxed">For a $500,000 home in Virginia:</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Real Estate Commission (6%): $30,000</li>
                <li>• Transfer Tax (0.1%): $500</li>
                <li>• Owner's Title Insurance: $1,500-2,500</li>
                <li>• Attorney Fees: $500-1,500</li>
                <li>• Recording Fees: $50-150</li>
                <li className="border-t border-gray-600 pt-2 font-semibold">• Estimated Total: $32,550 - $34,650</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-4">Explore More Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue-deep hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue-deep hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/calculators/seller-net-sheet" className="text-brand-blue-deep hover:underline">
              Estimate Seller Proceeds →
            </Link>
            <Link href="/blog/firpta-explained-dmv" className="text-brand-blue-deep hover:underline">
              FIRPTA Withholding Guide →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue-deep hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/title-company-arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-search-fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} includeSchema={false} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Virginia Seller Closing Cost Estimate</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Submit your property details through DMV Title Guy for an itemized planning estimate and to request a current quote from the provider handling the transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virginia-closing-cost-calculator" className="btn-primary px-8">
              Calculate Your Costs →
            </Link>
            <Link href="/contact" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Get a Quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
