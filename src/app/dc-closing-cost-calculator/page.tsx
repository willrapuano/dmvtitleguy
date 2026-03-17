import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { CalculatorSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Washington DC Closing Cost Calculator | DMV Title Guy",
  description:
    "Free DC closing cost calculator for buyers and sellers. Estimate DC recordation tax, transfer tax, title insurance, and total closing costs for Washington DC real estate.",
  alternates: { canonical: "/dc-closing-cost-calculator" },
};

export default function DCCalculatorPage() {
  return (
    <>
      <CalculatorSchema state="Washington DC" slug="dc-closing-cost-calculator" />

      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span>DC Closing Cost Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Washington DC Closing Cost Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Estimate closing costs for DC real estate. Includes recordation tax, transfer tax, title insurance, and buyer &amp; seller fee breakdowns.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <ClosingCostCalculator state="DC" />
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Understanding DC Closing Costs</h2>
          <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
            <p>Washington DC has some of the highest closing costs in the nation. Combined recordation and transfer taxes can reach <strong className="text-brand-dark-text">2.9%</strong> of the sales price for properties over $400,000 — typically split equally between buyer and seller.</p>
            <h3 className="text-brand-navy font-bold text-base">DC Tax Rates</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Properties ≤ $400,000:</strong> 1.1% recordation + 1.1% transfer = 2.2% combined</li>
              <li><strong>Properties &gt; $400,000:</strong> 1.45% recordation + 1.45% transfer = 2.9% combined</li>
              <li>Typically split 50/50 between buyer and seller by contract</li>
              <li>First-time DC homebuyer exemptions available on recordation tax</li>
            </ul>
            <p>DC title insurance rates are set by the DC Insurance Commissioner. Pruitt Title LLC provides owner&apos;s and lender&apos;s coverage for all transaction types.</p>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-brand-navy mb-3">Need Help with Your DC Closing?</h2>
            <p className="text-brand-muted mb-5 text-sm">Contact Will Rapuano at Pruitt Title LLC for a precise quote on your DC transaction.</p>
            <div className="flex justify-center gap-4">
              <Link href="/calculators/title-quote" className="btn-primary">Get a Quote</Link>
              <Link href="/title-company-washington-dc" className="btn-outline">DC Title Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
