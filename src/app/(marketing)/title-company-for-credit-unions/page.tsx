import type { Metadata } from "next";
import { AudienceSections } from "@/components/AudienceSections";
import { PageHero } from "@/components/PageHero";
import { TitleQuotePanel } from "@/components/TitleQuotePanel";

export const metadata: Metadata = {
  title: "Title Company Services for Credit Unions | DMV Title Guy",
  description: "DMVTitleGuy provides title services for credit unions in Northern Virginia, DC, and Maryland. Understanding of CU processes.",
  alternates: { canonical: "https://dmvtitleguy.io/title-company-for-credit-unions" },
};

export default function CreditUnionsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Credit Unions" }]}
        eyebrow="For credit unions"
        title="Title Company Services for Credit Unions"
        lede="Title and settlement for your members' purchase and refinance loans across Virginia, Maryland and DC, handled by Will Rapuano and the Pruitt Title team."
        aside={<TitleQuotePanel />}
        alignTop
      />
      <AudienceSections
        label="Working with credit unions"
        heading="Title and settlement for your members' loans."
        intro="Members get clear numbers up front and a closing handled by Pruitt Title, with Will as your direct contact."
        rows={[
          { title: "Closings for your members", body: "Pruitt Title handles title and settlement for credit union purchase and refinance loans in Virginia, Maryland and DC." },
          { title: "A clear number for members", body: "Members can use the calculator above to see their title and settlement costs before they apply." },
          { title: "Documents in a secure portal", body: "Pruitt Title runs on Qualia. Documents move through Qualia Connect, a secure portal, instead of email, which cuts the risk of wire fraud." },
          { title: "One contact at Pruitt Title", body: "Will Rapuano is your direct line for every file, from contract to closing." },
        ]}
        handoff="Credit union → Will → Member"
        handoffNote="One contact for your team and your members, from application to closing."
      />
    </>
  );
}
