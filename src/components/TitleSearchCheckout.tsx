import Link from "next/link";
import type { TransactionType } from "@/lib/paypal";

interface CheckoutFormProps {
  defaultTransactionType?: TransactionType;
  defaultPropertyAddress?: string;
}

interface TitleSearchOrderButtonProps extends CheckoutFormProps {
  label?: string;
  className?: string;
}

export function PayPalTitleSearchCheckout() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="t-h5 text-brand-navy mb-2">Request a title-search introduction</h3>
      <p className="text-sm text-brand-muted mb-5 max-w-[68ch] leading-relaxed">
        Share the property and timing with Will. DMV Title Guy does not accept payment for title services; any provider must confirm scope, pricing, terms, and acceptance directly.
      </p>
      <Link href="/request-title-review" className="btn-primary inline-flex px-6 py-3">
        Request an introduction
      </Link>
    </div>
  );
}

export function TitleSearchOrderButton({
  label = "Request a title-search introduction",
  className = "btn-primary px-6 py-3 text-base font-semibold",
}: TitleSearchOrderButtonProps) {
  return (
    <Link href="/request-title-review" className={className}>
      {label}
    </Link>
  );
}
