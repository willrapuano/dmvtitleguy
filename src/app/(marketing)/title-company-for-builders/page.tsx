import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Company Services for Builders | DMV Title Guy",
  description: "DMVTitleGuy provides fast, reliable title services for builders and developers in Northern Virginia, DC, and Maryland.",
  alternates: { canonical: "https://dmvtitleguy.com/title-company-for-builders" },
};

export default function BuildersPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="t-h5 font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="builders" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Why Builders Choose DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">New Construction Closings</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Specialized expertise in new construction transactions and builder settlements.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Fast Turnaround Times</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">We understand builder timelines and deliver on your schedule.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Multi-Unit Closings</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Experience handling multiple simultaneous closings for developments.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Dedicated Account Manager</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Single point of contact for all your projects and transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Partner with a Builder-Friendly Title Company</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us to discuss your upcoming projects.
          </p>
          <Link href="/contact" className="btn-primary px-8">
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  );
}
