import type { Metadata } from "next";
import Link from "next/link";
import { HomeEquityCalculator } from "@/components/calculators/HomeEquityCalculator";

export const metadata: Metadata = {
  title: "Home Equity Calculator | DMV Title Guy",
  description:
    "Calculate your available home equity, current LTV, and maximum borrowing potential via cash-out refi or HELOC. Free home equity tool for DC, Maryland, and Virginia homeowners.",
  alternates: { canonical: "/calculators/home-equity" },
};

export default function HomeEquityPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Home Equity</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Homeowner Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Home Equity Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Know exactly how much equity you've built — and how much you can tap through a cash-out refi or HELOC. Enter your home value and mortgage balance to see your full equity picture.
          </p>
        </div>
      </section>
      <section className="section-light">
        <div className="container-xl">
          <HomeEquityCalculator />
        </div>
      </section>
    </>
  );
}
