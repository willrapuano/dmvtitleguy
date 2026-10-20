import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { SITE_NAME, willPersonReference } from "@/lib/brand-identity";

export const metadata: Metadata = {
  title: "DC Closing Cost & Transfer Tax Calculator (2026)",
  description:
    "Free Washington DC closing cost and transfer tax calculator. DC recordation and transfer tax at 1.1% or 1.45%, the 0.725% first-time buyer rate, and worked examples.",
  alternates: { canonical: "https://dmvtitleguy.io/dc-closing-cost-calculator" },
};

const SITE_URL = "https://dmvtitleguy.io";
const PAGE_SLUG = "dc-closing-cost-calculator";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

// D.C. Code § 42-1103 (recordation) and § 47-903 (transfer): 1.1% below $400,000 and
// 1.45% at $400,000 or more, each on the full price. § 42-1103(e): qualifying
// first-time homebuyers pay a reduced 0.725% recordation rate.
const RATE_THRESHOLD = 400_000;
const LOWER_RATE = 0.011;
const UPPER_RATE = 0.0145;
const FIRST_TIME_RECORDATION_RATE = 0.00725;

const dcRate = (price: number) => (price >= RATE_THRESHOLD ? UPPER_RATE : LOWER_RATE);

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });

const examples = [
  { title: "$350,000 DC condo", price: 350_000, firstTime: false },
  { title: "$700,000 DC rowhouse", price: 700_000, firstTime: false },
  { title: "$500,000 purchase by a qualifying first-time DC buyer", price: 500_000, firstTime: true },
];

function dcTaxes(price: number, firstTime: boolean) {
  const recordation = price * (firstTime ? FIRST_TIME_RECORDATION_RATE : dcRate(price));
  const transfer = price * dcRate(price);
  return { recordation, transfer, total: recordation + transfer };
}

const buyerCosts = [
  "DC recordation tax (customarily the buyer's)",
  "Lender's title insurance policy",
  "Owner's title insurance policy, if purchased",
  "Settlement fee, title search and recording charges",
  "Lender origination, appraisal and credit report fees",
  "Prepaid interest, homeowner's insurance, taxes and escrow deposits",
];

const sellerCosts = [
  "DC transfer tax (owed by the seller)",
  "Broker commission",
  "Mortgage payoff and lien releases",
  "Deed preparation by a DC-licensed attorney",
  "Prorated real property taxes and condo or HOA dues",
  "Condo resale package or HOA documents",
];

const relatedResources = [
  { href: "/closing-costs/dc", label: "DC closing costs guide" },
  { href: "/closing-costs/dc-who-pays", label: "Who pays closing costs in DC" },
  { href: "/blog/dc-first-time-homebuyer-tax-exemption", label: "DC first-time homebuyer recordation rate" },
  { href: "/blog/title-insurance-cost-dc", label: "Title insurance cost in DC" },
  { href: "/blog/washington-dc-real-estate-attorneys", label: "DC real estate attorneys and closings" },
  { href: "/title-company-washington-dc", label: "DC title and settlement services" },
  { href: "/calculators/seller-net-sheet", label: "Seller net sheet calculator" },
  { href: "/calculators/title-quote", label: "Get a title insurance quote" },
  { href: "/maryland-closing-cost-calculator", label: "Maryland closing cost calculator" },
  { href: "/virginia-closing-cost-calculator", label: "Virginia closing cost calculator" },
];

