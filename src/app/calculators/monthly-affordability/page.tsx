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
        <div className="container-xl">
          <iframe
            src="https://palmagent.com/app/calculators/MonthlyAffordability"
            width="100%"
            style={{ border: "none", minHeight: "800px" }}
            title="Monthly Affordability Calculator — Pruitt Title LLC"
            allow="clipboard-write"
          />
        </div>
      </section>
    </>
  );
}
