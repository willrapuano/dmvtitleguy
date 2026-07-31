/**
 * Page-level schema markup component.
 * Renders JSON-LD for LocalBusiness + Service per location page,
 * WebPage for static pages, etc.
 */

import { formatLocationName, type StateCode } from "@/data/locations";

const SITE_URL = "https://dmvtitleguy.com";
const BUSINESS_NAME = "DMV Title Guy — Pruitt Title LLC";

interface LocationSchemaProps {
  city: string;
  state: string;
  county: string;
  slug: string;
  description: string;
}

export function LocationSchema({ city, state, county, slug, description }: LocationSchemaProps) {
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
    ? "Bethesda-Chevy Chase MD Title Company, Escrow & Settlement Services"
    : `Title Insurance & Closing Services in ${locationName}`;
  const serviceDescription = isBethesda
    ? "Professional escrow, title search, title insurance, settlement, recording, and closing services for residential, commercial, refinance, investor, trust, and estate transactions in Bethesda-Chevy Chase and Montgomery County."
    : `Professional title search, title insurance, and real estate closing services for buyers, sellers, agents, and lenders in ${locationName}.`;
  const serviceType = isBethesda
    ? "Escrow, Title Search, Settlement, Title Insurance, and Real Estate Closing Services"
    : "Title Insurance & Settlement Services";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "LegalService"],
        "@id": `${SITE_URL}/${slug}#business`,
        name: `${BUSINESS_NAME} — ${locationName}`,
        url: `${SITE_URL}/${slug}`,
        telephone: "(703) 859-1467",
        email: "wrapuano@pruitt-title.com",
        description,
        image: `${SITE_URL}/logo.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "1900 Gallows Rd Ste 230",
          addressLocality: "Vienna",
          addressRegion: "VA",
          postalCode: "22182",
          addressCountry: "US",
        },
        areaServed: localAreaServed,
        parentOrganization: {
          "@type": "Organization",
          name: "Pruitt Title LLC",
          url: SITE_URL,
        },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/${slug}#service`,
        name: serviceName,
        provider: {
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/${slug}#business`,
          name: BUSINESS_NAME,
        },
        areaServed: localAreaServed,
        description: serviceDescription,
        serviceType,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${slug}#webpage`,
        url: `${SITE_URL}/${slug}`,
        name: `Title & Closing Services in ${locationName} | DMV Title Guy`,
        isPartOf: { "@id": SITE_URL },
        about: { "@id": `${SITE_URL}/${slug}` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
    "@type": ["LocalBusiness", "LegalService"],
    "@id": `${SITE_URL}/${slug}#business`,
    name: `${BUSINESS_NAME} — ${countyName}`,
    url: `${SITE_URL}/${slug}`,
    telephone: "(703) 859-1467",
    image: `${SITE_URL}/logo.png`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: countyName,
      addressRegion: state,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "1900 Gallows Rd Ste 230",
      addressLocality: "Vienna",
      addressRegion: "VA",
      postalCode: "22182",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_NAME,
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "RealEstateAgent",
      name: "DMV Title Guy | Pruitt Title LLC",
      telephone: "+1-703-859-1467",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1900 Gallows Rd Ste 230",
        addressLocality: "Vienna",
        addressRegion: "VA",
        postalCode: "22182",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "State", name: "Virginia" },
        { "@type": "State", name: "Maryland" },
        { "@type": "State", name: "District of Columbia" },
      ],
    },
    serviceType,
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
      provider: {
        "@type": "LocalBusiness",
        name: BUSINESS_NAME,
        url: SITE_URL,
        telephone: "(703) 859-1467",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1900 Gallows Rd Ste 230",
          addressLocality: "Vienna",
          addressRegion: "VA",
          postalCode: "22182",
          addressCountry: "US",
        },
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${slug}#webpage`,
      url: `${SITE_URL}/${slug}`,
      name: `Closing Costs in ${cityLabel} | DMV Title Guy`,
      isPartOf: { "@id": SITE_URL },
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
