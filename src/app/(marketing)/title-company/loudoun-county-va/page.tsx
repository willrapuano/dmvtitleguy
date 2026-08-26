import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Loudoun County VA | Settlement & Title Services",
  description: "Practical Loudoun County title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review.",
  alternates: { canonical: "/title-company/loudoun-county-va" },
};

const faqs = [
  {
    question: "How much does title insurance cost in Loudoun County, VA?",
    answer: "Title insurance premiums in Loudoun County are regulated by the Virginia Bureau of Insurance. For a $775,000 home—the current median in Loudoun—owner's title insurance typically costs around $2,100-2,800. Virginia's simultaneous issue discount reduces the total when both lender's and owner's policies are purchased together.",
  },
  {
    question: "What are the closing costs for buyers in Loudoun County?",
    answer: "Buyers in Loudoun County pay approximately 2-4% of the purchase price in closing costs. This includes the state recordation tax ($0.25 per $100), lender fees, title insurance, and prorated property taxes. Loudoun County does not add a local recordation tax, keeping buyer costs slightly lower than some neighboring jurisdictions.",
  },
  {
    question: "How long does a Loudoun County title search take?",
    answer: "Standard Loudoun County title searches take 3-5 business days. For new construction in Ashburn or Brambleton, or for properties in master-planned communities with HOA covenants, we allow additional time to review all community-specific documents.",
  },
  {
    question: "What makes Loudoun County title work unique?",
    answer: "Loudoun's rapid growth means many transactions involve new construction, master-planned communities with complex HOA structures, and properties with Loudoun Water or Dulles Airport authority easements. Our team is experienced with these specific issues that are common in one of America's fastest-growing counties.",
  },
  {
    question: "Are RON closings available in Loudoun County?",
    answer: "Yes, Remote Online Notarization is fully available for Loudoun County transactions. This is especially popular for tech professionals who travel frequently or are relocating from out of state for jobs in the Dulles Corridor.",
  },
  {
    question: "Does Loudoun County have additional transfer taxes for sellers?",
    answer: "Sellers in Loudoun County pay Virginia's standard grantor tax of $0.50 per $500 of the sales price. There is no additional local transfer tax in Loudoun County, which helps keep seller closing costs predictable compared to some Maryland jurisdictions.",
  },
];

export default function LoudounCountyTitlePage() {
  return (
    <>
      <LocationSchema
        city="Loudoun County"
        state="VA"
        county="Loudoun County"
        slug="title-company/loudoun-county-va"
        description="Practical Loudoun County title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review."
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/virginia-closing-cost-calculator" className="hover:text-brand-blue">Virginia Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Loudoun County</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Title Company Loudoun County VA &mdash; Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC serves Loudoun County's fast-growing real estate market with precision and speed. From Ashburn townhouses to Leesburg estates, we understand the unique demands of closing in America's wealthiest county.
          </p>
        </div>
      </section>

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
            Loudoun County's median home price is ~$775K with homes moving in about 10 days. In a market this fast and this expensive, a delayed title search can cost buyers their dream home. We turn Loudoun title reports around in 48 hours.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Why Loudoun County Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Loudoun County is the wealthiest county in America by median household income and one of the fastest-growing regions in the country. With a median home price around $775,000 and homes selling in approximately 10 days, Loudoun is a competitive market where every hour counts.
            </p>
            <p className="max-w-[68ch]">
              The county's real estate landscape spans from the historic downtown of Leesburg to the tech corridors of Ashburn and Dulles. New construction dominates in master-planned communities like Brambleton and Aldie, while established neighborhoods in Sterling and Purcellville offer more traditional suburban living. This diversity means title issues can range from complex HOA covenants in new developments to century-old easements on rural properties. Pruitt Title's local expertise ensures nothing falls through the cracks.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Title Services in Loudoun County</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Comprehensive title searches through Loudoun County land records, covering everything from historic Leesburg properties to new Ashburn subdivisions.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Protect your Loudoun County investment with comprehensive owner's title insurance coverage against hidden defects.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">ALTA policies for all major lenders serving the Loudoun County market, including jumbo loan coverage for high-value properties.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Full-service closings from contract ratification to recorded deed and title policy delivery.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">New Construction Closings</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Specialized expertise for new construction and builder transactions common in Loudoun's rapidly developing communities.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">RON available for busy professionals and out-of-state buyers relocating to Loudoun County.</p>
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
            <Link href="/title-company/prince-william-county-va" className="text-brand-blue-deep hover:underline">
              Prince William County Title Services →
            </Link>
            <Link href="/title-company/arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-company/alexandria-va" className="text-brand-blue-deep hover:underline">
              Alexandria Title Services →
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
          <h2 className="t-h3 text-white mb-4">Get Your Loudoun County Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Loudoun County property.
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
