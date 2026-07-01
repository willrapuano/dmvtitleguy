import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Company Services for Realtors | DMV Title Guy",
  description: "DMVTitleGuy provides fast, reliable title services tailored specifically for real estate professionals in Northern Virginia, DC, and Maryland.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-realtors" },
};

export default function RealtorsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Realtors</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Title Company Services for Realtors
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Fast, reliable title services tailored specifically for real estate professionals in Northern Virginia, DC, and Maryland.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="realtors" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Why Realtors Choose DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">24-Hour Preliminary Title Reports</h3>
              <p className="text-gray-600">Get fast preliminary title reports for your listings so you can keep transactions moving.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Flexible Closing Scheduling</h3>
              <p className="text-gray-600">We offer evening and weekend closings to fit your clients' schedules.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Dedicated Closing Coordinators</h3>
              <p className="text-gray-600">Your team gets a dedicated coordinator who knows your transactions inside out.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Digital Document Signing</h3>
              <p className="text-gray-600">Remote online notarization (RON) available for clients who can't attend in person.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-brand-navy mb-8">How We Support Your Business</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <h3 className="text-lg font-semibold text-brand-navy">Clear Title Issues Before They Delay Closings</h3>
                <p className="text-gray-600">We identify and resolve problems early so your deals close on time.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <h3 className="text-lg font-semibold text-brand-navy">Weekly Pipeline Updates</h3>
                <p className="text-gray-600">Stay informed on every transaction with regular status updates.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h3 className="text-lg font-semibold text-brand-navy">Competitive Referral Bonuses</h3>
                <p className="text-gray-600">Earn bonuses for every closed transaction you refer our way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPLOAD CONTRACT CTA */}
      <section className="py-12 bg-brand-blue text-white">
        <div className="container-xl text-center">
          <h2 className="text-2xl font-bold mb-3">Upload Your Contract</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Got a ratified contract? Upload it and we&apos;ll initiate the title process within 1 business hour.</p>
          <Link href="/upload-contract" className="inline-block bg-white text-brand-blue font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
            Upload Contract Now →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Streamline Your Closings?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule a broker briefing to learn how we can support your business.
          </p>
          <Link href="/contact" className="inline-block bg-brand-blue text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
            Schedule a Broker Briefing →
          </Link>
        </div>
      </section>
    </>
  );
}
