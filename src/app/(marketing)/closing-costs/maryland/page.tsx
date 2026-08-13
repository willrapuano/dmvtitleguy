import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { TIER1_LOCATIONS, TIER2_LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Maryland Closing Costs Guide | DMV Title Guy",
  description: "Complete guide to Maryland closing costs for buyers and sellers. Learn about transfer taxes, recordation fees, title insurance, and what to expect at settlement.",
  alternates: { canonical: "/closing-costs/maryland" },
};

const MD_LOCATIONS = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS].filter((l) => l.state === "MD");

const faqs = [
  {
    question: "How much are closing costs in Maryland?",
    answer: "Maryland closing costs typically range from 3% to 5% of the purchase price for buyers and 1% to 3% for sellers. This includes transfer taxes, recordation taxes, title insurance, and various other fees. The exact amount depends on the purchase price, county, and whether you're buying or selling.",
  },
  {
    question: "Who pays transfer taxes in Maryland?",
    answer: "In Maryland, transfer taxes are generally split between buyer and seller, but this can be negotiated in the contract. The state transfer tax is 0.5% (1.0% for non-primary residences), and county transfer taxes vary by jurisdiction—Montgomery County charges 1.0%, while Prince George's County charges 1.4%.",
  },
  {
    question: "What is the recordation tax in Maryland?",
    answer: "Maryland recordation tax varies by county. In Montgomery County, it's $6.60 per $1,000 of the loan amount for the state portion, plus additional county recordation taxes. The buyer typically pays recordation taxes based on the mortgage amount.",
  },
  {
    question: "Are there any exemptions from Maryland transfer taxes?",
    answer: "Yes, first-time homebuyers in Maryland may qualify for exemptions from county transfer taxes in certain circumstances. There are also exemptions for properties transferred between spouses, to a trust for estate planning purposes, or in connection with a divorce settlement. Consult with your title company for specific eligibility.",
  },
  {
    question: "How much does title insurance cost in Maryland?",
    answer: "Maryland title insurance rates are filed with the Maryland Insurance Administration. For a $500,000 home, owner's title insurance typically costs $1,500-2,000. Maryland offers a simultaneous issue discount when both lender's and owner's policies are purchased together.",
  },
  {
    question: "How do Maryland closing costs differ by county?",
    answer: "Maryland counties have varying transfer tax rates. Montgomery County has the highest at 1.5% combined, while Frederick County is lower at 1.0%. Prince George's County charges 1.9%. These differences significantly impact total closing costs.",
  },
  {
    question: "What is the first-time homebuyer benefit in Maryland?",
    answer: "First-time Maryland homebuyers may qualify for exemptions from county transfer taxes and reduced recordation taxes. Programs vary by county—Montgomery County offers generous exemptions that can save thousands at closing.",
  },
];

