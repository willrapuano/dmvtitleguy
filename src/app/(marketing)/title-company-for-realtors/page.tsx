import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Title Company Services for Realtors | DMV Title Guy",
  description: "DMVTitleGuy provides fast, reliable title services tailored specifically for real estate professionals in Northern Virginia, DC, and Maryland.",
  alternates: { canonical: "https://dmvtitleguy.com/title-company-for-realtors" },
};

export default function RealtorsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "For Realtors" }]}
        eyebrow="For real estate professionals"
        title="Title company services for Realtors across the DMV, built to keep every closing moving."
        lede="Responsive title and settlement support for agents across Northern Virginia, Maryland, and Washington DC, with proactive communication from contract to closing."
        aside={<LeadCaptureForm location="realtors" compact />}
      />

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Why Realtors Choose DMV Title Guy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">24-Hour Preliminary Title Reports</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Get fast preliminary title reports for your listings so you can keep transactions moving.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Flexible Closing Scheduling</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">We offer evening and weekend closings to fit your clients' schedules.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Dedicated Closing Coordinators</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Your team gets a dedicated coordinator who knows your transactions inside out.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Digital Document Signing</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Remote online notarization (RON) available for clients who can't attend in person.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP */}
      <section className="section-gray">
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
          <Link href="/upload-contract" className="btn-light px-8">
            Start Contract Intake →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Ready to Streamline Your Closings?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule a broker briefing to learn how we can support your business.
          </p>
          <Link href="/contact" className="btn-primary px-8">
            Schedule a Broker Briefing →
          </Link>
        </div>
      </section>
    </>
  );
}
