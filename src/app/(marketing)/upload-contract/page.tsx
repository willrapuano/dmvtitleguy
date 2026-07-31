import type { Metadata } from "next";
import Link from "next/link";
import { Send, Clock, FileCheck, Phone } from "lucide-react";
import { UploadContractForm } from "@/components/funnels/UploadContractForm";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Start Contract Intake | DMV Title Guy",
  description: "Realtors and investors: start secure contract intake and our team will follow up within 1 business hour.",
  alternates: { canonical: "https://dmvtitleguy.com/upload-contract" },
  robots: { index: false, follow: true },
};

const nextSteps = [
  { icon: Send, title: "1. Start Intake", desc: "Tell us how to reach you and share the basic transaction details." },
  { icon: FileCheck, title: "2. Send the Contract Securely", desc: "Our team follows up with secure transfer instructions for the ratified contract." },
  { icon: Clock, title: "3. Title Work Begins", desc: "After the contract is received and reviewed, we open the title order and keep you updated." },
];

const faqs = [
  { q: "How do I send my contract?", a: "Submit the intake form and our team will provide secure transfer instructions. Contracts are not accepted through a public upload link." },
  { q: "How quickly will you follow up?", a: "Our team aims to contact you within one business hour during normal business hours." },
  { q: "What happens after you receive my contract?", a: "Our team reviews the contract, opens the title order, and begins the search process. You'll receive updates at each milestone." },
];

export default function UploadContractPage() {
  return (
    <>
      <ServiceSchema
        name="Start Contract Intake"
        description="Start secure contract intake and our team will follow up with transfer instructions."
        serviceType="Contract Intake & Title Processing"
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
              Start Contract Intake — We&apos;ll Handle the Rest
            </h1>
            <p className="text-lg text-gray-300 mb-4 max-w-[68ch]">
              Realtors and investors: share your contact and transaction details. We&apos;ll follow up within one business hour with secure contract-transfer instructions.
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
