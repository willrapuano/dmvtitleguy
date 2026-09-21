import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmation | DMV Title Guy",
  description: "Confirmation for your DMVTitleGuy title search order.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://dmvtitleguy.io/order-confirmation" },
};

interface OrderConfirmationPageProps {
  searchParams: Promise<{
    orderId?: string;
    transactionType?: string;
    propertyAddress?: string;
  }>;
}

export default async function OrderConfirmationPage(props: OrderConfirmationPageProps) {
  const searchParams = await props.searchParams;
  const orderId = searchParams.orderId || "Pending";
  const transactionType = searchParams.transactionType || "Standard Title Search";
  const propertyAddress = searchParams.propertyAddress;

  return (
    <section className="section-light min-h-[70vh] py-16">
      <div className="container-xl max-w-2xl">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />
          <h1 className="mb-3 t-h3 text-brand-navy">
            Thank you for your order!
          </h1>
          <p className="mb-8 text-brand-muted max-w-[68ch] leading-relaxed">
            This page confirms a prior PayPal transaction. Contact Will if you need help identifying the merchant or fulfillment terms for that order.
          </p>

          <dl className="space-y-4 rounded-lg bg-gray-50 p-5 text-left">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                PayPal Order ID
              </dt>
              <dd className="mt-1 break-words font-semibold text-brand-navy">{orderId}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Transaction Type
              </dt>
              <dd className="mt-1 text-brand-navy">{transactionType}</dd>
            </div>
            {propertyAddress && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Property Address
                </dt>
                <dd className="mt-1 text-brand-navy">{propertyAddress}</dd>
              </div>
            )}
          </dl>

          <Link href="/" className="btn-primary mt-8 inline-flex px-6 py-3">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
