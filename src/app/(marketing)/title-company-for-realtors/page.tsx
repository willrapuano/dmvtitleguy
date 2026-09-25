import Link from "next/link";
import { AudienceSections } from "@/components/AudienceSections";
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
        lede="Practical education for agents across Northern Virginia, Maryland, and Washington DC. When your clients are ready to close, Will and the Pruitt Title team handle the title and settlement."
        aside={<LeadCaptureForm location="realtors" compact />}
      />
      <AudienceSections
        label="Working with Realtors"
        heading="A closing that reflects well on you."
        intro="Your client sees one transaction. Will and the Pruitt Title team keep the title side clear, so every handoff feels intentional."
        rows={[
          { title: "Contract intake", body: "Send Will the ratified contract details and he confirms the next steps with you." },
          { title: "One contact at Pruitt Title", body: "Will confirms the quote, timing and deliverables, and the Pruitt Title team handles the title work and closing." },
          { title: "Answers your clients understand", body: "Plain-language guides on title insurance, surveys, closing costs and settlement you can send to a client." },
          { title: "Local cost and process guides", body: "Compare Virginia, Maryland and DC costs and steps before you set a client's expectations." },
        ]}
        handoff="Agent → Will → Client"
        handoffNote="Direct access keeps the answer close to the person who knows the file."
        handoffLink={{ label: "Start contract intake →", href: "/upload-contract" }}
      />

      <section className="bg-white py-14 md:py-16">
        <div className="container-xl grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-[70px]">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-brass">Agent resources</p>
            <h2 className="font-display text-3xl font-medium leading-tight text-brand-navy md:text-4xl">Guides to send before a deadline slips.</h2>
          </div>
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col border-t border-brand-line">
              {[
                { href: "/blog/firpta-explained-dmv", label: "FIRPTA withholding basics" },
                { href: "/blog/types-of-property-surveys-dc-md-va", label: "Property survey types in DC, MD and VA" },
                { href: "/calculators/seller-net-sheet", label: "Seller net sheet" },
                { href: "/contact", label: "Schedule a broker briefing with Will" },
              ].map((item) => (
                <li key={item.href} className="border-b border-brand-line">
                  <Link href={item.href} className="flex items-center justify-between py-4 font-display text-xl text-brand-navy hover:text-brand-ink">
                    {item.label} <span aria-hidden="true" className="text-brand-brass-dark">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="max-w-[68ch] text-sm leading-relaxed text-brand-ink-light">
              No pay-for-referral promise: DMV Title Guy doesn&apos;t offer payments for settlement-service referrals. Your client chooses the title company that serves them best.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
