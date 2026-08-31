import { HomePageClient } from "@/components/HomePageClient";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "DMV Title Guy | Title Education & Transaction Introductions",
  description: "Practical title education, calculators, and local transaction resources from Will Rapuano for DC, Maryland, and Virginia.",
  path: "/",
});

export default function HomePage() {
  return <HomePageClient />;
}
