import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocationSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Title Company Silver Spring MD | Settlement & Title Services",
  description: "Pruitt Title LLC provides expert title and settlement services in Silver Spring, MD. Fast closings, competitive rates, and local expertise since 2007.",
  alternates: { canonical: "/title-company/silver-spring-md" },
};

const faqs = [
  {
    question: "How much does title insurance cost in Silver Spring, MD?",
    answer: "Maryland title insurance rates are filed with the Maryland Insurance Administration. For a $525,000 home—the current median in Silver Spring—owner's title insurance typically costs $1,600-2,200. Maryland offers a simultaneous issue discount when both lender's and owner's policies are purchased together.",
  },
  {
    question: "What are the transfer and recordation taxes in Silver Spring?",
    answer: "In Montgomery County, sellers pay a transfer tax that includes a state portion (0.5%) and a county portion (1.0% for properties under $1M). Buyers pay recordation taxes: state recordation ($0.005 per $100) plus Montgomery County recordation ($0.0085 per $100). First-time homebuyers may qualify for exemptions.",
  },
  {
    question: "Does Maryland require an attorney at closing in Silver Spring?",
    answer: "Yes, Maryland law requires that a licensed attorney or title agent conduct the settlement. At Pruitt Title, our experienced settlement team ensures full compliance with Maryland regulations while providing a smooth, efficient closing experience for Silver Spring buyers and sellers.",
  },
  {
    question: "What is unique about Silver Spring real estate transactions?",
    answer: "Silver Spring's urban-suburban mix means transactions range from downtown condos to single-family homes in established neighborhoods. Many properties are in the Wheaton/Silver Spring revitalization area, where new development and historic preservation intersect. Our team handles both straightforward residential closings and complex transactions involving trusts, estates, and investment properties.",
  },
  {
    question: "How long does a Silver Spring title search take?",
    answer: "Montgomery County title searches typically take 5-7 business days. For properties in downtown Silver Spring with multiple prior owners or condominium conversions, we recommend allowing additional time for thorough research into all liens, easements, and HOA documentation.",
  },
  {
    question: "Are there first-time homebuyer programs in Montgomery County?",
    answer: "Yes, Montgomery County offers several first-time homebuyer assistance programs, including closing cost assistance and down payment help. First-time buyers may also qualify for exemptions from the county transfer tax. Our team can connect you with local resources to take advantage of these programs.",
  },
];

