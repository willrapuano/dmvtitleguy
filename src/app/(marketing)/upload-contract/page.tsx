import type { Metadata } from "next";
import Link from "next/link";
import { Upload, Clock, FileCheck, Phone } from "lucide-react";
import { UploadContractForm } from "@/components/funnels/UploadContractForm";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Upload Your Contract — We'll Handle the Rest | DMV Title Guy",
  description: "Realtors and investors: upload your ratified contract and we'll initiate the title process within 1 business hour. Fast, reliable title services across the DMV.",
  alternates: { canonical: "https://dmvtitleguy.io/upload-contract" },
  robots: { index: false, follow: true },
};

const nextSteps = [
  { icon: FileCheck, title: "1. We Review Your Contract", desc: "Our team reviews the ratified contract and initiates the title search on the property." },
  { icon: Clock, title: "2. Title Search Begins", desc: "Within 1 business hour, we order the title search and begin examining the chain of title, liens, and encumbrances." },
  { icon: Upload, title: "3. You Get Title Commitment", desc: "We deliver a clear title commitment so you can move forward with confidence toward closing." },
];

const faqs = [
  { q: "What file formats do you accept?", a: "We accept PDF files only for contract uploads. If your contract is in another format, please convert it to PDF before uploading. Maximum file size is 50MB." },
  { q: "How quickly will you start on my contract?", a: "We initiate the title process within 1 business hour of receiving your uploaded contract. You'll receive a confirmation email with your file number." },
  { q: "What happens after I upload my contract?", a: "Our team reviews the contract, opens a title order, and begins the search process. You'll receive updates at each milestone — search ordered, commitment issued, and clear to close." },
];

export default function UploadContractPage() {
  return (
    <>
      <ServiceSchema
        name="Upload Your Contract"
        description="Upload your ratified contract and we'll initiate the title process within 1 business hour. Fast, reliable title services across the DMV."
        serviceType="Contract Upload & Title Processing"
      />
      {/* HERO — Upload is the star */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Upload Contract</span>
          </nav>
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Upload Your Contract — We&apos;ll Handle the Rest
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              Realtors and investors: upload your ratified contract and we&apos;ll initiate the title process within 1 business hour.
            </p>
            <a href="tel:+17038591467" className="inline-flex items-center gap-2 text-brand-blue font-medium hover:text-white transition-colors">
              <Phone className="h-4 w-4" /> (703) 859-1467
            </a>
          </div>

          {/* Upload Form — prominent in hero */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl">
            <UploadContractForm />
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">What Happens Next</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {nextSteps.map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-green mb-4">
                  <step.icon className="h-7 w-7 text-brand-navy" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-brand-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light py-16">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-brand-navy mb-2">{faq.q}</h3>
                <p className="text-brand-muted text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Related Pages</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/investor-due-diligence" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted">Comprehensive title searches for real estate investors.</p>
            </Link>
            <Link href="/request-title-review" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Request Title Review</h3>
              <p className="text-sm text-brand-muted">Get clarity on a property&apos;s title status.</p>
            </Link>
            <Link href="/calculators" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Closing Cost Calculator</h3>
              <p className="text-sm text-brand-muted">Estimate your buyer or seller closing costs.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}