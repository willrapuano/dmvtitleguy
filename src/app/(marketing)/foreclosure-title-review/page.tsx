import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileCheck,
  FileSearch,
  FileWarning,
  Gavel,
  Landmark,
  Phone,
  Scale,
  Search,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Foreclosure Title Review | DMV Title Guy",
  description:
    "Foreclosure title review for buyers who need liens, HUD issues, judgments, defects, and title risks reviewed before closing in DC, Maryland, and Virginia.",
  alternates: {
    canonical: "https://dmvtitleguy.com/foreclosure-title-review",
  },
};

const foreclosureRisks = [
  {
    icon: AlertTriangle,
    title: "Surviving Liens",
    desc: "Some liens may survive foreclosure depending on priority, jurisdiction, notice, and the recorded facts behind the sale.",
  },
  {
    icon: Scale,
    title: "Judgments",
    desc: "Judgment liens against prior owners can attach to real estate and may require payoff, release, or underwriting review.",
  },
  {
    icon: Landmark,
    title: "HUD and Government Issues",
    desc: "HUD, VA, FHA, tax, municipal, and government-related matters can create special title and closing requirements.",
  },
  {
    icon: FileWarning,
    title: "Foreclosure Process Defects",
    desc: "Notice problems, trustee issues, missing assignments, defective appointments, or recording gaps can affect insurable title.",
  },
  {
    icon: Building2,
    title: "HOA and Condo Claims",
    desc: "Association liens, unpaid assessments, covenants, super-lien issues, and resale requirements can affect ownership cost.",
  },
  {
    icon: Shield,
    title: "Title Insurance Exceptions",
    desc: "Post-foreclosure title insurance may require additional documentation, releases, affidavits, or underwriting approval.",
  },
];

const reviewCovers = [
  {
    icon: Search,
    title: "Ownership and Foreclosure Chain",
    desc: "We review the chain of title, foreclosure deed, trustee or substitute trustee documents, and recorded transfer history.",
  },
  {
    icon: FileSearch,
    title: "Lien and Judgment Review",
    desc: "Recorded liens, judgments, deeds of trust, tax items, municipal claims, and association matters are identified.",
  },
  {
    icon: Landmark,
    title: "HUD, Tax, and Government Items",
    desc: "We flag HUD, federal tax, state tax, municipal, and government-related items that may affect title or closing.",
  },
  {
    icon: FileCheck,
    title: "Defect and Cure Planning",
    desc: "Findings focus on what may need release, payoff, corrective recording, affidavit, underwriting review, or other cure.",
  },
  {
    icon: Gavel,
    title: "Auction and REO Support",
    desc: "Foreclosure buyers, REO buyers, wholesalers, and investors get practical title findings before resale or refinance.",
  },
  {
    icon: Shield,
    title: "Title Insurance Coordination",
    desc: "We help identify title issues that may affect insurable title, lender approval, and post-closing policy work.",
  },
];

const whyBeforeClosing = [
  "Identify liens, judgments, and title defects before closing funds move",
  "Understand whether foreclosure documents create title insurance concerns",
  "Flag HUD, tax, HOA, municipal, and government-related title issues",
  "Plan releases, payoffs, affidavits, or corrective recordings early",
  "Support lender, resale, refinance, and investor exit strategy questions",
  "Account for different foreclosure rules across DC, Maryland, and Virginia",
];

const process = [
  {
    icon: ClipboardCheck,
    title: "1. Send the Foreclosure File",
    desc: "Provide the property address, contract or auction materials, foreclosure documents if available, and your closing deadline.",
  },
  {
    icon: Search,
    title: "2. Review Title and Defects",
    desc: "We review ownership, foreclosure chain, liens, judgments, taxes, HUD concerns, defects, and curative needs.",
  },
  {
    icon: CheckCircle2,
    title: "3. Get Closing Guidance",
    desc: "You receive clear findings for closing, title insurance, cure, resale, refinance, or risk evaluation.",
  },
];

