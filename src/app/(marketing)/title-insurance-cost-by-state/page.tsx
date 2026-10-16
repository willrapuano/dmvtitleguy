import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Title Insurance Cost by State: VA, MD and DC Compared | DMV Title Guy",
  description: "How title insurance pricing differs by state, with Virginia, Maryland and DC compared. See what drives the premium, then get an instant quote online.",
  alternates: { canonical: "https://dmvtitleguy.io/title-insurance-cost-by-state" },
};

const faqs = [
  {
    question: "Is title insurance required in every state?",
    answer: "While not legally required everywhere, lenders typically require a lender's title insurance policy.",
  },
  {
    question: "Can I shop around for title insurance?",
    answer: "Yes. Each insurer files its own rates in Virginia, Maryland and DC, so premiums differ between companies, and in Virginia the rate can be negotiated (Va. Code § 38.2-4608). Compare the premium as well as the settlement fee on every quote.",
  },
  {
    question: "What does title insurance cover?",
    answer: "It protects against title defects, liens, or ownership disputes not found during the title search.",
  },
  {
    question: "How long does title insurance last?",
    answer: "The owner's policy lasts as long as you or your heirs own the property.",
  },
];

export default function TitleInsuranceCostByStatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/title-insurance" className="hover:text-white">Title Insurance</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Cost by State</span>
          </nav>
          <h1 className="t-h1 text-white mb-4">
            Title Insurance Cost by State: A 2026 Comparison
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Title insurance costs differ between Virginia, Maryland and DC, and between underwriters. See real published premiums and what affects pricing in your area.
          </p>
        </div>
      </section>

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
            Across the DMV, each title insurer files its own rates, so premiums vary between companies. In Virginia the rate can also be negotiated (Va. Code § 38.2-4608)—so shopping around can yield savings.
          </p>
        </div>
      </section>

      {/* COST BREAKDOWN TABLE */}
      <section className="section-gray">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Title Insurance Cost Breakdown by State</h2>
          <p className="text-brand-muted mb-4 max-w-[68ch]">Premiums on a $500,000 purchase from Stewart Title&apos;s published rate manuals (Virginia effective July 1, 2025; Maryland November 24, 2025; DC February 26, 2024), before reissue or other discounts. Other underwriters file their own rates, so your quote may differ.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-brand-muted border-collapse">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="text-left p-3">Jurisdiction</th>
                  <th className="text-right p-3">Standard owner&apos;s policy</th>
                  <th className="text-right p-3">Enhanced owner&apos;s policy</th>
                  <th className="text-left p-3">How rates work</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3 font-semibold">Virginia</td>
                  <td className="p-3 text-right">$2,097.50</td>
                  <td className="p-3 text-right">$2,517.50</td>
                  <td className="p-3">Each insurer files its own rates; can be negotiated</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Maryland</td>
                  <td className="p-3 text-right">$2,507.50</td>
                  <td className="p-3 text-right">$3,007.50</td>
                  <td className="p-3">Each underwriter files its own rates</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">DC</td>
                  <td className="p-3 text-right">$2,700</td>
                  <td className="p-3 text-right">$3,240</td>
                  <td className="p-3">Each underwriter files its own rates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FACTORS AFFECTING COSTS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Factors Affecting Title Insurance Costs</h2>
          <div className="space-y-6 text-brand-muted leading-relaxed">
            <div>
              <h3 className="text-brand-navy t-h6 mb-2">1. Home Value</h3>
              <p className="max-w-[68ch]">Higher-value homes typically cost more to insure. Title insurance premiums are calculated based on the purchase price of the property.</p>
            </div>
            <div>
              <h3 className="text-brand-navy t-h6 mb-2">2. State Regulations</h3>
              <p className="max-w-[68ch]">In Virginia, Maryland and DC, each title insurer files its own rate schedule with the state insurance regulator, so premiums vary by underwriter. Virginia also lets insurers and agents negotiate the rate with a buyer.</p>
            </div>
            <div>
              <h3 className="text-brand-navy t-h6 mb-2">3. Local Practices</h3>
              <p className="max-w-[68ch]">Urban areas may have higher costs due to more complex title histories, potential for liens, and higher property values. Rural properties may have different risk profiles.</p>
            </div>
            <div>
              <h3 className="text-brand-navy t-h6 mb-2">4. Endorsements</h3>
              <p className="max-w-[68ch]">Additional coverage options (endorsements) can increase the premium. Common endorsements include survey coverage, zoning endorsement, and contiguity insurance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DMV SPECIFICS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Title Insurance in the DMV Region</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-brand-navy t-h6 mb-3">Virginia</h3>
              <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
                Each insurer files its own rates with the State Corporation Commission&apos;s Bureau of Insurance, and Virginia law lets the rate be <strong>negotiated</strong>. In Stewart&apos;s schedule, the lender&apos;s policy issued with an owner&apos;s policy is a flat $200.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-brand-navy t-h6 mb-3">Maryland</h3>
              <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
                Each underwriter files its own rates with the Maryland Insurance Administration, so premiums <strong>vary between providers</strong>. In Stewart&apos;s schedule, the lender&apos;s policy issued with an owner&apos;s policy is $350.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-brand-navy t-h6 mb-3">Washington DC</h3>
              <p className="text-brand-muted text-sm max-w-[68ch] leading-relaxed">
                Each underwriter files its own rates. In Stewart&apos;s DC schedule, a standard owner&apos;s policy on a <strong>$500,000</strong> home is $2,700, and the lender&apos;s policy issued with it is $100.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OWNERS VS LENDERS */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="t-h4 text-brand-navy mb-4">Owner's vs. Lender's Title Insurance</h2>
          <div className="space-y-4 text-brand-muted leading-relaxed">
            <p>
              It's important to understand the difference between the two types of title insurance:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-brand-navy t-h6 mb-3">Owner's Title Insurance</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Protects the buyer/owner</li>
                  <li>One-time premium paid at closing</li>
                  <li>Lasts as long as you own the property</li>
                  <li>Protects against hidden defects</li>
                  <li><strong>Recommended for all buyers</strong></li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-brand-navy t-h6 mb-3">Lender's Title Insurance</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Protects the mortgage lender</li>
                  <li>One-time premium paid at closing</li>
                  <li>Lasts for the life of the loan</li>
                  <li>Protects lender's financial interest</li>
                  <li><strong>Required by most lenders</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-xl">
          <h2 className="t-h5 text-brand-navy mb-4">Explore More Resources</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/title-insurance" className="text-brand-blue-deep hover:underline">
              What is Title Insurance? →
            </Link>
            <Link href="/calculators" className="text-brand-blue-deep hover:underline">
              Closing Cost Calculators →
            </Link>
            <Link href="/virginia-closing-cost-calculator" className="text-brand-blue-deep hover:underline">
              Virginia Closing Costs →
            </Link>
            <Link href="/closing-costs/maryland" className="text-brand-blue-deep hover:underline">
              Maryland Closing Costs →
            </Link>
            <Link href="/closing-costs/dc" className="text-brand-blue-deep hover:underline">
              DC Closing Costs →
            </Link>
            <Link href="/title-company-arlington-va" className="text-brand-blue-deep hover:underline">
              Arlington Title Services →
            </Link>
            <Link href="/title-search-fairfax-va" className="text-brand-blue-deep hover:underline">
              Fairfax Title Services →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <FAQSection faqs={faqs} includeSchema={false} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-navy">
        <div className="container-xl text-center">
          <h2 className="t-h3 text-white mb-4">Get Your Title Insurance Quote</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact Pruitt Title LLC for an accurate title insurance quote for your Virginia, Maryland, or DC property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/title-insurance" className="btn-primary px-8">
              Get a Quote →
            </Link>
            <Link href="/contact" className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-brand-navy transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
