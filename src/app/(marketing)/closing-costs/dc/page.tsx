import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";

export const metadata: Metadata = {
  title: "Washington DC Closing Costs Guide | DMV Title Guy",
  description: "Complete guide to DC closing costs for buyers and sellers. Learn about recordation tax, transfer tax, title insurance, and what to expect at settlement in Washington DC.",
  alternates: { canonical: "/closing-costs/dc" },
};

const faqs = [
  {
    question: "How much are closing costs in Washington DC?",
    answer: "Washington DC has some of the highest closing costs in the nation. Combined recordation and transfer taxes can reach 2.9% of the sales price for properties over $400,000. Buyers typically pay 3% to 5% of the purchase price; sellers pay 1% to 3% (excluding agent commissions).",
  },
  {
    question: "What are DC recordation and transfer taxes?",
    answer: "DC charges both recordation tax (based on loan amount) and transfer tax (based on sales price). For properties $400,000 and under, the combined rate is 2.2% (1.1% each). For properties over $400,000, the combined rate increases to 2.9% (1.45% each). These are typically split 50/50 between buyer and seller.",
  },
  {
    question: "Are there any exemptions from DC closing costs?",
    answer: "Yes, first-time DC homebuyers may qualify for exemptions from the recordation tax. There are also exemptions for properties transferred to a spouse, as a gift, or in connection with a divorce. Senior citizens and disabled homeowners may qualify for additional exemptions. Consult with your title company for eligibility.",
  },
  {
    question: "How much does title insurance cost in DC?",
    answer: "DC title insurance rates are set by the DC Insurance Commissioner. For a $500,000 home, owner's title insurance typically costs $1,800-2,400. DC allows simultaneous issue discounts when both lender's and owner's policies are purchased together.",
  },
  {
    question: "What makes DC closings different from Maryland and Virginia?",
    answer: "DC uses a deed recording system and has the highest combined tax rates in the DMV region. Additionally, DC requires an attorney or licensed title agent to conduct all real estate settlements. DC also has unique first-time homebuyer programs that can significantly reduce closing costs.",
  },
  {
    question: "How do DC's tax rates impact buyers at different price points?",
    answer: "Properties under $400K pay 2.2% combined tax; properties over $400K jump to 2.9%. On a $600K home, this means over $17,000 in transfer and recordation taxes alone—making DC the most expensive jurisdiction in the DMV for closing costs.",
  },
  {
    question: "What first-time buyer programs are available in DC?",
    answer: "DC offers several first-time homebuyer programs that can exempt buyers from recordation taxes on properties up to $500,000. The DC Open Doors program provides down payment assistance and closing cost grants. These programs can save qualified buyers $10,000+.",
  },
];

