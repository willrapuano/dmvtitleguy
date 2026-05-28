import { NextRequest, NextResponse } from "next/server";
import { postToGHLWebhook } from "@/lib/ghl-webhook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await postToGHLWebhook(
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        propertyAddress: body.propertyAddress,
        buyerType: body.buyerType,
        source: body.source,
        timeframe: body.timeframe,
        documents: body.documents,
        notes: body.notes,
        location: body.location,
      },
      "investor-due-diligence"
    );

    if (!result.ok && result.error) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Investor Due Diligence API] Error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}