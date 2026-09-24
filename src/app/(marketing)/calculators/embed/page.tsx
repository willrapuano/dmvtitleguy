import type { Metadata } from "next";
import Link from "next/link";
import { EmbedSnippet } from "@/components/EmbedSnippet";

export const metadata: Metadata = {
  title: "Add the Closing Cost Calculator to Your Website | DMV Title Guy",
  description: "A free DC, Maryland and Virginia closing cost calculator any real estate website can embed with one snippet.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/calculators/embed" },
};

export default function CalculatorEmbedPage() {
  return (
    <>
      <section className="page-hero md:py-16">
        <div className="container-xl">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs text-[#C9D6E0]">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2 text-white/30" aria-hidden="true">/</span>
            <Link href="/calculators" className="hover:text-white">Calculators</Link>
            <span className="mx-2 text-white/30" aria-hidden="true">/</span>
            <span>Embed</span>
          </nav>
          <p className="page-hero-eyebrow">Free for any website</p>
          <h1 className="t-h1 text-white">Add the closing cost calculator to your site</h1>
          <p className="page-hero-lede">
            Give your buyers and sellers a DC, Maryland and Virginia closing cost estimate without leaving your website. Copy one snippet; there is nothing to sign up for.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-xl grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.015em] text-brand-navy">How to add it</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-[17px] leading-relaxed text-brand-ink">
              <li>Copy the code below.</li>
              <li>Paste it into an HTML or &ldquo;custom code&rdquo; block on the page where you want the calculator.</li>
              <li>Publish. The calculator resizes itself to fit.</li>
            </ol>
            <div className="mt-8"><EmbedSnippet /></div>
            <p className="mt-6 text-sm leading-relaxed text-brand-ink-light">
              The calculator shows estimates only; figures depend on the contract, the lender and the settlement company. DMV Title Guy is an educational website by Will Rapuano and is not a title insurer or settlement provider.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.015em] text-brand-navy">Preview</h2>
            <iframe
              src="/embed/closing-costs"
              title="Closing cost calculator preview"
              loading="lazy"
              className="mt-5 h-[900px] w-full border border-brand-line"
            />
          </div>
        </div>
      </section>
    </>
  );
}
