import type { Metadata } from "next";
import Link from "next/link";
import { TitleQuotePanel } from "@/components/TitleQuotePanel";

export const metadata: Metadata = {
  title: "Title Company Services for Credit Unions | DMV Title Guy",
  description: "DMVTitleGuy provides title services for credit unions in Northern Virginia, DC, and Maryland. Understanding of CU processes.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-credit-unions" },
};

export default function CreditUnionsPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Credit Unions</span>
            </nav>
            <h1 className="t-h1 text-white mb-4">
              Title Company Services for Credit Unions
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Title services designed for credit unions in Northern Virginia, DC, and Maryland.
            </p>
          </div>
          <TitleQuotePanel />
        </div>
      </section>

      {/* HOW WILL AND PRUITT TITLE WORK WITH CREDIT UNIONS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">How Will and Pruitt Title work with credit unions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Closings for your members</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Pruitt Title handles title and settlement for credit union purchase and refinance loans in Virginia, Maryland and DC.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">A clear number for members</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Members can use the calculator above to see their title and settlement costs before they apply.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Documents in a secure portal</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Pruitt Title runs on Qualia. Documents move through Qualia Connect, a secure portal, instead of email, which cuts the risk of wire fraud.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">One contact at Pruitt Title</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Will Rapuano is your direct line for every file, from contract to closing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Closing a member's loan in the DMV?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Talk to Will about title and settlement for your members.
          </p>
          <Link href="/contact" className="btn-primary px-8">
            Contact Will →
          </Link>
        </div>
      </section>
    </>
  );
}
