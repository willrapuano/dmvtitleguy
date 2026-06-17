import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "Pruitt Title | DMV Title Company & Closing Services",
  description:
    "DMV title company for DC, Maryland, and Virginia closings. Pruitt Title brings 17+ years serving Fairfax County. Call today for a fast quote.",
  alternates: { canonical: "https://dmvtitleguy.io/" },
};

export default function HomePage() {
  return <HomePageClient />;
}
