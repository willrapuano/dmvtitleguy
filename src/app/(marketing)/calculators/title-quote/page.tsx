import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "title quote calculator for DMV Closings | Pruitt Title",
  description:
    "Title quote calculator for DC, Maryland, and Virginia closings. Estimate title insurance and settlement costs with Pruitt Title. Start today.",
  alternates: { canonical: "https://dmvtitleguy.com/calculators/title-quote" },
};

export default function TitleQuotePage() {
  return (
    <>
      <section className="bg-brand-navy text-white py-12">
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/calculators" className="hover:text-brand-blue">Calculators</Link>
            <span className="mx-2">/</span>
            <span>Title Quote</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2 max-w-[68ch] leading-relaxed">Free Tool</p>
          <h1 className="t-h1 text-white mb-4">
            Title Quote Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Get an instant title insurance quote for buyers and sellers in DC, Maryland, and Virginia. Enter your transaction details below for a real-time estimate from Pruitt Title LLC.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="container-xl">
          <iframe
            src="https://pruitt-title.titlecapture.com/title-quote"
            width="100%"
            height="800"
            frameBorder="0"
            style={{ border: "none" }}
            title="Pruitt Title — Title Quote Calculator"
          />
        </div>
      </section>
    </>
  );
}
