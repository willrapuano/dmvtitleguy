/**
 * Page-level schema markup component.
 * Renders JSON-LD for LocalBusiness + Service per location page,
 * WebPage for static pages, etc.
 */

const SITE_URL = "https://www.dmvtitleguy.io";
const BUSINESS_NAME = "DMV Title Guy — Pruitt Title LLC";

interface LocationSchemaProps {
  city: string;
  state: string;
  county: string;
  slug: string;
  description: string;
}

export function LocationSchema({ city, state, county, slug, description }: LocationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "LegalService"],
        "@id": `${SITE_URL}/${slug}`,
        name: `${BUSINESS_NAME} — ${city}, ${state}`,
        url: `${SITE_URL}/${slug}`,
        telephone: "(703) 859-1467",
        email: "wrapuano@pruitt-title.com",
        description,
        address: {
          "@type": "PostalAddress",
          streetAddress: "1900 Gallows Rd Suite 230",
          addressLocality: "Vienna",
          addressRegion: "VA",
          postalCode: "22182",
          addressCountry: "US",
        },
        areaServed: {
          "@type": "City",
          name: city,
          ...(state !== "DC" ? { addressRegion: state } : {}),
        },
        parentOrganization: {
          "@type": "Organization",
          name: "Pruitt Title LLC",
          url: SITE_URL,
        },
      },
      {
        "@type": "Service",
        name: `Title Insurance & Closing Services in ${city}, ${state}`,
        provider: {
          "@type": "LocalBusiness",
          name: BUSINESS_NAME,
        },
        areaServed: {
          "@type": "City",
          name: city,
        },
        description: `Professional title search, title insurance, and real estate closing services for buyers, sellers, agents, and lenders in ${city}, ${state}.`,
        serviceType: "Title Insurance & Settlement Services",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${slug}#webpage`,
        url: `${SITE_URL}/${slug}`,
        name: `Title Company in ${city}, ${state} | DMV Title Guy`,
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
    name: `${BUSINESS_NAME} — ${countyName}`,
    url: `${SITE_URL}/${slug}`,
    telephone: "(703) 859-1467",
    areaServed: {
      "@type": "AdministrativeArea",
      name: countyName,
      addressRegion: state,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "1900 Gallows Rd Suite 230",
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