export default function MarylandClosingCostsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Maryland Closing Cost Guide",
            url: "https://dmvtitleguy.io/closing-costs/maryland",
            description: "Complete guide to Maryland closing costs for buyers and sellers. Learn about transfer taxes, recordation fees, title insurance, and what to expect at settlement.",
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
              "@type": "State",
              name: "Maryland",
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
            <span className="text-gray-200">Maryland Closing Costs</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Maryland Closing Costs Guide
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Complete guide to closing costs in Maryland. Learn what to expect as a buyer or seller, including transfer taxes, recordation fees, and title insurance in the Free State.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed
        title="Get a Maryland TitleCapture Quote"
        subtitle="Use Pruitt Title's live quote tool for title insurance, settlement charges, and applicable Maryland closing items."
      />

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container-xl max-w-3xl">
          <div className="rounded-lg border border-brand-blue/20 bg-brand-gray-bg p-5 text-brand-muted leading-relaxed">
            <h2 className="t-h6 text-brand-navy mb-2">Need a Maryland Closing Cost Estimate?</h2>
            <p className="max-w-[68ch]">
              Use the{" "}
              <Link href="/maryland-closing-cost-calculator" className="font-semibold text-brand-blue-deep hover:underline">
                Maryland closing cost calculator
              </Link>{" "}
              for Pruitt Title&apos;s embedded TitleCapture estimate. Pruitt Title confirms final figures after reviewing the contract and transaction details.
            </p>
          </div>
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
            Maryland has the most variable closing costs in the DMV—Montgomery County's 1.5% transfer tax vs. Frederick's 1.0% can mean a $2,500 difference on a $500K home. We help buyers understand county-specific costs before signing.
          </p>
        </div>
      </section>

      {/* BUYER COSTS */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">What Buyers Pay in Maryland</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Maryland buyers typically pay <strong>3% to 5%</strong> of the purchase price in closing costs, in addition to their down payment. These costs include:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>State Recordation Tax:</strong> $6.60 per $1,000 of the loan amount (varies by county)</li>
              <li><strong>County Recordation Tax:</strong> Varies by county—Montgomery County is approximately $6.60 per $1,000</li>
              <li><strong>State Transfer Tax:</strong> 0.5% of purchase price (1.0% if not primary residence)</li>
              <li><strong>County Transfer Tax:</strong> Varies by county—0% to 1.4% depending on jurisdiction</li>
              <li><strong>Title Insurance:</strong> Owner's and lender's title insurance premiums</li>
              <li><strong>Attorney/Settlement Fees:</strong> Typically $500-1,000 for closing services</li>
              <li><strong>Survey and Inspection Fees:</strong> Varies by transaction</li>
              <li><strong>Prorated Property Taxes:</strong> Property taxes from closing date through end of year</li>
              <li><strong>Recording Fees:</strong> Small fees to record the deed and mortgage</li>
            </ul>
            <p className="max-w-[68ch]">
              <strong>Example:</strong> For a $500,000 home in Montgomery County with 20% down, buyer closing costs would be approximately $12,000-18,000.
            </p>
          </div>
        </div>
      </section>

      {/* SELLER COSTS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">What Sellers Pay in Maryland</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Maryland sellers typically pay <strong>1% to 3%</strong> of the sale price in closing costs (excluding real estate commissions). These costs include:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Real Estate Commission:</strong> Typically 5-6% of the sale price (negotiable)</li>
              <li><strong>State Transfer Tax:</strong> 0.5% of purchase price (1.0% if buyer won't use as primary residence)</li>
              <li><strong>County Transfer Tax:</strong> Varies by county—Montgomery County is 1.0%</li>
              <li><strong>Prorated Property Taxes:</strong> Property taxes from January 1 to closing date</li>
              <li><strong>Outstanding Liens:</strong> Any liens on the property must be paid at closing</li>
              <li><strong>Attorney Fees:</strong> If seller uses an attorney for the transaction</li>
              <li><strong>HOA Fees:</strong> Any outstanding homeowners association dues</li>
            </ul>
            <p className="max-w-[68ch]">
              <strong>Example:</strong> For a $500,000 home in Montgomery County with a 6% commission, seller closing costs would be approximately $30,000-35,000.
            </p>
          </div>
        </div>
      </section>

      {/* COUNTY SPECIFIC */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Maryland Transfer & Recordation Taxes by County</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-brand-muted border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="text-left p-3">County</th>
                  <th className="text-right p-3">State Transfer</th>
                  <th className="text-right p-3">County Transfer</th>
                  <th className="text-right p-3">Total Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Montgomery County</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right">1.0%</td>
                  <td className="p-3 text-right font-semibold">1.5%</td>
                </tr>
                <tr>
                  <td className="p-3">Prince George's County</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right">1.4%</td>
                  <td className="p-3 text-right font-semibold">1.9%</td>
                </tr>
                <tr>
                  <td className="p-3">Howard County</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right">1.0%</td>
                  <td className="p-3 text-right font-semibold">1.5%</td>
                </tr>
                <tr>
                  <td className="p-3">Anne Arundel County</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right">1.0%</td>
                  <td className="p-3 text-right font-semibold">1.5%</td>
                </tr>
                <tr>
                  <td className="p-3">Frederick County</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right">0.5%</td>
                  <td className="p-3 text-right font-semibold">1.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-brand-muted mt-4 max-w-[68ch] leading-relaxed">
            <em>Note: These rates are subject to change. First-time homebuyers may qualify for exemptions in certain counties. Consult with your title company for current rates.</em>
          </p>
        </div>
      </section>

      {/* TITLE INSURANCE */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Title Insurance in Maryland</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Maryland requires attorney or licensed title agent involvement at closing. Title insurance protects against hidden title defects that could affect your ownership rights.
            </p>
            <h3 className="text-brand-navy font-bold text-base">Owner's Title Insurance</h3>
            <p className="max-w-[68ch]">
              Owner's title insurance protects your investment against claims against your ownership of the property. It's a one-time premium paid at closing and provides coverage for as long as you own the property. For a $500,000 home, owner's title insurance costs approximately $1,500-2,000.
            </p>
            <h3 className="text-brand-navy font-bold text-base">Lender's Title Insurance</h3>
            <p className="max-w-[68ch]">
              Most lenders require lender's title insurance (also called a loan policy) to protect their interest in the property. This is typically a separate policy from the owner's coverage.
            </p>
            <h3 className="text-brand-navy font-bold text-base">Simultaneous Issue Discount</h3>
            <p className="max-w-[68ch]">
              Maryland offers a simultaneous issue discount when both owner's and lender's title insurance are purchased together. This can save buyers 10-20% on their title insurance costs.
            </p>
          </div>
        </div>
      </section>

      {/* LOCATION LINKS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Maryland Markets We Serve</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MD_LOCATIONS.map((l) => (
              <Link
                key={l.slug}
                href={`/${l.slug}`}
                className="text-sm text-brand-blue-deep hover:underline border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors"
              >
                {l.city}, MD →
              </Link>
            ))}
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
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/title-company-bethesda-md" className="text-brand-blue-deep hover:underline">
              Bethesda Title Services →
            </Link>
            <Link href="/title-company-rockville-md" className="text-brand-blue-deep hover:underline">
              Rockville Title Services →
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
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Maryland Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact Pruitt Title LLC for an accurate closing cost estimate for your Maryland transaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/maryland-closing-cost-calculator" className="btn-primary px-8">
              Calculate Your Costs →
            </Link>
            <Link href="/maryland-closing-cost-calculator" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Get a Quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
