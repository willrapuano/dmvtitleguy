import type { Metadata } from "next";
import { AudienceSections } from "@/components/AudienceSections";
import { PageHero } from "@/components/PageHero";
import { TitleQuotePanel } from "@/components/TitleQuotePanel";

export const metadata: Metadata = {
  title: "Title Company Services for Lenders | DMV Title Guy",
  description: "DMVTitleGuy provides reliable title services for lenders in Northern Virginia, DC, and Maryland. Fast turnarounds and competitive rates.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-lenders" },
};

export default function LendersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Lenders" }]}
        eyebrow="For lenders"
        title="Title Company Services for Lenders"
        lede="Lender's title insurance and settlement for purchase and refinance loans across Virginia, Maryland and DC, handled by Will Rapuano and the Pruitt Title team."
        aside={<TitleQuotePanel />}
        alignTop
      />
      <AudienceSections
        label="Working with lenders"
        heading="Title and settlement for your borrowers across the DMV."
        intro="Pruitt Title issues the lender's policy and closes the loan. Will is your direct contact from the title order to funding."
        rows={[
          { title: "Lender's title insurance", body: "Pruitt Title issues lender's policies underwritten by First American Title Insurance Company, with the endorsements your loan requires." },
          { title: "Commitments and closing documents", body: "The title commitment, payoffs and closing documents reach your team through Qualia Connect, Pruitt Title's secure portal, instead of email." },
          { title: "One contact at Pruitt Title", body: "Will Rapuano is your direct line for every file, from contract to closing." },
          { title: "Closings across the DMV", body: "Pruitt Title closes purchase and refinance loans in Virginia, Maryland and DC." },
        ]}
        handoff="Lender → Will → Borrower"
        handoffNote="One contact from the title order through funding."
      />
    </>
  );
}
