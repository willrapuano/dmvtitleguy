/**
 * Root layout - minimal wrapper that applies to ALL routes
 * Studio gets its own nested layout, marketing pages get (marketing) group layout
 */

import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/brand-identity";
import { AttributionCapture } from "@/components/AttributionCapture";

const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

/**
 * Capital Standard type system (Paper: "DMV Title Guy — Website Design Options").
 * Newsreader for headings, set tight at medium weight; Manrope for body and UI.
 */
const displayFont = Newsreader({
  subsets: ["latin"],
  // Variable font with the optical-size axis: large headings get the tight
  // display cut the Paper artboards use. Fixed weights drop the axis and
  // every heading falls back to the loose text cut.
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const defaultTitle = "DMV Title Guy | Title & Closing Services — DC, MD & VA";
const defaultDescription =
  "Practical title and closing guidance from Will Rapuano, with eligible transaction requests available for referral to Pruitt Title LLC for independent review.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultTitle, template: `%s` },
  description: defaultDescription,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen antialiased bg-white text-brand-dark-text font-sans">
        <AttributionCapture />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7JQ2YPBX58"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7JQ2YPBX58');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
