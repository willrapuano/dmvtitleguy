import type { Metadata } from "next";
import { PRUITT_TITLE, RELATIONSHIP_DISCLOSURE, WILL } from "@/lib/brand-identity";

export const metadata: Metadata = {
  title: "Privacy Policy | DMV Title Guy",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://dmvtitleguy.io/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section-light min-h-[60vh]">
      <div className="container-xl max-w-3xl py-12">
        <h1 className="prose-title mb-4">Privacy Policy</h1>
        <p className="mb-8 text-sm text-brand-muted">
          <strong>Effective date:</strong> August 26, 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-brand-muted">
          <p>{RELATIONSHIP_DISCLOSURE}</p>
          <p>
            This policy explains how {WILL.name}, as the operator of dmvtitleguy.io, handles information collected
            through this website and when that information is provided to {PRUITT_TITLE.name} to respond to a title,
            escrow, or settlement request. Pruitt Title may separately provide notices governing accepted transaction files.
          </p>

          <h2 className="t-h6 text-brand-navy">1. Information collected</h2>
          <p>Depending on the feature you use, the website may collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Name, email address, phone number, and communication preferences.</li>
            <li>Property address, jurisdiction, transaction type, price range, closing timing, and questions you submit.</li>
            <li>Account and document information submitted through a clearly identified secure tool.</li>
            <li>Device, browser, IP address, referring page, pages viewed, and interaction events used for security and analytics.</li>
          </ul>
          <p>
            Do not submit Social Security numbers, taxpayer identification numbers, bank or wire instructions,
            passwords, or payment-card data through a general contact form.
          </p>

          <h2 className="t-h6 text-brand-navy">2. Why information is used</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To answer a question, provide an estimate, or route a requested title or settlement inquiry.</li>
            <li>To operate, secure, troubleshoot, and improve the website and its calculators.</li>
            <li>To measure which pages and campaigns produce useful inquiries.</li>
            <li>To send marketing messages when permitted; marketing email should provide an opt-out.</li>
            <li>To prevent abuse, comply with law, and preserve records needed for a transaction or dispute.</li>
          </ul>

          <h2 className="t-h6 text-brand-navy">3. Who receives information</h2>
          <p>The website does not sell personal information. Information may be disclosed to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>{PRUITT_TITLE.name}:</strong> when you request title, escrow, settlement, or transaction support.</li>
            <li>
              <strong>Website processors:</strong> Vercel for hosting, Sanity for content, Google Analytics for traffic
              measurement, and GoHighLevel for lead routing and communications.
            </li>
            <li>
              <strong>Tools you choose to open:</strong> for example, TitleCapture or another clearly linked quote or
              calculator service, and PayPal when a payment feature is used.
            </li>
            <li>
              <strong>Transaction participants:</strong> only when requested, authorized, or reasonably necessary for
              an accepted transaction, subject to applicable professional and legal obligations.
            </li>
            <li>
              <strong>Authorities or advisers:</strong> when required by law or reasonably necessary to investigate
              fraud, security incidents, or legal claims.
            </li>
          </ul>

          <h2 className="t-h6 text-brand-navy">4. Cookies and analytics</h2>
          <p>
            Essential storage may be used for security and site operation. Analytics tools may record page views,
            referrals, and conversion events. Browser controls can restrict cookies, although doing so may affect
            some features. Analytics events are not intended to collect SSNs, TINs, bank data, or document contents.
          </p>
          <p>
            The site also stores a limited first-touch attribution record in browser storage: the landing path,
            referring host, timestamp, and UTM campaign fields. When you submit a form, those fields and the conversion
            path may be sent with the request to help measure which public content produced the inquiry. This record does
            not include ad click IDs, document contents, or the sensitive financial identifiers listed above.
          </p>

          <h2 className="t-h6 text-brand-navy">5. Retention</h2>
          <p>
            General website submissions are retained only as long as reasonably needed to respond, maintain lead-routing
            integrity, measure outcomes, and meet legal obligations. Inactive marketing contacts are periodically reviewed
            for deletion or suppression. If an inquiry becomes a title or settlement matter, {PRUITT_TITLE.name} may retain
            the transaction record for the period required by applicable law, underwriting, insurance, accounting, and
            professional recordkeeping rules. Security logs and duplicate-submission records may be kept for shorter
            operational periods. You may request the retention basis applicable to your record.
          </p>

          <h2 className="t-h6 text-brand-navy">6. Security and wire-fraud warning</h2>
          <p>
            Reasonable administrative and technical safeguards are used, but no internet system is risk-free. Never rely
            on emailed wire instructions without independently confirming them by calling a trusted, previously verified
            phone number. Report suspicious instructions immediately.
          </p>

          <h2 className="t-h6 text-brand-navy">7. Your choices</h2>
          <p>
            You may ask to access, correct, or delete website-submitted information, request a copy, or opt out of marketing.
            Some records cannot be deleted when retention is required for a transaction, fraud prevention, legal claim, or
            regulatory obligation. Requests will be verified before action is taken.
          </p>

          <h2 className="t-h6 text-brand-navy">8. Children and external websites</h2>
          <p>
            This website is intended for adults involved in real-estate matters and is not directed to children. External
            websites and services have their own privacy practices; review them before submitting information.
          </p>

          <h2 className="t-h6 text-brand-navy">9. Updates and contact</h2>
          <p>
            This policy may change as the website or its providers change. The effective date identifies the current version.
            Privacy questions and requests may be sent to {WILL.name} at{" "}
            <a className="text-brand-blue-deep hover:underline" href={`mailto:${WILL.email}`}>
              {WILL.email}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
