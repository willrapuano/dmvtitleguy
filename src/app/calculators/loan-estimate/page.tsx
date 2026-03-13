import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loan Estimate Calculator | DMV Title Guy",
  description:
    "Generate a detailed loan estimate with projected closing costs for DC, Maryland, and Virginia home purchases. Built for buyers and lenders by Pruitt Title LLC.",
  alternates: { canonical: "/calculators/loan-estimate" },
};

export default function LoanEstimatePage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Loan Estimate</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loan Estimate Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Generate an accurate loan estimate with projected closing costs for your DMV purchase. Designed for buyers and lenders who need a clear picture of transaction costs upfront.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://pruitt-title.titlecapture.com/loan-estimate-quote"
            width="100%"
            height="800"
            frameBorder="0"
            style={{ border: "none" }}
            title="Pruitt Title — Loan Estimate Calculator"
          />
        </div>
      </section>
    </>
  );
}
