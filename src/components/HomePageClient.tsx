"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/data/blog";

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61556322698901", icon: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/dmvtitleguy",                  icon: "IG" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/will-rapuano-86914b130",      icon: "IN" },
  { label: "YouTube",   href: "https://www.youtube.com/@dmvtitleguy",                   icon: "YT" },
];

const AUDIENCE_CARDS = [
  { role: "Real Estate Agents", desc: "Marketing strategies, CE classes, and a title partner who makes every closing smooth and stress-free.", icon: "🏠" },
  { role: "Mortgage Lenders", desc: "Fast turnarounds, proactive communication, and reliable closings for your entire pipeline.", icon: "🏦" },
  { role: "Banks & Credit Unions", desc: "Institutional-grade title services with the reliability and compliance your organization demands.", icon: "🏛️" },
  { role: "Home Builders", desc: "From lot closings to final sales, we handle every phase of your new construction pipeline.", icon: "🔨" },
  { role: "Real Estate Investors", desc: "Subject-to, wholesale, fix-and-flip, BRRRR — we understand your deal structures and move fast.", icon: "📈" },
];

const REASONS = [
  {
    num: "#1",
    title: "Expertise in Real Estate Marketing",
    body: "With years of experience in real estate marketing, I bring a unique blend of industry knowledge and creative strategy. My approach is tailored to the specific needs of real estate professionals in the DMV area, ensuring that your marketing efforts are both effective and efficient. From digital advertising to video marketing, I leverage the latest tools and techniques to help you stand out in a crowded market.",
  },
  {
    num: "#2",
    title: "Comprehensive Title & Escrow Services",
    body: "As a licensed title producer at Pruitt Title LLC, I offer comprehensive title and escrow services backed by First American Title Insurance Company. Whether you're working on a residential purchase, commercial deal, new construction, or investor transaction, I ensure every closing is handled with professionalism, accuracy, and care. My goal is to make the settlement process seamless for all parties involved.",
  },
  {
    num: "#3",
    title: "Dedication to Professional Growth",
    body: "I'm passionate about helping real estate professionals grow their businesses. Through free CE classes, workshops, panel events, and one-on-one mentorship, I invest in the DMV agent and lender community year-round. I believe that when we grow together, everyone benefits — your clients, your business, and the entire real estate ecosystem.",
  },
];

const DISCOVER_ITEMS = [
  { num: 1, title: "Unique Real Estate Marketing Strategies", desc: "Discover innovative marketing strategies specifically designed for the real estate industry. From social media campaigns to targeted digital ads, I'll help you reach your ideal audience and generate quality leads." },
  { num: 2, title: "Expertise in Video Marketing and Digital Advertising", desc: "Leverage the power of video and digital advertising to showcase your listings and build your personal brand. I'll guide you through creating engaging content that resonates with today's buyers and sellers." },
  { num: 3, title: "Comprehensive Title and Escrow Services", desc: "Benefit from professional title and escrow services that ensure smooth, timely closings. As a Pruitt Title producer backed by First American, I bring Fortune 500 resources to every transaction." },
  { num: 4, title: "Access to Real Estate Tools and Resources", desc: "Gain access to a curated collection of tools, templates, and resources designed to streamline your real estate business. From closing cost calculators to market analysis tools." },
  { num: 5, title: "Professional Growth and Education", desc: "Take advantage of free CE classes, workshops, and industry events designed to keep you at the top of your game. Continuous learning is key to staying competitive in the DMV market." },
  { num: 6, title: "Personalized Support for Real Estate Marketing", desc: "Receive personalized marketing support tailored to your specific goals and target market. Whether you're a new agent or a seasoned professional, I'll help you develop a strategy that works for you." },
  { num: 7, title: "Guidance in Using Latest Technologies", desc: "Stay ahead of the curve with guidance on the latest real estate technologies. From AI-powered tools to advanced CRM systems, I'll help you leverage technology to grow your business." },
  { num: 8, title: "Local Expertise with National Presence", desc: "Benefit from deep local market knowledge combined with the backing of First American Title Insurance Company, a Fortune 500 leader in the title industry. Local service, national strength." },
];