export default function SilverSpringTitlePage() {
  return (
    <>
      <LocationSchema
        city="Silver Spring"
        state="MD"
        county="Montgomery County"
        slug="title-company/silver-spring-md"
        description="Pruitt Title LLC provides expert title and settlement services in Silver Spring, MD. Fast closings, competitive rates, and local expertise since 2007."
      />

      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/closing-costs/maryland" className="hover:text-brand-blue">Maryland Closing Costs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Silver Spring</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Title Company Silver Spring MD | Settlement & Title Services
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Pruitt Title LLC delivers expert title and settlement services in Silver Spring and throughout Montgomery County. From downtown condos to Wheaton single-families, we understand the unique dynamics of closing in one of Maryland's most diverse communities.
          </p>
        </div>
      </section>

      <ClosingCostCalculator state="MD" />

      {/* LOCAL INSIGHT */}
      <section className="py-8 bg-brand-blue text-white">
        <div className="container-xl max-w-3xl">
          <p className="text-lg font-medium">
            <span className="text-brand-light-blue">💡 Local Insight:</span> Silver Spring's median home price is ~$525K with homes selling in about 12 days. With Metro access driving demand and a mix of condos, townhomes, and single-families, every transaction type needs a title partner who knows Montgomery County's recording requirements inside and out.
          </p>
        </div>
      </section>

      {/* LOCAL CONTEXT */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Why Silver Spring Real Estate Matters</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              Silver Spring is one of the most vibrant and diverse communities in the Washington DC metro area. With a median home price around $525,000 and homes selling in approximately 12 days, Silver Spring offers urban convenience at a relative value compared to DC and Bethesda.
            </p>
            <p>
              The Silver Spring market is uniquely varied. Downtown Silver Spring features high-rise condos and apartments steps from the Metro. Neighborhoods like Woodmoor, Northwood, and Four Corners offer established single-family homes with mature trees and community character. The ongoing revitalization of the Wheaton and Silver Spring corridors is bringing new development, creating opportunities for buyers and investors alike. This diversity means title work can range from straightforward condo unit transfers to complex transactions involving historic properties, estate sales, and investment portfolios. Pruitt Title's Montgomery County expertise handles it all.
            </p>
            <div className="rounded-lg border border-brand-blue/20 bg-white p-5">
              <h3 className="text-base font-bold text-brand-navy mb-2">Estimate Silver Spring Closing Costs</h3>
              <p>
                Use the{" "}
                <Link href="/maryland-closing-cost-calculator" className="font-semibold text-brand-blue hover:underline">
                  Maryland closing cost calculator
                </Link>{" "}
                to estimate Silver Spring closing costs before you request a final title quote. The calculator helps frame Montgomery County tax, title insurance, and settlement fee questions for buyers and sellers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <h2 className="text-3xl font-bold text-brand-navy mb-8">Title Services in Silver Spring</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Title Searches</h3>
              <p className="text-gray-600">Comprehensive title searches through Montgomery County land records and court filings.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Owner's Title Insurance</h3>
              <p className="text-gray-600">Full coverage owner's title insurance to protect your Silver Spring home investment.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Lender's Title Insurance</h3>
              <p className="text-gray-600">ALTA lender's policies for all major lenders operating in Montgomery County.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Settlement Services</h3>
              <p className="text-gray-600">Complete closing services from contract to recorded deed delivery, compliant with Maryland attorney requirements.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Condominium Closings</h3>
              <p className="text-gray-600">Specialized expertise for condo transactions common in downtown Silver Spring and surrounding developments.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Remote Online Notarization</h3>
              <p className="text-gray-600">RON available for flexible signing options on Montgomery County transactions.</p>
            </div>
          </div>
        </div>
      </section>


      {/* INVESTOR SERVICES */}
      <section className="py-12 bg-white">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Investor Services</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/investor-title-services" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Title Services</h3>
              <p className="text-sm text-brand-muted">Title searches, auction support & wholesale closings.</p>
            </Link>
            <Link href="/auction-property-title-search" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Auction Property Title Search</h3>
              <p className="text-sm text-brand-muted">Pre-auction title search & risk assessment.</p>
            </Link>
            <Link href="/foreclosure-title-review" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Foreclosure Title Review</h3>
              <p className="text-sm text-brand-muted">Surviving liens & chain-of-title review.</p>
            </Link>
            <Link href="/investor-due-diligence" className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-brand-navy mb-1">Investor Due Diligence</h3>
              <p className="text-sm text-brand-muted">Submit property info & start your title search.</p>
            </Link>
          </div>
        </div>
      </section>
      {/* INTERNAL LINKS */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue hover:underline">
              Maryland Closing Costs Guide →
            </Link>
            <Link href="/maryland-closing-cost-calculator" className="text-brand-blue hover:underline">
              Maryland Closing Cost Calculator →
            </Link>
            <Link href="/title-company-bethesda-md" className="text-brand-blue hover:underline">
              Bethesda Title Services →
            </Link>
            <Link href="/title-company/rockville-md" className="text-brand-blue hover:underline">
              Rockville Title Services →
            </Link>
            <Link href="/title-company/arlington-va" className="text-brand-blue hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-company/fairfax-va" className="text-brand-blue hover:underline">
              Fairfax Title Services →
            </Link>
            <Link href="/title-company/alexandria-va" className="text-brand-blue hover:underline">
              Alexandria Title Services →
            </Link>
            <Link href="/closing-costs/virginia" className="text-brand-blue hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue hover:underline">
              DC Closing Costs →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-navy">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get Your Silver Spring Title Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us for a competitive title insurance quote for your Silver Spring property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/maryland-closing-cost-calculator" className="inline-block bg-brand-blue text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
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
