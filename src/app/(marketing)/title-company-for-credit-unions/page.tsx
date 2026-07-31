import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Company Services for Credit Unions | DMV Title Guy",
  description: "DMVTitleGuy provides title services for credit unions in Northern Virginia, DC, and Maryland. Understanding of CU processes.",
  alternates: { canonical: "https://dmvtitleguy.com/title-company-for-credit-unions" },
};

export default function CreditUnionsPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="t-h5 font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="credit-unions" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Why Credit Unions Choose DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Credit Union Expertise</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">We understand credit union lending processes and requirements.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Member-Focused Service</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Treat your members like family with our white-glove service.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Competitive Pricing</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Special rates for credit union partners and their members.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Dedicated Support</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Single point of contact for all your lending partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Partner with Us</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to learn about credit union partnership options.
          </p>
          <Link href="/contact" className="btn-primary px-8">
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  );
}
