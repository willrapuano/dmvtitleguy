import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Ban,
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
  title: "Auction Property Title Search | DMV Title Guy",
  description:
    "Auction property title search for buyers who need liens, judgments, taxes, defects, and title risks reviewed fast across DC, Maryland, and Virginia.",
  alternates: {
    canonical: "https://dmvtitleguy.io/auction-property-title-search",
  },
};

const auctionRisks = [
  {
    icon: AlertTriangle,
    title: "Surviving Liens",
    desc: "Not every lien is wiped out by an auction or foreclosure sale. Tax liens, HOA claims, municipal charges, and other items may survive.",
  },
  {
    icon: Scale,
    title: "Judgments Against Prior Owners",
    desc: "Judgment liens can attach to title and may require payoff, release, underwriting review, or further legal analysis.",
  },
  {
    icon: FileWarning,
    title: "Recording Defects",
    desc: "Distressed properties often have missing assignments, unreleased deeds of trust, estate issues, or gaps in the recorded chain.",
  },
  {
    icon: Ban,
    title: "Tax and Municipal Issues",
    desc: "Property taxes, water bills, code liens, special assessments, and federal or state tax liens can affect closing and resale.",
  },
  {
    icon: Building2,
    title: "HOA and Condo Claims",
    desc: "Association liens, assessments, resale documents, covenants, and super-lien concerns can change the cost of ownership.",
  },
  {
    icon: Landmark,
    title: "Easements and Restrictions",
    desc: "Access rights, utility easements, covenants, restrictions, and recorded agreements may affect use, value, and financing.",
  },
];

const searchIncludes = [
  {
    icon: Search,
    title: "Ownership and Chain Review",
    desc: "We review current vesting, prior transfers, legal description issues, and recorded ownership concerns.",
  },
  {
    icon: FileSearch,
    title: "Lien and Judgment Search",
    desc: "Recorded liens, judgments, deeds of trust, tax items, and other encumbrances are identified for decision-making.",
  },
  {
    icon: FileCheck,
    title: "Title Defect Review",
    desc: "We look for unreleased loans, gaps, missing releases, estate concerns, and defects that can block insurable title.",
  },
  {
    icon: Shield,
    title: "Title Insurance Readiness",
    desc: "Findings are framed around what may need cure, underwriting review, or documentation before title insurance and closing.",
  },
  {
    icon: Gavel,
    title: "Auction Deadline Support",
    desc: "Auction buyers need fast, practical information before bid deposits, closing deadlines, and resale plans are locked in.",
  },
  {
    icon: Building2,
    title: "DMV Jurisdiction Review",
    desc: "We account for different auction, foreclosure, recording, and lien practices across DC, Maryland, and Virginia.",
  },
];

const whyBeforeClosing = [
  "Identify liens and judgments before your auction deposit is at risk",
  "Understand which recorded issues may survive the sale",
  "Flag title defects that could delay resale, refinance, or title insurance",
  "Estimate curative steps before the closing deadline gets tight",
  "Support lender and title insurance questions after the auction",
  "Make bid and closing decisions with clearer title risk information",
];

const process = [
  {
    icon: ClipboardCheck,
    title: "1. Submit Auction Details",
    desc: "Send the property address, auction notice or listing, trustee information if available, and your bid or closing deadline.",
  },
  {
    icon: Search,
    title: "2. Search Title Risk",
    desc: "We review ownership, liens, judgments, taxes, recorded defects, easements, restrictions, and jurisdiction-specific issues.",
  },
  {
    icon: CheckCircle2,
    title: "3. Use the Findings",
    desc: "You receive practical title findings for bidding, closing, cure, title insurance, resale, or walking away.",
  },
];

const faqs = [
  {
    q: "What is an auction property title search?",
    a: "An auction property title search reviews ownership, liens, judgments, taxes, deeds of trust, easements, restrictions, and title defects that may affect a property being purchased at auction.",
  },
  {
    q: "Why should I order a title search before auction closing?",
    a: "Auction buyers often have short closing deadlines and limited protections. A title search can reveal liens, judgments, tax issues, unreleased loans, or defects that may affect closing, title insurance, resale, or refinance.",
  },
  {
    q: "Should I search title before bidding or after winning?",
    a: "Before bidding is usually best because it lets you account for risk before committing funds. If you already won the auction, title review still matters because it can identify what must be cleared before closing or resale.",
  },
  {
    q: "Can auction liens survive the sale?",
    a: "Some liens and claims can survive depending on the sale type, lien priority, jurisdiction, and recorded facts. We flag recorded issues that need review before you rely on the auction result.",
  },
  {
    q: "Do you support auction buyers across the DMV?",
    a: "Yes. We support auction property title searches for buyers across DC, Maryland, and Virginia, including investor, foreclosure, tax sale, REO, and distressed property transactions.",
  },
];

const relatedPages = [
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/commercial-due-diligence", label: "Commercial Due Diligence" },
  { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
  { href: "/commercial-real-estate-closings", label: "Commercial Real Estate Closings" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://dmvtitleguy.io/auction-property-title-search#service",
      name: "Auction Property Title Search",
      serviceType: "Auction Property Title Search",
      provider: {
        "@type": "LegalService",
        name: "DMV Title Guy | Pruitt Title LLC",
        telephone: "+1-703-859-1467",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1900 Gallows Rd Ste 230",
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
        "Auction property title search for buyers purchasing properties at auction who need liens, judgments, taxes, title defects, and closing risks reviewed fast across DC, Maryland, and Virginia.",
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

export default function AuctionPropertyTitleSearchPage() {
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
            <span className="text-gray-200">Auction Property Title Search</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Auction Property Title Search
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Fast title search support for auction buyers who need to understand
            liens, judgments, taxes, title defects, and closing risk before the
            auction deadline controls the deal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/calculators/title-quote" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Title Search
            </Link>
            <Link href="/investor-title-services" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Investor Title Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">Auction Title Risks</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Auction properties are often sold quickly and with limited
            protections. The title record needs to be checked before hidden
            problems become your closing problem.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionRisks.map((item) => (
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
          <h2 className="prose-title text-center mb-4">What an Auction Title Search Includes</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            The search is built to answer what affects the property, what may
            need cure, and what could affect closing or resale.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchIncludes.map((item) => (
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
          <h2 className="prose-title text-center mb-4">Why Title Search Before Auction Closing Matters</h2>
          <p className="text-brand-muted text-center text-lg mb-10 max-w-2xl mx-auto">
            Title risk is easier to price, negotiate, or avoid before the
            closing clock is running.
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
            Order Auction Title Support
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Send the auction property details and we&apos;ll identify liens,
            defects, curative needs, and closing risks before they slow the deal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/calculators/title-quote" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Title Search
            </Link>
            <Link href="/foreclosure-title-review" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Foreclosure Title Review
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
