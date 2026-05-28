/**
 * Shared GHL webhook utility for all funnel API routes.
 * POSTs lead data to GoHighLevel webhook with a source tag.
 * If webhook URL is not configured, logs the submission and returns success.
 */

export async function postToGHLWebhook(data: Record<string, unknown>, source: string): Promise<{ ok: boolean; error?: string }> {
  const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

  const payload = {
    ...data,
    source: `dmvtitleguy-${source}`,
  };

  if (!webhookUrl) {
    console.log("[GHL Webhook] No webhook URL configured. Logged submission:", JSON.stringify(payload, null, 2));
    return { ok: true };
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