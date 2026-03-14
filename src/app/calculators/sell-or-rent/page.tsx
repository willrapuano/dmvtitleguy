import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sell or Rent Calculator | DMV Title Guy",
  description:
    "Should you sell your home or rent it out? Use this free calculator to compare the financial outcomes of selling versus renting your property in the DC, Maryland, and Virginia market.",
  alternates: { canonical: "/calculators/sell-or-rent" },
};

export default function SellOrRentPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Sell or Rent</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sell or Rent Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Not sure whether to sell your property or keep it as a rental? Compare projected returns, cash flow, and equity growth to make the smartest financial decision.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://palmagent.com/app/calculators/sellorrent"
            width="100%"
            style={{ border: "none", minHeight: "800px" }}
            title="Sell or Rent Calculator — Pruitt Title LLC"
            allow="clipboard-write"
          />
        </div>
      </section>
    </>
  );
}
