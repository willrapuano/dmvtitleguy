import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { CalculatorSchema } from "@/components/SchemaMarkup";
import { TIER1_LOCATIONS, TIER2_LOCATIONS } from "@/data/locations";

export const metadata: Metadata = {
  title: "Maryland Closing Cost Calculator | DMV Title Guy",
  description:
    "Free Maryland closing cost calculator for buyers and sellers. Estimate title insurance, state and county transfer taxes, recordation fees, and all closing costs for MD real estate.",
  alternates: { canonical: "/maryland-closing-cost-calculator" },
};

const MD_LOCATIONS = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS].filter((l) => l.state === "MD");

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Maryland Closing Cost Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Estimate closing costs for Maryland real estate transactions. Covers state &amp; county transfer taxes, title insurance, recordation fees, and more.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <ClosingCostCalculator state="MD" />
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Understanding Maryland Closing Costs</h2>
          <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
            <p>Maryland closing costs are among the highest in the region due to the combination of state and county transfer taxes. Buyers typically pay <strong className="text-brand-dark-text">3% to 5%</strong> of the purchase price; sellers pay <strong className="text-brand-dark-text">1% to 3%</strong>.</p>
            <h3 className="text-brand-navy font-bold text-base">Maryland Transfer Taxes</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>State Transfer Tax:</strong> 0.5% (1.0% if buyer will not use as primary residence)</li>
              <li><strong>Montgomery County:</strong> 1.0% county transfer tax</li>
              <li><strong>Prince George&apos;s County:</strong> 1.4% county transfer tax</li>
              <li><strong>State Recordation Tax:</strong> $6.60 per $1,000 (Montgomery) or varies by county</li>
            </ul>
            <p>Maryland also has a property tax disclosure and first-time homebuyer exemption on transfer taxes in many counties.</p>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Maryland Markets We Serve</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MD_LOCATIONS.map((l) => (
              <Link key={l.slug} href={`/${l.slug}`} className="text-sm text-brand-blue border border-brand-gray-bg rounded px-3 py-2 bg-brand-gray-bg hover:border-brand-blue transition-colors">
                {l.city}, MD →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
