import type { ReactNode } from "react";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { LocationSchema } from "@/components/SchemaMarkup";
import type { BlogFAQItem } from "@/lib/blog-portable-content";
import {
  REGIONAL_TRANSPORTATION_FEE_RATE,
  vaLocalRecordationRate,
} from "@/data/closingCostData";

/**
 * Buyer- and seller-facing "title company in {town}" page.
 *
 * Built 2026-10-26 because the Vienna and Fairfax "title company" and "title
 * insurance" searches were landing on the investor title-search guides. Each page
 * passes its own local copy; only the layout and the worked cost example are shared,
 * and every rate in that example comes from closingCostData so it can't drift from
 * the calculators.
 */

// Stewart Title's published Virginia schedule (eff. 2025-07-01), before discounts.
// Same figures as title-insurance-cost-virginia-maryland.md.
const EXAMPLE_PRICE = 600_000;
const EXAMPLE_LOAN = 480_000;
const STEWART_VA_OWNERS_600K = 2472.5;
const STEWART_VA_SIMULTANEOUS_LENDERS = 200;
const VA_RECORDATION_RATE = 0.0025; // Va. Code § 58.1-801, $0.25 per $100
const VA_GRANTOR_RATE = 0.001; // Va. Code § 58.1-802, $0.50 per $500

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export interface LocalTitleCompanyContent {
  town: string;
  slug: string;
  county: string;
  schemaDescription: string;
  intro: ReactNode;
  localNotes: { heading: string; body: ReactNode }[];
  faqs: BlogFAQItem[];
  related: { href: string; label: string }[];
  /** Fairfax keeps its pre-existing calculator (verify-titlecapture-fleet freezes it). */
  calculator?: ReactNode;
}

