import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Contact Will Rapuano | DMV Title Guy",
  description: "Contact Will Rapuano for DMV title education, transaction questions, and a provider introduction in Northern Virginia, DC, and Maryland.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Talk directly with Will"
        title="Bring Will the question. Get a clear next step."
        lede={
          <div className="space-y-4">
            <p>Ask about title concepts, transaction preparation, or an introduction to an appropriate provider. A submission is not a title order and does not guarantee provider acceptance.</p>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <a href="tel:+17038591467" className="font-semibold text-white hover:text-brand-blue-200">(703) 859-1467</a>
              <span>Or use the secure form</span>
            </div>
          </div>
        }
        aside={<LeadCaptureForm location="contact" compact />}
      />

      {/* CONTACT EXPECTATIONS */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="t-h3 text-brand-navy mb-6">What happens next</h2>
              <p className="text-gray-600 mt-6 max-w-[68ch] leading-relaxed">
                Will reviews the request and follows up about the appropriate next step. If a provider introduction is requested, that provider decides whether to accept the matter and supplies its own scope, timing, pricing, and required disclosures.
              </p>
            </div>
            <div>
              <h2 className="t-h3 text-brand-navy mb-6">Service Areas</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Virginia</h3>
                  <p className="text-gray-600 text-sm max-w-[68ch] leading-relaxed">Arlington, Fairfax, Alexandria, Loudoun, Prince William Counties</p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Maryland</h3>
                  <p className="text-gray-600 text-sm max-w-[68ch] leading-relaxed">Montgomery County, Prince George's County</p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Washington DC</h3>
                  <p className="text-gray-600 text-sm max-w-[68ch] leading-relaxed">All DC neighborhoods and wards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHOOSE A NEXT STEP */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 mb-4">Choose a Next Step</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Share enough context for Will to respond or make an appropriate introduction.</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link href="/investor-due-diligence" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Investor Due Diligence</h3>
              <p className="text-sm text-gray-300 max-w-[68ch] leading-relaxed">Share property context and request an introduction.</p>
            </Link>
            <Link href="/upload-contract" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Start Contract Intake</h3>
              <p className="text-sm text-gray-300 max-w-[68ch] leading-relaxed">Begin intake and receive secure transfer instructions.</p>
            </Link>
            <Link href="/request-title-review" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Request Title Review</h3>
              <p className="text-sm text-gray-300 max-w-[68ch] leading-relaxed">Get clarity on a property&apos;s title status.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8 text-center">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/calculators/title-quote" className="surface-card p-6">
              <h3 className="t-h6 font-semibold text-brand-navy mb-2">Get a Title Quote</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Instant title insurance quotes for your transaction.</p>
            </Link>
            <Link href="/calculators" className="surface-card p-6">
              <h3 className="t-h6 font-semibold text-brand-navy mb-2">Closing Cost Calculator</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Estimate buyer and seller closing costs.</p>
            </Link>
            <Link href="/my-classes" className="surface-card p-6">
              <h3 className="t-h6 font-semibold text-brand-navy mb-2">Agent Education</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">CE classes and training for real estate professionals.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
