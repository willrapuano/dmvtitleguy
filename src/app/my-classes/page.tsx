import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Classes | DMV Title Guy — Workshops & CE Courses",
  description:
    "Free workshops, CE courses, and educational events for real estate agents and lenders in DC, Maryland & Virginia. Hosted by Will Rapuano, Pruitt Title LLC.",
  alternates: { canonical: "/my-classes" },
};

const PAST_CLASSES = [
  {
    title: "Demystify AI: Simple but Effective Tools with thanks.io",
    desc: "Explore practical AI tools that can streamline your real estate marketing and client outreach, including how to leverage thanks.io for personalized direct mail campaigns powered by AI.",
    date: "August 1, 2025",
    time: "2:00 PM",
    location: "Virtual",
    price: "Free",
  },
  {
    title: "Video Reels & Social Media Ads for Realtors",
    desc: "Learn how to create engaging video reels and run effective social media ad campaigns that generate real leads. We cover Instagram Reels, Facebook Ads, and content strategy for real estate professionals.",
    date: "October 9, 2024",
    time: "10:30 AM",
    location: "Virtual",
    price: "Free",
  },
  {
    title: "Targeting Absentee Owners and Downsizers!",
    desc: "Discover strategies for identifying and marketing to absentee property owners and downsizers in the DMV area. Learn how to build targeted lists and create compelling outreach campaigns.",
    date: "May 25, 2023",
    time: "4:00 PM",
    location: "Virtual",
    price: "Free",
  },
  {
    title: "CE Course: 1031 Exchanges",
    desc: "A comprehensive continuing education course on 1031 tax-deferred exchanges. Understand the rules, timelines, qualified intermediaries, and how to advise your clients on this powerful investment strategy.",
    date: "February 23, 2023",
    time: "12:00 PM",
    location: "Virtual",
    price: "Free",
  },
  {
    title: "Lunch & Learn: Authority to Execute on Behalf of Deceased",
    desc: "An educational session covering the legal authority required to execute real estate transactions on behalf of a deceased property owner. Topics include estates, probate, personal representatives, and title requirements.",
    date: "January 19, 2023",
    time: "12:00 PM",
    location: "Virtual",
    price: "Free",
  },
  {
    title: "CE Course: Using Living Trusts to Hold Real Estate",
    desc: "Learn how living trusts are used to hold real estate, the benefits for estate planning, and the title implications when buying or selling property held in trust. Approved for continuing education credits.",
    date: "December 8, 2022",
    time: "12:00 PM",
    location: "Virtual",
    price: "Free",
  },
];

export default function MyClassesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-blue py-20 md:py-28">
        <div className="container-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            My Classes
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Workshops, CE courses, and networking events designed to help DMV real estate professionals stay ahead and grow their businesses.
          </p>
        </div>
      </section>

      {/* Past Classes & Workshops */}
      <section className="section-light">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-2">Past Classes &amp; Workshops</h2>
          <div className="accent-divider" />
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {PAST_CLASSES.map((c) => (
              <div key={c.title} className="card p-6">
                <h3 className="font-bold text-brand-navy text-lg mb-2">{c.title}</h3>
                <p className="text-brand-muted text-sm mb-4 leading-relaxed">{c.desc}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="bg-brand-gray-bg px-3 py-1.5 rounded-full text-brand-muted font-medium">📅 {c.date}</span>
                  <span className="bg-brand-gray-bg px-3 py-1.5 rounded-full text-brand-muted font-medium">🕐 {c.time}</span>
                  <span className="bg-brand-gray-bg px-3 py-1.5 rounded-full text-brand-muted font-medium">📍 {c.location}</span>
                  <span className="bg-brand-blue/10 px-3 py-1.5 rounded-full text-brand-blue font-semibold">{c.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interested in Future Classes */}
      <section className="section-blue">
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Interested in Future Classes?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Follow me on Eventbrite to get notified about upcoming workshops, CE courses, and events.
          </p>
          <a
            href="https://www.eventbrite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            Follow on Eventbrite →
          </a>
        </div>
      </section>

      {/* Custom Training */}
      <section className="section-light">
        <div className="container-xl text-center max-w-2xl">
          <h2 className="prose-title mb-2">Custom Training for Your Team</h2>
          <div className="accent-divider" />
          <p className="text-brand-muted leading-relaxed mt-6 mb-8">
            I offer customized training sessions for real estate teams, brokerages, and mortgage companies. Whether it&apos;s a
            title insurance deep-dive, a marketing workshop, or a technology training session — I&apos;ll build a program
            tailored to your team&apos;s specific needs and goals.
          </p>
          <Link href="/#contact" className="btn-primary px-8">
            Contact Me →
          </Link>
        </div>
      </section>
    </>
  );
}
