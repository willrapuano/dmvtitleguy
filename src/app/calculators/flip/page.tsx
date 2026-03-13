import type { Metadata } from "next";
import Link from "next/link";
import { FlipCalculator } from "@/components/calculators/FlipCalculator";

export const metadata: Metadata = {
  title: "House Flip Calculator | DMV Title Guy",
  description:
    "Calculate profit, ROI, and Maximum Allowable Offer (MAO) for your next fix-and-flip in DC, Maryland, or Virginia. Free flip calculator from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/flip" },
};

export default function FlipPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Flip Calculator</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Investor Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">House Flip Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Run your fix-and-flip numbers before you make an offer. Calculate estimated profit, ROI, and your Maximum Allowable Offer (MAO) based on ARV, rehab costs, and holding expenses.
          </p>
        </div>
      </section>
      <section className="section-light">
        <div className="container-xl">
          <FlipCalculator />
        </div>
      </section>
    </>
  );
}
