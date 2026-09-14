export type LeadSubmissionResult = {
  status: "success" | "pending" | "error";
  trackConversion: boolean;
};

/**
 * Browser intake acknowledgment only, not proof of GHL opportunity creation.
 * A 202 or explicit pending result must never become a confirmed conversion.
 */
export function classifyLeadSubmissionResponse(
  response: { ok: boolean; status: number },
  body: unknown,
): LeadSubmissionResult {
  if (!response.ok || !body || typeof body !== "object" || !("ok" in body) || body.ok !== true) {
    return { status: "error", trackConversion: false };
  }
  const result = body as { pending?: unknown; duplicate?: unknown };
  if (response.status === 202 || result.pending === true) {
    return { status: "pending", trackConversion: false };
  }
  if (
    (result.pending !== undefined && result.pending !== false) ||
    (result.duplicate !== undefined && typeof result.duplicate !== "boolean")
  ) {
    return { status: "error", trackConversion: false };
  }
  return { status: "success", trackConversion: result.duplicate !== true };
}
