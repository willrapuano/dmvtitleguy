/**
 * Shared GHL webhook utility for all funnel API routes.
 * POSTs lead data to GoHighLevel webhook with a source tag.
 * A missing webhook is an operational error: callers must never show a success
 * state for a lead that was only written to a transient function log.
 */

export async function postToGHLWebhook(
  data: Record<string, unknown>,
  source: string
): Promise<{ ok: boolean; error?: string; retrySafe?: boolean }> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  const payload = {
    ...data,
    source: `dmvtitleguy-${source}`,
  };

  if (!webhookUrl) {
    console.error("[GHL Webhook] No webhook URL configured for source:", source);
    return { ok: false, error: "Lead delivery is not configured", retrySafe: true };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) {
      // Upstream bodies may echo submitted lead data; never copy them to logs.
      console.error("[GHL Webhook] HTTP error for source:", source, res.status);
      // The request reached the webhook. Even a non-2xx response can be
      // returned after an upstream contact was created, so the result is
      // ambiguous and the submission ID must remain locked.
      return { ok: false, error: `Webhook returned HTTP ${res.status}`, retrySafe: false };
    }

    return { ok: true };
  } catch (err) {
    console.error(
      "[GHL Webhook] Fetch error for source:",
      source,
      err instanceof Error ? err.name : "UnknownError"
    );
    // A timeout or connection reset can happen after the remote service has
    // accepted the body. Never invite an automatic retry for this ID.
    return { ok: false, error: (err as Error).message, retrySafe: false };
  }
}
