import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "Subscribe | DMV Title Guy — Real Estate Tips & Market Updates",
  description:
    "Subscribe to the DMV Title Guy newsletter for real estate tips, closing cost guides, market updates, and tools for agents and lenders in DC, Maryland & Virginia.",
  alternates: { canonical: "/subscribe" },
};

const WHAT_YOU_GET = [
  {
    icon: "📊",
    title: "Market Updates",
    desc: "Monthly insights on the DMV real estate market — trends, stats, and what's moving.",
  },
  {
    icon: "💡",
    title: "Agent Tips & Tools",
    desc: "Actionable strategies for growing your business — marketing ideas, tech tools, and closing tips.",
  },
  {
    icon: "📋",
    title: "CE Class Announcements",
    desc: "Be the first to know about upcoming free CE classes, workshops, and events.",
  },
  {
    icon: "🏠",
    title: "Closing Cost Guides",
    desc: "State-specific guides and calculator updates for DC, Maryland, and Virginia transactions.",
  },
];

export default function SubscribePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}
      >
        <div className="container-xl text-center">
          <nav className="text-xs text-gray-400 mb-4 flex justify-center gap-2">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span>/</span>
            <span className="text-gray-200">Subscribe</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
            Stay Connected
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl mx-auto">
            Get Real Estate Tips, Tools & Market Updates
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Join hundreds of DMV agents and lenders who get actionable insights from Will Rapuano at Pruitt Title LLC. No spam — just value.
          </p>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="prose-title mb-6">What You&apos;ll Receive</h2>
              <div className="space-y-6">
                {WHAT_YOU_GET.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-bold text-brand-navy mb-1">{item.title}</h3>
                      <p className="text-brand-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-brand-muted mt-8">
                We respect your inbox. Typically 2–4 emails per month. Unsubscribe anytime.
              </p>
            </div>
            <div>
              <LeadCaptureForm
                title="Subscribe Now"
                subtitle="Get DMV real estate insights delivered to your inbox."
                location="subscribe-page"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
