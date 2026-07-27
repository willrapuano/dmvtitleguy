import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Contact DMV Title Guy | Pruitt Title LLC",
  description: "Contact DMV Title Guy for title insurance and closing services in Northern Virginia, DC, and Maryland. Call (703) 859-1467.",
  alternates: { canonical: "https://dmvtitleguy.io/contact" },
};

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-navy text-white py-16 md:py-24" style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}>
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Contact</span>
            </nav>
            <h1 className="t-h1 text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">
              Get in touch with DMV Title Guy for title insurance and closing services across the DMV.
            </p>
            <div className="space-y-3">
              <p className="text-gray-300 max-w-[68ch] leading-relaxed">
                <span className="text-brand-blue font-semibold">Phone:</span>{" "}
                <a href="tel:+17038591467" className="hover:text-white">(703) 859-1467</a>
              </p>
              <p className="text-gray-300 max-w-[68ch] leading-relaxed">
                <span className="text-brand-blue font-semibold">Email:</span>{" "}
                <a href="mailto:wrapuano@pruitt-title.com" className="hover:text-white">wrapuano@pruitt-title.com</a>
              </p>
              <p className="text-gray-300 max-w-[68ch] leading-relaxed">
                <span className="text-brand-blue font-semibold">Address:</span>{" "}
                1900 Gallows Rd Suite 230, Vienna, VA 22182
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="t-h5 font-semibold text-white mb-4">Get a Title Quote</h2>
            <LeadCaptureForm location="contact" />
          </div>
        </div>
      </section>

      {/* OFFICE HOURS */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="t-h3 text-brand-navy mb-6">Office Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Monday – Friday</span>
                  <span className="font-semibold text-brand-navy">8:30 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold text-brand-navy">By Appointment</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold text-brand-navy">Closed</span>
                </div>
              </div>
              <p className="text-gray-600 mt-6 max-w-[68ch] leading-relaxed">
                <span className="font-semibold text-brand-navy">Emergency Closings:</span>{" "}
                After-hours support available for scheduled closings.
              </p>
            </div>
            <div>
              <h2 className="t-h3 text-brand-navy mb-6">Service Areas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Virginia</h3>
                  <p className="text-gray-600 text-sm max-w-[68ch] leading-relaxed">Arlington, Fairfax, Alexandria, Loudoun, Prince William Counties</p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Maryland</h3>
                  <p className="text-gray-600 text-sm max-w-[68ch] leading-relaxed">Montgomery County, Prince George's County</p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Washington DC</h3>
                  <p className="text-gray-600 text-sm max-w-[68ch] leading-relaxed">All DC neighborhoods and wards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* START YOUR TRANSACTION */}
      <section className="py-16 bg-brand-navy text-white">
        <div className="container-xl text-center">
          <h2 className="t-h3 mb-4">Start Your Transaction</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Ready to get started? Choose the service that fits your needs.</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link href="/investor-due-diligence" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Investor Due Diligence</h3>
              <p className="text-sm text-gray-300 max-w-[68ch] leading-relaxed">Submit property info & start your title search.</p>
            </Link>
            <Link href="/upload-contract" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Upload Contract</h3>
              <p className="text-sm text-gray-300 max-w-[68ch] leading-relaxed">Upload your ratified contract for fast processing.</p>
            </Link>
            <Link href="/request-title-review" className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors">
              <h3 className="font-semibold text-white mb-2">Request Title Review</h3>
              <p className="text-sm text-gray-300 max-w-[68ch] leading-relaxed">Get clarity on a property&apos;s title status.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl">
          <h2 className="t-h3 text-brand-navy mb-8 text-center">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/calculators/title-quote" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="t-h6 font-semibold text-brand-navy mb-2">Get a Title Quote</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Instant title insurance quotes for your transaction.</p>
            </Link>
            <Link href="/calculators" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="t-h6 font-semibold text-brand-navy mb-2">Closing Cost Calculator</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">Estimate buyer and seller closing costs.</p>
            </Link>
            <Link href="/my-classes" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="t-h6 font-semibold text-brand-navy mb-2">Agent Education</h3>
              <p className="text-gray-600 max-w-[68ch] leading-relaxed">CE classes and training for real estate professionals.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
