import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { FAQSection } from "@/components/FAQSection";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { TIER1_LOCATIONS, TIER2_LOCATIONS } from "@/data/locations";
import { SITE_NAME, willPersonReference } from "@/lib/brand-identity";

export const metadata: Metadata = {
  title: "Maryland Closing Cost Calculator (2026) | Free Buyer & Seller Estimates",
  description:
    "Free Maryland closing cost calculator for buyers and sellers. Estimate MD transfer tax, recordation, title insurance, and county costs for Montgomery, PG, and statewide.",
  alternates: { canonical: "https://dmvtitleguy.io/maryland-closing-cost-calculator" },
};

const MD_LOCATIONS = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS].filter((l) => l.state === "MD");
const SITE_URL = "https://dmvtitleguy.io";
const PAGE_SLUG = "maryland-closing-cost-calculator";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

const taxRateNotice =
  "Tax rates verified as of June 2026. Rates are subject to change; confirm with the applicable circuit court clerk for the most current rates.";

const transferTaxRows = [
  { county: "State of Maryland", rate: "0.5% state transfer tax; 0.25% for qualifying first-time Maryland homebuyers, paid by seller." },
  { county: "Montgomery County", rate: "1.0% local transfer tax for consideration of $70,000 or more; 0.50% from $40,000 to $70,000; 0.25% under $40,000." },
  { county: "Prince George's County", rate: "1.4% local transfer tax; the 1.4% local transfer tax also applies to mortgages and deeds of trust." },
];

