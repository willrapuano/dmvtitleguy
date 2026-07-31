/**
 * Shared GHL webhook utility for all funnel API routes.
 * POSTs lead data to GoHighLevel webhook with a source tag.
 * A missing webhook is an operational error: callers must never show a success
 * state for a lead that was only written to a transient function log.
 */

export async function postToGHLWebhook(data: Record<string, unknown>, source: string): Promise<{ ok: boolean; error?: string }> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL || process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

  const payload = {
    ...data,
    source: `dmvtitleguy-${source}`,
  };

  if (!webhookUrl) {
    console.error("[GHL Webhook] No webhook URL configured for source:", source);
    return { ok: false, error: "Lead delivery is not configured" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[GHL Webhook] HTTP error:", res.status, text.slice(0, 300));
      return { ok: false, error: `Webhook returned HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("[GHL Webhook] Fetch error:", err);
    return { ok: false, error: (err as Error).message };
  }
}
