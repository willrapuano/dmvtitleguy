import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { TIER1_LOCATIONS, TIER2_LOCATIONS } from "@/data/locations";
import { REGIONAL_TRANSPORTATION_FEE_RATE } from "@/data/closingCostData";
import { SITE_NAME, willPersonReference } from "@/lib/brand-identity";

export const metadata: Metadata = {
  title: "Virginia Closing Cost Calculator (2026) | Buyer & Seller",
  description:
    "Free Virginia closing cost calculator. Estimate recordation and grantor tax, Northern Virginia fees, title insurance and settlement costs, with worked examples.",
  alternates: { canonical: "https://dmvtitleguy.io/virginia-closing-cost-calculator" },
};

const VA_LOCATIONS = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS].filter((l) => l.state === "VA");
const SITE_URL = "https://dmvtitleguy.io";
const PAGE_SLUG = "virginia-closing-cost-calculator";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

// Va. Code § 58.1-801 (deed) and § 58.1-803 (purchase deed of trust): $0.25 per $100.
const STATE_RECORDATION_RATE = 0.0025;
// Va. Code § 58.1-802: grantor's tax, $0.50 per $500.
const GRANTOR_TAX_RATE = 0.001;

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface Example {
  title: string;
  locality: string;
  price: number;
  loan: number;
  localRecordation: boolean;
  northernVirginia: boolean;
}

const examples: Example[] = [
  { title: "$650,000 Fairfax County purchase, 20% down", locality: "Fairfax County", price: 650_000, loan: 520_000, localRecordation: true, northernVirginia: true },
  { title: "$450,000 Prince William County purchase, 10% down", locality: "Prince William County", price: 450_000, loan: 405_000, localRecordation: true, northernVirginia: true },
  { title: "$500,000 Fredericksburg purchase, 20% down", locality: "City of Fredericksburg", price: 500_000, loan: 400_000, localRecordation: true, northernVirginia: false },
];

function computeExample(e: Example) {
  const stateDeed = e.price * STATE_RECORDATION_RATE;
  const stateLoan = e.loan * STATE_RECORDATION_RATE;
  // §§ 58.1-814 and 58.1-3800: the local tax is one-third of the state tax on each instrument.
  const local = e.localRecordation ? (stateDeed + stateLoan) / 3 : 0;
  const grantor = e.price * GRANTOR_TAX_RATE;
  const regional = e.northernVirginia ? e.price * REGIONAL_TRANSPORTATION_FEE_RATE : 0;
  return { stateDeed, stateLoan, local, buyerTotal: stateDeed + stateLoan + local, grantor, regional, sellerTotal: grantor + regional };
}

const taxRows = [
  { item: "State recordation tax on the deed", rate: "$0.25 per $100 of the price", payer: "Buyer", source: "Va. Code § 58.1-801" },
  { item: "State recordation tax on the purchase deed of trust", rate: "$0.25 per $100 of the loan", payer: "Buyer", source: "Va. Code § 58.1-803" },
  { item: "Local recordation tax", rate: "One-third of the state tax (about $0.083 per $100), on the deed and the deed of trust", payer: "Buyer", source: "Va. Code §§ 58.1-814, 58.1-3800" },
  { item: "Grantor's tax", rate: "$0.50 per $500 of the price ($0.10 per $100)", payer: "Seller", source: "Va. Code § 58.1-802" },
  { item: "Northern Virginia WMATA capital fee", rate: "$0.10 per $100 of the price", payer: "Seller", source: "Va. Code § 58.1-802.3" },
  { item: "Northern Virginia congestion relief fee", rate: "$0.10 per $100 of the price", payer: "Seller", source: "Va. Code § 58.1-802.4" },
];

