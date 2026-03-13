import type { Metadata } from "next";
import { InvestorPageTemplate } from "@/components/InvestorPageTemplate";
export const metadata: Metadata = {
  title: "Creative Financing Real Estate Closing | DMV Title Guy",
  description: "Creative financing closing services in DC, Maryland, and Virginia. Seller financing, land contracts, lease-options, wraparound mortgages — Pruitt Title LLC closes them all.",
  alternates: { canonical: "/creative-financing-closing" },
};
export default function CreativeFinancingPage() {
  return (
    <InvestorPageTemplate
      heroTag="Non-Traditional Real Estate Finance"
      h1="Creative Financing Closing Services in the DMV"
      heroBody="Seller financing, land contracts, wrap mortgages, lease-options — DMV Title Guy closes non-traditional deals correctly, protecting all parties with proper documentation and title insurance."
      slug="creative-financing-closing"
      services={[
        { title: "Seller Financing / Owner Carry", desc: "Full closing with promissory note, deed of trust, and ALTA title insurance protecting both parties." },
        { title: "Land Contracts (Contract for Deed)", desc: "We document installment sale contracts with proper recording and buyer protection language." },
        { title: "Wraparound Mortgages", desc: "All-inclusive trust deed (AITD) closings with compliant documentation and fund flow." },
        { title: "Lease-Option Closings", desc: "Option-to-purchase exercises closed with full title exam and clean deed recording." },
        { title: "DSCR & Non-QM Loan Closings", desc: "Experience with alternative lending products and their unique title requirements." },
        { title: "Hard Money / Private Lender Closings", desc: "Fast, lender-compliant closings for hard money and private capital transactions." },
      ]}
      howItWorksSteps={[
        "Share your deal structure — tell us what type of creative financing you're using.",
        "We review your documents (note, deed of trust, contract, option) and advise on any issues.",
        "We prepare all closing documents, coordinate all parties, and run a full title search.",
        "We close, record all instruments, and issue appropriate title insurance.",
      ]}
      faqItems={[
        { q: "Can you close a seller finance deal in Virginia?", a: "Absolutely. Seller-financed transactions are common in Virginia. We prepare the promissory note, deed of trust, and ALTA settlement statement. We issue title insurance on the property." },
        { q: "What is a wraparound mortgage and can you close one?", a: "A wraparound is a junior financing instrument where the new loan 'wraps' the existing mortgage. These carry legal complexity — we can close them when the deal is structured correctly with full disclosure." },
        { q: "Do you handle DSCR loan closings?", a: "Yes. DSCR and other non-QM loan closings have specific lender title requirements. We're experienced with these products and can coordinate with most private and institutional DSCR lenders." },
        { q: "Are land contracts common in the DMV?", a: "Less common than other strategies, but we close them. A land contract (contract for deed) means the buyer doesn't receive the deed until the purchase price is paid — we ensure this is properly documented and recorded." },
      ]}
      relatedPages={[
        { label: "Investor-Friendly Title", href: "/investor-friendly-title-company" },
        { label: "Subject-To Closings", href: "/subject-to-closing-services" },
        { label: "Novation Closings", href: "/novation-real-estate-closing" },
        { label: "Wholesale Closings", href: "/wholesale-real-estate-closing" },
      ]}
    />
  );
}
