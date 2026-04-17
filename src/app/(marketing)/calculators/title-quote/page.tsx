import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Title Quote Calculator | DMV Title Guy",
  description:
    "Get an instant title insurance quote for your DC, Maryland, or Virginia real estate transaction. Powered by Pruitt Title LLC.",
  alternates: { canonical: "/calculators/title-quote" },
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
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">Free Tool</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
