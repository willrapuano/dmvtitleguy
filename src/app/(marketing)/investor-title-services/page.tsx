import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  FileCheck,
  AlertTriangle,
  Building2,
  Search,
  Users,
  Zap,
  MapPin,
  UserCheck,
  ChevronDown,
  Phone,
  Gavel,
  Home,
  TrendingUp,
  Handshake,
} from "lucide-react";
import { ServiceSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Investor Title Services in DC, Maryland & Virginia | DMV Title Guy",
  description:
    "Fast, reliable title services for real estate investors across the DMV. Title searches, auction support, wholesale closings, and investor due diligence. Call (703) 859-1467.",
  alternates: { canonical: "https://dmvtitleguy.io/investor-title-services" },
};

const investorServices = [
  {
    icon: Search,
    title: "Title Searches for Auction Properties",
    desc: "Comprehensive title searches that uncover hidden liens, judgments, and defects before you bid at auction.",
  },
  {
    icon: FileCheck,
    title: "Pre-Purchase Title Search",
    desc: "For investors who need answers before committing. Order a standalone paid title search — we review ownership, liens, judgments, easements, and title defects before you go under contract. No purchase contract required.",
  },
  {
    icon: Handshake,
    title: "Wholesale & Double Closing Support",
    desc: "Assignment contracts, simultaneous closings, and investor-specific transaction structures handled correctly.",
  },
  {
    icon: Building2,
    title: "Portfolio Transaction Management",
    desc: "Multi-property acquisitions and dispositions with coordinated title work and closing schedules.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    desc: "5–7 business days standard. 1–3 business days rush. We know investors don't wait.",
  },
];

const whoWeServe = [
  {
    icon: TrendingUp,
    title: "Flip Investors",
    desc: "Title cleared fast so you can renovate and resell without surprises.",
  },
  {
    icon: Home,
    title: "Buy-and-Hold Landlords",
    desc: "Clean title for rental acquisitions — single-family and small multi-family.",
  },
  {
    icon: Users,
    title: "Wholesale Buyers",
    desc: "We handle assignment contracts and double closings across the DMV.",
  },
  {
    icon: Gavel,
    title: "Auction Buyers",
    desc: "Title searches before you bid and post-auction due diligence.",
  },
  {
    icon: Building2,
    title: "REIT & Fund Managers",
    desc: "Institutional-grade title work for portfolio acquisitions and dispositions.",
  },
];

const whyUs = [
  {
    icon: Clock,
    title: "Speed Investors Need",
    desc: "5–7 day standard turnaround. 1–3 day rush. We don't slow your deal down.",
  },
  {
    icon: MapPin,
    title: "Full DMV Coverage",
    desc: "DC, Maryland, and Virginia — one team, all three jurisdictions. No handoffs.",
  },
  {
    icon: Shield,
    title: "Investor-Specific Expertise",
    desc: "We understand auction risk, wholesale structures, and investment timelines — because we work with investors every day.",
  },
  {
    icon: UserCheck,
    title: "Single Point of Contact",
    desc: "One person handles your file from search to close. No rotating coordinators.",
  },
];

const howItWorks = [
  {
    icon: FileCheck,
    title: "1. Submit Your Deal",
    desc: "Use our investor due diligence form to send property details, upload documents, and tell us your timeline.",
    link: "/investor-due-diligence",
  },
  {
    icon: Search,
    title: "2. We Run Title",
    desc: "Full title search, lien check, judgment search, and chain-of-title verification — tailored to your transaction type.",
  },
  {
    icon: Shield,
    title: "3. Get Results & Close",
    desc: "Detailed title report with clear findings. Rush available for time-sensitive closings.",
  },
];

const faqs = [
  {
    q: "What makes investor title services different from standard title work?",
    a: "Investor transactions move faster and carry different risks. We look for the things that kill investor deals — surviving liens from foreclosures, judgment liens that follow the debtor, recording gaps in wholesale chains, and HOA super-liens. Standard residential title work often misses these.",
  },
  {
    q: "How fast can you turn around a title search?",
    a: "Standard turnaround is 5–7 business days. Rush service is 1–3 business days. For auction deadlines, we can often accommodate same-day preliminary searches — call us directly.",
  },
  {
    q: "Do you handle double closings and assignment contracts?",
    a: "Yes. We regularly process wholesale transactions including assignment contracts and simultaneous (double) closings. We coordinate with all parties to keep the transaction on schedule.",
  },
  {
    q: "Can I get a title search before I bid at auction?",
    a: "Absolutely — and we strongly recommend it. Auction properties carry elevated title risk. A pre-auction title search can save you from buying a property with surviving liens or title defects that wipe out your margin.",
  },
  {
    q: "What does investor due diligence include?",
    a: "Our due diligence package includes a full title search, lien and judgment check, ownership chain verification, easement review, tax status, and a comprehensive title report with recommendations and risk assessment.",
  },
];

