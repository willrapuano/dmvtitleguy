import type { Metadata } from "next";
import { InvestorPageTemplate } from "@/components/InvestorPageTemplate";
export const metadata: Metadata = {
  title: "Subject-To Closing Services | Sub-To Title Company | DMV Title Guy",
  description: "Subject-to closing services in DC, Maryland, and Virginia. Pruitt Title LLC handles sub-to purchases with proper documentation, deed prep, and owner's title insurance.",
  alternates: { canonical: "/subject-to-closing-services" },
};
export default function SubjectToPage() {
  return (
    <InvestorPageTemplate
      heroTag="Creative Acquisition Structures"
      h1="Subject-To Closing Services in the DMV"
      heroBody="Purchasing property subject to the existing mortgage? We handle sub-to closings with full documentation, proper disclosure, and owner's title insurance — protecting you and the seller."
      slug="subject-to-closing-services"
      services={[
        { title: "Subject-To Deed Preparation", desc: "We draft the deed transferring ownership while the existing mortgage remains in place." },
        { title: "Existing Mortgage Disclosure", desc: "All parties sign required disclosures acknowledging the due-on-sale clause and mortgage status." },
        { title: "Owner's Title Insurance", desc: "We issue owner's title insurance protecting you against prior title defects." },
        { title: "Authorization Documentation", desc: "Proper seller authorization allowing you to communicate with the existing lender." },
        { title: "Land Trust Coordination", desc: "Subject-to transactions held in a land trust — we coordinate with your trust documents." },
        { title: "Full Settlement Statement", desc: "Clear ALTA/HUD documenting all costs, credits, and the existing loan balance." },
      ]}
      howItWorksSteps={[
        "Send us your purchase agreement, subject-to addendum, and loan statement from the existing lender.",
        "We review title and confirm there are no liens or encumbrances that would block the transfer.",
        "We prepare the deed, disclosure documents, and all closing paperwork for both parties.",
        "We close, record the new deed, and issue owner's title insurance in your name.",
      ]}
      faqItems={[
        { q: "Is buying subject-to legal?", a: "Yes. Subject-to purchases are legal in Virginia, Maryland, and DC. However, most mortgages contain a due-on-sale clause, which is why proper documentation and disclosure are critical." },
        { q: "Will you issue title insurance on a sub-to deal?", a: "Yes. We can issue owner's title insurance on subject-to transactions. Lender's title insurance may not be available since the existing loan stays in place." },
        { q: "What if the seller wants the loan paid off?", a: "If the seller needs mortgage relief rather than a cash payment, a subject-to structure may work well — or we can explore a traditional purchase or novation." },
        { q: "Do you work with land trusts for sub-to deals?", a: "Yes. We regularly work with investors who hold subject-to properties in land trusts and can coordinate with your trust documents at closing." },
      ]}
      relatedPages={[
        { label: "Investor-Friendly Title", href: "/investor-friendly-title-company" },
        { label: "Novation Closings", href: "/novation-real-estate-closing" },
        { label: "Creative Financing", href: "/creative-financing-closing" },
        { label: "Double Closing", href: "/double-closing-title-company" },
      ]}
    />
  );
}
