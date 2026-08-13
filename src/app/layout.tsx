/**
 * Root layout - minimal wrapper that applies to ALL routes
 * Studio gets its own nested layout, marketing pages get (marketing) group layout
 */

import type { Metadata } from "next";
import { Open_Sans, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

const siteUrl = "https://dmvtitleguy.io";
const siteName = "Pruitt Title | DMV Title Guy";
const defaultTitle = "Real Estate Title & Escrow in DC, MD & VA | Pruitt Title";
const defaultDescription =
  "Pruitt Title provides real estate title insurance, escrow, and settlement services across Northern Virginia, Maryland, and Washington, DC. Get a quote.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    siteName,
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
