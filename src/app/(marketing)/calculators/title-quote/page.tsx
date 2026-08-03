import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "title quote calculator for DMV Closings | Pruitt Title",
  description:
    "Title quote calculator for DC, Maryland, and Virginia closings. Estimate title insurance and settlement costs with Pruitt Title. Start today.",
  alternates: { canonical: "https://dmvtitleguy.io/calculators/title-quote" },
};

export default function TitleQuotePage() {
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Title Quote" }]}
        eyebrow="Free tool"
        title="Title Quote Calculator"
        lede="Get an instant title insurance quote for buyers and sellers in DC, Maryland, and Virginia. Enter your transaction details below for a real-time estimate from Pruitt Title LLC."
      />

      <section className="section-light">
        <div className="container-xl">
          <div className="surface-card-elevated overflow-hidden p-2 sm:p-4">
            <iframe
              src="https://pruitt-title.titlecapture.com/title-quote"
              width="100%"
              height="800"
              frameBorder="0"
              style={{ border: "none" }}
              title="Pruitt Title — Title Quote Calculator"
            />
          </div>
        </div>
      </section>
    </>
  );
}