const localities = [
  { name: "Fairfax County", local: "Yes", regional: "Yes" },
  { name: "Arlington County", local: "Yes", regional: "Yes" },
  { name: "Loudoun County", local: "Yes", regional: "Yes" },
  { name: "Prince William County", local: "Yes", regional: "Yes" },
  { name: "City of Alexandria", local: "Yes", regional: "Yes" },
  { name: "Cities of Fairfax, Falls Church, Manassas and Manassas Park", local: "Confirm with the clerk", regional: "Yes" },
  { name: "City of Fredericksburg", local: "Yes", regional: "No" },
];

const buyerCosts = [
  "State and local recordation tax on the deed and the purchase deed of trust",
  "Clerk's recording fees",
  "Lender's title insurance policy",
  "Owner's title insurance policy, if purchased",
  "Settlement or closing fee and title search",
  "Lender origination, appraisal and credit report fees",
  "Prepaid interest, homeowner's insurance, taxes and escrow deposits",
];

const sellerCosts = [
  "Grantor's tax",
  "Northern Virginia regional fees (in the nine Northern Virginia localities)",
  "Broker commission",
  "Mortgage payoff and lien releases",
  "Deed preparation and seller settlement charges",
  "Prorated real estate taxes and HOA dues",
  "HOA or condo resale disclosure packet",
];

const relatedResources = [
  { href: "/blog/closing-costs-virginia", label: "Virginia closing costs guide" },
  { href: "/closing-costs/seller-virginia", label: "Seller closing costs in Virginia" },
  { href: "/blog/title-insurance-cost-virginia", label: "Title insurance cost in Virginia" },
  { href: "/blog/who-chooses-the-title-company-in-virginia", label: "Who chooses the title company in Virginia" },
  { href: "/blog/virginia-real-estate-contract", label: "The Virginia real estate contract" },
  { href: "/closing-costs-fairfax-va", label: "Fairfax closing cost calculator" },
  { href: "/closing-costs-alexandria-va", label: "Alexandria closing cost calculator" },
  { href: "/closing-costs-ashburn-va", label: "Ashburn closing cost calculator" },
  { href: "/calculators/seller-net-sheet", label: "Seller net sheet calculator" },
  { href: "/calculators/title-quote", label: "Get a title insurance quote" },
];

const fairfax = computeExample(examples[0]);

