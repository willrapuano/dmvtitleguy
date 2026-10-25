import type { Metadata } from "next";
import { AdvertisingPageClient } from "@/components/AdvertisingPageClient";

export const metadata: Metadata = {
  title: "Advertising Services | DMV Title Guy — Amplify Your Listings",
  description:
    "Amplify your real estate listings with strategic ad campaigns. Traffic-generating ads, sphere-based advertising, and data-driven results for DMV real estate professionals.",
  alternates: { canonical: "/advertising-services" },
  // 2026-10-23 prune 2/3: not a search landing page; Google declined to index it.
  robots: { index: false, follow: true },
};

export default function AdvertisingServicesPage() {
  return <AdvertisingPageClient />;
}
