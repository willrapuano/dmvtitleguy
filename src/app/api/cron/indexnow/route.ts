import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { submitIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

// Daily: submit sitemap URLs whose lastModified is within the window. Sanity posts
// carry their real modified date, so new and edited posts reach Bing within a day.
// Code releases are submitted by `node scripts/indexnow-submit.mjs` after they ship.
const WINDOW_MS = 72 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const since = Date.now() - WINDOW_MS;
    const entries = await sitemap();
    const urls = entries
      .filter((entry) => entry.lastModified && new Date(entry.lastModified).getTime() >= since)
      .map((entry) => entry.url);
    const result = await submitIndexNow(urls);
    console.info("[IndexNow]", result);
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("[IndexNow] Failed", { code: "INDEXNOW_SUBMIT_FAILED" });
    return NextResponse.json({ ok: false, error: "Submission failed" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
