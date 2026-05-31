import type { Metadata } from "next";
import Link from "next/link";
import {
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
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Commercial Real Estate Closings | DMV Title Guy",
  description:
    "Commercial real estate closings, title review, escrow coordination, and settlement support for commercial buyers, sellers, lenders, and investors.",
  alternates: {
    canonical: "https://dmvtitleguy.io/commercial-real-estate-closings",
  },
};

const closingInvolves = [
  {
    icon: Search,
    title: "Commercial Title Search",
    desc: "Ownership, liens, judgments, taxes, easements, restrictions, leases, and title exceptions are reviewed before settlement.",
  },
  {
    icon: Shield,
    title: "Title Insurance Coordination",
    desc: "We coordinate title insurance requirements, endorsements, underwriting questions, and lender title conditions.",
  },
  {
    icon: Landmark,
    title: "Escrow and Payoff Handling",
    desc: "Commercial closings require precise payoff, release, tax, escrow, recording, and disbursement coordination.",
  },
  {
    icon: Building2,
    title: "Entity and Authority Review",
    desc: "LLCs, corporations, partnerships, trusts, and authorized signers must be confirmed for valid conveyance and closing documents.",
  },
  {
    icon: FileSearch,
    title: "Document and Exception Review",
    desc: "Surveys, leases, easements, declarations, loan documents, and recorded agreements are reviewed for closing impact.",
  },
  {
    icon: Users,
    title: "Multi-Party Coordination",
    desc: "Commercial deals often involve buyers, sellers, brokers, lenders, attorneys, tenants, and asset managers with competing deadlines.",
  },
];

const process = [
  {
    icon: ClipboardCheck,
    title: "1. Open the File",
    desc: "Send the contract, property information, lender contact, entity details, and any survey or prior title policy.",
  },
  {
    icon: Search,
    title: "2. Review Title and Requirements",
    desc: "We run commercial title, identify exceptions, review lender requirements, and flag curative items early.",
  },
  {
    icon: FileCheck,
    title: "3. Prepare for Settlement",
    desc: "Closing documents, escrow figures, payoffs, releases, and recording requirements are coordinated for settlement.",
  },
  {
    icon: CheckCircle2,
    title: "4. Close and Record",
    desc: "Funds are disbursed, documents are recorded, and title policy work moves forward after closing.",
  },
];

const comparison = [
  {
    icon: Building2,
    title: "More Deal Structures",
    desc: "Commercial closings can involve asset purchases, entity transfers, 1031 exchanges, seller financing, and complex lender conditions.",
  },
  {
    icon: Scale,
    title: "More Legal and Title Exceptions",
    desc: "Commercial title commitments often require review of surveys, zoning issues, access, leases, reciprocal easements, and use restrictions.",
  },
  {
    icon: Landmark,
    title: "More Coordination",
    desc: "The closing timeline must account for lenders, attorneys, brokers, tenants, municipalities, payoff lenders, and entity signers.",
  },
];

const faqs = [
  {
    q: "What is involved in commercial real estate closings?",
    a: "Commercial real estate closings involve title search, title insurance coordination, escrow handling, payoff and release review, entity authority verification, lender requirement coordination, document preparation, signing, disbursement, and recording.",
  },
  {
    q: "How long does a commercial real estate closing take?",
    a: "Timing depends on lender requirements, title issues, survey needs, entity documents, and due diligence deadlines. Many commercial transactions take longer than residential closings because more parties and title conditions must be coordinated.",
  },
  {
    q: "Do commercial closings require title insurance?",
    a: "Most lender-financed commercial transactions require lender's title insurance, and many buyers also obtain owner's coverage. Title insurance helps protect against covered title defects, liens, and recorded matters not otherwise resolved before closing.",
  },
  {
    q: "What documents should I provide to start a commercial closing?",
    a: "Useful documents include the purchase contract, property address, legal description, lender contact, entity documents, survey, leases, prior title policy, payoff information, and any special closing instructions.",
  },
  {
    q: "Can you help with commercial title issues before closing?",
    a: "Yes. We identify title exceptions and curative requirements, then help coordinate releases, payoffs, corrective documents, underwriting review, and lender title conditions.",
  },
];

const relatedPages = [
  { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
  { href: "/investor-due-diligence", label: "Commercial Due Diligence" },
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/upload-contract", label: "Upload Contract" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://dmvtitleguy.io/commercial-real-estate-closings#service",
      name: "Commercial Real Estate Closings",
      serviceType: "Commercial Real Estate Closing Services",
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
        "Commercial real estate closing, title review, escrow coordination, title insurance, and settlement support for commercial buyers, sellers, lenders, and investors.",
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

export default function CommercialRealEstateClosingsPage() {
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
            <span className="text-gray-200">Commercial Real Estate Closings</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Commercial Real Estate Closings
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Commercial closing support for buyers, sellers, lenders, investors,
            and operators who need title review, escrow coordination, lender
            compliance, and settlement handled clearly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/request-title-review" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Commercial Title Search
            </Link>
            <Link href="/upload-contract" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Upload Contract
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">What Commercial Closings Involve</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            A commercial closing is more than a signing appointment. It is a
            coordinated process for title, escrow, lender, entity, and recording
            requirements.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {closingInvolves.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green">
                  <item.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">{item.title}</h3>
                  <p className="text-brand-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-16">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">Commercial Closing Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step) => (
              <div key={step.title} className="bg-white rounded-lg p-6 shadow-sm">
                <step.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">{step.title}</h3>
                <p className="text-brand-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">Commercial vs. Residential Closings</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Commercial transactions have more variables, more documents, and
            more parties. The closing process needs to match that complexity.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {comparison.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-lg p-6">
                <item.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy text-white py-16 md:py-20">
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Commercial Closing Support?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Upload the contract or request a commercial title review. We&apos;ll
            identify title, escrow, and closing requirements early.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/request-title-review" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Commercial Title Search
            </Link>
            <Link href="/upload-contract" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Upload Contract
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
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
          <h3 className="text-lg font-bold text-brand-navy mb-6">Related Pages</h3>
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
