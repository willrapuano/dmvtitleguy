"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PayPalCheckoutButtonProps {
  transactionType: string;
  propertyAddress?: string;
}

interface PayPalApproveData {
  orderID: string;
}

interface PayPalNamespace {
  Buttons: (options: {
    style?: Record<string, string>;
    createOrder: () => Promise<string>;
    onApprove: (data: PayPalApproveData) => Promise<void>;
    onError: (error: unknown) => void;
    onCancel: () => void;
  }) => {
    render: (selector: HTMLElement) => Promise<void>;
    close?: () => void;
  };
}

type PayPalButtonsInstance = ReturnType<PayPalNamespace["Buttons"]>;

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let paypalSdkPromise: Promise<void> | null = null;

function loadPayPalSdk(clientId: string) {
  if (window.paypal) {
    return Promise.resolve();
  }

  if (!paypalSdkPromise) {
    paypalSdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>("script[data-paypal-sdk]");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Unable to load PayPal.")));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        clientId,
      )}&currency=USD&intent=capture&components=buttons`;
      script.async = true;
      script.dataset.paypalSdk = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load PayPal."));
      document.body.appendChild(script);
    });
  }

  return paypalSdkPromise;
}

export function PayPalCheckoutButton({
  transactionType,
  propertyAddress = "",
}: PayPalCheckoutButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<PayPalButtonsInstance | null>(null);
  const [error, setError] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    async function renderButtons() {
      if (!containerRef.current || successOrderId) {
        return;
      }

      if (!clientId) {
        setError("PayPal is not configured. Please call (703) 859-1467 to order.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        setIsLoading(true);
        await loadPayPalSdk(clientId);

        if (!isMounted || !window.paypal || !containerRef.current) {
          return;
        }

        containerRef.current.innerHTML = "";
        buttonsRef.current?.close?.();
        buttonsRef.current = window.paypal.Buttons({
          style: {
            color: "gold",
            label: "pay",
            layout: "vertical",
            shape: "rect",
          },
          createOrder: async () => {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transactionType, propertyAddress }),
            });
            const data = await response.json();

            if (!response.ok || !data.id) {
              throw new Error(data.error || "Unable to create PayPal order.");
            }

            return data.id;
          },
          onApprove: async (data) => {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const capture = await response.json();

            if (!response.ok) {
              throw new Error(capture.error || "Unable to capture PayPal order.");
            }

            setSuccessOrderId(capture.id || data.orderID);
            const params = new URLSearchParams({
              orderId: capture.id || data.orderID,
              transactionType,
            });

            if (propertyAddress) {
              params.set("propertyAddress", propertyAddress);
            }

            window.setTimeout(() => {
              router.push(`/order-confirmation?${params.toString()}`);
            }, 900);
          },
          onError: (err) => {
            console.error(err);
            setError("PayPal checkout failed. Please try again or call (703) 859-1467.");
          },
          onCancel: () => {
            setError("Checkout was cancelled before payment was completed.");
          },
        });

        await buttonsRef.current.render(containerRef.current);
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError(err instanceof Error ? err.message : "PayPal checkout failed.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    renderButtons();

    return () => {
      isMounted = false;
      buttonsRef.current?.close?.();
    };
  }, [propertyAddress, router, successOrderId, transactionType]);

  if (successOrderId) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Payment complete. Order ID: <span className="font-semibold">{successOrderId}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading && <p className="text-sm text-brand-muted max-w-[68ch] leading-relaxed">Loading PayPal checkout...</p>}
      <div ref={containerRef} />
      {error && <p className="text-sm text-red-600 max-w-[68ch] leading-relaxed">{error}</p>}
    </div>
  );
}
