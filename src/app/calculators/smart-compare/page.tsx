import type { Metadata } from "next";
import Link from "next/link";
import { SmartCompareCalculator } from "@/components/calculators/SmartCompareCalculator";

export const metadata: Metadata = {
  title: "Smart Compare Calculator | DMV Title Guy",
  description:
    "Compare two properties or loan scenarios side by side — monthly payments, down payment, taxes, HOA, and total cost. Free property comparison tool for DMV buyers.",
  alternates: { canonical: "/calculators/smart-compare" },
};

export default function SmartComparePage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Smart Compare</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Buyer Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Smart Compare Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Deciding between two properties or loan options? Put them side by side and see the real monthly cost difference — including P&I, taxes, insurance, and HOA.
          </p>
        </div>
      </section>
      <section className="section-light">
        <div className="container-xl">
          <SmartCompareCalculator />
        </div>
      </section>
    </>
  );
}
