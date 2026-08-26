import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Title Company Arlington VA | Settlement & Title Services",
  description: "Practical Arlington title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review.",
  alternates: { canonical: "/title-company/arlington-va" },
};

const faqs = [
  {
    question: "How much does title insurance cost in Arlington, VA?",
    answer: "Title insurance premiums in Arlington are regulated by the Virginia Bureau of Insurance. For a $500,000 home, owner's title insurance typically costs around $1,500-2,000. As a simultaneous issue state, Virginia offers discounts when lender's and owner's policies are issued together.",
  },
  {
    question: "What are the closing costs for sellers in Arlington?",
    answer: "Sellers in Arlington pay the grantor tax ($0.50 per $500 of sales price), pro-rated property taxes, and any outstanding liens. Seller closing costs typically range from 1-3% of the sale price, excluding real estate commissions.",
  },
  {
    question: "How long does it take to close in Arlington?",
    answer: "Most residential closings in Arlington complete within 30-45 days from contract ratification. PuPritt Title LLC offers expedited closings for clients who need faster settlement, sometimes as quick as 7-14 days.",
  },
  {
    question: "What documents do I need for an Arlington closing?",
    answer: "You'll need government-issued ID, proof of insurance, mortgage documents (if applicable), and any addenda to the contract. Your closing coordinator will provide a complete checklist specific to your transaction.",
  },
  {
    question: "How long does title search take in Arlington?",
    answer: "Arlington title searches typically take 3-5 business days. For refinances or transactions with urgency, we can often expedite preliminary title reports within 24-48 hours.",
  },
  {
    question: "Are RON closings available in Arlington?",
    answer: "Yes! Pruitt Title offers Remote Online Notarization (RON) for Arlington transactions. This allows buyers and sellers to sign documents electronically from anywhere, streamlining the closing process for remote clients.",
  },
];

export default function ArlingtonTitlePage() {
  return (
    <>
      <LocationSchema 
        city="Arlington" 
        state="VA" 
        county="Arlington County" 
        slug="title-company/arlington-va"
        description="Practical Arlington title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review."
      />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Virginia Closing Costs", href: "/virginia-closing-cost-calculator" }, { label: "Arlington" }]}
        eyebrow="Arlington County, Virginia"
        title="Title Company Arlington VA &mdash; Settlement & Title Services"
        lede="Pruitt Title LLC has served Arlington homeowners and real estate professionals since 2007, combining local expertise, responsive communication, and dependable settlement coordination."
        actions={
          <>
            <Link href="/calculators/title-quote" className="btn-primary px-7">Get an Arlington Title Quote</Link>
            <Link href="/contact" className="btn-on-dark px-7">Start a Closing</Link>
          </>
        }
      />

      <ClosingCostCalculator state="VA" />

      {/* LOCAL INSIGHT */}
      <section className="bg-brand-action py-10 text-white">
        <div className="container-xl max-w-3xl">
          {/* The label previously used an undefined brand colour utility, so it
              inherited the band's white and carried no emphasis at all. Now an
              eyebrow with a real icon, matching the homepage pattern. */}
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue-100">
            <Lightbulb size={14} strokeWidth={2} aria-hidden="true" />
            Local insight
          </p>
          <p className="mt-3 max-w-[68ch] text-lg leading-relaxed">
            Arlington's average days-on-market is just 7—a blazing fast market where a local title partner prevents deal fall-throughs that cost buyers their dream home.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Why Arlington Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Arlington County is one of the most competitive real estate markets in the Washington DC metro area. With a median home price exceeding $700,000 and a high concentration of federal contractors and government employees, Arlington attracts buyers seeking proximity to DC without the DC price tag.
            </p>
            <p className="max-w-[68ch]">
              The Arlington market is known for its quick sales—properties often receive multiple offers within days of listing. This fast-paced environment demands a title company that can keep up: fast preliminary reports, responsive coordinators, and flexible closing schedules. Pruitt Title understands Arlington's unique rhythm and ensures your settlement stays on track.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Title Services in Arlington</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Comprehensive title searches to identify any liens, encumbrances, or ownership issues before closing.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Protect your investment with owner's title insurance coverage against hidden title defects.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Required by most lenders, we issue ALTA owner's and lender's policies with competitive rates.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">We handle the entire closing process, from contract to recorded deed and title policy delivery.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Refinance Closings</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Streamlined refinance settlements with fast turn times and flexible scheduling.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">RON available for clients who cannot attend closing in person.</p>
            </div>
          </div>
        </div>
      </section>


      {/* INVESTOR SERVICES */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Investor Services</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/investor-title-services" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Title Services</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Title searches, auction support & wholesale closings.</p>
            </Link>
            <Link href="/auction-property-title-search" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Pre-auction title search & risk assessment.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Surviving liens & chain-of-title review.</p>
            </Link>
            <Link href="/investor-due-diligence" className="surface-card p-5 transition-colors duration-150 hover:border-brand-blue/40">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Submit property info & request a title-search introduction.</p>
            </Link>
          </div>
        </div>
      </section>
      {/* INTERNAL LINKS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-6">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue-deep hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue-deep hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs Guide →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Cost Calculator →
            </Link>
            <Link href="/title-company/fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
            </Link>
            <Link href="/title-company/alexandria-va" className="text-brand-blue-deep hover:underline">
              Alexandria Title Services →
            </Link>
            <Link href="/title-company-falls-church-va" className="text-brand-blue-deep hover:underline">
              Falls Church Title Services →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue-deep hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Arlington Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Arlington property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/virginia-closing-cost-calculator" className="btn-primary px-8">
              Get a Quote →
            </Link>
            <a href="tel:+15714744000" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Call (571) 474-4000
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