const recordationRows = [
  { county: "State recordation tax base", rate: "$2.50 per $500, with county rates set locally." },
  { county: "Montgomery County", rate: "$4.45 per $500 up to $500,000; $6.75 per $500 from $500,000.01-$600,000; $10.20 per $500 from $600,000.01-$750,000; $10.78 per $500 from $750,000.01-$1,000,000; $11.35 per $500 over $1,000,000." },
  { county: "Montgomery owner-occupied exemption", rate: "First $100,000 exempt for owner-occupied residential property when the buyer intends to occupy for 7 of the next 12 months." },
  { county: "Prince George's County", rate: "0.55%, equal to $2.75 per $500." },
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
      "Buyer cash to close before down payment can land in the low five figures, depending on county, lender fees, and tax allocation.",
    ],
  },
  {
    title: "$600,000 Rockville Purchase With 20% Down",
    lines: [
      "Rockville purchases usually require Montgomery County-specific transfer and recordation review.",
      "Closing costs are meaningfully higher than a lower-price statewide example because taxes and title insurance are tied to price and loan amount.",
    ],
  },
  {
    title: "$950,000 Bethesda Purchase With 20% Down",
    lines: [
      "Bethesda transactions often have higher purchase prices, so percentage-based taxes and title premiums can move the estimate quickly.",
      "Buyer-side charges should be reviewed line by line against the contract, lender estimate, and county rules.",
    ],
  },
  {
    title: "$525,000 Silver Spring Seller Net Example",
    lines: [
      "Seller net estimates should account for commissions, payoff, transfer tax allocation, prorations, settlement fees, and any condo or HOA charges.",
      "Seller costs can change materially if the contract shifts transfer tax responsibility or requires repairs/credits.",
    ],
  },
  {
    title: "$475,000 Prince George's County Purchase",
    lines: [
      "Prince George's County estimates should include the 1.4% county transfer tax, 0.55% recordation tax, and the additional deed of trust transfer tax on the loan amount.",
      "A Hyattsville, Bowie, or Upper Marlboro buyer should compare buyer cash to close and seller net because county tax allocation can shift by contract.",
    ],
  },
  {
    title: "$425,000 Baltimore County Seller Example",
    lines: [
      "Baltimore County seller costs usually start with commission, payoff, prorations, title company settlement fees, and any seller-paid transfer tax under the contract.",
      "County-specific taxes and recording treatment should be checked before relying on a statewide Maryland closing cost estimate.",
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
      "Maryland closing costs depend on the purchase price, loan amount, county, title insurance, lender fees, taxes, recording charges, and escrow deposits. The calculator applies Maryland, Montgomery County, and Prince George's County tax rates verified for June 2026.",
  },
  {
    question: "Who pays transfer tax in Maryland?",
    answer:
      "Transfer tax allocation is usually governed by the purchase contract, local custom, and negotiation. Maryland transactions can involve both state transfer tax and county transfer tax, so the contract should be reviewed before assuming whether the buyer, seller, or both sides pay.",
  },
  {
    question: "What is the Maryland recordation tax?",
    answer:
      "Maryland recordation tax is charged when deeds, deeds of trust, mortgages, and certain other instruments are recorded in land records. The state base is $2.50 per $500, but each county sets its own rate.",
  },
  {
    question: "Are closing costs different in Montgomery County?",
    answer:
      "Yes. Montgomery County uses a tiered recordation tax schedule under Bill 17-23 and charges local transfer tax based on consideration. Bethesda, Rockville, Silver Spring, Gaithersburg, Germantown, and Potomac transactions should use Montgomery County-specific calculations.",
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
      "Yes. Montgomery County charges 1.0% for consideration of $70,000 or more, with lower tiers below $70,000. Prince George's County charges 1.4%, and that local transfer tax also applies to mortgages and deeds of trust.",
  },
  {
    question: "Do first-time homebuyers pay transfer tax in Maryland?",
    answer:
      "Qualifying first-time Maryland homebuyers receive the reduced 0.25% Maryland state transfer tax rate, and that state transfer tax must be paid by the seller. County-specific benefits or exemptions depend on the county and transaction details.",
  },
  {
    question: "How much is title insurance in Maryland?",
    answer:
      "Maryland title insurance cost depends on the purchase price, loan amount, owner's policy, lender's policy, and whether simultaneous issue pricing applies. Premiums and settlement charges should be verified for the actual transaction.",
  },
  {
    question: "Is this Maryland closing cost calculator exact?",
    answer:
      "The calculator applies the listed June 2026 tax rates, but final closing costs still depend on the signed contract, lender information, county, title insurance requirements, payoff details, and target closing date.",
  },
  {
    question: "How should I estimate Montgomery County closing costs?",
    answer:
      "Use Montgomery County-specific transfer tax and recordation tax assumptions instead of a generic statewide estimate. Montgomery County has a local transfer tax schedule and tiered recordation tax rates, with a potential first $100,000 owner-occupied residential exemption.",
  },
  {
    question: "Why are Prince George's County closing costs different?",
    answer:
      "Prince George's County uses a 1.4% local transfer tax and 0.55% recordation tax. The county's 1.4% local transfer tax also applies to mortgages and deeds of trust, so loan amount can affect the estimate.",
  },
  {
    question: "Does Baltimore County use the same closing cost estimate as Montgomery or Prince George's County?",
    answer:
      "No. Baltimore County transactions should be checked against Baltimore County transfer, recordation, recording, and contract-allocation rules. The statewide calculator is a starting point, but county-specific review is needed before settlement.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}#calculator`,
      name: "Maryland Closing Cost Calculator",
      url: PAGE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      description:
        "Free interactive closing cost calculator for Maryland buyers and sellers. Estimate transfer tax, recordation fees, title insurance, and settlement charges.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: willPersonReference(),
      publisher: {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Maryland Closing Cost Calculator | Buyer & Seller Costs in MD",
      description:
        "Calculate Maryland closing costs for buyers and sellers. Estimate MD transfer tax, recordation fees, title insurance, and Montgomery County costs. Get a free quote.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: [
        { "@type": "Thing", name: "Maryland closing costs" },
        { "@type": "Thing", name: "Maryland recordation tax" },
        { "@type": "Thing", name: "Maryland transfer tax" },
        { "@type": "Thing", name: "Maryland title insurance" },
        { "@type": "Thing", name: "Real estate settlement" },
      ],
      mainEntity: { "@id": `${PAGE_URL}#calculator` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Maryland Closing Cost Calculator",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function MarylandCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span>Maryland Closing Cost Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">Maryland Closing Cost Calculator for Buyers and Sellers</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Estimate Maryland closing costs for buyers and sellers before settlement. Covers state and county transfer taxes, title insurance, recordation fees, lender charges, seller costs, and county-specific assumptions for Montgomery County and Prince George&apos;s County.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <ClosingCostCalculator state="MD" />
        </div>
      </section>

      <TitleQuoteEmbed />

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Closing Cost Calculator Maryland</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                This closing cost calculator Maryland page is built for buyers, sellers, agents, and lenders who need
                a Maryland-specific estimate instead of a generic national calculator. Enter the purchase price, loan
                amount, party type, county, and first-time homebuyer details to compare buyer cash-to-close and seller
                closing cost exposure.
              </p>
              <p className="max-w-[68ch]">
                The calculator is most useful before ordering a title quote, reviewing a lender estimate, or checking
                whether a contract allocates transfer taxes to the buyer, seller, or both sides.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">How Maryland Closing Costs Are Calculated</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Maryland closing costs combine lender fees, title insurance, settlement fees, recordation taxes,
                transfer taxes, recording fees, prepaid taxes and insurance, escrow deposits, and prorations.
                The calculator is a starting point for organizing those line items before a final title quote.
              </p>
              <p className="max-w-[68ch]">
                Buyer costs commonly vary by loan amount, property type, county, contract terms, and whether the
                buyer qualifies as a first-time Maryland homebuyer. Seller costs depend heavily on payoff, commission,
                contract credits, prorations, and how transfer taxes are allocated.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Maryland Recordation Tax Explained</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Recordation tax is tied to the recording of deeds, deeds of trust, mortgages, and certain other
                instruments in Maryland land records. It is separate from title insurance and settlement fees.
              </p>
              <p className="max-w-[68ch]">
                Maryland law sets the state recordation tax base at $2.50 per $500, and each county sets its own
                rate. Montgomery County uses a tiered schedule under Bill 17-23, while Prince George&apos;s County uses
                0.55%, equal to $2.75 per $500.
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-navy text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Jurisdiction</th>
                      <th className="px-4 py-3 font-semibold">Recordation Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recordationRows.map((row) => (
                      <tr key={row.county}>
                        <td className="px-4 py-3 font-semibold text-brand-navy">{row.county}</td>
                        <td className="px-4 py-3 text-brand-muted">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm font-semibold text-brand-navy max-w-[68ch] leading-relaxed">
                {taxRateNotice}
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Maryland Transfer Tax Calculator</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Maryland transfer tax calculations separate state transfer tax from county transfer tax. The standard
                Maryland state transfer tax is 0.5% of consideration. For qualifying first-time Maryland homebuyers,
                the state transfer tax rate is 0.25% and must be paid by the seller.
              </p>
              <p className="max-w-[68ch]">
                Use the Maryland transfer tax calculator controls above to compare Montgomery County and Prince
                George&apos;s County. The final allocation still depends on the contract and any negotiated tax split.
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-navy text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Jurisdiction</th>
                      <th className="px-4 py-3 font-semibold">Transfer Tax Rate</th>
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
              <p className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm font-semibold text-brand-navy max-w-[68ch] leading-relaxed">
                {taxRateNotice}
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Maryland Seller Closing Costs</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed mb-5">
              <p className="max-w-[68ch]">
                Maryland seller closing costs commonly include broker commission, mortgage payoff, seller settlement
                fee, prorated taxes, HOA or condo resale documents, lien releases, and any transfer taxes or buyer
                credits assigned to the seller by contract.
              </p>
              <p className="max-w-[68ch]">
                A seller net estimate should be reviewed with the payoff, contract, county, expected closing date, and
                any negotiated repair credits before the seller relies on the final net proceeds number.
              </p>
            </div>
            <h3 className="t-h5 text-brand-navy mb-4">Who Pays Closing Costs in Maryland: Buyer vs Seller</h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="t-h6 text-brand-navy mb-3">Buyer Closing Cost Line Items</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-brand-muted">
                  {buyerCosts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="t-h6 text-brand-navy mb-3">Seller Closing Cost Line Items</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-brand-muted">
                  {sellerCosts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
              Transfer tax allocation is often handled by the contract and local custom. A title company should review
              the signed contract before either side relies on an estimate.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Example Maryland Closing Cost Calculations</h2>
            <div className="mt-5 grid md:grid-cols-2 gap-5">
              {calculationExamples.map((example) => (
                <div key={example.title} className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="t-h6 text-brand-navy mb-3">{example.title}</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-brand-muted">
                    {example.lines.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Montgomery County Closing Costs</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Montgomery County closing cost estimates need county-specific tax handling because Bethesda, Rockville,
                Silver Spring, Gaithersburg, Germantown, and Potomac transactions can involve different property types,
                price points, lender requirements, and contract allocations.
              </p>
              <p className="max-w-[68ch]">
                Use a Montgomery County-specific quote when reviewing transfer tax, recordation charges, title insurance,
                settlement fees, and any HOA or condo documentation costs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/title-company-montgomery-county-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Montgomery County title company</Link>
                <Link href="/title-company-bethesda-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Bethesda title company</Link>
                <Link href="/title-company-rockville-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Rockville title company</Link>
                <Link href="/title-company-silver-spring-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Silver Spring title company</Link>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Prince George&apos;s County Closing Costs</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Prince George&apos;s County closing cost examples should account for the 1.4% county transfer tax,
                0.55% recordation tax, and the additional county transfer tax that applies to mortgages and deeds of
                trust. That means the loan amount can matter in addition to the purchase price.
              </p>
              <p className="max-w-[68ch]">
                Buyers and sellers in Bowie, Hyattsville, Upper Marlboro, Laurel, and College Park should use county
                inputs rather than relying on Montgomery County or statewide assumptions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/title-company-prince-georges-county-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Prince George&apos;s County title company</Link>
                <Link href="/title-company-bowie-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Bowie title company</Link>
                <Link href="/closing-costs-bowie-md" className="text-sm font-semibold text-brand-blue-deep hover:underline">Bowie closing cost calculator</Link>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Bethesda, Rockville, and Silver Spring Examples</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {cityExamples.map((item) => (
                <div key={item.city} className="rounded-lg bg-white p-5 shadow-sm">
                  <h3 className="t-h6 text-brand-navy mb-3">{item.city}</h3>
                  <p className="text-sm leading-relaxed text-brand-muted mb-4 max-w-[68ch]">{item.copy}</p>
                  <div className="space-y-2">
                    {item.links.map((link) => (
                      <Link key={link.href} href={link.href} className="block text-sm font-semibold text-brand-blue-deep hover:underline">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">First-Time Homebuyer Closing Cost Benefits in Maryland</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Qualifying first-time Maryland homebuyers receive a reduced 0.25% Maryland state transfer tax rate,
                paid by the seller. County-specific benefits or exemptions can also affect the calculation when
                both purchase price and loan amount are part of the closing cost review.
              </p>
              <p className="max-w-[68ch]">
                Eligibility can depend on the buyer, occupancy, property type, county, transaction documents, and
                timing. Pruitt Title can review the documents for the actual transaction before settlement.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Maryland Title Insurance and Settlement Fees</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Title insurance protects against covered title defects, liens, and ownership issues. Maryland buyers
                often see separate lender's title insurance and owner's title insurance line items, depending on the
                loan and contract.
              </p>
              <p className="max-w-[68ch]">
                Maryland title insurance rates are filed or regulated, and the exact premium depends on purchase price,
                loan amount, policy type, and whether simultaneous issue pricing applies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/title-insurance" className="text-sm font-semibold text-brand-blue-deep hover:underline">Learn about title insurance</Link>
                <Link href="/calculators/title-quote" className="text-sm font-semibold text-brand-blue-deep hover:underline">Get a title insurance quote</Link>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Maryland Closing Cost FAQs</h2>
            <FAQSection faqs={faqs} includeSchema={false} />
          </div>

          <div>
            <h2 className="t-h4 text-brand-navy mb-4">Related Maryland Closing Cost Resources</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-brand-blue-deep hover:border-brand-blue-deep transition-colors"
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
          <h2 className="t-h5 text-brand-navy mb-6">Maryland Markets We Serve</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MD_LOCATIONS.map((l) => (
              <Link key={l.slug} href={`/${l.slug}`} className="text-sm text-brand-blue-deep border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors">
                {l.city}, MD
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
