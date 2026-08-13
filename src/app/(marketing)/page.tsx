import { HomePageClient } from "@/components/HomePageClient";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Real Estate Title & Escrow in DC, MD & VA | Pruitt Title",
  description: "Pruitt Title provides real estate title insurance, escrow, and settlement services across Northern Virginia, Maryland, and Washington, DC. Get a quote.",
  path: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
