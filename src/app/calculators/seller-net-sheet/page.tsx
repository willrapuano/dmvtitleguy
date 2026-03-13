import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seller Net Sheet Calculator | DMV Title Guy",
  description:
    "Calculate exactly how much you'll net from your home sale after commissions, title fees, and closing costs in DC, Maryland, and Virginia. Free seller net sheet from Pruitt Title LLC.",
  alternates: { canonical: "/calculators/seller-net-sheet" },
};

export default function SellerNetSheetPage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Seller Net Sheet</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Seller Net Sheet Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Find out exactly what you'll walk away with after commissions, title insurance, transfer taxes, and all closing costs. An essential tool for sellers and listing agents in the DMV.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://pruitt-title.titlecapture.com/seller-net-sheet"
            width="100%"
            height="800"
            frameBorder="0"
            style={{ border: "none" }}
            title="Pruitt Title — Seller Net Sheet Calculator"
          />
        </div>
      </section>
    </>
  );
}
