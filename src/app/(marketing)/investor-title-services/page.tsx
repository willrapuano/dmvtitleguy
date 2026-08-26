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
  Phone,
  Scale,
  Search,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { TitleSearchOrderButton } from "@/components/TitleSearchCheckout";

export const metadata: Metadata = {
  title: "Investor Title Services | DMV Title Guy",
  description:
    "Investor title services for real estate investors, wholesalers, and flippers who need fast title searches and closing support across DC, Maryland, and Virginia.",
  alternates: {
    canonical: "https://dmvtitleguy.io/investor-title-services",
  },
};

const investorServices = [
  {
    icon: Search,
    title: "Fast Title Searches",
    desc: "Ownership, liens, judgments, taxes, easements, restrictions, and title defects are reviewed before your timeline gets tight.",
  },
  {
    icon: FileSearch,
    title: "Distressed Property Review",
    desc: "Auction, foreclosure, REO, estate, and off-market properties are checked for the recorded issues that can erase investor margin.",
  },
  {
    icon: Scale,
    title: "Lien and Judgment Checks",
    desc: "We identify recorded liens, judgments, tax items, HOA charges, municipal issues, and payoff concerns that need attention.",
  },
  {
    icon: Users,
    title: "Wholesale Transaction Support",
    desc: "Assignments, double closings, investor resales, and short contract windows require title support built for deal velocity.",
  },
  {
    icon: Building2,
    title: "Entity and Vesting Review",
    desc: "LLCs, trusts, partnerships, and investor entities are checked for vesting, authority, and closing document requirements.",
  },
  {
    icon: Shield,
    title: "Title Insurance Coordination",
    desc: "We help move title issues toward cure, underwriting review, insurable title, and settlement readiness.",
  },
];

const whySpecialized = [
  {
    icon: Zap,
    title: "Investor Timelines Are Short",
    desc: "Investors often need answers before a bid, due diligence deadline, resale, or lender condition expires.",
  },
  {
    icon: AlertTriangle,
    title: "Hidden Title Risk Can Kill Profit",
    desc: "Surviving liens, judgments, tax issues, HOA claims, and recording gaps can change the economics of a deal quickly.",
  },
  {
    icon: TrendingUp,
    title: "Exit Strategy Depends on Title",
    desc: "Clean title affects resale, refinance, title insurance, lender approval, and the next buyer&apos;s confidence.",
  },
];

const dmvFocus = [
  "Investor title searches across DC, Maryland, and Virginia",
  "Auction, foreclosure, wholesale, flip, rental, and portfolio support",
  "Lien, judgment, tax, HOA, municipal, and UCC issue spotting",
  "Title exception review for resale, refinance, and closing readiness",
  "Coordination for title insurance, lender review, and curative needs",
  "Clear title findings written for practical investor decisions",
];

const process = [
  {
    icon: ClipboardCheck,
    title: "1. Send the Property Details",
    desc: "Provide the address, contract or auction information if available, investor entity details, and your deadline.",
  },
  {
    icon: Search,
    title: "2. We Review Title Risk",
    desc: "We search ownership, liens, judgments, taxes, recorded exceptions, entity concerns, and investor-specific title issues.",
  },
  {
    icon: FileCheck,
    title: "3. Get Clear Next Steps",
    desc: "You receive practical findings for bidding, closing, cure, resale, refinance, or deciding whether to walk away.",
  },
];

const faqs = [
  {
    q: "What are investor title services?",
    a: "Investor title services are title searches, lien reviews, title insurance coordination, and closing support built for real estate investors, wholesalers, flippers, landlords, and buyers working under short timelines.",
  },
  {
    q: "Why do investors need specialized title support?",
    a: "Investor deals often involve distressed properties, short due diligence periods, assignments, double closings, entity buyers, and resale or refinance plans. Specialized title review focuses on issues that affect margin, closing speed, and exit strategy.",
  },
  {
    q: "Can you help before I bid or go under contract?",
    a: "Yes. Early title review can help identify liens, judgments, taxes, ownership problems, easements, restrictions, and title defects before you commit more money to the deal.",
  },
  {
    q: "Do you work with wholesalers and flippers?",
    a: "Yes. We support wholesalers, flippers, buy-and-hold investors, auction buyers, foreclosure buyers, and portfolio investors across the DMV area.",
  },
  {
    q: "What should I send to order title work?",
    a: "Send the property address, legal description if available, contract or auction information, buyer entity details, known title concerns, and the deadline for your decision or closing.",
  },
];

const relatedPages = [
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/commercial-due-diligence", label: "Commercial Due Diligence" },
  { href: "/commercial-property-title-search", label: "Commercial Property Title Search" },
  { href: "/commercial-real-estate-closings", label: "Commercial Real Estate Closings" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://dmvtitleguy.io/investor-title-services#guide",
      headline: "Investor Title Guide",
      about: { "@type": "Thing", name: "Investor Title Topics" },
      spatialCoverage: [
        { "@type": "State", name: "Virginia" },
        { "@type": "State", name: "Maryland" },
        { "@type": "AdministrativeArea", name: "Washington DC" },
      ],
      description:
        "Investor title services for real estate investors, wholesalers, flippers, and auction buyers who need fast title searches, lien review, title insurance coordination, and closing support across DC, Maryland, and Virginia.",
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

export default function InvestorTitleServicesPage() {
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
            <span className="text-gray-200">Investor Title Services</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Investor Title Services
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Fast title work for real estate investors, wholesalers, flippers,
            auction buyers, and portfolio owners who need clear answers before
            bidding, closing, reselling, or refinancing.
          </p>
          <div className="flex flex-wrap gap-4">
            <TitleSearchOrderButton defaultTransactionType="Investor/Wholesale" />
            <Link href="/commercial-due-diligence" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Commercial Due Diligence
            </Link>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">What Investor Title Services Include</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Investor title work should answer what affects the property, what
            needs cure, and whether the deal still works before your deadline.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investorServices.map((item) => (
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
          <h2 className="prose-title text-center mb-4">Why Investors Need Specialized Title Support</h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            Investment deals are often faster, more distressed, and less
            forgiving than standard residential purchases.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {whySpecialized.map((item) => (
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
          <h2 className="prose-title text-center mb-4">DMV-Area Investor Title Focus</h2>
          <p className="text-brand-muted text-center text-lg mb-10 max-w-2xl mx-auto">
            DC, Maryland, and Virginia each have different recording systems,
            foreclosure rules, lien concerns, and closing expectations.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {dmvFocus.map((item) => (
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
            Order Investor Title Work
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Send the property details and we&apos;ll identify title risks,
            curative needs, and closing issues before they slow your deal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <TitleSearchOrderButton defaultTransactionType="Investor/Wholesale" />
            <Link href="/auction-property-title-search" className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10">
              Auction Property Title Search
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
