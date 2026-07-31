/**
 * Marketing pages layout - includes NavBar and Footer
 * This wraps all pages in the (marketing) route group
 */

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const siteUrl = "https://dmvtitleguy.com";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DMV Title Guy — Pruitt Title LLC",
  alternateName: "Pruitt Title LLC",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/logo.png`,
  },
  description: "Professional title insurance and closing services for real estate agents, mortgage lenders, banks, credit unions, and home builders in DC, Maryland, and Virginia.",
  telephone: "(703) 859-1467",
  email: "wrapuano@pruitt-title.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1900 Gallows Rd Ste 230",
    addressLocality: "Vienna",
    addressRegion: "VA",
    postalCode: "22182",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61556322698901",
    "https://www.instagram.com/dmvtitleguy",
    "https://www.linkedin.com/in/will-rapuano-86914b130",
    "https://www.youtube.com/@dmvtitleguy",
  ],
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "LegalService"],
  name: "DMV Title Guy — Pruitt Title LLC",
  alternateName: "Pruitt Title LLC",
  url: siteUrl,
  telephone: "(703) 859-1467",
  email: "wrapuano@pruitt-title.com",
  description: "Pruitt Title LLC — trusted title insurance and closing services across Washington DC, Maryland, and Virginia. Top 5% title executive.",
  image: `${siteUrl}/logo.png`,
  priceRange: "$$",
  foundingDate: "2007",
  areaServed: [
    { "@type": "City", name: "Washington", addressRegion: "DC" },
    { "@type": "State", name: "Virginia" },
    { "@type": "State", name: "Maryland" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "1900 Gallows Rd Ste 230",
    addressLocality: "Vienna",
    addressRegion: "VA",
    postalCode: "22182",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.9005,
    longitude: -77.2341,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "17:00" },
  ],
  sameAs: [
    "https://www.facebook.com/profile.php?id=61556322698901",
    "https://www.instagram.com/dmvtitleguy",
    "https://www.linkedin.com/in/will-rapuano-86914b130",
    "https://www.youtube.com/@dmvtitleguy",
  ],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
