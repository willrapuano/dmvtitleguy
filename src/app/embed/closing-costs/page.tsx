import type { Metadata } from "next";
import { EmbedClosingCosts } from "@/components/EmbedClosingCosts";

// Framed on other sites; the calculators live at /calculators for search.
export const metadata: Metadata = {
  title: "Pruitt Title Quote Calculator | DMV Title Guy",
  robots: { index: false, follow: true },
  alternates: { canonical: "/calculators/title-quote" },
};

export default function EmbedClosingCostsPage() {
  return <EmbedClosingCosts />;
}
