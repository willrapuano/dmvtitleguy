import type { Metadata } from "next";
import { WhyChooseUsClient } from "@/components/WhyChooseUsClient";

export const metadata: Metadata = {
  title: "Why Pruitt Title? | DMV Title Guy",
  description:
    "9 reasons why real estate professionals choose Pruitt Title LLC. Woman-owned, First American backed, serving DC, Maryland & Virginia since 2007.",
  alternates: { canonical: "/why-choose-us" },
};

export default function WhyChooseUsPage() {
  return <WhyChooseUsClient />;
}
