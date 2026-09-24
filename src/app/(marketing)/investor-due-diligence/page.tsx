import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, FileCheck, Phone } from "lucide-react";
import { InvestorDueDiligenceForm } from "@/components/funnels/InvestorDueDiligenceForm";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Investor Title Due Diligence Guide | DMV Title Guy",
  description: "Educational title due-diligence guidance for DMV investors, with a path to request an independent provider review for an eligible property.",
  alternates: { canonical: "https://dmvtitleguy.io/investor-due-diligence" },
};

const howItWorks = [
  { icon: FileCheck, title: "1. Submit Property Info", desc: "Fill out the form with property details. We'll follow up with secure instructions for any supporting documents." },
  { icon: Shield, title: "2. Pruitt Title Reviews the Title", desc: "The Pruitt Title team searches the title and flags liens, judgments, and ownership issues." },
  { icon: Clock, title: "3. Will Confirms Next Steps", desc: "Will confirms the quote, timing, deliverables, and how to send documents securely." },
];

const faqs = [
  { q: "What can investor due diligence include?", a: "It can include a title search, lien and judgment checks, ownership-chain review, easement review, and a written report. Will confirms the deliverables for your property up front." },
  { q: "How fast can I get results?", a: "Timing depends on the jurisdiction, record availability, property history, underwriting questions, and what you need. Pruitt Title confirms timing after it reviews the property." },
  { q: "Can you review wholesale deals?", a: "Wholesale transactions, assignments, and double closings depend on jurisdiction, underwriting, and lender requirements. Send Will the deal structure and he confirms what Pruitt Title can do for it." },
  { q: "What documents might you need?", a: "Will may ask for the ratified contract, prior title policies, deeds, entity documents, or other transaction-specific material. Wait for approved secure transfer instructions before sending sensitive documents." },
  { q: "Can I request due diligence before going under contract?", a: "Yes. Send Will an auction or off-market property before you finalize an offer. Will confirms the title-search quote, timing, and next steps with you." },
];

export default function InvestorDueDiligencePage() {
  return (
    <>
      <ServiceSchema
        name="Investor Due Diligence Request"
        description="Educational title due-diligence guidance and a request path for a possible independent provider review."
        serviceType="Investor Due Diligence Introduction"
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl grid md:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Investor Due Diligence</span>
            </nav>
            <h1 className="t-h1 text-white mb-4">
              Investor Title Due Diligence
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Learn what to investigate before acquiring a DMV property, then send Will the details. Will and the Pruitt Title team handle the title search and your closing.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#due-diligence-form" className="btn-primary px-6 py-3 text-base font-semibold inline-flex items-center gap-2">
                Start Your Due Diligence
              </a>
              <a href="tel:+17038591467" className="btn-outline px-6 py-3 text-base font-semibold inline-flex items-center gap-2 text-white border-white/40 hover:bg-white/10">
                <Phone className="h-4 w-4" /> (703) 859-1467
              </a>
            </div>
          </div>
          <div id="due-diligence-form">
            <InvestorDueDiligenceForm />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="text-center">
                <h3 className="mb-2 font-display text-[1.375rem] font-medium leading-snug text-brand-navy">{step.title}</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="surface-card p-6">
                <h3 className="text-base font-bold text-brand-navy mb-2">{faq.q}</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Related Pages</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/upload-contract" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Start Contract Intake</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Begin intake and receive secure contract-transfer instructions.</p>
            </Link>
            <Link href="/request-title-review" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Request Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Get clarity on a property&apos;s title status.</p>
            </Link>
            <Link href="/title-insurance" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Title Insurance</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Protect your investment with owner&apos;s title insurance.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
