import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Company Services for Lenders | DMV Title Guy",
  description: "DMVTitleGuy provides reliable title services for lenders in Northern Virginia, DC, and Maryland. Fast turnarounds and competitive rates.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-lenders" },
};

export default function LendersPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="t-h5 font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="lenders" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Why Lenders Trust DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Comprehensive coverage to protect your mortgage investment.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Fast Turnaround</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">We meet your funding deadlines with quick title commitments.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Online Status Tracking</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Real-time updates on title status through your pipeline.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Competitive Rates</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Volume discounts available for frequent lender partners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Become a Lending Partner</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to set up your account.
          </p>
          <Link href="/contact" className="inline-block bg-brand-action text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
            Get Started →
          </Link>
        </div>
      </section>
    </>
  );
}
