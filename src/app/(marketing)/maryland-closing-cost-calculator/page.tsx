import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { CalculatorSchema } from "@/components/SchemaMarkup";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { TIER1_LOCATIONS, TIER2_LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Maryland Closing Cost Calculator | Buyer & Seller Costs in MD",
  description:
    "Calculate Maryland closing costs for buyers and sellers. Estimate MD transfer tax, recordation fees, title insurance, and Montgomery County costs. Get a free quote.",
  alternates: { canonical: "/maryland-closing-cost-calculator" },
};

const MD_LOCATIONS = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS].filter((l) => l.state === "MD");

const verificationNotice =
  "⚠️ VERIFY BEFORE PUBLISH: Rates shown are approximate and for illustration only. Verify with current Maryland/county official sources before relying on these estimates.";

const transferTaxRows = [
  { county: "Montgomery County", rate: "Approximately 1.0% county transfer tax, plus applicable state transfer tax and recordation charges." },
  { county: "Prince George's County", rate: "Approximately 1.4% county transfer tax, plus applicable state transfer tax and recordation charges." },
  { county: "Anne Arundel County", rate: "County transfer and recordation treatment can vary by transaction type and should be verified before publishing." },
  { county: "Howard County", rate: "County transfer and recordation treatment can vary by transaction type and should be verified before publishing." },
  { county: "Frederick County", rate: "County transfer and recordation treatment can vary by transaction type and should be verified before publishing." },
  { county: "Baltimore County", rate: "County transfer and recordation treatment can vary by transaction type and should be verified before publishing." },
];

const buyerCosts = [
  "Lender origination and underwriting fees",
  "Appraisal and credit report fees",
  "Lender's title insurance policy",
  "Owner's title insurance policy if selected or negotiated",
  "Recordation taxes and recording fees",
  "Transfer taxes depending on the contract and local custom",
  "Prepaid taxes, insurance, and escrow deposits",
];

const sellerCosts = [
  "Broker commission",
  "Mortgage payoff and payoff statement fees",
  "Seller settlement fee",
  "State and county transfer taxes depending on the contract and local custom",
  "Prorated property taxes and assessments",
  "HOA or condo resale package fees",
  "Lien releases and related recording charges",
];

const calculationExamples = [
  {
    title: "$400,000 Maryland Purchase With 10% Down",
    lines: [
      "Buyer costs are often driven by lender charges, title insurance, recording, transfer, recordation, and escrow deposits.",
      "Illustrative buyer cash to close before down payment may commonly land in the low five figures, depending on county and lender fees.",
    ],
  },
  {
    title: "$600,000 Rockville Purchase With 20% Down",
    lines: [
      "Rockville purchases usually require Montgomery County-specific transfer and recordation review.",
      "Illustrative closing costs may be meaningfully higher than a lower-price statewide example because taxes and title insurance are tied to price and loan amount.",
    ],
  },
  {
    title: "$950,000 Bethesda Purchase With 20% Down",
    lines: [
      "Bethesda transactions often have higher purchase prices, so percentage-based taxes and title premiums can move the estimate quickly.",
      "Illustrative buyer-side charges should be verified line by line against the contract, lender estimate, and county rules.",
    ],
  },
  {
    title: "$525,000 Silver Spring Seller Net Example",
    lines: [
      "Seller net estimates should account for commissions, payoff, transfer tax allocation, prorations, settlement fees, and any condo or HOA charges.",
      "Illustrative seller costs can change materially if the contract shifts transfer tax responsibility or requires repairs/credits.",
    ],
  },
];

