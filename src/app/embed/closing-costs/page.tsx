import type { Metadata } from "next";
import { EmbedClosingCosts } from "@/components/EmbedClosingCosts";

// Framed on other sites; the calculator lives at /calculators for search.
export const metadata: Metadata = {
  title: "Closing Cost Calculator | DMV Title Guy",
  robots: { index: false, follow: true },
  alternates: { canonical: "/calculators" },
};

export default async function EmbedClosingCostsPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  const initial = state === "MD" || state === "DC" ? state : "VA";
  return <EmbedClosingCosts initialState={initial} />;
}
