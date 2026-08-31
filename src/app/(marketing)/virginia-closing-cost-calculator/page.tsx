import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorSchema } from "@/components/SchemaMarkup";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { TIER1_LOCATIONS, TIER2_LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Virginia Closing Cost Calculator | DMV Title Guy",
  description:
    "Free Virginia closing cost calculator for buyers and sellers. Estimate title insurance, transfer taxes, recordation fees, and all closing costs for VA real estate transactions.",
  alternates: { canonical: "/virginia-closing-cost-calculator" },
};

const VA_LOCATIONS = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS].filter((l) => l.state === "VA");

export default function VirginiaCalculatorPage() {
  return (
    <>
      <CalculatorSchema state="Virginia" slug="virginia-closing-cost-calculator" />

      {/* ── HERO ── */}
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span>Virginia Closing Cost Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">
            Virginia Closing Cost Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Estimate buyer and seller closing costs for Virginia real estate transactions. Includes title insurance, grantor tax, recordation fees, and more.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed />

      {/* ── EXPLAINER ── */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Understanding Virginia Closing Costs</h2>
          <div className="space-y-5 text-brand-muted text-sm leading-relaxed">
            <p className="max-w-[68ch]">
              Virginia closing costs typically range from <strong className="text-brand-dark-text">2% to 5%</strong> of the purchase price for buyers, and <strong className="text-brand-dark-text">1% to 3%</strong> for sellers (excluding agent commissions).
            </p>
            <h3 className="text-brand-navy font-bold text-base mt-4">Virginia-Specific Fees</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Grantor Tax (Seller):</strong> $0.50 per $500 of the sales price, paid by the seller.</li>
              <li><strong>State Recordation Tax:</strong> $0.25 per $100 of the sales price (buyers typically pay).</li>
              <li>
                <strong>Northern Virginia Regional Fees (Seller):</strong> $0.20 per $100 in total —
                the regional WMATA capital fee (Va. Code § 58.1-802.3) and the regional congestion
                relief fee (§ 58.1-802.4), $0.10 per $100 each. Both fall on the grantor by default
                and apply in Arlington, Fairfax, Loudoun and Prince William counties and the cities
                of Alexandria, Fairfax, Falls Church, Manassas and Manassas Park. Neither is owed on
                a refinance — they attach to a conveyance, not to a deed of trust.
              </li>
              <li>
                <strong>Local Recordation Add-On (Buyer):</strong> under § 58.1-814 a locality that
                adopts an ordinance may add one-third of the state rate, $0.0833 per $100. Confirm
                with the Circuit Court Clerk whether one is in force where you are buying.
              </li>
              <li><strong>Deed of Trust Recording:</strong> Based on loan amount, varies by county.</li>
            </ul>
            <h3 className="text-brand-navy font-bold text-base mt-4">Title Insurance in Virginia</h3>
            <p className="max-w-[68ch]">
              Virginia is a "simultaneous issue" state, meaning lender&apos;s and owner&apos;s title insurance can be issued together at a discounted rate. Pruitt Title LLC has been providing trusted title services across the DMV since 2007.
            </p>
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
