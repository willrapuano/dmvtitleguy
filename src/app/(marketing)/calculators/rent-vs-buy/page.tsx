import type { Metadata } from "next";
import Link from "next/link";
import { RentVsBuyCalculator } from "@/components/calculators/RentVsBuyCalculator";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator | DMV Title Guy",
  description:
    "Should you rent or buy in the DMV? Compare the long-term costs of renting versus buying a home in Washington DC, Maryland, and Virginia with this free calculator from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/rent-vs-buy" },
};

export default function RentVsBuyPage() {
  return (
    <>
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-white">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Rent vs Buy</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">
            Rent vs Buy Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Wondering whether it makes more sense to rent or buy in the DMV? Compare the long-term financial impact of both options including equity growth, selling costs, and what your down payment could earn if you kept renting.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <RentVsBuyCalculator />
        </div>
      </section>
    </>
  );
}
