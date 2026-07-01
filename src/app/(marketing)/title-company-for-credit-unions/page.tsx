import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Company Services for Credit Unions | DMV Title Guy",
  description: "DMVTitleGuy provides title services for credit unions in Northern Virginia, DC, and Maryland. Understanding of CU processes.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-credit-unions" },
};

export default function CreditUnionsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Credit Unions</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Title Company Services for Credit Unions
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Title services designed for credit unions in Northern Virginia, DC, and Maryland.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="credit-unions" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Why Credit Unions Choose DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Credit Union Expertise</h3>
              <p className="text-gray-600">We understand credit union lending processes and requirements.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Member-Focused Service</h3>
              <p className="text-gray-600">Treat your members like family with our white-glove service.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Competitive Pricing</h3>
              <p className="text-gray-600">Special rates for credit union partners and their members.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Dedicated Support</h3>
              <p className="text-gray-600">Single point of contact for all your lending partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Partner with Us</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to learn about credit union partnership options.
          </p>
          <Link href="/contact" className="inline-block bg-brand-blue text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  );
}
