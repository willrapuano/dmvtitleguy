/**
 * Marketing pages layout - includes NavBar and Footer
 * This wraps all pages in the (marketing) route group
 */

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import {
  BRAND_SAME_AS,
  PRUITT_TITLE,
  RELATIONSHIP_DISCLOSURE,
  SITE_NAME,
  SITE_URL,
  WILL,
} from "@/lib/brand-identity";
import { serializeJsonLd } from "@/lib/json-ld";

const IDENTITY_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: RELATIONSHIP_DISCLOSURE,
      creator: { "@id": `${WILL.url}#person` },
      publisher: { "@id": `${WILL.url}#person` },
      sameAs: BRAND_SAME_AS,
    },
    {
      "@type": "Person",
      "@id": `${WILL.url}#person`,
      name: WILL.name,
      url: WILL.url,
      image: WILL.image,
      jobTitle: WILL.jobTitle,
      email: WILL.email,
      telephone: WILL.phoneDisplay,
      worksFor: { "@id": PRUITT_TITLE.id },
      sameAs: WILL.sameAs,
    },
    {
      "@type": "Organization",
      "@id": PRUITT_TITLE.id,
      name: PRUITT_TITLE.name,
      url: PRUITT_TITLE.url,
    },
  ],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(IDENTITY_SCHEMA) }}
      />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
