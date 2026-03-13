import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rent vs. Buy Calculator | DMV Title Guy",
  description:
    "Compare the true cost of renting versus buying a home in the DC, Maryland, and Virginia market. Make a confident decision with this free analysis from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/rent-vs-buy" },
};

export default function RentVsBuyPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Rent vs. Buy</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rent vs. Buy Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Still on the fence? Compare the long-term financial impact of renting versus buying in the DMV market — including equity building, tax benefits, and true monthly costs.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://pruitt-title.titlecapture.com/rent-vs-buy"
            width="100%"
            height="800"
            frameBorder="0"
            style={{ border: "none" }}
            title="Pruitt Title — Rent vs. Buy Calculator"
          />
        </div>
      </section>
    </>
  );
}