const cityExamples = [
  {
    city: "Bethesda",
    copy:
      "Bethesda purchase prices can make percentage-based taxes, title insurance, and lender charges more visible in the final cash-to-close estimate.",
    links: [
      { href: "/title-company-bethesda-md", label: "Bethesda title company" },
      { href: "/closing-costs-bethesda-md", label: "Bethesda closing cost calculator" },
    ],
  },
  {
    city: "Rockville",
    copy:
      "Rockville has a broad mix of condos, townhomes, and single-family homes, so the estimate should reflect both property type and Montgomery County tax treatment.",
    links: [
      { href: "/title-company-rockville-md", label: "Rockville title company" },
      { href: "/closing-costs-rockville-md", label: "Rockville closing cost calculator" },
    ],
  },
  {
    city: "Silver Spring",
    copy:
      "Silver Spring closing costs can differ between downtown condos, Wheaton-area homes, townhomes, and single-family properties because HOA/condo documents and lender items vary.",
    links: [
      { href: "/title-company-silver-spring-md", label: "Silver Spring title company" },
      { href: "/closing-costs-silver-spring-md", label: "Silver Spring closing cost calculator" },
    ],
  },
];

const relatedResources = [
  { href: "/closing-costs/maryland", label: "Maryland closing costs guide" },
  { href: "/closing-costs/buyer-maryland", label: "Buyer closing costs in Maryland" },
  { href: "/closing-costs-bethesda-md", label: "Bethesda closing cost calculator" },
  { href: "/closing-costs-rockville-md", label: "Rockville closing cost calculator" },
  { href: "/closing-costs-silver-spring-md", label: "Silver Spring closing cost calculator" },
  { href: "/closing-costs-gaithersburg-md", label: "Gaithersburg closing cost calculator" },
  { href: "/title-company-montgomery-county-md", label: "Montgomery County title and settlement services" },
  { href: "/title-insurance", label: "Maryland title insurance" },
  { href: "/calculators/title-quote", label: "Get a title insurance quote" },
];

const faqs = [
  {
    question: "How much are closing costs in Maryland?",
    answer:
      "Maryland closing costs typically depend on the purchase price, loan amount, county, title insurance, lender fees, taxes, recording charges, and escrow deposits. VERIFY BEFORE PUBLISH: Any percentage range or dollar estimate should be verified against current Maryland and county sources before publishing or relying on it.",
  },
  {
    question: "Who pays transfer tax in Maryland?",
    answer:
      "Transfer tax allocation is usually governed by the purchase contract, local custom, and negotiation. Maryland transactions can involve both state transfer tax and county transfer tax, so the contract should be reviewed before assuming whether the buyer, seller, or both sides pay.",
  },
  {
    question: "What is the Maryland recordation tax?",
    answer:
      "Maryland recordation tax is charged when deeds, deeds of trust, mortgages, and certain other instruments are recorded in land records. County rules matter, and first-time buyer treatment can change the final estimate.",
  },
  {
    question: "Are closing costs different in Montgomery County?",
    answer:
      "Yes. Montgomery County has its own transfer and recordation cost profile, so Bethesda, Rockville, Silver Spring, Gaithersburg, Germantown, and Potomac buyers and sellers should use county-specific estimates instead of a generic statewide number.",
  },
  {
    question: "How much are buyer closing costs in Maryland?",
    answer:
      "Buyer closing costs can include lender fees, appraisal, credit report, title insurance, recordation taxes, transfer taxes depending on the contract, recording fees, prepaid taxes, insurance, and escrow deposits. The exact estimate depends on the property, lender, county, and closing date.",
  },
  {
    question: "How much are seller closing costs in Maryland?",
    answer:
      "Maryland seller closing costs can include broker commission, payoff charges, seller settlement fees, transfer taxes depending on the contract, prorated taxes, HOA or condo fees, lien releases, and recording charges.",
  },
  {
    question: "What closing costs do Maryland buyers pay?",
    answer:
      "Maryland buyers commonly pay lender-related charges, title charges, recording fees, prepaid taxes and insurance, escrow deposits, and taxes assigned to the buyer by contract or local custom.",
  },
  {
    question: "What closing costs do Maryland sellers pay?",
    answer:
      "Maryland sellers commonly pay commission, mortgage payoff, seller-side settlement charges, prorations, HOA or condo resale package costs, lien release costs, and any transfer taxes assigned to the seller by contract or local custom.",
  },
  {
    question: "Does Maryland have county transfer taxes?",
    answer:
      "Yes. Maryland county transfer tax treatment varies by jurisdiction. Montgomery County, Prince George's County, Anne Arundel County, Howard County, Frederick County, and Baltimore County should each be checked against current county rules before relying on a final estimate.",
  },
  {
    question: "Do first-time homebuyers pay transfer tax in Maryland?",
    answer:
      "Qualifying first-time Maryland homebuyers may receive transfer or recordation tax benefits depending on state and county rules. Eligibility depends on the buyer, occupancy, property, purchase documents, and county requirements.",
  },
  {
    question: "How much is title insurance in Maryland?",
    answer:
      "Maryland title insurance cost depends on the purchase price, loan amount, owner's policy, lender's policy, and whether simultaneous issue pricing applies. Premiums and settlement charges should be verified for the actual transaction.",
  },
  {
    question: "Is this Maryland closing cost calculator exact?",
    answer:
      "No. The calculator provides an estimate. Pruitt Title can verify final closing costs using the contract, lender information, county, title insurance requirements, payoff details, and target closing date.",
  },
];

