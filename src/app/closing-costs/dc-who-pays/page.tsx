import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Who Pays Closing Costs in DC? A 2026 Breakdown | DMV Title Guy",
  description: "Learn who pays what in DC real estate transactions. Complete breakdown of buyer vs. seller closing costs in Washington DC.",
  alternates: { canonical: "/closing-costs/dc-who-pays" },
};

const faqs = [
  {
    question: "Can closing costs be negotiated in DC?",
    answer: "Yes, buyers and sellers can negotiate who pays certain fees, such as transfer taxes or inspection costs.",
  },
  {
    question: "Are there any programs to help with closing costs in DC?",
    answer: "DC offers some assistance programs for first-time homebuyers, including grants for closing costs.",
  },
  {
    question: "How much is the DC transfer tax?",
    answer: "The transfer tax is 1.1% of the sale price, typically split between buyer and seller.",
  },
  {
    question: "When do I pay closing costs?",
    answer: "All closing costs are paid at the settlement table when the transaction is finalized.",
  },
];

export default function DCWhoPaysClosingCostsPage() {
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
            <Link href="/closing-costs/dc" className="hover:text-brand-blue">DC Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Who Pays What</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Who Pays Closing Costs in DC? A 2026 Breakdown
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Closing costs in Washington, DC, are typically split between buyers and sellers, but the specifics can vary based on negotiations and local customs.
          </p>
        </div>
      </section>

      {/* LOCAL INSIGHT */}
      <section className="py-8 bg-brand-blue text-white">
        <div className="container-xl max-w-3xl">
          <p className="text-lg font-medium">
            <span className="text-brand-light-blue">💡 Local Insight:</span> DC has some of the highest closing costs in the nation. The combined recordation and transfer taxes reach 2.9% for properties over $400,000—typically split 50/50 between buyer and seller by custom.
          </p>
        </div>
      </section>

      {/* BUYER RESPONSIBILITIES */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Buyer Responsibilities in DC</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              DC buyers typically pay <strong>3% to 5%</strong> of the purchase price in closing costs, in addition to their down payment. Here's what buyers are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li><strong>Loan Origination Fees:</strong> Charged by the lender for processing the mortgage, typically 0.5%-1% of the loan amount.</li>
              <li><strong>Title Insurance:</strong> Protects the buyer and lender from title disputes. Buyers usually pay for the lender's title insurance policy.</li>
              <li><strong>Appraisal Fees:</strong> Required by lenders to assess the home's value, usually $400-$600.</li>
              <li><strong>Home Inspection Fees:</strong> Optional but recommended, costing $400-$600.</li>
              <li><strong>Prepaid Expenses:</strong> Includes property taxes, homeowners insurance, and prepaid interest from closing date to end of the month.</li>
              <li><strong>Recording Fees:</strong> Fees to record the deed and mortgage with DC authorities.</li>
              <li><strong>DC Recordation Tax:</strong> 1.1% of purchase price (properties under $400K) or 1.45% (properties over $400K) — typically split 50/50.</li>
              <li><strong>DC Transfer Tax:</strong> 1.1% of purchase price (properties under $400K) or 1.45% (properties over $400K) — typically split 50/50.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SELLER RESPONSIBILITIES */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Seller Responsibilities in DC</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              DC sellers typically pay <strong>1% to 3%</strong> of the sale price in closing costs (excluding real estate commissions). Here's what sellers are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li><strong>Real Estate Agent Commissions:</strong> Typically 5-6% of the sale price, split between the buyer's and seller's agents.</li>
              <li><strong>DC Transfer Tax:</strong> 1.1% of purchase price (properties under $400K) or 1.45% (properties over $400K) — typically split 50/50 with buyer.</li>
              <li><strong>DC Recordation Tax:</strong> 1.1% of purchase price (properties under $400K) or 1.45% (properties over $400K) — typically split 50/50 with buyer.</li>
              <li><strong>Title Insurance for Buyer:</strong> Sellers often pay for the owner's title insurance policy as a concession.</li>
              <li><strong>Prorated Property Taxes:</strong> Property taxes from January 1 to the closing date.</li>
              <li><strong>Outstanding Liens:</strong> Any liens on the property must be paid at closing.</li>
              <li><strong>Condo/Co-op Fees:</strong> Any outstanding monthly fees or special assessments.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* DC TAX RATES TABLE */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">DC Tax Rates: Who Pays What</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-brand-muted border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="text-left p-3">Tax Type</th>
                  <th className="text-right p-3">Properties under $400K</th>
                  <th className="text-right p-3">Properties >$400K</th>
                  <th className="text-right p-3">Typically Paid By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Recordation Tax</td>
                  <td className="p-3 text-right">1.1%</td>
                  <td className="p-3 text-right">1.45%</td>
                  <td className="p-3 text-right">Split 50/50</td>
                </tr>
                <tr>
                  <td className="p-3">Transfer Tax</td>
                  <td className="p-3 text-right">1.1%</td>
                  <td className="p-3 text-right">1.45%</td>
                  <td className="p-3 text-right">Split 50/50</td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="p-3">Combined Total</td>
                  <td className="p-3 text-right">2.2%</td>
                  <td className="p-3 text-right">2.9%</td>
                  <td className="p-3 text-right">Buyer & Seller</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 space-y-3 text-brand-muted text-sm">
            <p><strong>Example:</strong> On a $600,000 home (over $400K), the combined taxes are 2.9% or $17,400. Split 50/50, each party pays $8,700.</p>
          </div>
        </div>
      </section>

      {/* NEGOTIATION */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Can Closing Costs Be Negotiated?</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Yes! While there's a customary 50/50 split for recordation and transfer taxes, buyers and sellers can negotiate who pays other fees:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Title Insurance:</strong> Who pays can be negotiated (traditionally split or paid by seller as concession)</li>
              <li><strong>Inspection Repairs:</strong> Sellers may agree to credit buyers for repair costs</li>
              <li><strong>Attorney Fees:</strong> Can be split or paid by either party</li>
              <li><strong>Home Warranty:</strong> Often paid by seller as part of the sale</li>
            </ul>
            <p>
              In a competitive market, sellers may offer to pay more closing costs to attract buyers. In a buyer's market, buyers may request seller concessions.
            </p>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-4">Explore More Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/closing-costs/virginia" className="text-brand-blue hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/dc-closing-cost-calculator" className="text-brand-blue hover:underline">
              DC Closing Cost Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Estimate Your DC Closing Costs</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact Pruitt Title LLC for an accurate breakdown of what you'll pay or receive at closing in DC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dc-closing-cost-calculator" className="inline-block bg-brand-blue text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
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