const faqs = [
  {
    q: "What is foreclosure title review?",
    a: "Foreclosure title review examines the recorded ownership chain, foreclosure documents, liens, judgments, taxes, HUD or government items, and defects that may affect a buyer&apos;s ability to close, insure, resell, or refinance the property.",
  },
  {
    q: "Why do I need title review before foreclosure closing?",
    a: "Foreclosed properties can carry liens, judgments, process defects, HOA claims, tax issues, municipal charges, and title insurance requirements that are easier to address before closing than after ownership transfers.",
  },
  {
    q: "What foreclosure title risks do you look for?",
    a: "We look for surviving liens, judgments, HUD and government-related issues, unpaid taxes, HOA or condo claims, unreleased deeds of trust, missing assignments, defective foreclosure documents, and chain-of-title gaps.",
  },
  {
    q: "Can foreclosure title issues affect title insurance?",
    a: "Yes. Title insurance underwriters may require releases, affidavits, corrective recordings, foreclosure documentation, payoff proof, or other curative items before issuing coverage.",
  },
  {
    q: "Do you support foreclosure buyers across the DMV?",
    a: "Yes. We support foreclosure title review for buyers, investors, wholesalers, flippers, auction buyers, and REO buyers across DC, Maryland, and Virginia.",
  },
];

const relatedPages = [
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/commercial-due-diligence", label: "Commercial Due Diligence" },
  { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
  { href: "/commercial-real-estate-closings", label: "Commercial Real Estate Closings" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://dmvtitleguy.com/foreclosure-title-review#service",
      name: "Foreclosure Title Review",
      serviceType: "Foreclosure Title Review",
      provider: {
        "@type": "LegalService",
        name: "DMV Title Guy | Pruitt Title LLC",
        telephone: "+1-703-859-1467",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1900 Gallows Rd Suite 230",
          addressLocality: "Vienna",
          addressRegion: "VA",
          postalCode: "22182",
          addressCountry: "US",
        },
      },
      areaServed: [
        { "@type": "State", name: "Virginia" },
        { "@type": "State", name: "Maryland" },
        { "@type": "AdministrativeArea", name: "Washington DC" },
      ],
      description:
        "Foreclosure title review for buyers of foreclosure properties who need liens, judgments, HUD issues, title defects, curative needs, and closing risks reviewed across DC, Maryland, and Virginia.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function ForeclosureTitleReviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)",
        }}
      >
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Foreclosure Title Review</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Foreclosure Title Review
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Title review for foreclosure buyers who need liens, HUD issues,
            judgments, defects, foreclosure documents, and curative needs
            checked before closing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/calculators/title-quote" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Title Search
            </Link>
            <Link href="/auction-property-title-search" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Auction Property Title Search
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">Foreclosure Title Risks</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Foreclosure can clear some issues and leave others behind. Buyers
            need to know what survived, what is defective, and what must be
            resolved before closing.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foreclosureRisks.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green">
                  <item.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="t-h6 text-brand-navy mb-1">{item.title}</h3>
                  <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">What Foreclosure Title Review Covers</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            The review focuses on recorded matters and foreclosure-specific
            title issues that can affect closing, title insurance, resale, and
            refinance.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewCovers.map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="t-h6 text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl max-w-4xl">
          <h2 className="prose-title text-center mb-4">Why Title Review Before Foreclosure Closing Matters</h2>
          <p className="text-brand-muted text-center text-lg mb-10 max-w-2xl mx-auto">
            Title findings should be available while there is still time to
            cure, negotiate, underwrite, or make a different decision.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {whyBeforeClosing.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step) => (
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

      <section className="bg-brand-navy text-white py-16 md:py-20">
        <div className="container-xl text-center">
          <h2 className="t-h2 mb-4">
            Review Foreclosure Title Before Closing
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Send the property details and we&apos;ll identify liens, judgments,
            HUD issues, defects, and curative needs before closing.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/calculators/title-quote" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Title Search
            </Link>
            <Link href="/investor-title-services" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Investor Title Services
            </Link>
          </div>
          <p className="text-gray-400 text-sm max-w-[68ch] mx-auto leading-relaxed">
            Prefer to talk? Call{" "}
            <a href="tel:+17038591467" className="text-white font-semibold hover:underline">
              <Phone className="inline h-4 w-4" /> (703) 859-1467
            </a>
          </p>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-white rounded-lg shadow-sm group">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-brand-navy">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-brand-muted shrink-0 ml-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-brand-muted text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-brand-gray-bg">
        <div className="container-xl">
          <h3 className="t-h6 text-brand-navy mb-6">Related Pages</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedPages.map((page) => (
              <Link key={page.href} href={page.href} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-brand-navy">
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
