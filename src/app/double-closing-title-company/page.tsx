import type { Metadata } from "next";
import { InvestorPageTemplate } from "@/components/InvestorPageTemplate";
export const metadata: Metadata = {
  title: "Double Closing Title Company | Simultaneous Closings | DMV Title Guy",
  description: "Double closing and simultaneous closing title company in DC, MD, and VA. Same-day A-B/B-C closings handled by Pruitt Title LLC. Investor-friendly, experienced, and reliable.",
  alternates: { canonical: "/double-closing-title-company" },
};
export default function DoubleClosingPage() {
  return (
    <InvestorPageTemplate
      heroTag="Advanced Investor Closing Structures"
      h1="Double Closing Title Company — DC, Maryland & Virginia"
      heroBody="DMV Title Guy handles same-day and back-to-back double closings (simultaneous closings) across the DMV. Two separate transactions, one smooth settlement day."
      slug="double-closing-title-company"
      services={[
        { title: "A-B Transaction (Purchase)", desc: "You purchase the property from the original seller with full title insurance and clean recording." },
        { title: "B-C Transaction (Resale)", desc: "Immediate or same-day resale to your end buyer with a new deed and clear title." },
        { title: "Fund Flow Coordination", desc: "We manage compliant fund disbursement between both closings — no commingling." },
        { title: "Transactional Funding Connections", desc: "Need flash funding for the A-B side? We can connect you with trusted transactional lenders." },
        { title: "Separate Settlement Statements", desc: "Each transaction gets its own ALTA/HUD with proper disclosure for all parties." },
        { title: "Same-Day Recording", desc: "We can record A-B and B-C deeds in sequence on the same day when needed." },
      ]}
      howItWorksSteps={[
        "Provide both contracts (A-B purchase and B-C resale) along with all party information.",
        "We open two separate title orders and run concurrent title searches.",
        "We coordinate transactional funding if the B-C funds are needed to close the A-B.",
        "A-B closes and records. B-C closes immediately after. Both parties receive clean title.",
      ]}
      faqItems={[
        { q: "Are double closings legal in Virginia and Maryland?", a: "Yes. Double closings are legal and common in VA and MD when structured properly with full disclosure and separate settlement statements." },
        { q: "Do both transactions need to happen the same day?", a: "Not necessarily. Back-to-back closings within a few days are also common, though same-day is preferred for most investors." },
        { q: "What happens if the end buyer backs out?", a: "If the B-C falls through after A-B records, you own the property. This is why title insurance and a solid B-C buyer commitment matter." },
        { q: "Do you have experience with transactional funding?", a: "Yes. We work with transactional funding companies regularly and can recommend vetted sources if you need flash funding for the A-B side." },
      ]}
      relatedPages={[
        { label: "Investor-Friendly Title", href: "/investor-friendly-title-company" },
        { label: "Wholesale Closings", href: "/wholesale-real-estate-closing" },
        { label: "Subject-To Closings", href: "/subject-to-closing-services" },
        { label: "Novation Closings", href: "/novation-real-estate-closing" },
      ]}
    />
  );
}
