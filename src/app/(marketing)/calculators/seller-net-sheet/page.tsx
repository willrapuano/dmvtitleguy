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
        <div className="container-xl max-w-4xl">
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold text-brand-navy mb-3">Launch the Seller Net Sheet Tool</h2>
            <p className="text-brand-muted mb-6">
              Use the live PalmAgent calculator to estimate your projected proceeds after commissions, closing costs, title fees, and transfer taxes.
            </p>
            <a
              href="https://palmagent.com/app/calculators/selltonet"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8"
            >
              Open Seller Net Sheet Calculator →
            </a>
          </div>

          <div className="prose max-w-none text-brand-muted">
            <h2 className="text-brand-navy">Why Sellers Use a Net Sheet Before Listing</h2>
            <p>
              A seller net sheet estimates how much cash you may receive at closing after paying commissions, title and settlement fees, transfer/recordation taxes, and other transaction costs. For homeowners in DC, Maryland, and Virginia, this is one of the most important numbers to review before pricing a home.
            </p>
            <p>
              Running a net sheet early helps you plan your next purchase, compare offer scenarios, and avoid surprises at the closing table. We recommend updating your estimate whenever list price, concessions, or commission structure changes.
            </p>

            <h3 className="text-brand-navy">Frequently Asked Questions</h3>
            <p><strong>Is this my exact closing amount?</strong><br />No. It is an estimate for planning. Final numbers depend on the executed contract and final closing disclosures.</p>
            <p><strong>Does this include title and transfer costs?</strong><br />Yes, it is designed to help model common seller closing costs including title-related fees and transfer taxes.</p>
            <p><strong>Can I compare multiple offer scenarios?</strong><br />Absolutely. Run the calculator with different sale prices and concession amounts to compare outcomes quickly.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/calculators/title-quote" className="btn-primary">Get a Title Quote</Link>
            <Link href="/virginia-closing-cost-calculator" className="btn-outline">VA Closing Cost Calculator</Link>
            <Link href="/maryland-closing-cost-calculator" className="btn-outline">MD Closing Cost Calculator</Link>
            <Link href="/dc-closing-cost-calculator" className="btn-outline">DC Closing Cost Calculator</Link>
          </div>
        </div>
      </section>
    </>
  );
}