export default function DCClosingCostsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Washington DC Closing Cost Guide",
            url: "https://dmvtitleguy.com/closing-costs/dc",
            description: "Complete guide to DC closing costs for buyers and sellers. Learn about recordation tax, transfer tax, title insurance, and what to expect at settlement.",
            provider: {
              "@type": "LocalBusiness",
              name: "DMV Title Guy — Pruitt Title LLC",
              telephone: "(703) 859-1467",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1900 Gallows Rd Ste 230",
                addressLocality: "Vienna",
                addressRegion: "VA",
                postalCode: "22182",
                addressCountry: "US",
              },
            },
            areaServed: {
              "@type": "City",
              name: "Washington",
              addressRegion: "DC",
            },
          }),
        }}
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">DC Closing Costs</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Washington DC Closing Costs Guide
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Complete guide to closing costs in Washington DC. Learn what to expect as a buyer or seller in the nation's capital, including recordation taxes, transfer taxes, and title insurance.
          </p>
        </div>
      </section>

      <ClosingCostCalculator state="DC" />

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
            DC has the highest closing costs in the DMV—properties over $400K pay 2.9% in combined taxes. But first-time buyers can save $10K+ through DC's recordation tax exemptions. We help buyers navigate these programs.
          </p>
        </div>
      </section>

      {/* BUYER COSTS */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">What Buyers Pay in Washington DC</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              DC buyers typically pay <strong>3% to 5%</strong> of the purchase price in closing costs, in addition to their down payment. The high costs are primarily due to DC's recordation and transfer taxes, which are among the highest in the nation.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>DC Recordation Tax:</strong> 1.1% of purchase price (properties &le;$400K) or 1.45% (properties &gt;$400K)</li>
              <li><strong>DC Transfer Tax:</strong> 1.1% of purchase price (properties &le;$400K) or 1.45% (properties &gt;$400K)</li>
              <li><strong>Title Insurance:</strong> Owner's and lender's title insurance premiums</li>
              <li><strong>Settlement/Attorney Fees:</strong> Typically $600-1,200 for closing services</li>
              <li><strong>Recording Fees:</strong> Fees to record the deed and mortgage</li>
              <li><strong>Prorated Property Taxes:</strong> Property taxes from closing date through end of tax year</li>
              <li><strong>Survey and Inspection Fees:</strong> Varies by transaction</li>
            </ul>
            <p>
              <strong>Example:</strong> For a $600,000 home with 20% down, buyer closing costs in DC would be approximately $17,000-22,000.
            </p>
          </div>
        </div>
      </section>

      {/* SELLER COSTS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">What Sellers Pay in Washington DC</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              DC sellers typically pay <strong>1% to 3%</strong> of the sale price in closing costs (excluding real estate commissions). These costs include:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Real Estate Commission:</strong> Typically 5-6% of the sale price (negotiable)</li>
              <li><strong>DC Transfer Tax:</strong> 1.1% of purchase price (properties &le;$400K) or 1.45% (properties &gt;$400K)</li>
              <li><strong>DC Recordation Tax:</strong> 1.1% of purchase price (properties &le;$400K) or 1.45% (properties &gt;$400K)</li>
              <li><strong>Prorated Property Taxes:</strong> Property taxes from January 1 to closing date</li>
              <li><strong>Outstanding Liens:</strong> Any liens on the property must be paid at closing</li>
              <li><strong>Condo/Co-op Fees:</strong> Any outstanding monthly fees or special assessments</li>
            </ul>
            <p>
              <strong>Example:</strong> For a $600,000 home with a 6% commission, seller closing costs in DC would be approximately $36,000-42,000.
            </p>
          </div>
        </div>
      </section>

      {/* DC TAX RATES */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">DC Recordation & Transfer Tax Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-brand-muted border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="text-left p-3">Property Value</th>
                  <th className="text-right p-3">Recordation Tax</th>
                  <th className="text-right p-3">Transfer Tax</th>
                  <th className="text-right p-3">Combined Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">$0 - $400,000</td>
                  <td className="p-3 text-right">1.1%</td>
                  <td className="p-3 text-right">1.1%</td>
                  <td className="p-3 text-right font-semibold">2.2%</td>
                </tr>
                <tr>
                  <td className="p-3">Over $400,000</td>
                  <td className="p-3 text-right">1.45%</td>
                  <td className="p-3 text-right">1.45%</td>
                  <td className="p-3 text-right font-semibold">2.9%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 space-y-3 text-brand-muted text-sm">
            <p className="max-w-[68ch]"><strong>Note:</strong> By custom (not law), buyers and sellers typically split these taxes 50/50. This is negotiated in the purchase contract.</p>
            <p className="max-w-[68ch]"><strong>First-Time Homebuyer Exemption:</strong> First-time DC homebuyers may be exempt from the recordation tax on properties up to $500,000. This can save buyers thousands of dollars at closing.</p>
          </div>
        </div>
      </section>

      {/* TITLE INSURANCE */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Title Insurance in Washington DC</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              DC law requires an attorney or licensed title agent to conduct all real estate settlements. Title insurance protects against hidden title defects that could affect your ownership rights.
            </p>
            <h3 className="text-brand-navy font-bold text-base">Owner's Title Insurance</h3>
            <p className="max-w-[68ch]">
              Owner's title insurance protects your investment against claims against your ownership of the property. It's a one-time premium paid at closing and provides coverage for as long as you own the property. For a $600,000 home in DC, owner's title insurance costs approximately $2,000-2,500.
            </p>
            <h3 className="text-brand-navy font-bold text-base">Lender's Title Insurance</h3>
            <p className="max-w-[68ch]">
              Most lenders require lender's title insurance (a loan policy) to protect their interest in the property. This is typically a separate policy from the owner's coverage.
            </p>
            <h3 className="text-brand-navy font-bold text-base">Simultaneous Issue Discount</h3>
            <p className="max-w-[68ch]">
              DC allows a simultaneous issue discount when both owner's and lender's title insurance are purchased together. This can save buyers approximately 10-15% on their title insurance costs.
            </p>
          </div>
        </div>
      </section>

      {/* DC SPECIFICS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">What Makes DC Closings Unique</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Washington DC real estate transactions have several unique characteristics that differ from Maryland and Virginia:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Highest Tax Rates in the DMV:</strong> DC's combined 2.2-2.9% tax rate exceeds both Maryland and Virginia</li>
              <li><strong>Deed Recording:</strong> DC uses a deed recording system that requires proper documentation</li>
              <li><strong>First-Time Homebuyer Programs:</strong> DC offers several programs that can reduce or eliminate closing costs</li>
              <li><strong>Condo/Co-op Considerations:</strong> Many DC properties are condos or co-ops, which may have additional fees and resale certificate requirements</li>
              <li><strong>Attorney Requirement:</strong> DC requires attorney involvement at all real estate closings</li>
            </ul>
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
            <Link href="/title-company/arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-company/fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
            </Link>
            <Link href="/title-company/alexandria-va" className="text-brand-blue-deep hover:underline">
              Alexandria Title Services →
            </Link>
            <Link href="/title-company/falls-church-va" className="text-brand-blue-deep hover:underline">
              Falls Church Title Services →
            </Link>
            <Link href="/title-company-bethesda-md" className="text-brand-blue-deep hover:underline">
              Bethesda Title Services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your DC Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact Pruitt Title LLC for an accurate closing cost estimate for your DC transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dc-closing-cost-calculator" className="btn-primary px-8">
              Calculate Your Costs →
            </Link>
            <Link href="/dc-closing-cost-calculator" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Get a Quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
