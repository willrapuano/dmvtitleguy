import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Company Services for Realtors | DMV Title Guy",
  description: "DMVTitleGuy provides fast, reliable title services tailored specifically for real estate professionals in Northern Virginia, DC, and Maryland.",
  alternates: { canonical: "https://dmvtitleguy.com/title-company-for-realtors" },
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
            <h1 className="t-h1 text-white mb-4">
              Title Company Services for Realtors
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Fast, reliable title services tailored specifically for real estate professionals in Northern Virginia, DC, and Maryland.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="t-h5 font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="realtors" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Why Realtors Choose DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">24-Hour Preliminary Title Reports</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Get fast preliminary title reports for your listings so you can keep transactions moving.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Flexible Closing Scheduling</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">We offer evening and weekend closings to fit your clients' schedules.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Dedicated Closing Coordinators</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Your team gets a dedicated coordinator who knows your transactions inside out.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Digital Document Signing</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Remote online notarization (RON) available for clients who can't attend in person.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">How We Support Your Business</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-action text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <h3 className="t-h6 font-semibold text-brand-navy">Clear Title Issues Before They Delay Closings</h3>
                <p className="text-gray-600 max-w-[68ch] leading-relaxed">We identify and resolve problems early so your deals close on time.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-action text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <h3 className="t-h6 font-semibold text-brand-navy">Weekly Pipeline Updates</h3>
                <p className="text-gray-600 max-w-[68ch] leading-relaxed">Stay informed on every transaction with regular status updates.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-action text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h3 className="t-h6 font-semibold text-brand-navy">Competitive Referral Bonuses</h3>
                <p className="text-gray-600 max-w-[68ch] leading-relaxed">Earn bonuses for every closed transaction you refer our way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTRACT INTAKE CTA */}
      <section className="py-12 bg-brand-action text-white">
        <div className="container-xl text-center">
          <h2 className="t-h4 mb-3">Start Contract Intake</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Got a ratified contract? Start intake and we&apos;ll follow up with secure transfer instructions.</p>
          <Link href="/upload-contract" className="inline-block bg-white text-brand-action font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
            Start Contract Intake →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Ready to Streamline Your Closings?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule a broker briefing to learn how we can support your business.
          </p>
          <Link href="/contact" className="inline-block bg-brand-action text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
            Schedule a Broker Briefing →
          </Link>
        </div>
      </section>
    </>
  );
}
