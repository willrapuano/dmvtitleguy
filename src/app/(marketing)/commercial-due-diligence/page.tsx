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
  Landmark,
  Phone,
  Scale,
  Search,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Commercial Due Diligence Title Services | DMV Title Guy",
  description:
    "Commercial real estate due diligence title services for buyers, investors, lenders, and operators across DC, Maryland, and Virginia.",
  alternates: {
    canonical: "https://dmvtitleguy.io/commercial-due-diligence",
  },
};

const diligenceAreas = [
  {
    icon: Search,
    title: "Title and Ownership Review",
    desc: "An accepted provider may review vesting, recorded deeds, ownership chain, legal-description issues, and prior transfers within its confirmed scope.",
  },
  {
    icon: Scale,
    title: "Lien and Judgment Search",
    desc: "Recorded liens, judgments, deeds of trust, tax liens, UCC concerns, and municipal charges are identified for cure or negotiation.",
  },
  {
    icon: FileSearch,
    title: "Easements and Restrictions",
    desc: "Access rights, utility easements, declarations, covenants, use restrictions, and recorded agreements are reviewed for deal impact.",
  },
  {
    icon: Building2,
    title: "Entity and Authority Issues",
    desc: "LLCs, corporations, trusts, partnerships, and authorized signers are checked for title, closing, and lender requirements.",
  },
  {
    icon: Landmark,
    title: "Lender and Title Insurance Needs",
    desc: "An accepted provider may identify title exceptions, endorsements, underwriting questions, and closing conditions that can affect financing.",
  },
  {
    icon: Shield,
    title: "Risk Summary and Next Steps",
    desc: "You get practical findings that explain what matters, what needs cure, and what should be addressed before closing.",
  },
];

const whenToOrder = [
  {
    icon: AlertTriangle,
    title: "Before the Due Diligence Deadline",
    desc: "Use title findings before your contingency period expires so title defects can shape price, timing, or walk-away decisions.",
  },
  {
    icon: FileCheck,
    title: "Before Financing Is Final",
    desc: "Commercial lenders may need clean title, entity authority, survey review, endorsements, and exception clearance before approval.",
  },
  {
    icon: Building2,
    title: "Before Buying an Operating Asset",
    desc: "Retail, office, industrial, mixed-use, multifamily, and special-use assets often carry recorded matters that affect operations.",
  },
];

const deliverables = [
  "Commercial property title search and ownership chain review",
  "Lien, judgment, tax, municipal, and UCC issue spotting",
  "Recorded easement, access, covenant, and restriction review",
  "Entity, vesting, and signing authority issue identification",
  "Title insurance exception and endorsement coordination",
  "Clear summary of curative items before closing",
];

const process = [
  {
    icon: ClipboardCheck,
    title: "1. Send the Deal Details",
    desc: "Provide the property address, contract, legal description, lender requirements, survey if available, and any known title concerns.",
  },
  {
    icon: Search,
    title: "2. Review the Title Record",
    desc: "An accepted provider may examine ownership, liens, judgments, taxes, easements, restrictions, entity concerns, and commercial closing requirements.",
  },
  {
    icon: CheckCircle2,
    title: "3. Get a Practical Action Plan",
    desc: "You receive findings, risk notes, and next steps for cure, underwriting, lender review, title insurance, and settlement.",
  },
];

const faqs = [
  {
    q: "What is commercial real estate due diligence?",
    a: "Commercial real estate due diligence is the review process used to identify legal, title, financing, operational, and closing risks before a buyer or investor commits fully to a transaction. Title due diligence focuses on ownership, liens, judgments, taxes, easements, restrictions, entity authority, and title insurance issues.",
  },
  {
    q: "Why order title due diligence before closing?",
    a: "Early title due diligence can reveal issues that affect price, lender approval, use of the property, title insurance, or whether the transaction should proceed. Waiting until the closing deadline can leave too little time to cure defects or renegotiate.",
  },
  {
    q: "What commercial properties do you review?",
    a: "A provider may support due diligence for office, retail, industrial, mixed-use, multifamily, development, investor, distressed, or owner-operator properties. It must independently confirm eligibility, acceptance, scope, pricing, timing, and terms.",
  },
  {
    q: "Can you help with lender title requirements?",
    a: "An accepted provider may identify title exceptions, curative needs, entity concerns, survey questions, endorsements, and closing conditions within its confirmed lender-facing scope.",
  },
  {
    q: "What should I send to start commercial due diligence?",
    a: "Helpful materials include the property address, contract, legal description, survey, prior title policy, lender instructions, entity documents, leases, and any known easements or recorded agreements.",
  },
];

const relatedPages = [
  { href: "/blog/types-of-property-surveys-dc-md-va", label: "Types of Property Surveys" },
  { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
  { href: "/commercial-real-estate-closings", label: "Commercial Real Estate Closings" },
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/request-title-review", label: "Request Title Review" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://dmvtitleguy.io/commercial-due-diligence#guide",
      headline: "Commercial Due Diligence Title Guide",
      about: { "@type": "Thing", name: "Commercial Real Estate Due Diligence" },
      spatialCoverage: [
        { "@type": "State", name: "Virginia" },
        { "@type": "State", name: "Maryland" },
        { "@type": "AdministrativeArea", name: "Washington DC" },
      ],
      description:
        "Commercial real estate due diligence title services for buyers, investors, lenders, and operators across DC, Maryland, and Virginia.",
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

export default function CommercialDueDiligencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        className="page-hero"
      >
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Commercial Due Diligence</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Commercial Due Diligence Title Services
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Title due diligence for commercial buyers, investors, lenders, and
            operators across DC, Maryland, and Virginia. An accepted provider may identify title
            risks, liens, easements, restrictions, entity issues, and closing
            concerns before they slow the deal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/request-title-review" className="btn-primary px-6 py-3 text-base font-semibold">
              Request Title Review
            </Link>
            <Link href="/commercial-property-title-search" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Commercial Property Title Search
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">What Commercial Due Diligence Covers</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Commercial title due diligence should tell you what you are buying,
            what affects the property, and what must be cleared before closing.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {diligenceAreas.map((item) => (
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

      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">When to Order Commercial Due Diligence</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            The best time to find title risk is while you still have leverage,
            lender flexibility, and time to cure problems.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {whenToOrder.map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="t-h6 text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl max-w-4xl">
          <h2 className="prose-title text-center mb-4">Commercial Title Due Diligence Deliverables</h2>
          <p className="text-brand-muted text-center text-lg mb-10 max-w-2xl mx-auto">
            We focus on usable findings that help buyers, lenders, counsel, and
            operators decide what needs attention before closing.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {deliverables.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">A Typical Provider Process</h2>
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

      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h2 mb-4">
            Start Commercial Title Due Diligence
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Send the property details and we&apos;ll identify title risks,
            curative needs, and commercial closing issues before they slow the
            transaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/request-title-review" className="btn-primary px-6 py-3 text-base font-semibold">
              Request Title Review
            </Link>
            <Link href="/commercial-real-estate-closings" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Commercial Real Estate Closings
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

      <section className="section-light">
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
