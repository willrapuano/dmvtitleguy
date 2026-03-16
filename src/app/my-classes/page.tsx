import type { Metadata } from "next";
import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const metadata: Metadata = {
  title: "CE Classes & Events | DMV Title Guy",
  description:
    "Free continuing education classes, workshops, and panel events for real estate agents and lenders across DC, Maryland & Virginia. Hosted by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/my-classes" },
};

const UPCOMING_CLASSES = [
  {
    title: "Title Insurance 101 for New Agents",
    desc: "Everything new agents need to know about title insurance, the closing process, and how to set their clients up for a smooth settlement.",
    format: "In-Person or Virtual",
    duration: "2 hours",
    ce: "2 CE Credits (VA/MD)",
  },
  {
    title: "Closing Costs Explained — Buyer & Seller Edition",
    desc: "Deep dive into closing costs across DC, Maryland, and Virginia. Help your clients understand exactly what they're paying and why.",
    format: "In-Person or Virtual",
    duration: "1.5 hours",
    ce: "1.5 CE Credits (VA/MD)",
  },
  {
    title: "AI Tools for Real Estate Professionals",
    desc: "How today's top-performing agents and lenders are using AI to generate leads, create content, and close more deals.",
    format: "Workshop",
    duration: "2 hours",
    ce: "Pending Approval",
  },
  {
    title: "Real Estate Marketing Panel",
    desc: "Join Will and a panel of top DMV professionals to discuss what's working in real estate marketing right now.",
    format: "Live Event",
    duration: "2 hours",
    ce: "N/A",
  },
];

const PAST_TOPICS = [
  "Understanding Title Commitments",
  "Navigating Multiple Offer Situations",
  "New Construction Closing Process",
  "Working with First-Time Homebuyers",
  "Real Estate Technology Stack 2025",
  "Building Your Personal Brand as an Agent",
];

export default function MyClassesPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}
      >
        <div className="container-xl">
          <nav className="text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-brand-blue">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Classes & Events</span>
          </nav>
          <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">
            Education & Community
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-3xl">
            Free CE Classes, Workshops & Events for DMV Real Estate Professionals
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl">
            Will Rapuano is a leading educator and connector in the DMV real estate community. From CE classes to marketing workshops to panel events — we invest in helping agents and lenders grow.
          </p>
          <Link href="/my-classes#signup" className="btn-primary">
            Get Notified About Upcoming Classes →
          </Link>
        </div>
      </section>

      {/* UPCOMING CLASSES */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-10">
            <h2 className="prose-title">Available Classes & Workshops</h2>
            <p className="prose-subtitle max-w-xl mx-auto">
              All classes are free for real estate professionals. In-person classes held in Northern Virginia with virtual options available.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {UPCOMING_CLASSES.map((c) => (
              <div key={c.title} className="card p-6">
                <h3 className="font-bold text-brand-navy text-lg mb-2">{c.title}</h3>
                <p className="text-brand-muted text-sm mb-4 leading-relaxed">{c.desc}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="bg-brand-gray-bg px-3 py-1 rounded-full text-brand-muted">{c.format}</span>
                  <span className="bg-brand-gray-bg px-3 py-1 rounded-full text-brand-muted">{c.duration}</span>
                  <span className="bg-brand-blue/10 px-3 py-1 rounded-full text-brand-blue font-medium">{c.ce}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAST TOPICS */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-8">Past Class Topics</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {PAST_TOPICS.map((topic) => (
              <div key={topic} className="flex items-center gap-2 text-sm text-brand-dark-text">
                <span className="text-brand-blue flex-shrink-0">✓</span>
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" className="section-navy">
        <div className="container-xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Want to Attend a Class?</h2>
            <p className="text-gray-300 mb-4">
              Submit your info and we&apos;ll notify you about upcoming CE classes, workshops, and events in the DMV area. All classes are free for real estate professionals.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Classes held in Northern Virginia + virtual options</p>
              <p>📞 <a href="tel:+17038591467" className="text-brand-blue">(703) 859-1467</a></p>
              <p>✉️ <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">wrapuano@pruitt-title.com</a></p>
            </div>
          </div>
          <LeadCaptureForm title="Sign Up for Class Notifications" subtitle="We'll let you know when the next class is scheduled." location="classes-signup" />
        </div>
      </section>
    </>
  );
}
