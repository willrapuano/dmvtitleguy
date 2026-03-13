import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-light min-h-[60vh] flex items-center">
      <div className="container-xl text-center">
        <p className="text-6xl font-bold text-brand-blue mb-4">404</p>
        <h1 className="text-3xl font-bold text-brand-navy mb-4">Page Not Found</h1>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Try navigating back home or find your city below.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <Link href="/virginia-closing-cost-calculator" className="btn-outline">VA Calculator</Link>
          <Link href="/investor-friendly-title-company" className="btn-outline">Investor Services</Link>
        </div>
      </div>
    </section>
  );
}
