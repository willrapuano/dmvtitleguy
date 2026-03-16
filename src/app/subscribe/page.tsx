import type { Metadata } from "next";
import { SubscribePageClient } from "@/components/SubscribePageClient";

export const metadata: Metadata = {
  title: "Subscribe | DMV Title Guy — Real Estate Tools & Marketing Ideas",
  description:
    "Get exclusive access to real estate tools, classes, marketing strategies, and industry insights delivered directly to your inbox. Subscribe to DMV Title Guy.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return <SubscribePageClient />;
}
