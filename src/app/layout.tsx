/**
 * Root layout - minimal wrapper that applies to ALL routes
 * Studio gets its own nested layout, marketing pages get (marketing) group layout
 */

import type { Metadata } from "next";
import { Open_Sans, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/brand-identity";
import { AttributionCapture } from "@/components/AttributionCapture";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

/**
 * Display face for headings. The wordmark in logo.png is a high-contrast serif.
 * Source Serif 4 is a clean, professional, and readable serif for headings.
 * Body copy stays on Open Sans.
 */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
    <html lang="en" className={`${openSans.variable} ${sourceSerif.variable}`}>
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
