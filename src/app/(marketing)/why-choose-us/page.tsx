import { WhyChooseUsClient } from "@/components/WhyChooseUsClient";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Why Choose Pruitt Title? Services, Process & Credentials",
  description:
    "Review Pruitt Title's DMV service area, title and settlement process, transaction support, and Will Rapuano's business-development role before requesting a quote.",
  path: "/why-choose-us",
});

const WHY_CHOOSE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why should I choose Pruitt Title LLC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pruitt Title LLC is an independently owned title, settlement, and escrow company serving Virginia, Maryland, and Washington DC. The company handles residential and commercial real estate transactions and coordinates closing support through its DMV offices and remote-closing options.",
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
        text: "Will Rapuano supports real estate professionals through educational classes, workshops, marketing resources, and transaction-focused communication while serving as Marketing and Business Development Officer at Pruitt Title LLC.",
      },
    },
    {
      "@type": "Question",
      name: "Does Pruitt Title handle commercial and new construction closings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pruitt Title's public service information identifies residential, commercial, resale, refinance, and new-construction work. Acceptance and requirements depend on the property, jurisdiction, underwriter, and transaction details.",
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