const faqs = [
  {
    question: "How much are closing taxes in DC?",
    answer:
      "DC charges a recordation tax and a transfer tax, each 1.1% of the price below $400,000 and 1.45% at $400,000 or more (D.C. Code §§ 42-1103 and 47-903). On a $700,000 sale that is $10,150 each, or $20,300 together. Title insurance, settlement fees and lender charges come on top.",
  },
  {
    question: "Who pays the recordation and transfer tax in DC?",
    answer:
      "The seller owes the transfer tax, and the buyer customarily pays the recordation tax. The purchase contract can shift either one.",
  },
  {
    question: "What is the DC first-time homebuyer recordation rate?",
    answer:
      "Qualifying first-time DC homebuyers pay a reduced recordation tax rate of 0.725% instead of 1.1% or 1.45% (D.C. Code § 42-1103(e)). It is a reduced rate, not a full exemption. On a $500,000 purchase it saves $3,625.",
  },
  {
    question: "Does the 1.45% rate apply to the whole price?",
    answer:
      "Yes. The rate is set by the price: below $400,000 the whole price is taxed at 1.1%, and at $400,000 or more the whole price is taxed at 1.45%. It is not charged in brackets.",
  },
  {
    question: "Do I need an attorney to close on a house in DC?",
    answer:
      "A notary or a title company's settlement agent can conduct the closing. Preparing the deed and other documents that affect title is the practice of law in DC (D.C. Court of Appeals Rule 49), so DC title companies work with a DC-licensed attorney for that part.",
  },
  {
    question: "Who pays for title insurance in DC?",
    answer:
      "The buyer customarily pays for both the owner's and lender's title insurance policies, though the contract can change that. Each insurer files its own rates.",
  },
  {
    question: "Is this DC closing cost calculator exact?",
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
      name: "Washington DC Closing Cost Calculator",
      url: PAGE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      description:
        "Embedded TitleCapture quote tool for DC buyers and sellers to estimate title insurance, settlement charges, recordation and transfer tax.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: willPersonReference(),
      publisher: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME },
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "DC Closing Cost Calculator | Recordation & Transfer Tax",
      description: metadata.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: [
        { "@type": "Thing", name: "Washington DC closing costs" },
        { "@type": "Thing", name: "DC recordation tax" },
        { "@type": "Thing", name: "DC transfer tax" },
      ],
      mainEntity: { "@id": `${PAGE_URL}#calculator` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "DC Closing Cost Calculator", item: PAGE_URL },
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

export default function DCCalculatorPage() {
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
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>DC Closing Cost Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">Washington DC Closing Cost Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Get a DC title and settlement estimate from Pruitt Title&apos;s live quote tool, then check the recordation
            and transfer tax with the worked examples below.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed
        title="Get Your DC Quote Through TitleCapture"
        subtitle="Use the live Pruitt Title quote tool for title insurance, settlement charges and DC closing taxes. Final figures are confirmed after the contract and transaction details are reviewed."
      />

      <section className="section-gray">
        <div className="container-xl max-w-4xl">
          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">DC Recordation and Transfer Tax Rates</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-navy text-white">
                  <tr>
                    <th className={th}>Tax</th>
                    <th className={th}>Below $400,000</th>
                    <th className={th}>$400,000 or more</th>
                    <th className={th}>Paid by</th>
                    <th className={th}>Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-brand-navy">Recordation tax</td>
                    <td className={td}>1.1%</td>
                    <td className={td}>1.45%</td>
                    <td className={td}>Buyer, by custom</td>
                    <td className={td}>D.C. Code § 42-1103</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-brand-navy">Transfer tax</td>
                    <td className={td}>1.1%</td>
                    <td className={td}>1.45%</td>
                    <td className={td}>Seller</td>
                    <td className={td}>D.C. Code § 47-903</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-brand-navy">First-time buyer recordation rate</td>
                    <td className={td} colSpan={2}>0.725%, for qualifying first-time DC homebuyers</td>
                    <td className={td}>Buyer</td>
                    <td className={td}>D.C. Code § 42-1103(e)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
              DC has no county layer, so these District rates are the whole closing tax. Each rate applies to the
              full price, not in brackets: a $399,000 sale is taxed at 1.1% and a $400,000 sale at 1.45%. Deeds are
              recorded by the DC Recorder of Deeds.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Worked Examples of DC Closing Taxes</h2>
            <p className="mb-5 text-sm leading-relaxed text-brand-muted max-w-[68ch]">
              Recordation and transfer tax only. Title insurance, settlement fees, lender charges and prepaid items
              come on top.
            </p>
            <div className="grid md:grid-cols-3 gap-5">
              {examples.map((e) => {
                const t = dcTaxes(e.price, e.firstTime);
                return (
                  <div key={e.title} className="rounded-lg bg-white p-5 shadow-sm">
                    <h3 className="t-h6 text-brand-navy mb-3">{e.title}</h3>
                    <ul className="space-y-1 text-sm text-brand-muted">
                      <li>Buyer&apos;s recordation tax: {usd(t.recordation)}</li>
                      <li>Seller&apos;s transfer tax: {usd(t.transfer)}</li>
                      <li className="font-semibold text-brand-navy">Total: {usd(t.total)}</li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="t-h4 text-brand-navy mb-4">Who Pays Closing Costs in DC</h2>
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
            <h2 className="t-h4 text-brand-navy mb-4">DC Closing Cost FAQs</h2>
            <FAQSection faqs={faqs} includeSchema={false} />
          </div>

          <div>
            <h2 className="t-h4 text-brand-navy mb-4">Related DC Closing Cost Resources</h2>
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
    </>
  );
}
