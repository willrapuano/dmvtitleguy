import type { Metadata } from "next";
import Link from "next/link";
import { SellerNetSheetCalculator } from "@/components/SellerNetSheetCalculator";

export const metadata: Metadata = {
  title: "Seller Net Sheet Calculator | DMV Title Guy",
  description:
    "Estimate seller proceeds after mortgage payoff, broker compensation, concessions, taxes, title fees, and other closing costs in DC, Maryland, or Virginia.",
  alternates: { canonical: "/calculators/seller-net-sheet" },
};

export default function SellerNetSheetPage() {
  const faqs = [
    {
      question: "Is this my exact closing amount?",
      answer: "No. It is an estimate for planning. Final numbers depend on the executed contract and final closing disclosures.",
    },
    {
      question: "Does this include title and transfer costs?",
      answer: "It includes the title, settlement, transfer-tax, and recordation-tax estimates you enter. It does not guess current jurisdiction-specific charges.",
    },
    {
      question: "Can I compare multiple offer scenarios?",
      answer: "Absolutely. Run the calculator with different sale prices and concession amounts to compare outcomes quickly.",
    },
  ];

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
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Seller Net Sheet</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">
            Seller Net Sheet Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Estimate what you may receive after payoffs, broker compensation, concessions, transfer taxes, settlement fees, and other entered costs.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <SellerNetSheetCalculator />

          <div className="prose mx-auto mt-12 max-w-4xl text-brand-muted">
            <h2 className="text-brand-navy">Why Sellers Use a Net Sheet Before Listing</h2>
            <p className="max-w-[68ch]">
              A seller net sheet estimates how much cash you may receive at closing after paying commissions, title and settlement fees, transfer/recordation taxes, and other transaction costs. For homeowners in DC, Maryland, and Virginia, this is one of the most important numbers to review before pricing a home.
            </p>
            <p className="max-w-[68ch]">
              Running a net sheet early helps you plan your next purchase, compare offer scenarios, and avoid surprises at the closing table. We recommend updating your estimate whenever list price, concessions, or commission structure changes.
            </p>

            <h3 className="text-brand-navy">Frequently Asked Questions</h3>
            <p className="max-w-[68ch]"><strong>Is this my exact closing amount?</strong><br />No. It is an estimate for planning. Final numbers depend on the executed contract and final closing disclosures.</p>
            <p className="max-w-[68ch]"><strong>Does this include title and transfer costs?</strong><br />It includes the title, settlement, transfer-tax, and recordation-tax estimates you enter. It does not guess current jurisdiction-specific charges.</p>
            <p className="max-w-[68ch]"><strong>Can I compare multiple offer scenarios?</strong><br />Absolutely. Run the calculator with different sale prices and concession amounts to compare outcomes quickly.</p>
          </div>

          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap gap-3">
            <Link href="/calculators/title-quote" className="btn-primary">Get a Title Quote</Link>
            <Link href="/virginia-closing-cost-calculator" className="btn-outline">VA Closing Cost Calculator</Link>
            <Link href="/maryland-closing-cost-calculator" className="btn-outline">MD Closing Cost Calculator</Link>
            <Link href="/dc-closing-cost-calculator" className="btn-outline">DC Closing Cost Calculator</Link>
          </div>
        </div>
      </section>
    </>
  );
}
