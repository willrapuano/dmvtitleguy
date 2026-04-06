import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "DMV Title Guy | Title & Closing Services — DC, MD & VA",
  description:
    "Pruitt Title LLC — trusted title insurance and closing services across DC, Maryland, and Virginia. Serving agents, lenders, and buyers. Fast closings, top 5% title executive.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomePageClient />;
}
