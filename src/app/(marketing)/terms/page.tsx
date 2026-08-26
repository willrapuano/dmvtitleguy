import type { Metadata } from "next";
import Link from "next/link";
import { PRUITT_TITLE, RELATIONSHIP_DISCLOSURE, WILL } from "@/lib/brand-identity";

export const metadata: Metadata = {
  title: "Terms of Use | DMV Title Guy",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://dmvtitleguy.io/terms" },
};

export default function TermsPage() {
  return (
    <section className="section-light min-h-[60vh]">
      <div className="container-xl max-w-3xl py-12">
        <h1 className="prose-title mb-4">Terms of Use</h1>
        <p className="mb-8 text-sm text-brand-muted">
          <strong>Effective date:</strong> August 26, 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-brand-muted">
          <p>{RELATIONSHIP_DISCLOSURE}</p>

          <h2 className="t-h6 text-brand-navy">1. Agreement and website operator</h2>
          <p>
            By using dmvtitleguy.io, you agree to these Terms. This personal educational and business-development website is operated by {WILL.name}
            as an education and business-development resource. It is not {PRUITT_TITLE.name}&apos;s corporate website
            and does not create a separate title, escrow, insurance, legal, or settlement company.
          </p>

          <h2 className="t-h6 text-brand-navy">2. Information, estimates, and calculators</h2>
          <p>
            Website articles, checklists, calculators, and estimated costs are for general educational and planning
            purposes. They are not legal, tax, accounting, lending, insurance, or financial advice and are not a
            commitment, title report, premium quote, Closing Disclosure, settlement statement, or guarantee of a
            transaction outcome. Rules, rates, taxes, fees, and underwriting requirements can change and may vary
            with the property and transaction.
          </p>

          <h2 className="t-h6 text-brand-navy">3. Requests for title and settlement services</h2>
          <p>
            A website form, email, phone call, calculator result, or document upload does not by itself open a title
            order, establish an escrow, bind coverage, create an attorney-client relationship, or require {PRUITT_TITLE.name}
            to accept a matter. Services are provided only after the appropriate parties confirm the engagement,
            transaction details, applicable fees, and any required documentation through the proper intake process.
          </p>

          <h2 className="t-h6 text-brand-navy">4. Sensitive information and secure intake</h2>
          <p>
            Do not place Social Security numbers, taxpayer identification numbers, bank or wire instructions,
            passwords, payment-card data, or other highly sensitive information in ordinary contact forms or email.
            Use only the secure intake method supplied for an accepted transaction. Independently verify wire
            instructions by calling a known, trusted number before sending funds.
          </p>

          <h2 className="t-h6 text-brand-navy">5. Third-party services and links</h2>
          <p>
            The website may link to or use third-party tools, including title-quote, payment, analytics, CRM, and
            content-hosting services. Those services have their own terms and privacy practices. A link does not
            guarantee availability, accuracy, security, or acceptance of your transaction.
          </p>

          <h2 className="t-h6 text-brand-navy">6. Acceptable use</h2>
          <p>
            You may not misuse the website, attempt unauthorized access, submit unlawful or deceptive material,
            interfere with security controls, scrape personal information, or use automated systems in a way that
            disrupts normal operation. Website content may not be republished as your own professional advice.
          </p>

          <h2 className="t-h6 text-brand-navy">7. No warranties; limitation</h2>
          <p>
            The website is provided on an &quot;as available&quot; basis. To the extent permitted by law, no warranty is made
            that every page, calculation, or external service will be uninterrupted or error-free. Nothing in these
            Terms excludes rights or responsibilities that cannot legally be limited.
          </p>

          <h2 className="t-h6 text-brand-navy">8. Changes</h2>
          <p>
            These Terms may be updated when the website, law, or service relationships change. The effective date
            above identifies the current version. Continued use after an update means the updated Terms apply.
          </p>

          <h2 className="t-h6 text-brand-navy">9. Contact</h2>
          <p>
            Questions about these Terms may be sent to {WILL.name} at{" "}
            <a className="text-brand-blue-deep hover:underline" href={`mailto:${WILL.email}`}>
              {WILL.email}
            </a>
            . For information about personal data, see the{" "}
            <Link className="text-brand-blue-deep hover:underline" href="/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