function VerificationCallout({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
      <p className="font-bold">{verificationNotice}</p>
      {children ? <div className="mt-3 space-y-2">{children}</div> : null}
    </div>
  );
}

export default function MarylandCalculatorPage() {
  return (
    <>
      <CalculatorSchema state="Maryland" slug="maryland-closing-cost-calculator" />

      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span>Maryland Closing Cost Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Maryland Closing Cost Calculator for Buyers and Sellers</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Estimate closing costs for Maryland real estate transactions. Covers state &amp; county transfer taxes, title insurance, recordation fees, and more.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed />

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">How Maryland Closing Costs Are Calculated</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Maryland closing costs combine lender fees, title insurance, settlement fees, recordation taxes,
                transfer taxes, recording fees, prepaid taxes and insurance, escrow deposits, and prorations.
                The calculator is a starting point for organizing those line items before a final title quote.
              </p>
              <p>
                Buyer costs commonly vary by loan amount, property type, county, contract terms, and whether the
                buyer qualifies as a first-time Maryland homebuyer. Seller costs depend heavily on payoff, commission,
                contract credits, prorations, and how transfer taxes are allocated.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Maryland Recordation Tax Explained</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Recordation tax is tied to the recording of deeds, deeds of trust, mortgages, and certain other
                instruments in Maryland land records. It is separate from title insurance and settlement fees.
              </p>
              <p>
                The way recordation tax applies can vary by county and by the recorded instrument. In some transactions,
                the estimate may be affected by purchase price, loan amount, first-time buyer treatment, or exemptions.
              </p>
              <VerificationCallout>
                <p>
                  Montgomery County recordation examples and any dollar-per-thousand calculations must be verified
                  against current Montgomery County and Maryland sources before publication.
                </p>
              </VerificationCallout>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Maryland Transfer Tax Explained</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Maryland transfer tax estimates usually separate state transfer tax from county transfer tax.
                State-level rules, county rules, contract allocation, and first-time homebuyer eligibility can all
                affect the final amount shown on the settlement statement.
              </p>
              <VerificationCallout>
                <p>
                  Maryland state transfer tax is commonly described as approximately 0.5% of consideration, with
                  different treatment possible for qualifying first-time Maryland homebuyers and non-owner-occupied
                  transactions. Verify before publishing.
                </p>
              </VerificationCallout>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-navy text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">County</th>
                      <th className="px-4 py-3 font-semibold">Approximate Transfer Tax Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transferTaxRows.map((row) => (
                      <tr key={row.county}>
                        <td className="px-4 py-3 font-semibold text-brand-navy">{row.county}</td>
                        <td className="px-4 py-3 text-brand-muted">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <VerificationCallout />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Who Pays Closing Costs in Maryland: Buyer vs Seller</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-brand-navy mb-3">Buyer Closing Cost Line Items</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-brand-muted">
                  {buyerCosts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-brand-navy mb-3">Seller Closing Cost Line Items</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-brand-muted">
                  {sellerCosts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Transfer tax allocation is often handled by the contract and local custom. A title company should review
              the signed contract before either side relies on an estimate.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Example Maryland Closing Cost Calculations</h2>
            <VerificationCallout>
              <p>
                All purchase prices, down payments, seller net examples, and cost descriptions below are approximate
                illustrations only. Verify all dollar amounts, tax rates, lender charges, and county charges before publishing.
              </p>
            </VerificationCallout>
            <div className="mt-5 grid md:grid-cols-2 gap-5">
              {calculationExamples.map((example) => (
                <div key={example.title} className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-brand-navy mb-3">{example.title}</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-brand-muted">
                    {example.lines.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Montgomery County Closing Costs</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Montgomery County closing cost estimates need county-specific tax handling because Bethesda, Rockville,
                Silver Spring, Gaithersburg, Germantown, and Potomac transactions can involve different property types,
                price points, lender requirements, and contract allocations.
              </p>
              <p>
                Use a Montgomery County-specific quote when reviewing transfer tax, recordation charges, title insurance,
                settlement fees, and any HOA or condo documentation costs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/title-company-montgomery-county-md" className="text-sm font-semibold text-brand-blue hover:underline">Montgomery County title company</Link>
                <Link href="/title-company-bethesda-md" className="text-sm font-semibold text-brand-blue hover:underline">Bethesda title company</Link>
                <Link href="/title-company-rockville-md" className="text-sm font-semibold text-brand-blue hover:underline">Rockville title company</Link>
                <Link href="/title-company-silver-spring-md" className="text-sm font-semibold text-brand-blue hover:underline">Silver Spring title company</Link>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Bethesda, Rockville, and Silver Spring Examples</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {cityExamples.map((item) => (
                <div key={item.city} className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-brand-navy mb-3">{item.city}</h3>
                  <p className="text-sm leading-relaxed text-brand-muted mb-4">{item.copy}</p>
                  <div className="space-y-2">
                    {item.links.map((link) => (
                      <Link key={link.href} href={link.href} className="block text-sm font-semibold text-brand-blue hover:underline">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">First-Time Homebuyer Closing Cost Benefits in Maryland</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Qualifying first-time Maryland homebuyers may receive transfer or recordation tax benefits depending
                on state and county rules. These benefits can materially change the estimate, especially when both
                the purchase price and loan amount are part of the calculation.
              </p>
              <p>
                Eligibility can depend on the buyer, occupancy, property type, county, transaction documents, and
                timing. Ask Pruitt Title to verify eligibility before relying on a calculator estimate.
              </p>
              <VerificationCallout />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Maryland Title Insurance and Settlement Fees</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>
                Title insurance protects against covered title defects, liens, and ownership issues. Maryland buyers
                often see separate lender's title insurance and owner's title insurance line items, depending on the
                loan and contract.
              </p>
              <p>
                Maryland title insurance rates are filed or regulated, and the exact premium depends on purchase price,
                loan amount, policy type, and whether simultaneous issue pricing applies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/title-insurance" className="text-sm font-semibold text-brand-blue hover:underline">Learn about title insurance</Link>
                <Link href="/calculators/title-quote" className="text-sm font-semibold text-brand-blue hover:underline">Get a title insurance quote</Link>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Maryland Closing Cost FAQs</h2>
            <FAQSection faqs={faqs} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Related Maryland Closing Cost Resources</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-brand-blue hover:border-brand-blue transition-colors"
                >
                  {resource.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Maryland Markets We Serve</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MD_LOCATIONS.map((l) => (
              <Link key={l.slug} href={`/${l.slug}`} className="text-sm text-brand-blue border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors">
                {l.city}, MD
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
