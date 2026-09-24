import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Buyer Closing Costs in Maryland: A Complete Guide for 2026 | DMV Title Guy",
  description: "Complete guide to buyer closing costs in Maryland. Learn about loan origination fees, title insurance, appraisal fees, and what to expect at settlement.",
  alternates: { canonical: "/closing-costs/buyer-maryland" },
};

const faqs = [
  {
    question: "Are closing costs negotiable in Maryland?",
    answer: "Some costs, like lender fees, may be negotiable. Shop around for the best rates.",
  },
  {
    question: "Can I roll closing costs into my mortgage?",
    answer: "Some loans allow this, but it will increase your loan amount and monthly payments.",
  },
  {
    question: "How much is title insurance in Maryland?",
    answer: "Title insurance typically costs 0.5%-1% of the home's purchase price.",
  },
  {
    question: "When do I pay closing costs?",
    answer: "All closing costs are paid at the settlement table when the purchase is finalized.",
  },
];

export default function BuyerMarylandClosingCostsPage() {
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
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/maryland" className="hover:text-white">Maryland Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Buyer Costs</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Buyer Closing Costs in Maryland: A Complete Guide for 2026
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Buying a home in Maryland comes with various closing costs that buyers need to prepare for. These expenses can add up, so it's essential to understand what you'll owe at closing.
          </p>
        </div>
      </section>

      {/* LOCAL INSIGHT */}
      <section className="bg-brand-navy py-10 text-white">
        <div className="container-xl max-w-3xl">
          {/* The label previously used an undefined brand colour utility, so it
              inherited the band's white and carried no emphasis at all. Now an
              eyebrow with a real icon, matching the homepage pattern. */}
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-100">
            <Lightbulb size={14} strokeWidth={2} aria-hidden="true" />
            Local insight
          </p>
          <p className="mt-3 max-w-[68ch] text-lg leading-relaxed">
            Maryland's recordation tax is set by each county and charged on the purchase price, and the state transfer tax is 0.5% of the sales price. Maryland law presumes the buyer and seller split these taxes equally unless the contract says otherwise, and first-time Maryland homebuyers pay no state transfer tax.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Common Buyer Closing Costs in Maryland</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <ul className="list-disc list-inside space-y-3">
              <li><strong>Loan Origination Fees:</strong> Charged by the lender for processing your mortgage, typically 0.5%-1% of the loan amount.</li>
              <li><strong>Title Insurance:</strong> Protects you and the lender from title disputes. Buyers usually pay for the lender's title insurance policy.</li>
              <li><strong>Appraisal Fees:</strong> Required by lenders to assess the home's value, usually $300-$500.</li>
              <li><strong>Home Inspection Fees:</strong> Optional but recommended, costing $300-$500.</li>
              <li><strong>Prepaid Expenses:</strong> Includes property taxes, homeowners insurance, and prepaid interest.</li>
              <li><strong>Recording Fees:</strong> Paid to the county to record the deed and mortgage.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MARYLAND TAXES */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Maryland Recordation & Transfer Taxes</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Maryland charges recordation tax and transfer tax, both based on the purchase price:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Recordation Tax:</strong> Set by each county—Montgomery County is $4.45 per $500 on the first $500,000, with the first $100,000 exempt for a principal residence</li>
              <li><strong>State Transfer Tax:</strong> 0.5% of the sales price (0.25%, paid entirely by the seller, for qualifying first-time Maryland homebuyers)</li>
              <li><strong>County Transfer Tax:</strong> Set by each county—Montgomery County is 1% of the price</li>
            </ul>
            <p>
              <strong>Example:</strong> For a $500,000 principal residence in Montgomery County, with taxes split equally:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Recordation Tax (buyer&apos;s half of $3,560): $1,780</li>
              <li>State Transfer Tax (buyer&apos;s half of $2,500): $1,250</li>
              <li>County Transfer Tax (buyer&apos;s half of $5,000): $2,500</li>
              <li>Total Buyer Taxes: $5,530</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ESTIMATING COSTS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">How to Estimate Your Closing Costs</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Use our{" "}
              <Link href="/maryland-closing-cost-calculator" className="font-semibold text-brand-blue-deep hover:underline">
                Maryland Closing Cost Calculator
              </Link>{" "}
              to calculate buyer closing costs in Maryland based on your loan amount, location, title insurance needs, and settlement cost inputs.
            </p>
            <div className="bg-brand-navy text-white p-6 rounded-lg">
              <h3 className="t-h6 mb-2">Estimated Buyer Costs Example</h3>
              <p className="text-gray-300 max-w-[68ch] leading-relaxed">For a $500,000 Montgomery County principal residence with 20% down ($400,000 loan), taxes split equally:</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Loan Origination (1%): $4,000</li>
                <li>• Title Insurance (Owner's + Lender's): $2,000-3,000</li>
                <li>• Appraisal: $400-500</li>
                <li>• Inspection: $400-500</li>
                <li>• Recordation Tax: $1,780</li>
                <li>• State + County Transfer Tax: $3,750</li>
                <li>• Prepaid Taxes/Insurance: $3,000-5,000</li>
                <li className="border-t border-gray-600 pt-2 font-semibold">• Estimated Total: $15,300 - $18,500</li>
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
            <Link href="/closing-costs/maryland" className="text-brand-blue-deep hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/title-company-bethesda-md" className="text-brand-blue-deep hover:underline">
              Bethesda Title Services →
            </Link>
            <Link href="/title-company-silver-spring-md" className="text-brand-blue-deep hover:underline">
              Silver Spring Title Services →
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
          <h2 className="t-h3 text-white mb-4">Get Your Maryland Buyer Closing Cost Estimate</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact Pruitt Title LLC for an accurate closing cost estimate for your Maryland home purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/maryland-closing-cost-calculator" className="btn-primary px-8">
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
