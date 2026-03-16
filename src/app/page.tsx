import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "DMV Title Guy | Title Insurance & Real Estate Marketing — DC, Maryland & Virginia",
  description:
    "Will Rapuano — Business Development at Pruitt Title LLC. Helping real estate agents and mortgage lenders throughout the DMV with marketing strategies, CE classes, and professional title services.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomePageClient />;
}
