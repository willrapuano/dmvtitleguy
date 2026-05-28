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
        contractUrl: body.contractUrl,
        contractName: body.contractName,
        transactionType: body.transactionType,
        closingTimeline: body.closingTimeline,
        notes: body.notes,
        location: body.location,
      },
      "upload-contract"
    );

    if (!result.ok && result.error) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Upload Contract API] Error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}