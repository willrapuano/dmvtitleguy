import type { Metadata } from "next";
import { InvestorPageTemplate } from "@/components/InvestorPageTemplate";

export const metadata: Metadata = {
  title: "Investor-Friendly Title Company | DC, Maryland & Virginia | DMV Title Guy",
  description: "Investor-friendly title company serving DC, Maryland, and Virginia. Wholesale, double closings, subject-to, novation, and creative financing closings. Pruitt Title LLC.",
  alternates: { canonical: "/investor-friendly-title-company" },
};

export default function InvestorFriendlyPage() {
  return (
    <InvestorPageTemplate
      heroTag="Real Estate Investor Services"
      h1="Investor-Friendly Title Company in DC, Maryland & Virginia"
      heroBody="Pruitt Title LLC handles the deals that other title companies turn away. Wholesale, double closings, subject-to, novation, and creative financing — we've seen it all and we'll get it to the closing table."
      slug="investor-friendly-title-company"
      services={[
        { title: "Wholesale Transactions", desc: "Assignment of contract closings with full title insurance and clean chain of title." },
        { title: "Double / Simultaneous Closings", desc: "AB and BC transactions handled same-day or back-to-back with compliant fund flows." },
        { title: "Subject-To Transactions", desc: "Purchase subject to existing mortgage — proper documentation, deed prep, and title insurance." },
        { title: "Novation Agreements", desc: "Legal novation closings replacing original contract parties with proper title protection." },
        { title: "Creative Financing Structures", desc: "Seller financing, land contracts, lease-options — we document and close them correctly." },
        { title: "Cash Transactions (Fast Close)", desc: "No lender delays. We can close in as few as 5-7 business days with clean title." },
      ]}
      howItWorksSteps={[
        "Submit your deal details — contract, assignment, or deal structure via our contact form or call (703) 859-1467.",
        "We review the title history and confirm we can insure the transaction, typically within 24 hours.",
        "We issue a title commitment and coordinate all parties — buyer, seller, assignor, assignee.",
        "You close on your timeline. We handle deed prep, recording, and fund disbursement.",
      ]}
      faqItems={[
        {
          q: "Can you do same-day double closings?",
          a: "Yes. We can structure same-day or back-to-back A-B and B-C closings. We will walk you through the fund flow requirements to ensure compliance.",
        },
        {
          q: "Do you require transactional funding?",
          a: "For double closings where funds from the B-C transaction fund the A-B side, transactional or flash funding is typically required. We can connect you with transactional funding sources if needed.",
        },
        {
          q: "Will you insure a subject-to transaction?",
          a: "Yes. We handle subject-to closings with proper documentation including the existing mortgage disclosure. We issue owner's title insurance on the deal.",
        },
        {
          q: "How fast can you close a cash deal?",
          a: "With a clean title, we can typically close in 5-7 business days. Rush closings in 3 days are possible in certain situations — call us to discuss.",
        },
      ]}
      relatedPages={[
        { label: "Wholesale Closings", href: "/wholesale-real-estate-closing" },
        { label: "Double Closing", href: "/double-closing-title-company" },
        { label: "Subject-To Closings", href: "/subject-to-closing-services" },
        { label: "Novation Closings", href: "/novation-real-estate-closing" },
        { label: "Creative Financing", href: "/creative-financing-closing" },
      ]}
    />
  );
}
