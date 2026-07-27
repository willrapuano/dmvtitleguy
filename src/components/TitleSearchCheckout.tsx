"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PayPalCheckoutButton } from "@/components/PayPalCheckoutButton";
import { TRANSACTION_TYPES, type TransactionType } from "@/lib/paypal";

interface CheckoutFormProps {
  defaultTransactionType?: TransactionType;
  defaultPropertyAddress?: string;
}

interface TitleSearchOrderButtonProps extends CheckoutFormProps {
  label?: string;
  className?: string;
}

function CheckoutForm({
  defaultTransactionType = "Purchase",
  defaultPropertyAddress = "",
}: CheckoutFormProps) {
  const [transactionType, setTransactionType] =
    useState<TransactionType>(defaultTransactionType);
  const [propertyAddress, setPropertyAddress] = useState(defaultPropertyAddress);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-brand-green/20 p-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">
          Standard title search
        </p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <p className="text-brand-muted text-sm">Pay securely online with PayPal.</p>
          <p className="text-3xl font-bold text-brand-navy">$125</p>
        </div>
      </div>

      <div>
        <label htmlFor="paypal-transaction-type" className="block text-sm font-medium text-brand-dark-text mb-1">
          Transaction Type
        </label>
        <select
          id="paypal-transaction-type"
          value={transactionType}
          onChange={(event) => setTransactionType(event.target.value as TransactionType)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          {TRANSACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="paypal-property-address" className="block text-sm font-medium text-brand-dark-text mb-1">
          Property Address <span className="font-normal text-brand-muted">(optional)</span>
        </label>
        <input
          id="paypal-property-address"
          type="text"
          value={propertyAddress}
          onChange={(event) => setPropertyAddress(event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
          placeholder="123 Main St, Vienna, VA 22180"
        />
      </div>

      <PayPalCheckoutButton
        transactionType={transactionType}
        propertyAddress={propertyAddress.trim()}
      />
    </div>
  );
}

export function PayPalTitleSearchCheckout(props: CheckoutFormProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="t-h5 text-brand-navy mb-2">Order a Title Search</h3>
      <p className="text-sm text-brand-muted mb-5">
        Start a standard title search for $125 and share the property details before payment.
      </p>
      <CheckoutForm {...props} />
    </div>
  );
}

export function TitleSearchOrderButton({
  label = "Order Title Search",
  className = "btn-primary px-6 py-3 text-base font-semibold",
  ...checkoutProps
}: TitleSearchOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/70 px-4 py-6">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close checkout"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-brand-muted hover:bg-gray-100 hover:text-brand-navy"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="pr-10 t-h4 text-brand-navy">Order Title Search</h2>
            <p className="mt-2 mb-5 text-sm text-brand-muted">
              Complete payment for a standard DMVTitleGuy title search.
            </p>
            <CheckoutForm {...checkoutProps} />
          </div>
        </div>
      )}
    </>
  );
}
