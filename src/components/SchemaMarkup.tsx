/**
 * Page-level schema markup component.
 * Renders page-level JSON-LD without representing every service area as a
 * physical DMV Title Guy office.
 */

import { formatLocationName, type StateCode } from "@/data/locations";
import {
  SITE_NAME,
  SITE_URL,
  willPersonReference,
} from "@/lib/brand-identity";
import { serializeJsonLd } from "@/lib/json-ld";

interface LocationSchemaProps {
  city: string;
  state: string;
  county: string;
  slug: string;
  description: string;
}

export function LocationSchema({ city, state, slug, description }: LocationSchemaProps) {
  const locationName = formatLocationName(city, state as StateCode);
  const isBethesda = slug === "title-company-bethesda-md";
  const localAreaServed = isBethesda
    ? [
        {
          "@type": "City",
          name: "Bethesda",
          addressRegion: "MD",
        },
        {
          "@type": "City",
          name: "Chevy Chase",
          addressRegion: "MD",
        },
        {
          "@type": "AdministrativeArea",
          name: "Montgomery County",
          addressRegion: "MD",
        },
      ]
    : {
        "@type": "City",
        name: city,
        ...(state !== "DC" ? { addressRegion: state } : {}),
      };
  const serviceName = isBethesda
    ? "Bethesda-Chevy Chase MD Title and Closing Guide"
    : `Title and Closing Guide for ${locationName}`;
  const serviceDescription = isBethesda
    ? "Educational guide to escrow, title search, title insurance, settlement, recording, and closing topics for Bethesda-Chevy Chase and Montgomery County."
    : `Educational title-search, title-insurance, and real-estate-closing guide for ${locationName}.`;
  const serviceType = isBethesda
    ? "Escrow, Title Search, Settlement, Title Insurance, and Real Estate Closing Services"
    : "Title Insurance & Settlement Services";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE_URL}/${slug}#guide`,
        headline: serviceName,
        description,
        about: { "@type": "Thing", name: serviceType },
        spatialCoverage: localAreaServed,
        author: willPersonReference(),
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${slug}#webpage`,
        url: `${SITE_URL}/${slug}`,
        name: `Title & Closing Services in ${locationName} | DMV Title Guy`,
        description: serviceDescription,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/${slug}#guide` },
        author: willPersonReference(),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}

interface CountySchemaProps {
  countyName: string;
  state: string;
  slug: string;
}

export function CountySchema({ countyName, state, slug }: CountySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/${slug}#guide`,
    headline: `Title and Closing Guide for ${countyName}`,
    url: `${SITE_URL}/${slug}`,
    about: { "@type": "Thing", name: "Title Insurance and Settlement" },
    spatialCoverage: {
      "@type": "AdministrativeArea",
      name: countyName,
      addressRegion: state,
    },
    author: willPersonReference(),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}

interface CalculatorSchemaProps {
  state: string;
  slug: string;
}

export function CalculatorSchema({ state, slug }: CalculatorSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${state} Closing Cost Calculator`,
    url: `${SITE_URL}/${slug}`,
    applicationCategory: "FinanceApplication",
    description: `Free interactive closing cost calculator for real estate transactions in ${state}. Estimate buyer and seller closing costs.`,
    creator: willPersonReference(),
    publisher: willPersonReference(),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
}

export function ServiceSchema({ name, description, serviceType }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    description,
    about: { "@type": "Thing", name: serviceType },
    spatialCoverage: [
      { "@type": "State", name: "Virginia" },
      { "@type": "State", name: "Maryland" },
      { "@type": "State", name: "District of Columbia" },
    ],
    author: willPersonReference(),
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}

interface CityCalculatorSchemaProps {
  city: string;
  state: string;
  county: string;
  slug: string;
  faqs?: { question: string; answer: string }[];
}

export function CityCalculatorSchema({ city, state, county, slug, faqs }: CityCalculatorSchemaProps) {
  const cityLabel = formatLocationName(city, state as StateCode);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name: `${cityLabel} Closing Cost Calculator`,
      url: `${SITE_URL}/${slug}`,
      applicationCategory: "FinanceApplication",
      description: `Free closing cost calculator for ${cityLabel}. Estimate buyer and seller closing costs including local ${county} taxes.`,
      creator: willPersonReference(),
      publisher: {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${slug}#webpage`,
      url: `${SITE_URL}/${slug}`,
      name: `Closing Costs in ${cityLabel} | DMV Title Guy`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      author: willPersonReference(),
    },
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
