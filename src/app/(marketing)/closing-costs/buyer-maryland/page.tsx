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
      <section className="bg-brand-navy text-white py-16 md:py-24">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/maryland" className="hover:text-brand-blue">Maryland Closing Costs</Link>
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
            Maryland's recordation tax is 0.5% of the loan amount, and the state transfer tax is 0.5% of the sales price—combined, buyers can expect to pay 1% of the purchase price in taxes at closing.
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
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Maryland Recordation & Transfer Taxes</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Maryland charges both recordation tax (based on loan amount) and transfer tax (based on sales price):
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Recordation Tax:</strong> 0.5% of the loan amount (for mortgages over $50,000)</li>
              <li><strong>Transfer Tax:</strong> 0.5% of the sales price (buyer pays, typically)</li>
              <li><strong>State Transfer Tax:</strong> Additional 0.5% of sales price (varies by county)</li>
            </ul>
            <p>
              <strong>Example:</strong> For a $500,000 home with a $400,000 mortgage:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Recordation Tax (0.5% of $400K): $2,000</li>
              <li>Transfer Tax (0.5% of $500K): $2,500</li>
              <li>Total State/County Taxes: $4,500</li>
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
              <p className="text-gray-300 max-w-[68ch] leading-relaxed">For a $500,000 home with 20% down ($400,000 loan):</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Loan Origination (1%): $4,000</li>
                <li>• Title Insurance (Owner's + Lender's): $2,000-3,000</li>
                <li>• Appraisal: $400-500</li>
                <li>• Inspection: $400-500</li>
                <li>• Recordation Tax: $2,000</li>
                <li>• Transfer Tax: $2,500</li>
                <li>• Prepaid Taxes/Insurance: $3,000-5,000</li>
                <li className="border-t border-gray-600 pt-2 font-semibold">• Estimated Total: $14,300 - $17,500</li>
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
            <Link href="/closing-costs/virginia" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/title-company-bethesda-md" className="text-brand-blue-deep hover:underline">
              Bethesda Title Services →
            </Link>
            <Link href="/title-company/silver-spring-md" className="text-brand-blue-deep hover:underline">
              Silver Spring Title Services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} includeSchema={false} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Maryland Buyer Closing Cost Estimate</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact Pruitt Title LLC for an accurate closing cost estimate for your Maryland home purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/maryland-closing-cost-calculator" className="inline-block bg-brand-action text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
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
