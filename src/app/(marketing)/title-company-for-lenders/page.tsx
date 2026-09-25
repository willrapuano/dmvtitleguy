import type { Metadata } from "next";
import Link from "next/link";
import { TitleQuotePanel } from "@/components/TitleQuotePanel";

export const metadata: Metadata = {
  title: "Title Company Services for Lenders | DMV Title Guy",
  description: "DMVTitleGuy provides reliable title services for lenders in Northern Virginia, DC, and Maryland. Fast turnarounds and competitive rates.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-lenders" },
};

export default function LendersPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Lenders</span>
            </nav>
            <h1 className="t-h1 text-white mb-4">
              Title Company Services for Lenders
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Reliable title services for lenders in Northern Virginia, DC, and Maryland.
            </p>
          </div>
          <TitleQuotePanel />
        </div>
      </section>

      {/* HOW WILL AND PRUITT TITLE WORK WITH LENDERS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">How Will and Pruitt Title work with lenders</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's title insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Pruitt Title issues lender's policies underwritten by First American Title Insurance Company, with the endorsements your loan requires.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Commitments and closing documents</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">The title commitment, payoffs and closing documents reach your team through Qualia Connect, Pruitt Title's secure portal, instead of email.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">One contact at Pruitt Title</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Will Rapuano is your direct line for every file, from contract to closing.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Closings across the DMV</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Pruitt Title closes purchase and refinance loans in Virginia, Maryland and DC.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Working on a loan in the DMV?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Talk to Will about your next file.
          </p>
          <Link href="/contact" className="btn-primary px-8">
            Contact Will →
          </Link>
        </div>
      </section>
    </>
  );
}
