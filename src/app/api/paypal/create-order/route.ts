import { NextResponse } from "next/server";
import {
  TITLE_SEARCH_CURRENCY,
  TITLE_SEARCH_PRICE,
  getPayPalAccessToken,
  getPayPalBaseUrl,
  normalizeTransactionType,
} from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const transactionType = normalizeTransactionType(body.transactionType);
    const propertyAddress =
      typeof body.propertyAddress === "string" ? body.propertyAddress.trim().slice(0, 250) : "";
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: "standard-title-search",
            description: "DMVTitleGuy Standard Title Search",
            custom_id: transactionType,
            soft_descriptor: "PRUITT TITLE",
            amount: {
              currency_code: TITLE_SEARCH_CURRENCY,
              value: TITLE_SEARCH_PRICE,
              breakdown: {
                item_total: {
                  currency_code: TITLE_SEARCH_CURRENCY,
                  value: TITLE_SEARCH_PRICE,
                },
              },
            },
            items: [
              {
                name: "Standard Title Search",
                description: propertyAddress
                  ? `${transactionType} title search for ${propertyAddress}`
                  : `${transactionType} title search`,
                quantity: "1",
                unit_amount: {
                  currency_code: TITLE_SEARCH_CURRENCY,
                  value: TITLE_SEARCH_PRICE,
                },
                category: "DIGITAL_GOODS",
              },
            ],
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
            },
          },
        },
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to create PayPal order.", details: data },
        { status: response.status },
      );
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      transactionType,
      propertyAddress,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create PayPal order." },
      { status: 500 },
    );
  }
}