const relatedPages = [
  { href: "/auction-property-title-search", label: "Auction Property Title Search" },
  { href: "/foreclosure-title-review", label: "Foreclosure Title Review" },
  { href: "/investor-friendly-title-company", label: "Investor-Friendly Title Company" },
  { href: "/investor-due-diligence", label: "Investor Due Diligence" },
  { href: "/upload-contract", label: "Upload Contract" },
  { href: "/request-title-review", label: "Request Title Review" },
];

export default function InvestorTitleServicesPage() {
  return (
    <>
      <ServiceSchema
        name="Investor Title Services in DC, Maryland & Virginia"
        description="Fast, reliable title services for real estate investors across the DMV. Title searches, auction support, wholesale closings, and investor due diligence."
        serviceType="Investor Title Services"
      />
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{
          background:
            "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)",
        }}
      >
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Investor Title Services</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Investor Title Services in the DMV
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            Fast, reliable title services built for real estate investors across
            DC, Maryland, and Virginia. Title searches, auction support,
            wholesale closings, and investor due diligence — all under one roof.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/investor-due-diligence"
              className="btn-primary px-6 py-3 text-base font-semibold inline-flex items-center gap-2"
            >
              Order a Title Search
            </Link>
            <a
              href="tel:+17038591467"
              className="btn-outline px-6 py-3 text-base font-semibold inline-flex items-center gap-2 text-white border-white/40 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> (703) 859-1467
            </a>
          </div>
        </div>
      </section>

      {/* WHAT INVESTORS NEED */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            What Investors Need From a Title Company
          </h2>
          <p className="text-brand-muted text-center text-lg mb-6 max-w-2xl mx-auto">
            Investor deals carry different risks than standard residential
            transactions. We know what to look for — and what to flag before it
            kills your deal.
          </p>
          <p className="text-center text-brand-blue font-semibold mb-12">
            Standalone investor title searches available — order without a purchase contract.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investorServices.map((s) => (
              <div key={s.title} className="flex gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green">
                  <s.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">
                    {s.title}
                  </h3>
                  <p className="text-brand-muted text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="section-light py-16">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            Who We Serve
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            From solo flippers to institutional funds — if you buy real estate
            as an investment in the DMV, we handle your title work.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whoWeServe.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <s.icon className="h-8 w-8 text-brand-blue mb-3" />
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {s.title}
                </h3>
                <p className="text-brand-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY INVESTORS CHOOSE US */}
      <section className="py-16 bg-brand-gray-bg">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-4">
            Why Investors Choose DMV Title Guy
          </h2>
          <p className="text-brand-muted text-center text-lg mb-12 max-w-2xl mx-auto">
            We work the way investors work — fast, decisive, and focused on
            results.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyUs.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-lg p-6 shadow-sm flex gap-4"
              >
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green">
                  <w.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">
                    {w.title}
                  </h3>
                  <p className="text-brand-muted text-sm">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-green mb-4">
                  <step.icon className="h-7 w-7 text-brand-navy" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-muted text-sm">{step.desc}</p>
                {step.link && (
                  <Link
                    href={step.link}
                    className="text-brand-blue text-sm font-semibold mt-2 inline-block hover:underline"
                  >
                    Order Now →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light py-16">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-lg shadow-sm group"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-brand-navy">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-brand-muted shrink-0 ml-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-brand-muted text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="bg-brand-navy text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)",
        }}
      >
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Order a Title Search for Your Next Deal
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Order a paid title search, upload a contract, or request a title
            review — we&apos;ll take it from here.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/investor-due-diligence"
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              Order a Title Search
            </Link>
            <Link
              href="/upload-contract"
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              Upload Contract
            </Link>
            <Link
              href="/request-title-review"
              className="btn-outline px-6 py-3 text-base font-semibold text-white border-white/40 hover:bg-white/10"
            >
              Request Title Review
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            Prefer to talk? Call us at{" "}
            <a
              href="tel:+17038591467"
              className="text-white font-semibold hover:underline"
            >
              (703) 859-1467
            </a>
          </p>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section className="py-12 bg-brand-gray-bg">
        <div className="container-xl">
          <h3 className="text-lg font-bold text-brand-navy mb-6">
            Related Pages
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedPages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-brand-navy"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
