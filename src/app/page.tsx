import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "DMV Title Guy | Title Insurance & Real Estate Marketing — DC, Maryland & Virginia",
  description:
    "Will Rapuano — Business Development at Pruitt Title LLC. Professional title insurance and closing services for real estate agents, mortgage lenders, banks, credit unions, and home builders in Washington DC, Northern Virginia, and Maryland. Your trusted DMV title company.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomePageClient />;
}