export function HomePageClient() {
  const [expandedReason, setExpandedReason] = useState<number | null>(null);
  const latestPosts = BLOG_POSTS.slice(0, 6);

  return (
    <>
      {/* ── SECTION 1: HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
        {/* Background — cherry blossom DC */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1617581629397-a72507c3f890?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-brand-navy/75" />

        {/* Social sidebar — desktop only */}
        <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-brand-blue flex items-center justify-center text-[10px] font-bold text-white transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="container-xl relative z-10 grid md:grid-cols-2 gap-10 items-center py-20">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-300 mb-3">Welcome To</p>
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-bold text-white leading-none mb-6">
              DMV Title Guy
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed max-w-lg mb-8">
              My name is <strong className="text-white">Will Rapuano</strong>, and I lead Business Development at{" "}
              <strong className="text-white">Pruitt Title</strong> in Vienna, VA. I help real estate agents and mortgage
              lenders throughout the DMV area implement unique marketing strategies and adopt a sustainable business model
              designed to help them grow their real estate business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contact" className="btn-primary text-base px-8 py-3.5">
                Get in Touch
              </Link>
              <Link href="/subscribe" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy text-base px-8 py-3.5">
                Subscribe
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image
                src="/will-rapuano-headshot.jpg"
                alt="Will Rapuano — DMV Title Guy"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ABOUT / BIO ───────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl max-w-4xl text-center">
          <h2 className="text-3xl md:text-[42px] font-bold text-brand-navy leading-tight mb-3">
            Are You a Real Estate Agent or Mortgage Lender?
          </h2>
          <div className="accent-divider" />
          <div className="text-brand-muted leading-relaxed space-y-4 text-left mt-8">
            <p>
              My name is Will Rapuano, and I am a Business Development Officer at <strong>Pruitt Title LLC</strong>, a
              locally-owned, woman-owned title and settlement company established in 2007 and based in Vienna, Virginia.
              I also lead Business Development for <strong>First American Title Insurance Company</strong>, the nation&apos;s
              leading provider of title insurance and settlement services and a Fortune 500 company.
            </p>
            <p>
              As the <strong>DMV Title Guy</strong>, my mission is to bring unique real estate marketing strategies,
              educational workshops, and innovative tools to real estate agents and mortgage lenders across Washington DC,
              Maryland, and Virginia. I&apos;m recognized among the top 5% of title insurance executives nationwide, and I use
              that expertise to not only handle closings with precision, but to help my referral partners grow their businesses.
            </p>
            <p>
              Whether you need a reliable title partner, want to attend a free CE class, or are looking for creative ways to
              market your listings — I&apos;m here to help. I&apos;m an educator, a connector, and an advocate for real estate
              professionals in the DMV.
            </p>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE CARDS ────────────────────────────────────────── */}
      <section className="section-gray">
        <div className="container-xl">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
            {AUDIENCE_CARDS.map((item) => (
              <div
                key={item.role}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-brand-navy text-base mb-2">{item.role}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SUBSCRIBE CTA ─────────────────────────────── */}
      <section className="section-blue">
        <div className="container-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Access to Real Estate Tools, Classes, and Marketing Ideas
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Sign up now for exclusive access to resources designed to help real estate professionals grow their business in the DMV.
          </p>
          <Link href="/subscribe" className="inline-block bg-white text-brand-blue font-bold px-8 py-3.5 rounded-md hover:bg-gray-100 transition-colors">
            Subscribe Now →
          </Link>
        </div>
      </section>

      {/* ── SECTION 4: LET'S CHAT ────────────────────────────────── */}
      <section id="contact" className="section-green">
        <div className="container-xl text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Let&apos;s Chat
          </h2>
          <div className="accent-divider" />
          <p className="text-brand-muted mb-8">
            Do you have any title, escrow, or real estate marketing questions? I&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:wrapuano@pruitt-title.com"
              className="btn-primary text-base px-8 py-3"
            >
              ✉️ Email Me
            </a>
            <a
              href="tel:+17038591467"
              className="btn-outline text-base px-8 py-3"
            >
              📞 (703) 859-1467
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHY CHOOSE ────────────────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="prose-title">Why Choose DMV Title Guy?</h2>
            <div className="accent-divider" />
            <p className="prose-subtitle max-w-2xl mx-auto">
              As a real estate professional, you need a partner who understands your business and can help you grow. Here&apos;s why agents and lenders across the DMV choose to work with me.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-center">
            <div className="p-6">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-blue text-2xl">💡</span>
              </div>
              <h3 className="font-bold text-brand-navy mb-2">Expertise in RE Marketing</h3>
              <p className="text-brand-muted text-sm">Innovative, data-driven marketing strategies tailored for real estate professionals.</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-blue text-2xl">🏠</span>
              </div>
              <h3 className="font-bold text-brand-navy mb-2">Comprehensive Title & Escrow</h3>
              <p className="text-brand-muted text-sm">Professional settlement services backed by First American Title Insurance Company.</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-blue text-2xl">📚</span>
              </div>
              <h3 className="font-bold text-brand-navy mb-2">Dedication to Professional Growth</h3>
              <p className="text-brand-muted text-sm">Free CE classes, workshops, and mentorship for DMV real estate professionals.</p>
            </div>
          </div>

          {/* Expandable Reason Cards */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {REASONS.map((r, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedReason(expandedReason === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-brand-blue font-bold text-lg">{r.num}</span>
                    <span className="font-bold text-brand-navy">{r.title}</span>
                  </div>
                  <span className={`text-brand-blue text-xl transition-transform duration-200 ${expandedReason === i ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {expandedReason === i && (
                  <div className="px-6 pb-5 pt-0 border-t border-gray-100">
                    <p className="text-brand-muted leading-relaxed text-sm">{r.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="mt-10 max-w-2xl mx-auto text-center border-l-4 border-brand-blue pl-6 py-2 italic text-brand-muted">
            &ldquo;My goal is simple: help real estate professionals in the DMV grow their businesses through better marketing, better education, and better title services. When my partners succeed, everybody wins.&rdquo;
            <footer className="mt-2 text-brand-navy font-semibold not-italic text-sm">— Will Rapuano, DMV Title Guy</footer>
          </blockquote>
        </div>
      </section>

      {/* ── SECTION 6: DISCOVER ──────────────────────────────────── */}
      <section className="section-blue">
        <div className="container-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Discover How I Can Elevate Your Real Estate Business
          </h2>
          <div className="w-6 h-0.5 bg-white/50 mx-auto mt-3 mb-10" />
          <div className="grid md:grid-cols-2 gap-6">
            {DISCOVER_ITEMS.map((item) => (
              <div key={item.num} className="flex gap-4 bg-white/10 rounded-lg p-5">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/75 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: LATEST BLOG POSTS ─────────────────────────── */}
      <section className="section-light">
        <div className="container-xl">
          <div className="text-center mb-10">
            <h2 className="prose-title">Latest Blog Posts</h2>
            <div className="accent-divider" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="bg-gradient-to-br from-brand-navy to-brand-navy-dark h-44 flex flex-col justify-end p-5">
                  <span className="text-xs text-brand-blue font-medium">{post.category}</span>
                  <span className="text-xs text-gray-400 mt-1">{post.date}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-blue transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <span className="text-brand-blue text-xs mt-3 block font-medium">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/my-blog" className="btn-outline">View All Posts</Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: NEED ANY HELP CTA BANNER ──────────────────── */}
      <section className="relative py-20 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/office-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-brand-navy/80" />
        <div className="container-xl relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Any Help? Feel Free to Get In Touch
          </h2>
          <a
            href="mailto:wrapuano@pruitt-title.com"
            className="btn-primary text-base px-8 py-3.5"
          >
            Contact Us →
          </a>
        </div>
      </section>

      {/* ── SECTION 9: LOOKING FOR IDEAS ─────────────────────────── */}
      <section className="section-light">
        <div className="container-xl text-center max-w-3xl">
          <h2 className="prose-title mb-6">Looking for Ideas to Grow Your Real Estate Business?</h2>
          <div className="accent-divider" />
          <div className="flex justify-center mb-6 mt-6">
            <Image
              src="/pruitt-logo.jpg"
              alt="Pruitt Title LLC"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="text-brand-muted text-sm space-y-2 mb-8">
            <p><a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue hover:underline">wrapuano@pruitt-title.com</a></p>
            <p><a href="tel:+17038591467" className="text-brand-blue hover:underline">(703) 859-1467</a></p>
            <p>1900 Gallows Rd Suite 230, Vienna, VA 22182</p>
          </div>
          <Link href="/subscribe" className="btn-primary px-8">
            Subscribe for Updates
          </Link>
        </div>
      </section>
    </>
  );
}
