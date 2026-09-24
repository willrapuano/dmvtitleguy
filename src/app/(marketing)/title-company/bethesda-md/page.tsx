import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Bethesda MD | Settlement & Title Services",
  description: "Practical Bethesda title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review.",
  alternates: { canonical: "/title-company-bethesda-md" },
};

const faqs = [
  {
    question: "How much does title insurance cost in Montgomery County, MD?",
    answer: "Maryland title insurance rates are filed with the Maryland Insurance Administration. For a $700,000 home in Bethesda, owner's title insurance typically costs $1,800-2,500. Maryland offers a simultaneous issue discount when both lender's and owner's policies are purchased together.",
  },
  {
    question: "What are the transfer and recordation taxes in Bethesda?",
    answer: "In Montgomery County, the state transfer tax is 0.5% and the county transfer tax is 1% of the price. Recordation tax is $4.45 per $500 on the first $500,000, with higher rates above that and the first $100,000 exempt for a principal residence. Maryland law presumes the buyer and seller split these taxes equally unless the contract says otherwise.",
  },
  {
    question: "Does Maryland require attorney involvement at closing?",
    answer: "Maryland settlement and title work must be handled by an appropriately authorized provider. For clients closing with Will, the Pruitt Title team handles the title and settlement work and provides the required disclosures.",
  },
  {
    question: "What is unique about Bethesda real estate transactions?",
    answer: "Bethesda transactions can involve high values, trusts, estates, or multiple properties. Tell Will about these early so the Pruitt Title team can plan for underwriting requirements and timing on your file.",
  },
  {
    question: "How long does a Bethesda title search take?",
    answer: "Montgomery County title searches typically take 5-7 business days. For new construction or complex titles involving estates, allow additional time for thorough research.",
  },
  {
    question: "Are there first-time homebuyer exemptions in Montgomery County?",
    answer: "Yes. First-time Maryland homebuyers pay no state transfer tax: the rate drops from 0.5% to 0.25% and the seller pays it. By default the seller also pays the county transfer and recordation taxes, unless the contract expressly says otherwise. The county transfer tax itself is 1% of the price.",
  },
];

export default function BethesdaTitlePage() {
  return (
    <>
      <LocationSchema 
        city="Bethesda" 
        state="MD" 
        county="Montgomery County" 
        slug="title-company/bethesda-md"
        description="Practical Bethesda title and closing guidance from DMV Title Guy. Eligible service requests may be referred to Pruitt Title LLC for independent review."
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/maryland" className="hover:text-white">Maryland Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Bethesda</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Title Company Bethesda MD &mdash; Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            DMV Title Guy publishes practical Bethesda and Montgomery County title and closing guidance. When you're ready to close, Will and the Pruitt Title team handle your title and settlement.
          </p>
        </div>
      </section>

      <TitleQuoteEmbed title="Get a Bethesda TitleCapture Quote" />

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
            Bethesda's median home price tops $800K—among the highest in MD. At these price points, a missing heir or undiscovered lien can derail a million-dollar deal. We specialize in complex titles for Bethesda's luxury market.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Why Bethesda Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p className="max-w-[68ch]">
              Bethesda is one of Maryland's most desirable communities, known for its top-rated schools, vibrant downtown, and proximity to Washington DC. With median home prices exceeding $800,000, Bethesda attracts affluent buyers seeking a sophisticated suburban lifestyle.
            </p>
            <p className="max-w-[68ch]">
              The Bethesda market includes established homes, new construction, and luxury estates in areas such as Chevy Chase, Battery Lane, and Glen Echo. High-value properties, trusts, or estates can require careful title and authority review before closing.
            </p>
            <div className="rounded-lg border border-brand-blue/20 bg-white p-5">
              <h3 className="text-base font-bold text-brand-navy mb-2">Estimate Bethesda Closing Costs</h3>
              <p className="max-w-[68ch]">
                Before comparing title and settlement options, estimate Bethesda closing costs with our{" "}
                <Link href="/maryland-closing-cost-calculator" className="font-semibold text-brand-blue-deep hover:underline">
                  Maryland closing cost calculator
                </Link>
                . It helps buyers and sellers organize Montgomery County title, tax, and settlement cost questions before requesting a final quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8">Title Services in Bethesda</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Comprehensive title searches through Montgomery County land records.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Full coverage owner's title insurance to protect your Bethesda home investment.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">ALTA lender's policies for all major Maryland lenders.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Complete closing services from contract to recorded deed delivery.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Commercial Title Services</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Specialized title and settlement services for commercial properties.</p>
            </div>
            <div className="surface-card p-6">
              <h3 className="t-h5 font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">RON available for flexible signing options.</p>
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
              <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Send Will the property details to get a title search started.</p>
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
            <Link href="/closing-costs/maryland" className="text-brand-blue-deep hover:underline">
              Maryland Closing Costs Guide →
            </Link>
            <Link href="/maryland-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Maryland Closing Cost Calculator →
            </Link>
            <Link href="/title-company-rockville-md" className="text-brand-blue-deep hover:underline">
              Rockville Title Services →
            </Link>
            <Link href="/title-company-silver-spring-md" className="text-brand-blue-deep hover:underline">
              Silver Spring Title Services →
            </Link>
            <Link href="/title-company-arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-search-fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs →
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
          <h2 className="t-h3 text-white mb-4">Get Your Bethesda Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Send Will the Bethesda property details for a quote or a title question. Will confirms next steps with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/maryland-closing-cost-calculator" className="btn-primary px-8">
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
