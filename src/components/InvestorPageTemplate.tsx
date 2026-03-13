import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

interface ServiceItem {
  title: string;
  desc: string;
}

interface InvestorPageTemplateProps {
  heroTag: string;
  h1: string;
  heroBody: string;
  slug: string;
  services: ServiceItem[];
  howItWorksSteps: string[];
  faqItems: { q: string; a: string }[];
  relatedPages: { label: string; href: string }[];
}

export function InvestorPageTemplate({
  heroTag,
  h1,
  heroBody,
  slug,
  services,
  howItWorksSteps,
  faqItems,
  relatedPages,
}: InvestorPageTemplateProps) {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-brand-navy text-white py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #0f1c27 0%, #1a2a3a 60%, #1e3a4a 100%)" }}
      >
        <div className="container-xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <nav className="text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-200">Investor Services</span>
            </nav>
            <p className="text-brand-blue text-sm uppercase tracking-widest font-semibold mb-2">{heroTag}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{h1}</h1>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">{heroBody}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${slug}#quote`} className="btn-primary">Start Your Order →</Link>
              <a href="tel:+17038591467" className="btn-outline border-white text-white hover:bg-white hover:text-brand-navy">
                📞 (703) 859-1467
              </a>
            </div>
          </div>
          <div>
            <LeadCaptureForm compact location={`investor-${slug}`} />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="prose-title mb-4">What We Handle</h2>
              <ul className="space-y-4">
                {services.map((s) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="text-brand-blue flex-shrink-0 mt-1">✓</span>
                    <div>
                      <h3 className="font-bold text-brand-navy text-sm">{s.title}</h3>
                      <p className="text-brand-muted text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div id="quote">
              <LeadCaptureForm title="Start Your Investor Order" location={`investor-${slug}-form`} />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="prose-title text-center mb-8">How It Works</h2>
          <ol className="max-w-2xl mx-auto space-y-4">
            {howItWorksSteps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-brand-dark-text text-sm leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-light">
        <div className="container-xl max-w-3xl">
          <h2 className="prose-title mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-brand-navy mb-2 text-base">{faq.q}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section className="section-gray">
        <div className="container-xl">
          <h2 className="text-xl font-bold text-brand-navy mb-4">Related Services</h2>
          <div className="flex flex-wrap gap-3">
            {relatedPages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="text-sm border border-brand-blue text-brand-blue rounded-full px-4 py-1.5 hover:bg-brand-blue hover:text-white transition-colors"
              >
                {p.label}
              </Link>
            ))}
            <Link href="/virginia-closing-cost-calculator" className="text-sm border border-gray-200 text-brand-muted rounded-full px-4 py-1.5 hover:border-brand-blue hover:text-brand-blue transition-colors">
              VA Closing Cost Calculator
            </Link>
            <Link href="/maryland-closing-cost-calculator" className="text-sm border border-gray-200 text-brand-muted rounded-full px-4 py-1.5 hover:border-brand-blue hover:text-brand-blue transition-colors">
              MD Closing Cost Calculator
            </Link>
            <Link href="/" className="text-sm border border-gray-200 text-brand-muted rounded-full px-4 py-1.5 hover:border-brand-blue hover:text-brand-blue transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
