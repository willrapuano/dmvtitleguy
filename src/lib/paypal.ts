export const TITLE_SEARCH_PRICE = "125.00";
export const TITLE_SEARCH_CURRENCY = "USD";

export const TRANSACTION_TYPES = [
  "Purchase",
  "Refinance",
  "Investor/Wholesale",
  "Commercial",
  "New Construction",
  "Other",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export function normalizeTransactionType(value: unknown): TransactionType {
  return TRANSACTION_TYPES.includes(value as TransactionType)
    ? (value as TransactionType)
    : "Purchase";
}

export function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENVIRONMENT === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed with status ${response.status}.`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("PayPal auth response did not include an access token.");
  }

  return data.access_token;
}
