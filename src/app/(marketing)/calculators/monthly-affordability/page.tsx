import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Monthly Affordability Calculator | DMV Title Guy",
  description:
    "Find out how much home you can afford in DC, Maryland, and Virginia based on your income, debts, and down payment. Free monthly affordability analysis from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/monthly-affordability" },
};

export default function MonthlyAffordabilityPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Monthly Affordability</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Monthly Affordability Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Enter your income, monthly debts, and down payment to see exactly what price range you can comfortably afford — a must-have first step for any DMV homebuyer.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold text-brand-navy mb-3">Launch the Monthly Affordability Tool</h2>
            <p className="text-brand-muted mb-6">
              Use the live PalmAgent calculator to estimate your home buying budget based on income, debts, down payment, taxes, and insurance.
            </p>
            <a
              href="https://palmagent.com/app/calculators/MonthlyAffordability"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8"
            >
              Open Monthly Affordability Calculator →
            </a>
          </div>

          <div className="prose max-w-none text-brand-muted">
            <h2 className="text-brand-navy">How to Use This Affordability Calculator</h2>
            <p>
              This calculator helps buyers in Washington DC, Maryland, and Virginia estimate a comfortable monthly payment and price range before shopping for homes. Start with your gross monthly income, add your expected down payment, and include recurring debt payments to see a practical affordability range.
            </p>
            <p>
              For the most accurate results, use realistic assumptions for HOA dues, property taxes, homeowners insurance, and current mortgage rates. If you are comparing multiple loan options, run the numbers more than once so you can see how small changes in interest rate and down payment affect your purchasing power.
            </p>

            <h3 className="text-brand-navy">Frequently Asked Questions</h3>
            <p><strong>Does this include taxes and insurance?</strong><br />Yes — you can input taxes and insurance to get a more realistic monthly payment estimate.</p>
            <p><strong>Is this a mortgage pre-approval?</strong><br />No. This is a planning tool. Final approval depends on lender underwriting and documentation.</p>
            <p><strong>Should I use gross or net income?</strong><br />Use gross monthly income first, then stress-test your budget to ensure the payment still feels comfortable.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/calculators/title-quote" className="btn-primary">Get a Title Quote</Link>
            <Link href="/virginia-closing-cost-calculator" className="btn-outline">VA Closing Cost Calculator</Link>
            <Link href="/maryland-closing-cost-calculator" className="btn-outline">MD Closing Cost Calculator</Link>
            <Link href="/dc-closing-cost-calculator" className="btn-outline">DC Closing Cost Calculator</Link>
          </div>
        </div>
      </section>
    </>
  );
}
