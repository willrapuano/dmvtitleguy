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
import { pruittOrganizationReference } from "@/lib/brand-identity";

export const metadata: Metadata = {
  title: "commercial property title search Guide | Pruitt Title",
  description:
    "Commercial property title search for DMV buyers, lenders, and investors. Pruitt Title reviews liens, easements, entities, and risks. Call today.",
  alternates: {
    canonical: "https://dmvtitleguy.io/commercial-property-title-search",
  },
};

const differences = [
  {
    icon: Building2,
    title: "Entity and Authority Review",
    desc: "Commercial deals often involve LLCs, partnerships, trusts, and signatory authority that must match title and closing documents.",
  },
  {
    icon: FileSearch,
    title: "Deeper Exception Review",
    desc: "Easements, declarations, access rights, leases, parking agreements, and use restrictions can affect value and lender approval.",
  },
  {
    icon: Landmark,
    title: "Lender and Survey Coordination",
    desc: "Commercial title work usually requires tighter coordination with lender instructions, surveys, endorsements, and escrow conditions.",
  },
];

const issues = [
  {
    icon: AlertTriangle,
    title: "Access and Easement Problems",
    desc: "Missing access rights, shared drive agreements, utility easements, and encroachments can create major operational issues.",
  },
  {
    icon: Scale,
    title: "UCC and Judgment Liens",
    desc: "Commercial searches may require review of judgments, UCC filings, financing statements, and entity-level encumbrances.",
  },
  {
    icon: FileCheck,
    title: "Unreleased Deeds of Trust",
    desc: "Prior commercial loans, credit lines, and construction financing may leave unreleased liens that must be cleared before closing.",
  },
  {
    icon: Building2,
    title: "Lease and Occupancy Issues",
    desc: "Tenant rights, memoranda of lease, purchase options, and recorded use agreements can affect the buyer and lender.",
  },
  {
    icon: Shield,
    title: "Title Insurance Exceptions",
    desc: "Commercial policies may include survey, zoning, access, contiguity, and other endorsements that depend on clean title evidence.",
  },
  {
    icon: Landmark,
    title: "Tax and Municipal Items",
    desc: "Open taxes, assessments, code liens, water balances, and special district charges can affect settlement and payoff figures.",
  },
];

const dueDiligence = [
  "Recorded ownership chain and vesting review",
  "Lien, judgment, tax, and municipal search",
  "Easement, covenant, access, and restriction review",
  "Entity name and authority issue spotting",
  "Commercial title exception and endorsement coordination",
  "Clear summary of issues that need cure before closing",
];

const process = [
  {
    icon: ClipboardCheck,
    title: "1. Submit Deal Details",
    desc: "Send the property address, contract, lender requirements, survey if available, and any entity or operating documents.",
  },
  {
    icon: Search,
    title: "2. Run Commercial Title",
    desc: "We review land records, liens, judgments, taxes, exceptions, entity concerns, and commercial-specific closing requirements.",
  },
  {
    icon: CheckCircle2,
    title: "3. Coordinate Cure and Closing",
    desc: "You receive clear findings, curative next steps, and coordination for title insurance, lender review, and settlement.",
  },
];

const faqs = [
  {
    q: "What is a commercial property title search?",
    a: "A commercial property title search reviews the recorded ownership history, liens, judgments, taxes, easements, restrictions, leases, and other title matters affecting a commercial property. It is designed to support due diligence, lender review, title insurance, and closing.",
  },
  {
    q: "How is commercial title work different from residential title work?",
    a: "Commercial title work usually has more complex ownership structures, lender requirements, surveys, endorsements, entity authority questions, leases, access rights, and recorded agreements. The title review needs to account for how the property will be owned, financed, and operated.",
  },
  {
    q: "Do I need a title search before signing a commercial contract?",
    a: "It can be valuable, especially for investor, off-market, distressed, or high-value assets. Early title review can identify issues that affect price, financing, due diligence deadlines, or whether the deal is worth pursuing.",
  },
  {
    q: "Can you coordinate commercial title insurance?",
    a: "Yes. We help identify title exceptions, curative needs, and underwriting questions so the commercial closing can move toward insurable title and lender approval.",
  },
  {
    q: "What documents help with a commercial title search?",
    a: "Helpful documents include the purchase contract, property address, legal description, survey, prior title policy, entity documents, lender requirements, and any known leases or recorded agreements.",
  },
];

const relatedPages = [
  { href: "/commercial-real-estate-closings", label: "Commercial Real Estate Closings" },
  { href: "/commercial-due-diligence", label: "Commercial Due Diligence" },
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/request-title-review", label: "Order Title Search" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://dmvtitleguy.io/commercial-property-title-search#service",
      name: "Commercial Property Title Search",
      serviceType: "Commercial Property Title Search",
      provider: pruittOrganizationReference(),
      areaServed: [
        { "@type": "State", name: "Virginia" },
        { "@type": "State", name: "Maryland" },
        { "@type": "AdministrativeArea", name: "Washington DC" },
      ],
      description:
        "Commercial property title search and title due diligence for buyers, investors, lenders, and operators across DC, Maryland, and Virginia.",
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

export default function CommercialPropertyTitleSearchPage() {
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
            <span className="text-gray-200">Commercial Property Title Search</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Commercial Property Title Search
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Commercial title review for buyers, investors, lenders, and
            operators who need to understand liens, easements, restrictions,
            entity issues, and title insurance risks before closing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/commercial-due-diligence" className="btn-primary px-6 py-3 text-base font-semibold">
              Commercial Due Diligence
            </Link>
            <Link href="/request-title-review" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Order Title Search
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">Commercial vs. Residential Title Search</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Commercial title work has more moving parts. The review must account
            for ownership structure, lender requirements, operations, and future use.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {differences.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-lg p-6">
                <item.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="t-h6 text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">Common Commercial Title Issues</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            We look for issues that can affect lender approval, title insurance,
            use of the property, and your ability to exit later.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map((item) => (
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
          <h2 className="prose-title text-center mb-4">Commercial Due Diligence Support</h2>
          <p className="text-brand-muted text-center text-lg mb-10 max-w-2xl mx-auto">
            Title due diligence should produce usable answers, not just a pile
            of exceptions. We help turn the search into an action plan.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {dueDiligence.map((item) => (
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

      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h2 mb-4">
            Start Commercial Title Due Diligence
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Send the deal details and we&apos;ll identify title risks, curative
            needs, and commercial closing issues before they slow the transaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/commercial-due-diligence" className="btn-primary px-6 py-3 text-base font-semibold">
              Commercial Due Diligence
            </Link>
            <Link href="/request-title-review" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Order Title Search
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
