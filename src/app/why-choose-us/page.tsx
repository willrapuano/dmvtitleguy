import type { Metadata } from "next";
import { WhyChooseUsClient } from "@/components/WhyChooseUsClient";

export const metadata: Metadata = {
  title: "Why Pruitt Title? | DMV Title Guy",
  description:
    "9 reasons why real estate professionals choose Pruitt Title LLC. Woman-owned, First American backed, serving DC, Maryland & Virginia since 2007.",
  alternates: { canonical: "/why-choose-us" },
};

const WHY_CHOOSE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why should I choose Pruitt Title LLC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pruitt Title LLC is a locally-owned, woman-owned title and settlement company established in 2007 in Vienna, Virginia. As an authorized agent of First American Title Insurance Company, we combine local DMV expertise with the financial strength of a Fortune 500 company. We handle residential, commercial, luxury, new construction, and investor transactions.",
      },
    },
    {
      "@type": "Question",
      name: "What areas does Pruitt Title serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pruitt Title LLC provides title insurance and closing services throughout Washington DC, Northern Virginia, and Maryland. We serve real estate agents, mortgage lenders, home builders, banks, credit unions, and investors across the entire DMV region.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Pruitt Title different from other title companies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beyond reliable closings, Pruitt Title actively helps referral partners grow their businesses through innovative marketing strategies, free CE classes, workshops, and one-on-one mentorship. Will Rapuano is recognized among the top 5% of title insurance executives nationwide.",
      },
    },
    {
      "@type": "Question",
      name: "Does Pruitt Title handle commercial and new construction closings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pruitt Title handles every type of closing including residential purchases, commercial transactions, luxury properties, new construction deals, refinances, and investor transactions such as fix-and-flip and BRRRR strategies.",
      },
    },
  ],
};

export default function WhyChooseUsPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(WHY_CHOOSE_FAQ_SCHEMA) }} />
      <WhyChooseUsClient />
    </>
  );
}
