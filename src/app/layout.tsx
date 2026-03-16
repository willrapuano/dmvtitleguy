import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = "https://www.dmvtitleguy.io";
const siteName = "DMV Title Guy";
const defaultTitle = "DMV Title Guy | Title & Closing Services — DC, Maryland & Virginia";
const defaultDescription =
  "Pruitt Title LLC — trusted title insurance and closing services across Washington DC, Maryland, and Virginia. Top 5% title executive.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | DMV Title Guy` },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: { index: true, follow: true },
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "LegalService"],
  name: "DMV Title Guy — Pruitt Title LLC",
  alternateName: "Pruitt Title LLC",
  url: siteUrl,
  telephone: "(703) 859-1467",
  email: "wrapuano@pruitt-title.com",
  description: defaultDescription,
  image: `${siteUrl}/og-image.jpg`,
  priceRange: "$$",
  foundingDate: "2007",
  areaServed: [
    { "@type": "City", name: "Washington", addressRegion: "DC" },
    { "@type": "State", name: "Virginia" },
    { "@type": "State", name: "Maryland" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "1900 Gallows Rd Suite 230",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-brand-dark-text">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
