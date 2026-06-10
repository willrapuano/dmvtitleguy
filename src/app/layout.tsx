/**
 * Root layout - minimal wrapper that applies to ALL routes
 * Studio gets its own nested layout, marketing pages get (marketing) group layout
 */

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

const siteUrl = "https://dmvtitleguy.io";
const siteName = "DMV Title Guy";
const defaultTitle = "DMV Title Guy | Title & Closing Services — DC, MD & VA";
const defaultDescription =
  "Pruitt Title LLC — trusted title insurance and closing services across Washington DC, Maryland, and Virginia. Top 5% title executive.";

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
    title: "DMV Title Guy | Title & Closing Services — DC, MD & VA",
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DMV Title Guy | Title & Closing Services — DC, MD & VA",
    description: defaultDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable}>
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
