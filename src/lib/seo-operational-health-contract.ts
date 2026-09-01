import { createHash, timingSafeEqual } from "node:crypto";

export const SEO_OPERATIONAL_HEALTH_SCOPE = "live-operational-health-only" as const;
export const SEO_CHANGE_AUTHORIZATION = {
  authorized: false,
  reason: "A separate evidence-complete human decision review is required.",
} as const;

export interface SeoHealthScheduleConfig {
  timezone: string;
  checkpointDates: Record<string, string>;
  canaryDates: string[];
}

export interface SeoHealthEvidenceContract {
  schemaVersion: number;
  contractVersion: string;
  scope: typeof SEO_OPERATIONAL_HEALTH_SCOPE;
}

export interface SeoHealthScheduleMatch {
  due: boolean;
  effectiveDate: string;
  checkpointId: string | null;
  runKind: "checkpoint" | "canary" | "off-date";
}

export function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function isSha256(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

export function fixedDigestEqual(actual: string, expected: string) {
  if (!isSha256(actual) || !isSha256(expected)) return false;
  return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

export function dateInTimeZone(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const year = values.get("year");
  const month = values.get("month");
  const day = values.get("day");
  if (!year || !month || !day) throw new Error("SEO health date could not be derived");
  return `${year}-${month}-${day}`;
}

export function resolveSeoHealthSchedule(
  now: Date,
  config: SeoHealthScheduleConfig,
): SeoHealthScheduleMatch {
  const effectiveDate = dateInTimeZone(now, config.timezone);
  const checkpointId = config.checkpointDates[effectiveDate] || null;
  if (checkpointId) {
    return { due: true, effectiveDate, checkpointId, runKind: "checkpoint" };
  }
  if (config.canaryDates.includes(effectiveDate)) {
    return {
      due: true,
      effectiveDate,
      checkpointId: `production-canary-${effectiveDate}`,
      runKind: "canary",
    };
  }
  return { due: false, effectiveDate, checkpointId: null, runKind: "off-date" };
}

export function isAuthorizedCronRequest(authorization: string | null, secret: string | undefined) {
  if (!secret || secret.length < 32 || !authorization?.startsWith("Bearer ")) return false;
  const provided = authorization.slice("Bearer ".length);
  const expected = secret;
  if (!provided || Buffer.byteLength(provided) !== Buffer.byteLength(expected)) return false;
  return timingSafeEqual(Buffer.from(provided, "utf8"), Buffer.from(expected, "utf8"));
}

export function isVercelDeploymentHostname(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 253 || value !== value.toLowerCase()) return false;
  if (!value.endsWith(".vercel.app") || value.includes("..")) return false;
  return value.split(".").every(
    (label) => label.length > 0
      && label.length <= 63
      && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
  );
}

export function isHostname(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 253 || value !== value.toLowerCase()) return false;
  if (value.includes("..")) return false;
  return value.split(".").every(
    (label) => label.length > 0
      && label.length <= 63
      && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
  );
}

export function isBoundVercelCronRequest(
  request: Request,
  deploymentHostname: string | undefined,
  productionHostname: string | undefined,
) {
  if (!isVercelDeploymentHostname(deploymentHostname)) return false;
  if (!isHostname(productionHostname)) return false;
  let requestUrl: URL;
  try {
    requestUrl = new URL(request.url);
  } catch {
    return false;
  }
  const acceptedRequestHostnames = new Set([deploymentHostname, productionHostname]);
  return requestUrl.protocol === "https:"
    && requestUrl.port === ""
    && requestUrl.username === ""
    && requestUrl.password === ""
    && acceptedRequestHostnames.has(requestUrl.hostname)
    && request.headers.get("host") === requestUrl.hostname
    && request.headers.get("user-agent") === "vercel-cron/1.0"
    && request.headers.get("x-vercel-deployment-url") === deploymentHostname;
}

export function canonicalFingerprint(parts: string[]) {
  const canonical = parts
    .map((value) => `${Buffer.byteLength(value, "utf8")}:${value}`)
    .join("|");
  return sha256(canonical);
}

export function ghlTargetFingerprint(parts: {
  locationId: string;
  pipelineId: string;
  submittedStageId: string;
  submissionIdFieldId: string;
  qaExcludedFieldId: string;
}) {
  return canonicalFingerprint([
    "ghl-target-v1",
    parts.locationId,
    parts.pipelineId,
    parts.submittedStageId,
    parts.submissionIdFieldId,
    parts.qaExcludedFieldId,
  ]);
}

export function strictBoolean(value: unknown): boolean | null {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

export function stableJsonDigest(value: unknown) {
  return sha256(JSON.stringify(value));
}

const SAFE_EXECUTION_CODES = new Set([
  "SEO_OPERATIONAL_HEALTH_EXECUTION_FAILED",
  "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE",
  "SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE",
  "SEO_HEALTH_GHL_SOURCE_INCOMPLETE",
  "SEO_HEALTH_DEADLINE_EXCEEDED",
]);

export class SeoOperationalHealthError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
    this.name = "SeoOperationalHealthError";
  }
}

export function safeExecutionCode(error: unknown) {
  if (
    error instanceof SeoOperationalHealthError
    && SAFE_EXECUTION_CODES.has(error.code)
  ) {
    return error.code;
  }
  return "SEO_OPERATIONAL_HEALTH_EXECUTION_FAILED";
}
