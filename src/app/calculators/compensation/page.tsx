import type { Metadata } from "next";
import Link from "next/link";
import { CompensationCalculator } from "@/components/calculators/CompensationCalculator";

export const metadata: Metadata = {
  title: "Agent Compensation Calculator | DMV Title Guy",
  description:
    "Calculate real estate agent take-home pay after commission splits, broker fees, and referral deductions. Free compensation calculator for DMV agents.",
  alternates: { canonical: "/calculators/compensation" },
};

export default function CompensationPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Compensation Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Agent Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Agent Compensation Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Know exactly what you'll net from any transaction. Enter the sale price, commission rate, your broker split, and any referral fees to see your real take-home.
          </p>
        </div>
      </section>
      <section className="section-light">
        <div className="container-xl">
          <CompensationCalculator />
        </div>
      </section>
    </>
  );
}
