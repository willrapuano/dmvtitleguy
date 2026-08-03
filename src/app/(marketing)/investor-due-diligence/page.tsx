import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, FileCheck, Phone } from "lucide-react";
import { InvestorDueDiligenceForm } from "@/components/funnels/InvestorDueDiligenceForm";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Investor Due Diligence Title Services | DMV Title Guy",
  description: "Fast, accurate title searches and due diligence for real estate investors across DC, Maryland & Virginia. Submit property details to get started.",
  alternates: { canonical: "https://dmvtitleguy.io/investor-due-diligence" },
};

const howItWorks = [
  { icon: FileCheck, title: "1. Submit Property Info", desc: "Fill out the form with property details. We'll follow up with secure instructions for any supporting documents." },
  { icon: Shield, title: "2. We Run Title Search", desc: "Our team conducts a thorough title search, examining liens, judgments, easements, and ownership history." },
  { icon: Clock, title: "3. You Get Results & Clear to Close", desc: "Receive a detailed title report with clear next steps. Rush available for time-sensitive deals." },
];

const faqs = [
  { q: "What does investor due diligence include?", a: "Our due diligence package includes a full title search, lien and judgment check, ownership chain verification, easement review, and a comprehensive title report with recommendations." },
  { q: "How fast can I get results?", a: "Standard turnaround is 5-7 business days. Rush service delivers results in 1-3 business days for time-sensitive acquisitions." },
  { q: "Do you work with wholesale deals?", a: "Yes. We regularly handle title searches for wholesale transactions, assignment contracts, and double closings across DC, Maryland, and Virginia." },
  { q: "What documents should I provide?", a: "Ideally, provide the ratified contract, any prior title policies, and the deed. If you don't have these, we can still run a search with just the property address." },
  { q: "Can I request due diligence before going under contract?", a: "Absolutely. Many investors request a title search before finalizing an offer, especially for auction properties or off-market deals where title issues could kill the deal." },
];

export default function InvestorDueDiligencePage() {
  return (
    <>
      <ServiceSchema
        name="Investor Due Diligence Title Services"
        description="Fast, accurate title searches and due diligence for real estate investors across DC, Maryland & Virginia."
        serviceType="Investor Due Diligence"
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
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Investor Due Diligence</span>
            </nav>
            <h1 className="t-h1 text-white mb-4">
              Investor Due Diligence Title Services
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Fast, accurate title searches and due diligence for real estate investors across the DMV. Submit the property details and we&apos;ll get started.
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
          <h2 className="prose-title text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-green mb-4">
                  <step.icon className="h-7 w-7 text-brand-navy" />
                </div>
                <h3 className="t-h6 text-brand-navy mb-2">{step.title}</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-10">Frequently Asked Questions</h2>
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
