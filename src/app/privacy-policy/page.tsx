import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy | DMV Title Guy", robots: { index: false } };
export default function PrivacyPolicyPage() {
  return (
    <section className="section-light min-h-[60vh]">
      <div className="container-xl max-w-2xl">
        <h1 className="prose-title mb-6">Privacy Policy</h1>
        <p className="text-brand-muted text-sm">Privacy policy content coming soon. For questions, contact <a href="mailto:wrapuano@pruitt-title.com" className="text-brand-blue">wrapuano@pruitt-title.com</a>.</p>
      </div>
    </section>
  );
}
