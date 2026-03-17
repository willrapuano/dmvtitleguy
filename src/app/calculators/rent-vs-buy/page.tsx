import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator | DMV Title Guy",
  description:
    "Should you rent or buy in the DMV? Compare the long-term costs of renting versus buying a home in Washington DC, Maryland, and Virginia with this free calculator from Pruitt Title LLC.",
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
            <span>Rent vs Buy</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rent vs Buy Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Wondering whether it makes more sense to rent or buy in the DMV? Compare the long-term financial impact of both options including equity growth, tax benefits, and opportunity costs.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://palmagent.com/app/calculators/RentVBuy"
            width="100%"
            style={{ border: "none", minHeight: "800px" }}
            title="Rent vs Buy Calculator — Pruitt Title LLC"
            allow="clipboard-write"
          />
        </div>
      </section>
    </>
  );
}
