import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, AlertTriangle, Home, Phone } from "lucide-react";
import { TitleReviewForm } from "@/components/funnels/TitleReviewForm";

export const metadata: Metadata = {
  title: "Request a Title Review | DMV Title Guy",
  description: "Need clarity on a property's title status? Submit your request and our team will respond within one business day. Full title searches, lien searches, and foreclosure reviews.",
  alternates: { canonical: "https://dmvtitleguy.io/request-title-review" },
};

const scenarios = [
  { icon: AlertTriangle, title: "Auction Property", desc: "Auction properties often have hidden liens and title defects. A review before bidding can save you thousands." },
  { icon: Home, title: "Inherited Property", desc: "Inherited homes may have unresolved ownership issues, old liens, or missing documentation that need clearing." },
  { icon: Shield, title: "Foreclosure Review", desc: "Foreclosed properties carry unique title risks — outstanding liens, judgments, and incomplete chain of title." },
  { icon: Clock, title: "Pre-Listing Title Check", desc: "Sellers can proactively identify title issues before listing, avoiding last-minute closing delays." },
];

const faqs = [
  { q: "What's the difference between a full title search and a lien search?", a: "A full title search examines the complete ownership chain, all recorded documents, liens, easements, and judgments. A lien search focuses specifically on outstanding liens and monetary encumbrances against the property." },
  { q: "When should I request a title search update?", a: "If you've had a title search done previously but need current information — for example, if time has passed since the original search or new activity may have occurred on the property — an update brings your report current." },
  { q: "What is a foreclosure title review?", a: "A foreclosure review examines the title specifically for risks common to foreclosed properties: prior liens that survived the foreclosure, judgment liens, incomplete chain of title, and recording defects that could affect your ownership." },
  { q: "How quickly will I get my title review results?", a: "Standard requests are completed within 5-7 business days. Rush requests are prioritized and typically completed within 1-3 business days." },
];

export default function RequestTitleReviewPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-start">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Request Title Review</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Request a Title Review
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Need clarity on a property&apos;s title status? Submit your request and our team will respond within one business day.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#review-form" className="btn-primary px-6 py-3 text-base font-semibold inline-flex items-center gap-2">
                Request Review Now
              </a>
              <a href="tel:+17038591467" className="btn-outline px-6 py-3 text-base font-semibold inline-flex items-center gap-2 text-white border-white/40 hover:bg-white/10">
                <Phone className="h-4 w-4" /> (703) 859-1467
              </a>
            </div>
          </div>
          <div id="review-form">
            <TitleReviewForm />
          </div>
        </div>
      </section>

      {/* WHEN TO REQUEST */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">When to Request a Title Review</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {scenarios.map((s) => (
              <div key={s.title} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-green flex items-center justify-center">
                  <s.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">{s.title}</h3>
                  <p className="text-brand-muted text-sm">{s.desc}</p>
                </div>
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
            <Link href="/upload-contract" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Upload Contract</h3>
              <p className="text-sm text-brand-muted">Submit your ratified contract for fast title processing.</p>
            </Link>
            <Link href="/title-insurance" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Title Insurance</h3>
              <p className="text-sm text-brand-muted">Protect your investment with owner&apos;s title insurance.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}