const faqs = [
  {
    question: "How much are closing costs in Virginia?",
    answer:
      "It depends on the price, the loan, the locality and the lender. Recordation taxes are a predictable part: on a $650,000 Fairfax County purchase with a $520,000 loan, the buyer's state and local recordation tax comes to " +
      `${usd(fairfax.buyerTotal)}, and the seller's grantor tax and Northern Virginia fees come to ${usd(fairfax.sellerTotal)}. ` +
      "Title insurance, settlement fees, lender charges and prepaid items come on top. Use the quote tool above for your transaction.",
  },
  {
    question: "Who pays recordation tax in Virginia?",
    answer:
      "By custom the buyer pays the recordation tax on the deed and on the purchase deed of trust, and the seller pays the grantor's tax. The purchase contract can divide them differently.",
  },
  {
    question: "What is the Virginia grantor's tax?",
    answer:
      "The grantor's tax is $0.50 per $500 of the sale price, or 0.1%, paid by the seller under Va. Code § 58.1-802. On a $500,000 sale it is $500.",
  },
  {
    question: "What are the Northern Virginia regional fees?",
    answer:
      "Sellers in Arlington, Fairfax, Loudoun and Prince William counties and the cities of Alexandria, Fairfax, Falls Church, Manassas and Manassas Park pay two regional fees of $0.10 per $100 each: the WMATA capital fee (§ 58.1-802.3) and the congestion relief fee (§ 58.1-802.4). Together they are $0.20 per $100, or $1,000 on a $500,000 sale. Refinances do not pay them.",
  },
  {
    question: "Does Fairfax County charge a local recordation tax?",
    answer:
      "Yes. Fairfax County adds a local recordation tax equal to one-third of the state tax, about $0.083 per $100, on both the deed and the purchase deed of trust. Arlington, Loudoun, Prince William and Alexandria do the same.",
  },
  {
    question: "Do first-time homebuyers get a closing tax break in Virginia?",
    answer:
      "Virginia has no first-time buyer exemption from recordation tax or grantor's tax, so the buyer's recordation tax is the same. Virginia's first-time homebuyer savings account (Va. Code § 58.1-322.02) is a state income tax benefit for saving toward the purchase, not a closing tax reduction.",
  },
  {
    question: "Who pays for title insurance in Virginia?",
    answer:
      "The buyer customarily pays for both the lender's policy and the optional owner's policy, though the contract can change that. Each insurer files its own rates, and Virginia title premiums can be negotiated (Va. Code § 38.2-4608(E)).",
  },
  {
    question: "Are recordation taxes owed if I pay cash?",
    answer:
      "A cash buyer still pays recordation tax on the deed, but there is no deed of trust, so there is no recordation tax on a loan. The seller's grantor's tax and any Northern Virginia fees are unchanged.",
  },
  {
    question: "Is this Virginia closing cost calculator exact?",
    answer:
      "The quote comes from Pruitt Title's TitleCapture tool using the details you enter. It is an estimate until Pruitt Title reviews the signed contract, the lender's figures, payoffs and the closing date.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}#calculator`,
      name: "Virginia Closing Cost Calculator",
      url: PAGE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      description:
        "Embedded TitleCapture quote tool for Virginia buyers and sellers to estimate title insurance, settlement charges, recordation and grantor taxes.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: willPersonReference(),
      publisher: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME },
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Virginia Closing Cost Calculator | Buyer & Seller Costs in VA",
      description: metadata.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: [
        { "@type": "Thing", name: "Virginia closing costs" },
        { "@type": "Thing", name: "Virginia recordation tax" },
        { "@type": "Thing", name: "Virginia grantor's tax" },
        { "@type": "Thing", name: "Virginia title insurance" },
      ],
      mainEntity: { "@id": `${PAGE_URL}#calculator` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Virginia Closing Cost Calculator", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

const th = "px-4 py-3 font-semibold";
const td = "px-4 py-3 text-brand-muted";

export default function VirginiaCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      {/* ── HERO ── */}
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>Virginia Closing Cost Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">Virginia Closing Cost Calculator for Buyers &amp; Sellers</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Get a Virginia title and settlement estimate from Pruitt Title&apos;s live quote tool, then check the
            recordation tax, grantor&apos;s tax and Northern Virginia fees with the worked examples below.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed
        title="Get Your Virginia Quote Through TitleCapture"
        subtitle="Use the live Pruitt Title quote tool for title insurance, settlement charges and Virginia closing taxes. Final figures are confirmed after the contract and transaction details are reviewed."
      />

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">How Virginia Closing Costs Are Calculated</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                Virginia closing costs combine taxes set by statute, title insurance, settlement fees, lender charges and
                prepaid items. The taxes are the most predictable part: they follow fixed rates on the price and the
                loan, and they differ by locality only in two ways, the local recordation tax and the Northern Virginia
                regional fees.
              </p>
              <p className="max-w-[68ch]">
                By custom the buyer pays the recordation tax, and the seller pays the grantor&apos;s tax and, in
                Northern Virginia, two regional fees. The contract can divide these differently, so the signed
                contract controls.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Virginia Closing Taxes and Fees</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-navy text-white">
                  <tr>
                    <th className={th}>Tax or fee</th>
                    <th className={th}>Rate</th>
                    <th className={th}>Customarily paid by</th>
                    <th className={th}>Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {taxRows.map((row) => (
                    <tr key={row.item}>
                      <td className="px-4 py-3 font-semibold text-brand-navy">{row.item}</td>
                      <td className={td}>{row.rate}</td>
                      <td className={td}>{row.payer}</td>
                      <td className={td}>{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
              The clerk of the circuit court also charges flat recording fees for each document. Refinances pay
              recordation tax on the new deed of trust but no grantor&apos;s tax or regional fees, because those
              attach to a sale.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Local Recordation Tax and Northern Virginia Fees by Locality</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-navy text-white">
                  <tr>
                    <th className={th}>Locality</th>
                    <th className={th}>Local recordation tax (buyer)</th>
                    <th className={th}>Regional fees (seller)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {localities.map((row) => (
                    <tr key={row.name}>
                      <td className="px-4 py-3 font-semibold text-brand-navy">{row.name}</td>
                      <td className={td}>{row.local}</td>
                      <td className={td}>{row.regional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm font-semibold text-brand-navy max-w-[68ch] leading-relaxed">
              Local recordation tax confirmed from each locality&apos;s official fee schedule, budget or code as of
              September 2026. Elsewhere in Virginia, a locality adds the local tax only if it has adopted one, so
              confirm with the circuit court clerk.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Worked Examples of Virginia Closing Taxes</h2>
            <p className="mb-5 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
              These show the closing taxes only, using the statutory rates above. Title insurance, settlement fees,
              lender charges and prepaid items are added on top.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {examples.map((e) => {
                const r = computeExample(e);
                return (
                  <div key={e.title} className="rounded-lg bg-white p-5 shadow-sm">
                    <h3 className="t-h6 text-brand-navy mb-3">{e.title}</h3>
                    <p className="text-xs uppercase tracking-wide font-semibold text-brand-navy mb-1">Buyer</p>
                    <ul className="space-y-1 text-sm text-brand-muted mb-3">
                      <li>State tax on deed: {usd(r.stateDeed)}</li>
                      <li>State tax on loan: {usd(r.stateLoan)}</li>
                      <li>Local recordation tax: {usd(r.local)}</li>
                      <li className="font-semibold text-brand-navy">Buyer total: {usd(r.buyerTotal)}</li>
                    </ul>
                    <p className="text-xs uppercase tracking-wide font-semibold text-brand-navy mb-1">Seller</p>
                    <ul className="space-y-1 text-sm text-brand-muted">
                      <li>Grantor&apos;s tax: {usd(r.grantor)}</li>
                      <li>Regional fees: {e.northernVirginia ? usd(r.regional) : "None outside Northern Virginia"}</li>
                      <li className="font-semibold text-brand-navy">Seller total: {usd(r.sellerTotal)}</li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Who Pays Closing Costs in Virginia</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="t-h6 text-brand-navy mb-3">Buyer closing costs</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-brand-muted">
                  {buyerCosts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h3 className="t-h6 text-brand-navy mb-3">Seller closing costs</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-brand-muted">
                  {sellerCosts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
              Sellers can estimate their proceeds with the{" "}
              <Link href="/calculators/seller-net-sheet" className="font-semibold text-brand-blue-deep hover:underline">seller net sheet calculator</Link>.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Title Insurance in Virginia</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p className="max-w-[68ch]">
                A lender&apos;s policy is required on a financed purchase; the owner&apos;s policy is optional and protects
                the buyer&apos;s ownership. Buying both at the same closing is usually cheaper than buying them
                separately. Each insurer files its own Virginia rates, and premiums can be negotiated.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/blog/title-insurance-cost-virginia" className="text-sm font-semibold text-brand-blue-deep hover:underline">Virginia title insurance cost</Link>
                <Link href="/title-insurance" className="text-sm font-semibold text-brand-blue-deep hover:underline">How title insurance works</Link>
                <Link href="/calculators/title-quote" className="text-sm font-semibold text-brand-blue-deep hover:underline">Get a title insurance quote</Link>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Virginia Closing Cost FAQs</h2>
            <FAQSection faqs={faqs} includeSchema={false} />
          </div>

          <div>
            <h2 className="t-h4 text-brand-navy mb-4">Related Virginia Closing Cost Resources</h2>
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

      {/* ── LOCATION LINKS ── */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Virginia Market Guides</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {VA_LOCATIONS.map((l) => (
              <Link
                key={l.slug}
                href={`/${l.slug}`}
                className="text-sm text-brand-blue-deep hover:underline border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors"
              >
                {l.city}, VA →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
