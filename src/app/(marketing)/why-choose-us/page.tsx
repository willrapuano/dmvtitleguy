import { WhyChooseUsClient } from "@/components/WhyChooseUsClient";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "How to Choose a DMV Title Provider | DMV Title Guy",
  description:
    "Use practical questions to compare title and settlement providers, understand Will Rapuano's role, and request an introduction without creating a service relationship.",
  path: "/why-choose-us",
});

const WHY_CHOOSE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should I compare when choosing a title provider?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Compare licensing or authorization, underwriting relationships, written fees, communication practices, service area, transaction fit, signing options, policy terms, and who is responsible for each closing step.",
      },
    },
    {
      "@type": "Question",
      name: "What areas does Pruitt Title serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pruitt Title's official public information describes service in Washington DC, Northern Virginia, and Maryland. Availability and acceptance remain transaction-specific and should be confirmed directly with Pruitt.",
      },
    },
    {
      "@type": "Question",
      name: "What is Will Rapuano's relationship to Pruitt Title?",
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
