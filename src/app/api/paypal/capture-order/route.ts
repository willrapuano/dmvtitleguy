import { NextResponse } from "next/server";

// Legacy capture is intentionally disabled. The site does not maintain a
// server-side order allowlist that can prove an arbitrary PayPal order belongs
// to this merchant and is authorized for capture. Historical orders must be
// reviewed and captured manually in PayPal after owner authorization.
export async function POST() {
  return NextResponse.json(
    {
      error: "Online PayPal capture is unavailable. Contact Will for help with a prior order.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
