import type { Metadata } from "next";
import Link from "next/link";
import { ExtraPaymentCalculator } from "@/components/calculators/ExtraPaymentCalculator";

export const metadata: Metadata = {
  title: "Extra Loan Payment Calculator | DMV Title Guy",
  description:
    "See how much interest you'll save and how many years you'll shave off your mortgage by making extra monthly payments. Free calculator from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/extra-payment" },
};

export default function ExtraPaymentPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Extra Loan Payment</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Buyer Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Extra Loan Payment Calculator</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Even a small extra payment each month can save you tens of thousands in interest and pay off your mortgage years early. See exactly how much with this free tool.
          </p>
        </div>
      </section>
      <section className="section-light">
        <div className="container-xl">
          <ExtraPaymentCalculator />
        </div>
      </section>
    </>
  );
}
