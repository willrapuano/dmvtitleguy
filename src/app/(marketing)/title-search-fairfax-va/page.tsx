import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  FileSearch,
  Landmark,
  MapPin,
  Phone,
  Scale,
  Search,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Title Search Fairfax VA | DMV Title Guy",
  description:
    "Order a title search in Fairfax, VA. We review ownership, liens, judgments, taxes, easements, restrictions, and title defects before closing.",
  alternates: {
    canonical: "https://dmvtitleguy.io/title-search-fairfax-va",
  },
};

const covers = [
  {
    icon: Search,
    title: "Ownership Verification",
    desc: "We confirm the current owner and review the recorded chain of title for gaps, estate issues, and prior transfer concerns.",
  },
  {
    icon: Scale,
    title: "Lien and Judgment Search",
    desc: "Recorded liens, judgments, deeds of trust, tax liens, and other encumbrances are identified and prioritized.",
  },
  {
    icon: FileSearch,
    title: "Easements and Covenants",
    desc: "Recorded restrictions, utility easements, access rights, and subdivision covenants are reviewed for practical impact.",
  },
  {
    icon: Landmark,
    title: "Taxes and Local Charges",
    desc: "We check property taxes, assessments, and municipal items that can affect payoff, settlement, or title insurance.",
  },
  {
    icon: Building2,
    title: "HOA and Condo Issues",
    desc: "Association liens, declarations, resale concerns, and assessment risks are flagged for Fairfax-area properties.",
  },
  {
    icon: Shield,
    title: "Curative Guidance",
    desc: "When a defect appears, we explain the likely cure path and what needs to happen before the title can be insured.",
  },
];

const whyFairfax = [
  {
    icon: MapPin,
    title: "Dense Fairfax County Records",
    desc: "Fairfax County has high transaction volume and deep land records. Thorough review helps avoid surprises in competitive deals.",
  },
  {
    icon: Building2,
    title: "Wide Property Mix",
    desc: "Fairfax includes condos, townhomes, single-family homes, estates, investor deals, and commercial properties with different title risks.",
  },
  {
    icon: AlertTriangle,
    title: "Older and Complex Titles",
    desc: "Long ownership histories can involve unreleased liens, estate transfers, easements, or covenants that need early review.",
  },
];

const process = [
  {
    icon: FileCheck,
    title: "1. Request Review",
    desc: "Send the Fairfax property address, contract, auction details, or any prior title documents you have available.",
  },
  {
    icon: Search,
    title: "2. Search the Records",
    desc: "We review land records, liens, judgments, taxes, restrictions, and title exceptions tied to the property and owners.",
  },
  {
    icon: CheckCircle2,
    title: "3. Resolve Issues",
    desc: "You receive clear findings and next steps for closing, further due diligence, title insurance, or negotiation.",
  },
];

const faqs = [
  {
    q: "What does a Fairfax title search show?",
    a: "A Fairfax title search shows the recorded ownership history, deeds of trust, liens, judgments, taxes, easements, restrictions, and other matters affecting the property. It helps identify title issues before closing or before you commit to a purchase.",
  },
  {
    q: "Can you review a Fairfax property before I make an offer?",
    a: "Yes. Buyers and investors can request title review before making an offer, before bidding at auction, or during a due diligence period. Early review can reveal defects that affect price, timing, or risk.",
  },
  {
    q: "How fast can you complete a title search in Fairfax?",
    a: "Standard title search turnaround is typically 5-7 business days. Rush review may be available depending on the property, record complexity, and deadline.",
  },
  {
    q: "Do Fairfax condos and HOAs need extra title review?",
    a: "Often, yes. Condo and HOA properties may involve association liens, assessment balances, declarations, resale documents, parking rights, and use restrictions that should be reviewed before closing.",
  },
  {
    q: "Can a title search help with foreclosure or investor properties?",
    a: "Yes. Fairfax investor and foreclosure properties often require deeper review for surviving liens, judgment risks, missing releases, and chain-of-title defects. We flag those issues and explain the practical next steps.",
  },
];

const relatedPages = [
  { href: "/title-search-vienna-va", label: "Title Search Vienna VA" },
  { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/upload-contract", label: "Upload Contract" },
  { href: "/request-title-review", label: "Order Title Search" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "LegalService"],
      "@id": "https://dmvtitleguy.io/title-search-fairfax-va#business",
      name: "DMV Title Guy | Pruitt Title LLC",
      url: "https://dmvtitleguy.io/title-search-fairfax-va",
      telephone: "+1-703-859-1467",
      image: "https://dmvtitleguy.io/logo.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1900 Gallows Rd Suite 230",
        addressLocality: "Vienna",
        addressRegion: "VA",
        postalCode: "22182",
        addressCountry: "US",
      },
      areaServed: { "@type": "City", name: "Fairfax", addressRegion: "VA" },
    },
    {
      "@type": "Service",
      "@id": "https://dmvtitleguy.io/title-search-fairfax-va#service",
      name: "Title Search Fairfax VA",
      serviceType: "Title Search",
      provider: { "@id": "https://dmvtitleguy.io/title-search-fairfax-va#business" },
      areaServed: { "@type": "City", name: "Fairfax", addressRegion: "VA" },
      description:
        "Title search services for Fairfax, VA properties, including ownership chain, liens, judgments, taxes, easements, restrictions, and title defect review.",
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

export default function TitleSearchFairfaxPage() {
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
            <span className="text-gray-200">Title Search Fairfax VA</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Title Search Fairfax VA
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Get a Fairfax title search before closing, bidding, or committing
            to a deal. We review ownership, liens, judgments, taxes, easements,
            and title defects so you know what you are taking on.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/request-title-review" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Title Search
            </Link>
            <Link href="/upload-contract" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Upload Contract
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">What a Title Search Covers</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            We focus on the recorded matters that affect ownership, financing,
            resale, and title insurance.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {covers.map((item) => (
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
          <h2 className="prose-title text-center mb-4">Why Fairfax Title Searches Matter</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Fairfax properties can have layered title history. Catching issues
            early protects your timeline and your negotiating position.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {whyFairfax.map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-brand-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step) => (
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

      <section className="bg-brand-navy text-white py-16 md:py-20">
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Title Search on a Fairfax Property?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Request a title review or upload your contract. We&apos;ll identify
            title risks and help you understand the path to closing.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/request-title-review" className="btn-primary px-6 py-3 text-base font-semibold">
              Order Title Search
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
