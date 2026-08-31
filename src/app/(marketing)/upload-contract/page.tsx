import type { Metadata } from "next";
import Link from "next/link";
import { Send, Clock, FileCheck, Phone } from "lucide-react";
import { UploadContractForm } from "@/components/funnels/UploadContractForm";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Start Contract Intake | DMV Title Guy",
  description: "Realtors and investors can send Will basic transaction details and request secure transfer instructions for a possible provider introduction.",
  alternates: { canonical: "https://dmvtitleguy.io/upload-contract" },
  robots: { index: false, follow: true },
};

const nextSteps = [
  { icon: Send, title: "1. Start Intake", desc: "Tell us how to reach you and share the basic transaction details." },
  { icon: FileCheck, title: "2. Await Secure Instructions", desc: "Will may follow up with a secure transfer path. Do not send a contract through an unapproved public channel." },
  { icon: Clock, title: "3. Provider Review", desc: "If an introduction is requested and eligible, the provider independently confirms acceptance, timing, scope, pricing, terms, and next steps." },
];

const faqs = [
  { q: "How do I send my contract?", a: "Submit only the basic intake details first. Will may provide secure transfer instructions. Contracts are not accepted through a public upload link." },
  { q: "How quickly will Will follow up?", a: "Follow-up timing depends on availability and the request. Submission does not create a deadline or service relationship." },
  { q: "What happens after a provider receives my contract?", a: "The provider independently reviews the material and confirms whether it accepts the transaction, along with its scope, pricing, timing, terms, required disclosures, and milestone process." },
];

export default function UploadContractPage() {
  return (
    <>
      <ServiceSchema
        name="Start Contract Intake"
        description="Send Will basic transaction details and request a secure transfer path for a possible independent provider review."
        serviceType="Transaction Introduction Request"
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
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Contract Intake</span>
          </nav>
          <div className="max-w-2xl mb-8">
            <h1 className="t-h1 text-white mb-4">
              Request Secure Contract Intake
            </h1>
            <p className="text-lg text-gray-300 mb-4 max-w-[68ch]">
              Realtors and investors: share basic contact and transaction details with Will. Do not send the contract until you receive an approved secure-transfer path.
            </p>
            <a href="tel:+17038591467" className="inline-flex items-center gap-2 text-brand-blue font-medium hover:text-white transition-colors">
              <Phone className="h-4 w-4" /> (703) 859-1467
            </a>
          </div>

          {/* Intake form */}
          <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-8">
            <UploadContractForm />
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">What Happens Next</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {nextSteps.map((step) => (
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
            <Link href="/investor-due-diligence" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Comprehensive title searches for real estate investors.</p>
            </Link>
            <Link href="/request-title-review" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Request Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Get clarity on a property&apos;s title status.</p>
            </Link>
            <Link href="/calculators" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Closing Cost Calculator</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Estimate your buyer or seller closing costs.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
