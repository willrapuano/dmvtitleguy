import { HomePageClient } from "@/components/HomePageClient";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Pruitt Title | DMV Title Company & Closing Services",
  description: "DMV title company for DC, Maryland, and Virginia closings. Pruitt Title brings 17+ years serving Fairfax County. Call today for a fast quote.",
  path: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
