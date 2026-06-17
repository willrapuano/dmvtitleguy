import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  FileSearch,
  MapPin,
  Phone,
  Scale,
  Search,
  Shield,
} from "lucide-react";
import { TitleSearchOrderButton } from "@/components/TitleSearchCheckout";

export const metadata: Metadata = {
  title: "title search vienna va for Closings | Pruitt Title",
  description:
    "Vienna title search service for liens, ownership, easements, and title risks. 17+ years serving Fairfax County. Order your review online now.",
  alternates: {
    canonical: "https://dmvtitleguy.io/title-search-vienna-va",
  },
};

const covers = [
  {
    icon: Search,
    title: "Ownership Chain",
    desc: "We verify the recorded deed history and identify gaps, estate issues, missing releases, or transfers that need attention.",
  },
  {
    icon: Scale,
    title: "Liens & Judgments",
    desc: "Recorded liens, court judgments, tax liens, HOA claims, and other encumbrances are checked before they become closing problems.",
  },
  {
    icon: FileSearch,
    title: "Easements & Restrictions",
    desc: "We review recorded easements, covenants, rights-of-way, and use restrictions that may affect value or future plans.",
  },
  {
    icon: FileCheck,
    title: "Tax & Assessment Status",
    desc: "Property taxes, local assessments, and municipal balances are reviewed for open amounts and priority concerns.",
  },
  {
    icon: Building2,
    title: "HOA / Condo Review",
    desc: "For association properties, we look for liens, assessments, resale package concerns, and recorded declarations.",
  },
  {
    icon: Shield,
    title: "Title Insurance Readiness",
    desc: "The goal is a clean path to insurable title, with practical next steps for clearing defects before settlement.",
  },
];

const whyVienna = [
  {
    icon: MapPin,
    title: "Local Land Records Experience",
    desc: "Vienna properties often involve Fairfax County records, older subdivisions, easements, and association documents that benefit from local title review.",
  },
  {
    icon: Building2,
    title: "Residential and Investor Deals",
    desc: "We review owner-occupied purchases, investor acquisitions, off-market deals, auction properties, and refinance-related title questions.",
  },
  {
    icon: AlertTriangle,
    title: "Complex Property History",
    desc: "Older homes, tear-down opportunities, estate transfers, and prior refinances can create recording issues that should be resolved early.",
  },
];

const process = [
  {
    icon: FileCheck,
    title: "1. Send the Property",
    desc: "Request a title review or upload your contract with the Vienna property address and any deal documents you already have.",
  },
  {
    icon: Search,
    title: "2. We Run the Search",
    desc: "Our team reviews land records, liens, judgments, taxes, easements, and title exceptions tied to the property.",
  },
  {
    icon: CheckCircle2,
    title: "3. Get Clear Next Steps",
    desc: "You receive practical findings and guidance on what must be cleared before closing, bidding, resale, or refinance.",
  },
];

const faqs = [
  {
    q: "What is included in a title search in Vienna, VA?",
    a: "A Vienna title search reviews the ownership chain, recorded liens, judgments, taxes, easements, restrictions, and other encumbrances affecting the property. The purpose is to identify title issues before closing or before you commit to the deal.",
  },
  {
    q: "Can I order a title search before I have a signed contract?",
    a: "Yes. Investors and buyers often request a title search before bidding, before making an offer, or during early due diligence. A signed purchase contract helps, but it is not always required to begin a title review.",
  },
  {
    q: "How long does a Vienna title search take?",
    a: "Standard turnaround is typically 5-7 business days depending on property complexity and record availability. Rush review may be available for auction deadlines, short contingencies, or fast closings.",
  },
  {
    q: "Do Vienna properties have unique title issues?",
    a: "They can. Vienna properties may involve older subdivisions, utility easements, HOA or condo documents, estate transfers, and prior unreleased deeds of trust. A local title review helps identify those issues early.",
  },
  {
    q: "Can you help clear a title defect after the search?",
    a: "Yes. If the search identifies a defect, we explain the issue and the likely path to resolution, such as obtaining a release, payoff, corrective deed, court document, or additional underwriting review.",
  },
];

const relatedPages = [
  { href: "/investor-title-services", label: "Investor Title Services" },
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/upload-contract", label: "Upload Contract" },
  { href: "/request-title-review", label: "Order Title Search" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "LegalService"],
      "@id": "https://dmvtitleguy.io/title-search-vienna-va#business",
      name: "DMV Title Guy | Pruitt Title LLC",
      url: "https://dmvtitleguy.io/title-search-vienna-va",
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
      areaServed: { "@type": "City", name: "Vienna", addressRegion: "VA" },
    },
    {
      "@type": "Service",
      "@id": "https://dmvtitleguy.io/title-search-vienna-va#service",
      name: "Title Search Vienna VA",
      serviceType: "Title Search",
      provider: { "@id": "https://dmvtitleguy.io/title-search-vienna-va#business" },
      areaServed: { "@type": "City", name: "Vienna", addressRegion: "VA" },
      description:
        "Title search services for Vienna, VA properties, including ownership chain, liens, judgments, taxes, easements, restrictions, and title defect review.",
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

export default function TitleSearchViennaPage() {
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
            <span className="text-gray-200">Title Search Vienna VA</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Title Search Vienna VA
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Get a practical title search for a Vienna property before you buy,
            bid, refinance, or close. We identify liens, judgments, easements,
            ownership issues, and title defects early.
          </p>
          <div className="flex flex-wrap gap-4">
            <TitleSearchOrderButton />
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
            A useful title search goes beyond a name check. We review the
            recorded history and the practical issues that can delay closing or
            reduce property value.
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
          <h2 className="prose-title text-center mb-4">Why Vienna Title Searches Matter</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Vienna real estate moves quickly, and local title details can affect
            timing, underwriting, and negotiating leverage.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {whyVienna.map((item) => (
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
            Need a Title Search on a Vienna Property?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Send the property details or upload your contract. We&apos;ll review
            the title risks and explain the next steps clearly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <TitleSearchOrderButton />
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
