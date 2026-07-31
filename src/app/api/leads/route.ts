import { NextRequest, NextResponse } from "next/server";
import { postToGHLWebhook } from "@/lib/ghl-webhook";

const FORM_TYPES = new Set(["quote", "subscribe", "advertising"]);

function clean(value: unknown, maxLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formType = clean(body.formType, 40);
    const name = clean(body.name, 120);
    const email = clean(body.email, 200).toLowerCase();

    if (!FORM_TYPES.has(formType)) {
      return NextResponse.json({ ok: false, error: "Unknown form type" }, { status: 400 });
    }

    // Honeypot fields are visually hidden from people. A bot gets a neutral
    // response so it has no signal to retry with a different payload.
    if (clean(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Name and a valid email are required" }, { status: 400 });
    }

    const listing = clean(body.listing, 240);
    if (formType === "advertising" && !listing) {
      return NextResponse.json({ ok: false, error: "A listing address or MLS number is required" }, { status: 400 });
    }

    const location = clean(body.location, 120) || formType;
    const result = await postToGHLWebhook(
      {
        formType,
        name,
        email,
        phone: clean(body.phone, 60),
        transactionType: clean(body.transactionType, 80),
        message: clean(body.message, 2000),
        listing,
      },
      location
    );

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error || "Lead delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Lead API] Error:", error);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
