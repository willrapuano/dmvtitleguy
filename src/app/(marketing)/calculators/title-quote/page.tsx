import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import TitleQuoteEmbed from "@/components/TitleQuoteEmbed";

export const metadata: Metadata = {
  // Searchers ask for a "title insurance calculator virginia", not a "title
  // quote calculator". This page was titled for the internal name of the tool,
  // so it sat around position 49 for its own query while three other URLs --
  // the homepage, the cost blog post, and the home-equity calculator -- picked
  // up the same searches and split the signal.
  title: "Title Insurance Calculator for Virginia, Maryland & DC | Pruitt Title",
  description:
    "Free title insurance calculator for Virginia, Maryland, and DC. Estimate title insurance premiums and settlement costs for a purchase or refinance with Pruitt Title.",
  alternates: { canonical: "https://dmvtitleguy.io/calculators/title-quote" },
};

export default function TitleQuotePage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Title Quote" }]}
        eyebrow="Free tool"
        title="Title Insurance Calculator for Virginia, Maryland, and DC"
        lede="Get an instant title insurance quote for buyers and sellers in Virginia, Maryland, and DC. Enter your transaction details below for a real-time estimate from Pruitt Title LLC."
      />

      <TitleQuoteEmbed
        title="Start Your TitleCapture Quote"
        subtitle="Use Pruitt Title's live quote tool for a transaction-specific estimate across DC, Maryland, and Virginia."
      />
    </>
  );
}
