import { NextResponse } from "next/server";

// New paid title-search orders are paused until the merchant of record,
// service provider, fulfillment terms, pricing, and permissions are confirmed.
export async function POST() {
  return NextResponse.json(
    {
      error: "Online title-search payment is unavailable. Please request an introduction instead.",
      requestPath: "/request-title-review",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}
