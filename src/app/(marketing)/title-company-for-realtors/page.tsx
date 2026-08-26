import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { PageHero } from "@/components/PageHero";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Title Company Services for Realtors | DMV Title Guy",
  description: "Title and closing education for real estate professionals in Northern Virginia, DC, and Maryland, with transaction requests reviewed before referral.",
  path: "/title-company-for-realtors",
});

export default function RealtorsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "For Realtors" }]}
        eyebrow="For real estate professionals"
        title="Title and closing resources for Realtors across the DMV."
        lede="Practical education for agents across Northern Virginia, Maryland, and Washington DC, plus a clear way to submit eligible transaction requests for review."
        aside={<LeadCaptureForm location="realtors" compact />}
      />

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">How DMV Title Guy Helps Realtors</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Early Title-Issue Education</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Use plain-language resources to spot common title questions before they threaten a deadline.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Transaction-Specific Intake</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Submit a non-sensitive summary so Will can identify next steps and whether a provider referral is appropriate.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Local Process Guides</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Compare common Virginia, Maryland, and DC cost and process questions before setting client expectations.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Clear Provider Handoff</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">When an eligible request is referred, the provider confirms acceptance, scope, pricing, and delivery details.</p>
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
                <p className="text-gray-600 max-w-[68ch] leading-relaxed">Review common warning signs and route transaction-specific issues to the appropriate licensed professional.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-action text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
              <h3 className="t-h6 font-semibold text-brand-navy">Useful Client Education</h3>
                <p className="text-gray-600 max-w-[68ch] leading-relaxed">Share clear explanations of title insurance, surveys, closing costs, and settlement steps.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-action text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h3 className="t-h6 font-semibold text-brand-navy">No Pay-for-Referral Promise</h3>
                <p className="text-gray-600 max-w-[68ch] leading-relaxed">DMV Title Guy does not promise referral payments for settlement-service business. Education and provider selection should serve the client and comply with applicable rules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h4 text-brand-navy mb-4">Agent Risk Guides</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/blog/firpta-explained-dmv" className="font-semibold text-brand-blue-deep hover:underline">FIRPTA withholding basics →</Link>
            <Link href="/blog/types-of-property-surveys-dc-md-va" className="font-semibold text-brand-blue-deep hover:underline">Property survey types →</Link>
            <Link href="/calculators/seller-net-sheet" className="font-semibold text-brand-blue-deep hover:underline">Seller net sheet →</Link>
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
