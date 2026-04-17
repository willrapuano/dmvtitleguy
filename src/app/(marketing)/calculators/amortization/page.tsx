import type { Metadata } from "next";
import Link from "next/link";
import { AmortizationCalculator } from "@/components/calculators/AmortizationCalculator";

export const metadata: Metadata = {
  title: "Amortization Calculator | DMV Title Guy",
  description:
    "See your full mortgage amortization schedule with yearly principal, interest, and remaining balance breakdowns. Free amortization calculator from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/amortization" },
};

export default function AmortizationPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Amortization</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Buyer Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Amortization Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            See your complete mortgage payment schedule — year by year. Understand exactly how much of each payment goes to principal vs. interest and when your loan is paid off.
          </p>
        </div>
      </section>
      <section className="section-light">
        <div className="container-xl">
          <AmortizationCalculator />
        </div>
      </section>
    </>
  );
}
