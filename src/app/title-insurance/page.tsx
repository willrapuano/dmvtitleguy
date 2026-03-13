import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Title Insurance in DC, Maryland & Virginia | DMV Title Guy",
  description: "Professional title insurance services underwritten by First American Title. Owner's and lender's policies for residential, commercial, and investor transactions across the DMV.",
  alternates: { canonical: "/title-insurance" },
};

export default function TitleInsurancePage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Underwritten by First American Title</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Title Insurance in DC, Maryland &amp; Virginia
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Pruitt Title LLC provides owner&apos;s and lender&apos;s title insurance backed by First American Title Insurance Company — one of the most financially secure title underwriters in the country. Founded 2007. Woman-owned.
            </p>
            <Link href="/#contact" className="btn-primary">Get a Policy Quote →</Link>
          </div>
          <div>
            <LeadCaptureForm compact location="title-insurance" />
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-6">What is Title Insurance?</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>Title insurance protects real estate buyers and lenders against financial losses from defects in a property&apos;s title or ownership chain. Unlike other insurance products that protect against future events, title insurance protects against past events — problems that existed before you purchased the property.</p>
            <h3 className="text-brand-navy font-bold text-lg mt-6">Owner&apos;s Title Insurance</h3>
            <p>Protects the buyer&apos;s ownership interest against claims arising from the property&apos;s history — undiscovered liens, errors in public records, forgery, fraud, and more. A one-time premium at closing provides protection for as long as you own the property.</p>
            <h3 className="text-brand-navy font-bold text-lg mt-6">Lender&apos;s Title Insurance</h3>
            <p>Required by virtually all mortgage lenders. Protects the lender&apos;s interest in the property up to the loan amount. Typically issued simultaneously with owner&apos;s coverage at a discounted simultaneous issue rate.</p>
            <h3 className="text-brand-navy font-bold text-lg mt-6">Why First American Title?</h3>
            <p>Pruitt Title LLC is underwritten by First American Title Insurance Company — a Fortune 500 company and one of the largest title insurers in the United States. Their financial strength means claims get paid.</p>
          </div>
        </div>
      </section>

      <section className="section-gray">
        <div className="container-xl text-center">
          <h2 className="prose-title mb-4">Ready to Open a Title Order?</h2>
          <p className="prose-subtitle max-w-xl mx-auto mb-6">Contact Will Rapuano at Pruitt Title LLC for a title insurance quote or to open your order today.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/#contact" className="btn-primary">Get a Quote</Link>
            <a href="tel:+17038591467" className="btn-outline">Call (703) 859-1467</a>
          </div>
        </div>
      </section>
    </>
  );
}
