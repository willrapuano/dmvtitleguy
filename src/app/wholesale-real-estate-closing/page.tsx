import type { Metadata } from "next";
import { InvestorPageTemplate } from "@/components/InvestorPageTemplate";

export const metadata: Metadata = {
  title: "Wholesale Real Estate Closing Company | DMV Title Guy",
  description: "Wholesale-friendly title company in DC, Maryland, and Virginia. Assignment closings, assignment of contract, and wholesale deal closings handled by Pruitt Title LLC.",
  alternates: { canonical: "/wholesale-real-estate-closing" },
};

export default function WholesaleClosingPage() {
  return (
    <InvestorPageTemplate
      heroTag="Wholesale Investor Services"
      h1="Wholesale Real Estate Closing Services — DMV"
      heroBody="Pruitt Title LLC closes wholesale deals — assignment of contract transactions — across DC, Maryland, and Virginia. We understand wholesale and will get your deal to the table cleanly."
      slug="wholesale-real-estate-closing"
      services={[
        { title: "Assignment of Contract Closings", desc: "We coordinate A-B closings where the wholesaler assigns their contract to an end buyer." },
        { title: "Title Search on Wholesale Deals", desc: "Full title examination even on quick-turn deals to protect all parties." },
        { title: "Chain of Title Review", desc: "We verify clean title and identify any issues before they become closing problems." },
        { title: "HUD / Settlement Statement Prep", desc: "Accurate closing disclosure with all fees itemized for buyer, seller, and assignor." },
        { title: "Assignment Fee Documentation", desc: "Proper handling and disclosure of wholesale assignment fees in the closing documents." },
        { title: "Rush Closings Available", desc: "Fast turnaround closings for time-sensitive wholesale deals." },
      ]}
      howItWorksSteps={[
        "Send us your purchase contract and assignment agreement along with buyer and seller info.",
        "We open title and begin the search immediately — same day for rush deals.",
        "We review title commitment with you and coordinate closing logistics.",
        "We close, record the deed, and disburse all funds including the assignment fee.",
      ]}
      faqItems={[
        { q: "Do you allow assignment fees at closing?", a: "Yes. Assignment fees are documented in the HUD/ALTA and disbursed to the wholesaler at closing. We ensure full transparency for all parties." },
        { q: "Will end buyers know the assignment fee?", a: "DC, MD, and VA require full disclosure in the settlement statement. The assignment fee will appear on the closing disclosure." },
        { q: "Can you do virtual/remote closings?", a: "Yes. We offer Remote Online Notarization (RON) for buyers and sellers who cannot attend in person." },
        { q: "What's your turnaround time?", a: "Standard: 7-10 business days. Rush: 3-5 business days with clean title. Call us to discuss your specific timeline." },
      ]}
      relatedPages={[
        { label: "Investor-Friendly Title", href: "/investor-friendly-title-company" },
        { label: "Double Closing", href: "/double-closing-title-company" },
        { label: "Subject-To Closings", href: "/subject-to-closing-services" },
        { label: "Creative Financing", href: "/creative-financing-closing" },
      ]}
    />
  );
}