export function LocalTitleCompanyPage({ content }: { content: LocalTitleCompanyContent }) {
  const { town, county } = content;
  const local = vaLocalRecordationRate(county);
  const rows: { item: string; amount: number; payer: string }[] = [
    { item: "Owner's title insurance, standard policy", amount: STEWART_VA_OWNERS_600K, payer: "Buyer, by custom" },
    { item: "Lender's title insurance, issued with the owner's policy", amount: STEWART_VA_SIMULTANEOUS_LENDERS, payer: "Buyer" },
    { item: "Virginia recordation tax on the deed ($0.25 per $100)", amount: EXAMPLE_PRICE * VA_RECORDATION_RATE, payer: "Buyer" },
    { item: "Virginia recordation tax on the deed of trust ($0.25 per $100)", amount: EXAMPLE_LOAN * VA_RECORDATION_RATE, payer: "Buyer" },
    { item: `${county} recordation tax on both (about $0.083 per $100)`, amount: Math.round((EXAMPLE_PRICE + EXAMPLE_LOAN) * local * 100) / 100, payer: "Buyer" },
    { item: "Virginia grantor tax ($0.50 per $500)", amount: EXAMPLE_PRICE * VA_GRANTOR_RATE, payer: "Seller" },
    { item: "Northern Virginia transportation fees ($0.20 per $100)", amount: EXAMPLE_PRICE * REGIONAL_TRANSPORTATION_FEE_RATE, payer: "Seller" },
  ];

  return (
    <>
      <LocationSchema city={town} state="VA" county={county} slug={content.slug} description={content.schemaDescription} />

      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/title-insurance" className="hover:text-white">Title Insurance</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">{town}, VA</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">Title Company in {town}, VA</h1>
          <div className="text-lg text-gray-300 max-w-2xl space-y-4">{content.intro}</div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/calculators/title-quote" className="btn-primary px-8">
              Get a Title Quote →
            </Link>
            <a href="tel:+17038591467" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors text-center">
              Call (703) 859-1467
            </a>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-4">What title and taxes cost on a {usd(EXAMPLE_PRICE)} {town} purchase</h2>
          <p className="text-brand-muted leading-relaxed mb-6 max-w-[68ch]">
            The example below assumes a {usd(EXAMPLE_PRICE)} price and a {usd(EXAMPLE_LOAN)} loan. Title premiums come from Stewart&apos;s
            published Virginia schedule, before discounts. Virginia insurers file their own rates and can negotiate them
            (<a className="text-brand-blue-deep hover:underline" href="https://law.lis.virginia.gov/vacode/title38.2/chapter46/section38.2-4608/">Va. Code § 38.2-4608</a>),
            so your quote can differ. Settlement fees and the clerk&apos;s recording charges are not included.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-brand-muted border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="text-left p-3">Item</th>
                  <th className="text-right p-3">Amount</th>
                  <th className="text-left p-3">Usually paid by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.item}>
                    <td className="p-3">{r.item}</td>
                    <td className="p-3 text-right whitespace-nowrap">{usd(r.amount)}</td>
                    <td className="p-3">{r.payer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-brand-muted leading-relaxed mt-6 max-w-[68ch]">
            Who pays what is the local custom, and the purchase contract can change it. The recordation taxes are set by
            Va. Code §§ 58.1-801 and 58.1-814, the grantor tax by § 58.1-802, and the transportation fees by §§ 58.1-802.3
            and 58.1-802.4. A refinance doesn&apos;t carry the grantor tax or the transportation fees.
          </p>
        </div>
      </section>

      {content.calculator}

      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-4">The buyer chooses the title company in Virginia</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Virginia law gives the buyer the right to pick the settlement agent, and a seller can&apos;t make a particular
              company a condition of the sale (
              <a className="text-brand-blue-deep hover:underline" href="https://law.lis.virginia.gov/vacode/title55.1/chapter10/section55.1-1006/">Va. Code § 55.1-1006</a>
              ). On a financed purchase, federal law also bars a seller from requiring a particular title insurer
              (RESPA section 9). To close with Pruitt Title, name Pruitt Title as the settlement agent when you sign the
              contract and tell your lender the same day.
            </p>
            <p className="max-w-[68ch]">
              <Link href="/blog/who-chooses-the-title-company-in-virginia" className="text-brand-blue-deep hover:underline">
                Read more about who chooses the title company in Virginia →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-6">How a {town} closing works with Pruitt Title</h2>
          <ol className="space-y-5 text-brand-muted leading-relaxed list-decimal pl-5">
            <li className="max-w-[68ch]">
              <strong className="text-brand-navy">Send Will the ratified contract.</strong> Pruitt Title opens the file,
              orders the title search and contacts your lender for its closing instructions.
            </li>
            <li className="max-w-[68ch]">
              <strong className="text-brand-navy">Review the title commitment.</strong> It lists what has to be paid off
              or cleared before closing and what the policy won&apos;t cover.{" "}
              <Link href="/blog/how-to-read-a-title-commitment" className="text-brand-blue-deep hover:underline">How to read one</Link>.
            </li>
            <li className="max-w-[68ch]">
              <strong className="text-brand-navy">Confirm wiring instructions by phone.</strong> Call Pruitt Title at a
              number you already know before you send closing funds. Emailed changes to wiring instructions are a common fraud.
            </li>
            <li className="max-w-[68ch]">
              <strong className="text-brand-navy">Sign and record.</strong> After signing, Pruitt Title pays off the
              existing loans, records the deed with the Fairfax Circuit Court Clerk and issues the title policies.
            </li>
          </ol>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-3xl space-y-8">
          {content.localNotes.map((note) => (
            <div key={note.heading}>
              <h2 className="t-h4 text-brand-navy mb-3">{note.heading}</h2>
              <div className="text-brand-muted leading-relaxed max-w-[68ch] space-y-4">{note.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={content.faqs} />
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Related guides</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {content.related.map((r) => (
              <Link key={r.href} href={r.href} className="text-brand-blue-deep hover:underline">
                {r.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get a {town} title quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Send Will the property details for a quote or a title question. Sending a request doesn&apos;t open an order;
            Will confirms next steps with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculators/title-quote" className="btn-primary px-8">
              Get a Quote →
            </Link>
            <a href="tel:+17038591467" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Call (703) 859-1467
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
