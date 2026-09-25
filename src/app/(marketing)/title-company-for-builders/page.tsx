import type { Metadata } from "next";
import { AudienceSections } from "@/components/AudienceSections";
import { PageHero } from "@/components/PageHero";
import { TitleQuotePanel } from "@/components/TitleQuotePanel";

export const metadata: Metadata = {
  title: "Title Company Services for Builders | DMV Title Guy",
  description: "DMVTitleGuy provides fast, reliable title services for builders and developers in Northern Virginia, DC, and Maryland.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-builders" },
};

export default function BuildersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Builders" }]}
        eyebrow="For builders"
        title="Title Company Services for Builders"
        lede="Title and settlement for new-construction sales across Virginia, Maryland and DC, handled by Will Rapuano and the Pruitt Title team."
        aside={<TitleQuotePanel />}
        alignTop
      />
      <AudienceSections
        label="Working with builders"
        heading="One title team for every home in the community."
        intro="Your sales team, the buyer and the buyer's lender work from the same file, with Will as the direct contact."
        rows={[
          { title: "New construction closings", body: "Pruitt Title handles title and settlement for new-construction sales, with the builder, buyer and lender on the same file." },
          { title: "One contact for your pipeline", body: "Will Rapuano is your direct line at Pruitt Title for every home in the community, from contract to closing." },
          { title: "Documents in a secure portal", body: "Pruitt Title runs on Qualia. Documents move through Qualia Connect, a secure portal, instead of email, which cuts the risk of wire fraud." },
          { title: "Numbers before the contract", body: "Your sales team can use the calculator above to show a buyer their title and settlement costs before the contract is written." },
        ]}
        handoff="Builder → Will → Buyer"
        handoffNote="Questions go straight to the person who has the file in front of him."
      />
    </>
  );
}
