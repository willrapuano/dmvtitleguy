import type { Metadata } from "next";
import Link from "next/link";
import { TitleQuotePanel } from "@/components/TitleQuotePanel";

export const metadata: Metadata = {
  title: "Title Company Services for Builders | DMV Title Guy",
  description: "DMVTitleGuy provides fast, reliable title services for builders and developers in Northern Virginia, DC, and Maryland.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-builders" },
};

export default function BuildersPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Builders</span>
            </nav>
            <h1 className="t-h1 text-white mb-4">
              Title Company Services for Builders
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Fast, reliable title services for builders and developers in Northern Virginia, DC, and Maryland.
            </p>
          </div>
          <TitleQuotePanel />
        </div>
      </section>

      {/* HOW WILL AND PRUITT TITLE WORK WITH BUILDERS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">How Will and Pruitt Title work with builders</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">New construction closings</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Pruitt Title handles title and settlement for new-construction sales across Virginia, Maryland and DC, with the builder, buyer and lender on the same file.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">One contact for your pipeline</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Will Rapuano is your direct line at Pruitt Title for every home in the community, from contract to closing.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Documents in a secure portal</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Pruitt Title runs on Qualia. Documents move through Qualia Connect, a secure portal, instead of email, which cuts the risk of wire fraud.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Numbers before the contract</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Your sales team can use the calculator above to show a buyer their title and settlement costs before the contract is written.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Planning a new community or a phase release?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Talk to Will about title and settlement for your upcoming closings.
          </p>
          <Link href="/contact" className="btn-primary px-8">
            Contact Will →
          </Link>
        </div>
      </section>
    </>
  );
}
