import { NextResponse } from "next/server";
import { retryDueGhlOpportunitySyncs } from "@/lib/ghl-opportunity-outbox";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await retryDueGhlOpportunitySyncs();
    console.info("[GHL opportunity reconciliation]", {
      attempted: result.attempted,
      expired: result.expired,
      synced: result.results.filter((item) => item.status === "synced").length,
      errors: result.results.filter((item) => item.status === "error").length,
    });
    return NextResponse.json(
      { ok: true, ...result },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(
      "[GHL opportunity reconciliation] Failed:",
      error instanceof Error ? error.message : "unknown-error",
    );
    return NextResponse.json(
      { ok: false, error: "Reconciliation failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
