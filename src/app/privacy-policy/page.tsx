import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DMV Title Guy",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="section-light min-h-[60vh]">
      <div className="container-xl max-w-3xl py-12">
        <h1 className="prose-title mb-8">Privacy Policy</h1>
        <p className="text-brand-muted text-sm mb-6">
          <strong>Effective Date:</strong> March 20, 2026
        </p>

        <div className="prose prose-sm text-brand-muted space-y-6">
          <p>
            DMV Title Guy (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website{" "}
            <a href="https://dmvtitleguy.io" className="text-brand-blue">
              dmvtitleguy.io
            </a>{" "}
            or use our services.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">1. Information We Collect</h2>

          <h3 className="text-base font-medium text-brand-navy">Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, email address, and phone number</li>
            <li>Property address and transaction details</li>
            <li>Information submitted through contact forms, home valuation requests, or consultation bookings</li>
            <li>Account information if you register for our contract analyzer or other tools</li>
          </ul>

          <h3 className="text-base font-medium text-brand-navy">Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>IP address, browser type, and operating system</li>
            <li>Pages visited, time spent on pages, and referring URLs</li>
            <li>Device identifiers and usage data</li>
          </ul>

          <h2 className="text-lg font-semibold text-brand-navy">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, operate, and maintain our services</li>
            <li>Respond to your inquiries and fulfill your requests</li>
            <li>Process title and settlement transactions</li>
            <li>Send you relevant updates, marketing communications, and service information</li>
            <li>Improve our website and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-lg font-semibold text-brand-navy">3. Sharing of Information</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Service Providers:</strong> Third-party vendors who assist with website hosting,
              analytics, email delivery, CRM, and payment processing
            </li>
            <li>
              <strong>Business Partners:</strong> Lenders, real estate agents, and other parties
              involved in your real estate transaction, with your consent
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law, subpoena, or to protect
              our rights, safety, or property
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-brand-navy">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, and similar technologies to enhance your experience,
            analyze site traffic, and understand usage patterns. You can control cookie preferences
            through your browser settings. Disabling cookies may affect site functionality.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">5. Third-Party Services</h2>
          <p>Our website may contain links to third-party websites or integrate with services such as:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google Analytics for website analytics</li>
            <li>GoHighLevel for CRM and marketing automation</li>
            <li>TitleCapture for closing cost calculators</li>
            <li>Repliers for property search (IDX/MLS data)</li>
          </ul>
          <p>
            These third parties have their own privacy policies, and we encourage you to review them.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">6. Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards to protect
            your personal information. However, no method of electronic transmission or storage
            is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">7. Data Retention</h2>
          <p>
            We retain your personal information only as long as necessary to fulfill the purposes
            outlined in this policy, comply with legal obligations, resolve disputes, and enforce
            our agreements.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">8. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access, correct, or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of the data we hold about you</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">
              wrapuano@pruitt-title.com
            </a>.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">9. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under 18. We do not knowingly collect
            personal information from children. If we learn we have collected information from
            a child, we will take steps to delete it promptly.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be
            indicated by the &quot;Effective Date&quot; at the top of this page. We encourage you to
            review this policy periodically.
          </p>

          <h2 className="text-lg font-semibold text-brand-navy">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-brand-navy">DMV Title Guy</p>
            <p>Will Rapuano</p>
            <p>
              Email:{" "}
              <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">
                wrapuano@pruitt-title.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a href="https://dmvtitleguy.io" className="text-brand-blue">
                dmvtitleguy.io
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
