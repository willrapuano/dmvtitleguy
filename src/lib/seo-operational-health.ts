import { createClient, type ResultSet, type Row } from "@libsql/client";
import {
  SEO_CHANGE_AUTHORIZATION,
  SEO_OPERATIONAL_HEALTH_SCOPE,
  SeoOperationalHealthError,
  fixedDigestEqual,
  ghlTargetFingerprint,
  isSha256,
  isVercelDeploymentHostname,
  sha256,
  stableJsonDigest,
  strictBoolean,
} from "./seo-operational-health-contract.ts";
import type { SeoOperationalHealthConfig } from "./seo-operational-health-config.ts";

const GHL_API_ORIGIN = "https://services.leadconnectorhq.com";
const TRANSACTION_FORMS = new Set([
  "quote",
  "request-title-review",
  "upload-contract",
  "investor-due-diligence",
]);
const ALLOWED_FORM_TYPES = new Set([
  ...TRANSACTION_FORMS,
  "subscribe",
  "advertising",
]);
const ALLOWED_DELIVERY_STATUSES = new Set(["pending", "sending", "delivered", "unknown"]);
const ALLOWED_GHL_SYNC_STATUSES = new Set(["not-required", "pending", "synced", "error"]);
const ALLOWED_QUALIFICATION_STATUSES = new Set([
  "submitted",
  "qualified",
  "referred",
  "accepted",
  "closed-won",
  "closed/won",
  "lost",
  "test",
]);

type Severity = "P0" | "P1";
type Incident = { code: string; severity: Severity; count: number };
type JsonRecord = Record<string, unknown>;

interface HealthContext {
  now: Date;
  effectiveDate: string;
  checkpointId: string;
  runKind: "checkpoint" | "canary";
}

interface RequiredEnvironment {
  databaseUrl: string;
  databaseToken: string;
  ghlToken: string;
  locationId: string;
  pipelineId: string;
  submittedStageId: string;
  deploymentOrigin: string;
  vercelSystem: boolean;
  productionBound: boolean;
  targetProductionBound: boolean;
  runtimeCredentialIsolation: boolean;
  projectFingerprint: boolean;
  gitProviderBound: boolean;
  gitRepoIdFingerprint: boolean;
  gitRepoOwnerFingerprint: boolean;
  gitRepoSlugFingerprint: boolean;
  gitBranchBound: boolean;
  gitCommitBound: boolean;
  deploymentIdBound: boolean;
  deploymentUrlBound: boolean;
  productionHostnameFingerprint: boolean;
  databaseFingerprint: boolean;
  databaseCredentialFingerprint: boolean;
  databaseCredentialExpiryMetadata: boolean;
  databaseCredentialLifetimePolicy: boolean;
  databaseCredentialFinalCheckpointCoverage: boolean;
  databaseCredentialRuntimeValidity: boolean;
  databaseCredentialPermissionClaims: boolean;
  databaseCredentialPermissionClaimEvidence: CredentialClaimEvidence;
  locationFingerprint: boolean;
  pipelineFingerprint: boolean;
  submittedStageFingerprint: boolean;
  ghlCredentialFingerprint: boolean;
  ghlCredentialScopeClaims: boolean;
  ghlCredentialLocationClaim: boolean;
  ghlCredentialScopeClaimEvidence: CredentialClaimEvidence;
}

interface LedgerRow {
  id: string;
  status: string;
  formType: string | null;
  submittedAt: string | null;
  deliveredAt: string | null;
  lastAttemptAt: string | null;
  ghlContactId: string | null;
  ghlOpportunityId: string | null;
  ghlSyncStatus: string;
  qualificationStatus: string;
  isQa: boolean;
}

interface OutboxRow {
  submissionId: string;
  expiresAt: string | null;
  ledgerExists: boolean;
  ledgerStatus: string | null;
  formType: string | null;
  ghlSyncStatus: string | null;
  qualificationStatus: string | null;
  isQa: boolean | null;
}

interface ExpiredEventRow {
  submissionId: string;
  ghlSyncStatus: string | null;
  ledgerExists: boolean;
  qualificationStatus: string | null;
  isQa: boolean | null;
}

interface DatabaseSnapshot {
  inventory: number;
  ledgerQaExcluded: number;
  ledgerNonQaInventory: number;
  qaMarkerMismatches: number;
  rows: LedgerRow[];
  outbox: OutboxRow[];
  expiredEvents: ExpiredEventRow[];
  credentialScope: {
    positiveReadsSucceeded: true;
    forbiddenReadDenied: boolean;
    denialEvidence: CredentialDenialEvidence;
  };
}

interface ProjectedOpportunity {
  id: string;
  contactId: string | null;
  locationId: string | null;
  pipelineId: string | null;
  fields: Map<string, unknown[]>;
}

interface GhlSnapshot {
  targetFingerprint: boolean;
  pipelineAndStage: boolean;
  customFields: boolean;
  inventory: number;
  declaredTotal: number;
  retrieved: number;
  pages: number;
  cursorTerminal: boolean;
  stableTotal: boolean;
  detailsComplete: boolean;
  qaExcluded: number;
  mappedSubmissions: number;
  reusedOpportunityCards: number;
  qaParityMismatches: number;
  unclassifiable: number;
  requestCount: number;
  credentialScope: {
    positiveReadsSucceeded: true;
    forbiddenContactReadDenied: boolean;
    denialEvidence: CredentialDenialEvidence;
  };
}

interface GhlBootstrapSnapshot {
  client: GhlReadClient;
  locationBody: JsonRecord;
  pipelinesBody: JsonRecord;
  fieldsBody: JsonRecord;
  credentialScope: GhlSnapshot["credentialScope"];
}

type CredentialDenialEvidence =
  | "structured-authorization-denial"
  | "overprivileged"
  | "incomplete"
  | "not-observed";

type CredentialClaimEvidence =
  | "exact-provider-jwt-claims"
  | "overprivileged"
  | "incomplete";

class IncidentCollector {
  private readonly values = new Map<string, Incident>();

  add(code: string, severity: Severity = "P0", count = 1) {
    const key = `${severity}:${code}`;
    const current = this.values.get(key) || { code, severity, count: 0 };
    current.count += count;
    this.values.set(key, current);
  }

  list() {
    return [...this.values.values()].sort(
      (left, right) => left.severity.localeCompare(right.severity) || left.code.localeCompare(right.code),
    );
  }
}

type DatabaseClient = Pick<ReturnType<typeof createClient>, "batch" | "execute" | "close">;

export interface SeoOperationalHealthDependencies {
  fetch: typeof fetch;
  createDatabaseClient: (options: { url: string; authToken: string }) => DatabaseClient;
  now: () => Date;
}

const defaultDependencies: SeoOperationalHealthDependencies = {
  fetch: (...args) => fetch(...args),
  createDatabaseClient: (options) => createClient(options),
  now: () => new Date(),
};

function record(value: unknown, code: string): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new SeoOperationalHealthError(code);
  }
  return value as JsonRecord;
}

function array(value: unknown, code: string) {
  if (!Array.isArray(value)) throw new SeoOperationalHealthError(code);
  return value;
}

function stringValue(value: unknown, code: string, allowNull = false): string | null {
  if (allowNull && (value === null || value === undefined)) return null;
  if (typeof value !== "string" || !value.trim()) throw new SeoOperationalHealthError(code);
  return value.trim();
}

function databaseInteger(value: unknown, code: string) {
  let numeric: number;
  if (typeof value === "bigint") numeric = Number(value);
  else if (typeof value === "number") numeric = value;
  else if (typeof value === "string" && /^(?:0|[1-9][0-9]*)$/.test(value)) numeric = Number(value);
  else throw new SeoOperationalHealthError(code);
  if (!Number.isSafeInteger(numeric) || numeric < 0) throw new SeoOperationalHealthError(code);
  return numeric;
}

function ghlInteger(value: unknown, code: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new SeoOperationalHealthError(code);
  }
  return value;
}

function ensureDeadline(deadline: number, now: () => Date = () => new Date()) {
  if (now().getTime() >= deadline) {
    throw new SeoOperationalHealthError("SEO_HEALTH_DEADLINE_EXCEEDED");
  }
}

function timeoutWithinDeadline(timeoutMs: number, deadline: number, now: () => Date) {
  const remaining = deadline - now().getTime();
  if (remaining <= 0) throw new SeoOperationalHealthError("SEO_HEALTH_DEADLINE_EXCEEDED");
  return Math.max(1, Math.min(timeoutMs, remaining));
}

async function promiseWithinDeadline<T>(
  operation: Promise<T>,
  deadline: number,
  now: () => Date,
) {
  const timeoutMs = timeoutWithinDeadline(Number.MAX_SAFE_INTEGER, deadline, now);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expired = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new SeoOperationalHealthError("SEO_HEALTH_DEADLINE_EXCEEDED"));
    }, timeoutMs);
  });
  try {
    return await Promise.race([operation, expired]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function exactIsoMilliseconds(value: unknown) {
  if (typeof value !== "string") return null;
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== value) return null;
  return milliseconds;
}

function jwtJsonRecord(segment: string) {
  if (!segment || segment.length > 16_384 || !/^[A-Za-z0-9_-]+$/.test(segment)) return null;
  try {
    const bytes = Buffer.from(segment, "base64url");
    if (bytes.length === 0 || bytes.toString("base64url") !== segment) return null;
    const decoded = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
    return decoded && typeof decoded === "object" && !Array.isArray(decoded)
      ? decoded as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

function jwtPayload(token: string) {
  if (!token || token.length > 32_768) return null;
  const segments = token.split(".");
  if (
    segments.length !== 3
    || !segments[2]
    || !/^[A-Za-z0-9_-]+$/.test(segments[2])
  ) return null;
  const header = jwtJsonRecord(segments[0]);
  const payload = jwtJsonRecord(segments[1]);
  if (
    !header
    || !payload
    || typeof header.alg !== "string"
    || !header.alg
    || header.alg.toLowerCase() === "none"
    || (header.typ !== undefined && header.typ !== "JWT")
  ) {
    return null;
  }
  return payload;
}

function jwtTemporalClaims(token: string) {
  const payload = jwtPayload(token);
  if (!payload) return null;
  const { iat, exp } = payload;
  if (
    typeof iat !== "number"
    || typeof exp !== "number"
    || !Number.isSafeInteger(iat)
    || !Number.isSafeInteger(exp)
    || iat <= 0
    || exp <= iat
  ) return null;
  return { issuedAtMs: iat * 1000, expiresAtMs: exp * 1000 };
}

const TURSO_REQUIRED_READ_TABLES = Object.freeze([
  "LeadOpportunityOutbox",
  "LeadSubmission",
  "LeadSubmissionEvent",
]);
const TURSO_PERMISSION_ACTIONS = new Set([
  "data_read",
  "data_add",
  "data_update",
  "data_delete",
  "schema_add",
  "schema_update",
  "schema_delete",
]);
const TURSO_WRITE_ACTIONS = new Set([
  "data_add",
  "data_update",
  "data_delete",
  "schema_add",
  "schema_update",
  "schema_delete",
]);
const GHL_REQUIRED_READ_SCOPES = Object.freeze([
  "locations.readonly",
  "locations/customFields.readonly",
  "opportunities.readonly",
]);

function exactUniqueStringSet(value: unknown, expected: readonly string[]) {
  return Array.isArray(value)
    && value.length === expected.length
    && value.every((item) => typeof item === "string" && item.length > 0)
    && new Set(value).size === value.length
    && [...value].sort().every((item, index) => item === [...expected].sort()[index]);
}

function exactRecordKeys(value: JsonRecord, expected: readonly string[]) {
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  return actual.length === required.length
    && actual.every((item, index) => item === required[index]);
}

function tursoPermissionPolicyValid(config: SeoOperationalHealthConfig) {
  const policy = config.credentialPolicy.turso;
  if (
    policy.claimProfile !== "turso-fine-grained-v1"
    || !Array.isArray(policy.requiredPermissions)
    || policy.requiredPermissions.length !== TURSO_REQUIRED_READ_TABLES.length
  ) return false;
  return policy.requiredPermissions.every((permission) => (
    permission
    && typeof permission === "object"
    && typeof permission.table === "string"
    && exactUniqueStringSet(permission.actions, ["data_read"])
  )) && exactUniqueStringSet(
    policy.requiredPermissions.map((permission) => permission.table),
    TURSO_REQUIRED_READ_TABLES,
  );
}

export function tursoCredentialPermissionClaims(
  token: string,
  config: SeoOperationalHealthConfig,
) {
  if (!tursoPermissionPolicyValid(config)) {
    return { exact: false, evidence: "incomplete" as const };
  }
  const payload = jwtPayload(token);
  if (!payload) return { exact: false, evidence: "incomplete" as const };
  if (payload.a !== undefined || payload.p !== undefined) {
    return { exact: false, evidence: "overprivileged" as const };
  }
  if (!Array.isArray(payload.permissions) || payload.permissions.length === 0) {
    return { exact: false, evidence: "incomplete" as const };
  }
  const grants = new Set<string>();
  for (const rawPermission of payload.permissions) {
    if (!rawPermission || typeof rawPermission !== "object" || Array.isArray(rawPermission)) {
      return { exact: false, evidence: "incomplete" as const };
    }
    const permission = rawPermission as JsonRecord;
    if (
      !exactRecordKeys(permission, ["t", "a"])
      || !Array.isArray(permission.t)
      || !Array.isArray(permission.a)
      || permission.a.length === 0
      || permission.t.some((table) => typeof table !== "string" || !table)
      || permission.a.some((action) => typeof action !== "string" || !action)
      || new Set(permission.t).size !== permission.t.length
      || new Set(permission.a).size !== permission.a.length
    ) {
      return { exact: false, evidence: "incomplete" as const };
    }
    // Turso normalizes an empty table list to `all`, so it is positive
    // evidence of a broader-than-allowlisted grant rather than an unknown
    // claim shape.
    if (permission.t.length === 0) {
      return { exact: false, evidence: "overprivileged" as const };
    }
    for (const action of permission.a as string[]) {
      if (!TURSO_PERMISSION_ACTIONS.has(action)) {
        return { exact: false, evidence: "incomplete" as const };
      }
      if (TURSO_WRITE_ACTIONS.has(action)) {
        return { exact: false, evidence: "overprivileged" as const };
      }
      for (const table of permission.t as string[]) {
        if (table === "all" || !TURSO_REQUIRED_READ_TABLES.includes(table)) {
          return { exact: false, evidence: "overprivileged" as const };
        }
        const grant = `${table}:${action}`;
        if (grants.has(grant)) return { exact: false, evidence: "incomplete" as const };
        grants.add(grant);
      }
    }
  }
  const expected = TURSO_REQUIRED_READ_TABLES.map((table) => `${table}:data_read`);
  if (!exactUniqueStringSet([...grants], expected)) {
    return { exact: false, evidence: "incomplete" as const };
  }
  return { exact: true, evidence: "exact-provider-jwt-claims" as const };
}

function ghlScopePolicyValid(config: SeoOperationalHealthConfig) {
  return config.credentialPolicy.ghl.claimProfile === "highlevel-pit-oauth-meta-v1"
    && exactUniqueStringSet(config.credentialPolicy.ghl.requiredScopes, GHL_REQUIRED_READ_SCOPES);
}

export function ghlCredentialScopeClaims(
  token: string,
  locationId: string,
  config: SeoOperationalHealthConfig,
) {
  if (!ghlScopePolicyValid(config)) {
    return { exact: false, locationBound: false, evidence: "incomplete" as const };
  }
  const payload = jwtPayload(token);
  if (!payload) return { exact: false, locationBound: false, evidence: "incomplete" as const };
  if (payload.authClass !== "Location") {
    return {
      exact: false,
      locationBound: false,
      evidence: payload.authClass === "Company" ? "overprivileged" as const : "incomplete" as const,
    };
  }
  const locationBound = payload.authClassId === locationId;
  const oauthMeta = payload.oauthMeta && typeof payload.oauthMeta === "object"
    && !Array.isArray(payload.oauthMeta)
    ? payload.oauthMeta as JsonRecord
    : null;
  const scopes = oauthMeta?.scopes;
  if (
    !locationBound
    || !Array.isArray(scopes)
    || scopes.length === 0
    || scopes.some((scope) => typeof scope !== "string" || !scope)
    || new Set(scopes).size !== scopes.length
  ) {
    return { exact: false, locationBound, evidence: "incomplete" as const };
  }
  if ((scopes as string[]).some((scope) => (
    scope.endsWith(".write")
    || scope.endsWith("/write")
    || !GHL_REQUIRED_READ_SCOPES.includes(scope)
  ))) {
    return { exact: false, locationBound, evidence: "overprivileged" as const };
  }
  if (!exactUniqueStringSet(scopes, GHL_REQUIRED_READ_SCOPES)) {
    return { exact: false, locationBound, evidence: "incomplete" as const };
  }
  return {
    exact: true,
    locationBound: true,
    evidence: "exact-provider-jwt-claims" as const,
  };
}

function tursoCredentialExpiryBindings(
  token: string,
  config: SeoOperationalHealthConfig,
  now: Date,
) {
  const policy = config.credentialPolicy.turso;
  const claims = jwtTemporalClaims(token);
  const configuredIssuedAtMs = exactIsoMilliseconds(policy.tokenIssuedAt);
  const configuredExpiresAtMs = exactIsoMilliseconds(policy.tokenExpiresAt);
  const minimumValidThroughMs = exactIsoMilliseconds(policy.minimumValidThrough);
  const maximumLifetimeDaysValid = Number.isSafeInteger(policy.maximumLifetimeDays)
    && policy.maximumLifetimeDays > 0
    && policy.maximumLifetimeDays <= 210;
  const safetyMarginHoursValid = Number.isSafeInteger(policy.finalCheckpointSafetyMarginHours)
    && policy.finalCheckpointSafetyMarginHours >= 48;
  const checkpointDates = Object.keys(config.checkpointCalendar).sort();
  const finalCheckpointDate = checkpointDates.at(-1) || "";
  const cronParts = config.permanentCronSchedule.split(/\s+/);
  const cronMinute = /^(?:[0-5]?[0-9])$/.test(cronParts[0] || "") ? Number(cronParts[0]) : null;
  const cronHour = /^(?:[01]?[0-9]|2[0-3])$/.test(cronParts[1] || "") ? Number(cronParts[1]) : null;
  const finalCheckpointRunMs = /^\d{4}-\d{2}-\d{2}$/.test(finalCheckpointDate)
    && cronMinute !== null
    && cronHour !== null
    ? Date.parse(`${finalCheckpointDate}T${String(cronHour).padStart(2, "0")}:${String(cronMinute).padStart(2, "0")}:00.000Z`)
    : Number.NaN;
  const minimumCoveragePolicyValid = minimumValidThroughMs !== null
    && safetyMarginHoursValid
    && Number.isFinite(finalCheckpointRunMs)
    && minimumValidThroughMs >= finalCheckpointRunMs + policy.finalCheckpointSafetyMarginHours * 60 * 60_000;
  const metadataBound = Boolean(
    claims
    && configuredIssuedAtMs !== null
    && configuredExpiresAtMs !== null
    && claims.issuedAtMs === configuredIssuedAtMs
    && claims.expiresAtMs === configuredExpiresAtMs,
  );
  const lifetimeWithinPolicy = Boolean(
    claims
    && maximumLifetimeDaysValid
    && claims.expiresAtMs - claims.issuedAtMs <= policy.maximumLifetimeDays * 24 * 60 * 60_000,
  );
  const finalCheckpointCoverage = Boolean(
    claims
    && minimumCoveragePolicyValid
    && claims.expiresAtMs >= minimumValidThroughMs!,
  );
  const runtimeValidity = Boolean(
    claims
    && claims.issuedAtMs <= now.getTime() + 5 * 60_000
    && claims.expiresAtMs >= now.getTime() + config.bounds.internalDeadlineMs,
  );
  return {
    metadataBound,
    lifetimeWithinPolicy,
    finalCheckpointCoverage,
    runtimeValidity,
  };
}

function requiredEnvironment(
  env: NodeJS.ProcessEnv,
  config: SeoOperationalHealthConfig,
  now: Date,
): RequiredEnvironment {
  const databaseUrl = env.SEO_HEALTH_TURSO_DATABASE_URL || "";
  const databaseToken = env.SEO_HEALTH_TURSO_AUTH_TOKEN || "";
  const ghlToken = env.SEO_HEALTH_GHL_READ_TOKEN || "";
  const locationId = env.GHL_LOCATION_ID || "";
  const pipelineId = env.GHL_WEBSITE_PIPELINE_ID || "";
  const submittedStageId = env.GHL_WEBSITE_SUBMITTED_STAGE_ID || "";
  if (
    !databaseUrl
    || !databaseToken
    || !ghlToken
    || !locationId
    || !pipelineId
    || !submittedStageId
  ) {
    throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
  }
  if (
    databaseToken === env.TURSO_AUTH_TOKEN
    || ghlToken === env.GHL_PRIVATE_INTEGRATION_TOKEN
  ) {
    throw new SeoOperationalHealthError("SEO_OPERATIONAL_HEALTH_EXECUTION_FAILED");
  }
  const databaseCredentialExpiry = tursoCredentialExpiryBindings(databaseToken, config, now);
  const databasePermissionClaims = tursoCredentialPermissionClaims(databaseToken, config);
  const ghlScopeClaims = ghlCredentialScopeClaims(ghlToken, locationId, config);
  return {
    databaseUrl,
    databaseToken,
    ghlToken,
    locationId,
    pipelineId,
    submittedStageId,
    deploymentOrigin: `https://${env.VERCEL_URL || ""}`,
    vercelSystem: env.VERCEL === "1",
    productionBound: env.VERCEL_ENV === "production",
    targetProductionBound: env.VERCEL_TARGET_ENV === "production",
    runtimeCredentialIsolation: !Object.prototype.hasOwnProperty.call(env, "TURSO_AUTH_TOKEN")
      && !Object.prototype.hasOwnProperty.call(env, "GHL_PRIVATE_INTEGRATION_TOKEN"),
    projectFingerprint: fixedDigestEqual(
      sha256(env.VERCEL_PROJECT_ID || ""),
      config.deploymentBinding.fingerprints.projectIdSha256,
    ),
    gitProviderBound: env.VERCEL_GIT_PROVIDER === config.deploymentBinding.gitProvider,
    gitRepoIdFingerprint: fixedDigestEqual(
      sha256(env.VERCEL_GIT_REPO_ID || ""),
      config.deploymentBinding.fingerprints.gitRepoIdSha256,
    ),
    gitRepoOwnerFingerprint: fixedDigestEqual(
      sha256(env.VERCEL_GIT_REPO_OWNER || ""),
      config.deploymentBinding.fingerprints.gitRepoOwnerSha256,
    ),
    gitRepoSlugFingerprint: fixedDigestEqual(
      sha256(env.VERCEL_GIT_REPO_SLUG || ""),
      config.deploymentBinding.fingerprints.gitRepoSlugSha256,
    ),
    gitBranchBound: env.VERCEL_GIT_COMMIT_REF === config.deploymentBinding.productionBranch,
    gitCommitBound: /^[a-f0-9]{40}$/.test(env.VERCEL_GIT_COMMIT_SHA || ""),
    deploymentIdBound: /^dpl_[A-Za-z0-9]{16,}$/.test(env.VERCEL_DEPLOYMENT_ID || ""),
    deploymentUrlBound: isVercelDeploymentHostname(env.VERCEL_URL),
    productionHostnameFingerprint: fixedDigestEqual(
      sha256(env.VERCEL_PROJECT_PRODUCTION_URL || ""),
      config.deploymentBinding.fingerprints.productionHostnameSha256,
    ),
    databaseFingerprint: fixedDigestEqual(sha256(databaseUrl), config.fingerprints.databaseUrlSha256),
    databaseCredentialFingerprint: fixedDigestEqual(
      sha256(databaseToken),
      config.fingerprints.databaseTokenSha256,
    ),
    databaseCredentialExpiryMetadata: databaseCredentialExpiry.metadataBound,
    databaseCredentialLifetimePolicy: databaseCredentialExpiry.lifetimeWithinPolicy,
    databaseCredentialFinalCheckpointCoverage: databaseCredentialExpiry.finalCheckpointCoverage,
    databaseCredentialRuntimeValidity: databaseCredentialExpiry.runtimeValidity,
    databaseCredentialPermissionClaims: databasePermissionClaims.exact,
    databaseCredentialPermissionClaimEvidence: databasePermissionClaims.evidence,
    locationFingerprint: fixedDigestEqual(sha256(locationId), config.fingerprints.ghlLocationIdSha256),
    pipelineFingerprint: fixedDigestEqual(sha256(pipelineId), config.fingerprints.ghlPipelineIdSha256),
    submittedStageFingerprint: fixedDigestEqual(
      sha256(submittedStageId),
      config.fingerprints.ghlSubmittedStageIdSha256,
    ),
    ghlCredentialFingerprint: fixedDigestEqual(
      sha256(ghlToken),
      config.fingerprints.ghlReadTokenSha256,
    ),
    ghlCredentialScopeClaims: ghlScopeClaims.exact,
    ghlCredentialLocationClaim: ghlScopeClaims.locationBound,
    ghlCredentialScopeClaimEvidence: ghlScopeClaims.evidence,
  };
}

export async function boundedBody(response: Response, maxBytes: number, code: string) {
  const rawLength = response.headers.get("content-length");
  if (rawLength !== null && (!/^(?:0|[1-9][0-9]*)$/.test(rawLength) || Number(rawLength) > maxBytes)) {
    throw new SeoOperationalHealthError(code);
  }
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let total = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new SeoOperationalHealthError(code);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    if (error instanceof SeoOperationalHealthError) throw error;
    throw new SeoOperationalHealthError(code);
  }
}

async function fetchText(
  url: string,
  timeoutMs: number,
  maxBytes: number,
  code: string,
  deadline: number,
  dependencies: SeoOperationalHealthDependencies,
) {
  const response = await dependencies.fetch(url, {
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutWithinDeadline(timeoutMs, deadline, dependencies.now)),
  });
  const text = await boundedBody(response, maxBytes, code);
  return { response, text };
}

interface ParsedMarkupTag {
  name: string;
  closing: boolean;
  selfClosing: boolean;
  attributes: Map<string, string>;
}

function markupTagEnd(source: string, start: number, code: string) {
  let quote: "\"" | "'" | null = null;
  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === "\"" || character === "'") quote = character;
    else if (character === ">") return index + 1;
  }
  throw new SeoOperationalHealthError(code);
}

function parseMarkupTag(raw: string, xml: boolean, code: string): ParsedMarkupTag {
  let body = raw.slice(1, -1).trim();
  const closing = body.startsWith("/");
  if (closing) body = body.slice(1).trim();
  const selfClosing = !closing && body.endsWith("/");
  if (selfClosing) body = body.slice(0, -1).trimEnd();
  const nameMatch = body.match(/^[A-Za-z][A-Za-z0-9:._-]*/);
  if (!nameMatch) throw new SeoOperationalHealthError(code);
  const name = nameMatch[0].toLowerCase();
  let cursor = nameMatch[0].length;
  const attributes = new Map<string, string>();
  while (cursor < body.length) {
    while (/\s/.test(body[cursor] || "")) cursor += 1;
    if (cursor >= body.length) break;
    if (closing) throw new SeoOperationalHealthError(code);
    const attributeMatch = body.slice(cursor).match(/^[^\s=/>]+/);
    if (!attributeMatch) throw new SeoOperationalHealthError(code);
    const attributeName = attributeMatch[0].toLowerCase();
    if (attributes.has(attributeName)) throw new SeoOperationalHealthError(code);
    cursor += attributeMatch[0].length;
    while (/\s/.test(body[cursor] || "")) cursor += 1;
    let value = "";
    if (body[cursor] === "=") {
      cursor += 1;
      while (/\s/.test(body[cursor] || "")) cursor += 1;
      const quote = body[cursor];
      if (quote === "\"" || quote === "'") {
        const end = body.indexOf(quote, cursor + 1);
        if (end < 0) throw new SeoOperationalHealthError(code);
        value = body.slice(cursor + 1, end);
        cursor = end + 1;
      } else {
        if (xml) throw new SeoOperationalHealthError(code);
        const valueMatch = body.slice(cursor).match(/^[^\s>]+/);
        if (!valueMatch) throw new SeoOperationalHealthError(code);
        value = valueMatch[0];
        cursor += value.length;
      }
    } else if (xml) {
      throw new SeoOperationalHealthError(code);
    }
    attributes.set(attributeName, value);
  }
  return { name, closing, selfClosing, attributes };
}

function robotsContentNoindex(value: string) {
  const directives = value.toLowerCase().split(/[\s,]+/).filter(Boolean);
  return directives.includes("noindex") || directives.includes("none");
}

function xRobotsNoindex(value: string) {
  let appliesToGoogle = true;
  for (const rawPart of value.split(",")) {
    let part = rawPart.trim().toLowerCase();
    const scoped = part.match(/^([a-z0-9_-]+)\s*:\s*(.*)$/);
    if (scoped) {
      appliesToGoogle = scoped[1] === "googlebot" || scoped[1] === "*";
      part = scoped[2];
    }
    if (appliesToGoogle && robotsContentNoindex(part)) return true;
  }
  return false;
}

export function htmlSignals(html: string) {
  const code = "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE";
  const canonicals: string[] = [];
  let metaNoindex = false;
  let htmlSeen = false;
  let headSeen = false;
  let headClosed = false;
  let bodySeen = false;
  let bodyClosed = false;
  let htmlClosed = false;
  let inHead = false;
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf("<", cursor);
    const text = html.slice(cursor, start < 0 ? html.length : start);
    if ((!htmlSeen || htmlClosed) && text.trim()) throw new SeoOperationalHealthError(code);
    if (start < 0) break;
    if (html.startsWith("<!--", start)) {
      const end = html.indexOf("-->", start + 4);
      if (end < 0) throw new SeoOperationalHealthError(code);
      cursor = end + 3;
      continue;
    }
    if (/^<!doctype\b/i.test(html.slice(start, start + 16))) {
      const end = markupTagEnd(html, start, code);
      if (htmlSeen || html.slice(start, end).trim().toLowerCase() !== "<!doctype html>") {
        throw new SeoOperationalHealthError(code);
      }
      cursor = end;
      continue;
    }
    if (html.startsWith("<!", start) || html.startsWith("<?", start)) {
      throw new SeoOperationalHealthError(code);
    }
    const end = markupTagEnd(html, start, code);
    const tag = parseMarkupTag(html.slice(start, end), false, code);
    cursor = end;
    if (tag.name === "html") {
      if (tag.closing) {
        if (!htmlSeen || htmlClosed || !bodyClosed || inHead) throw new SeoOperationalHealthError(code);
        htmlClosed = true;
      } else {
        if (htmlSeen || tag.selfClosing) throw new SeoOperationalHealthError(code);
        htmlSeen = true;
      }
    } else if (tag.name === "head") {
      if (tag.closing) {
        if (!htmlSeen || htmlClosed || !inHead) throw new SeoOperationalHealthError(code);
        inHead = false;
        headClosed = true;
      } else {
        if (!htmlSeen || htmlClosed || headSeen || bodySeen || tag.selfClosing) {
          throw new SeoOperationalHealthError(code);
        }
        headSeen = true;
        inHead = true;
      }
    } else if (tag.name === "body") {
      if (tag.closing) {
        if (!bodySeen || bodyClosed || inHead) throw new SeoOperationalHealthError(code);
        bodyClosed = true;
      } else {
        if (!htmlSeen || htmlClosed || !headClosed || bodySeen || tag.selfClosing) {
          throw new SeoOperationalHealthError(code);
        }
        bodySeen = true;
      }
    } else if (!htmlSeen || htmlClosed || bodyClosed) {
      throw new SeoOperationalHealthError(code);
    } else if (inHead && !tag.closing && tag.name === "link") {
      const rel = (tag.attributes.get("rel") || "").toLowerCase().split(/\s+/).filter(Boolean);
      if (rel.includes("canonical")) canonicals.push(tag.attributes.get("href") || "");
    } else if (inHead && !tag.closing && tag.name === "meta") {
      const name = (tag.attributes.get("name") || "").toLowerCase();
      if ((name === "robots" || name === "googlebot") && robotsContentNoindex(tag.attributes.get("content") || "")) {
        metaNoindex = true;
      }
    }
    if (!tag.closing && !tag.selfClosing && (tag.name === "script" || tag.name === "style")) {
      const closeStart = html.toLowerCase().indexOf(`</${tag.name}`, cursor);
      if (closeStart < 0) throw new SeoOperationalHealthError(code);
      const closeEnd = markupTagEnd(html, closeStart, code);
      const close = parseMarkupTag(html.slice(closeStart, closeEnd), false, code);
      if (!close.closing || close.name !== tag.name) throw new SeoOperationalHealthError(code);
      cursor = closeEnd;
    }
  }
  if (!htmlSeen || !headSeen || !headClosed || !bodySeen || !bodyClosed || !htmlClosed || inHead) {
    throw new SeoOperationalHealthError(code);
  }
  return { canonicals, metaNoindex };
}

function decodeXmlText(value: string, code: string) {
  if (/&(?!#(?:[0-9]+|x[0-9a-f]+);|amp;|lt;|gt;|quot;|apos;)/i.test(value)) {
    throw new SeoOperationalHealthError(code);
  }
  return value.replace(/&(#(?:[0-9]+|x[0-9a-f]+)|amp|lt|gt|quot|apos);/gi, (_match, entity: string) => {
    const normalized = entity.toLowerCase();
    if (normalized === "amp") return "&";
    if (normalized === "lt") return "<";
    if (normalized === "gt") return ">";
    if (normalized === "quot") return '"';
    if (normalized === "apos") return "'";
    const numeric = normalized.startsWith("#x")
      ? Number.parseInt(normalized.slice(2), 16)
      : Number.parseInt(normalized.slice(1), 10);
    if (!Number.isInteger(numeric) || numeric < 0 || numeric > 0x10ffff) {
      throw new SeoOperationalHealthError(code);
    }
    return String.fromCodePoint(numeric);
  });
}

export function sitemapLocations(xml: string, origin: string) {
  const code = "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE";
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(xml)) throw new SeoOperationalHealthError(code);
  const locations = new Set<string>();
  const stack: string[] = [];
  let rootSeen = false;
  let rootClosed = false;
  let declarationSeen = false;
  let currentUrlLocs = 0;
  let locText = "";
  let cursor = 0;
  while (cursor < xml.length) {
    const start = xml.indexOf("<", cursor);
    const text = xml.slice(cursor, start < 0 ? xml.length : start);
    if (stack.at(-1) === "loc") locText += text;
    else if (stack.length === 0 && text.trim()) throw new SeoOperationalHealthError(code);
    if (start < 0) break;
    if (xml.startsWith("<!--", start)) {
      if (stack.at(-1) === "loc") throw new SeoOperationalHealthError(code);
      const end = xml.indexOf("-->", start + 4);
      if (end < 0) throw new SeoOperationalHealthError(code);
      cursor = end + 3;
      continue;
    }
    if (xml.startsWith("<?xml", start)) {
      if (declarationSeen || rootSeen || stack.length > 0) throw new SeoOperationalHealthError(code);
      const end = xml.indexOf("?>", start + 5);
      if (end < 0) throw new SeoOperationalHealthError(code);
      if (!/^<\?xml\s+version=(?:"1\.0"|'1\.0')(?:\s+encoding=(?:"UTF-8"|'UTF-8'))?\s*\?>$/i.test(xml.slice(start, end + 2))) {
        throw new SeoOperationalHealthError(code);
      }
      declarationSeen = true;
      cursor = end + 2;
      continue;
    }
    if (xml.startsWith("<!", start) || xml.startsWith("<?", start)) {
      throw new SeoOperationalHealthError(code);
    }
    const end = markupTagEnd(xml, start, code);
    const tag = parseMarkupTag(xml.slice(start, end), true, code);
    cursor = end;
    if (tag.closing) {
      if (stack.pop() !== tag.name) throw new SeoOperationalHealthError(code);
      if (tag.name === "loc") {
        const location = decodeXmlText(locText.trim(), code);
        if (!location || locations.has(location)) throw new SeoOperationalHealthError(code);
        let parsed: URL;
        try {
          parsed = new URL(location);
        } catch {
          throw new SeoOperationalHealthError(code);
        }
        if (parsed.origin !== origin || parsed.username || parsed.password || parsed.hash) {
          throw new SeoOperationalHealthError(code);
        }
        locations.add(location);
        currentUrlLocs += 1;
        locText = "";
      } else if (tag.name === "url") {
        if (currentUrlLocs !== 1) throw new SeoOperationalHealthError(code);
        currentUrlLocs = 0;
      } else if (tag.name === "urlset") {
        rootClosed = true;
      }
      continue;
    }
    if (rootClosed) throw new SeoOperationalHealthError(code);
    if (!rootSeen) {
      if (tag.name !== "urlset" || tag.attributes.get("xmlns") !== "http://www.sitemaps.org/schemas/sitemap/0.9") {
        throw new SeoOperationalHealthError(code);
      }
      rootSeen = true;
    } else if (stack.length === 1 && tag.name !== "url") {
      throw new SeoOperationalHealthError(code);
    } else if (tag.name === "url") {
      if (stack.at(-1) !== "urlset" || currentUrlLocs !== 0 || tag.selfClosing) {
        throw new SeoOperationalHealthError(code);
      }
    } else if (tag.name === "loc") {
      if (stack.at(-1) !== "url" || currentUrlLocs !== 0 || tag.selfClosing) {
        throw new SeoOperationalHealthError(code);
      }
      locText = "";
    } else if (stack.at(-1) === "loc") {
      throw new SeoOperationalHealthError(code);
    }
    if (!tag.selfClosing) stack.push(tag.name);
  }
  if (!rootSeen || !rootClosed || stack.length !== 0 || locations.size === 0) {
    throw new SeoOperationalHealthError(code);
  }
  return locations;
}

function exactCanonicalRedirect(location: string | null, canonicalOrigin: string) {
  if (!location) return false;
  try {
    const parsed = new URL(location);
    return parsed.origin === canonicalOrigin
      && parsed.port === ""
      && parsed.username === ""
      && parsed.password === ""
      && parsed.pathname === "/"
      && parsed.search === ""
      && parsed.hash === "";
  } catch {
    return false;
  }
}

async function inspectPublicSite(
  environment: RequiredEnvironment,
  config: SeoOperationalHealthConfig,
  incidents: IncidentCollector,
  deadline: number,
  dependencies: SeoOperationalHealthDependencies,
) {
  const [sitemapResult, deploymentSitemapResult] = await Promise.all([
    fetchText(
      `${config.origin}/sitemap.xml`,
      config.bounds.publicRequestTimeoutMs,
      config.bounds.maxSitemapBytes,
      "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE",
      deadline,
      dependencies,
    ),
    fetchText(
      `${environment.deploymentOrigin}/sitemap.xml`,
      config.bounds.publicRequestTimeoutMs,
      config.bounds.maxSitemapBytes,
      "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE",
      deadline,
      dependencies,
    ),
  ]);
  if (sitemapResult.response.status !== 200) incidents.add("sitemap-http", "P1");
  const locations = sitemapLocations(sitemapResult.text, config.origin);
  const deploymentLocations = sitemapLocations(deploymentSitemapResult.text, config.origin);
  const sitemapParity = sitemapResult.response.status === deploymentSitemapResult.response.status
    && fixedDigestEqual(sha256(sitemapResult.text), sha256(deploymentSitemapResult.text))
    && exactUniqueStringSet([...locations], [...deploymentLocations]);
  if (!sitemapParity) incidents.add("public-deployment-parity-mismatch");

  const pageResults = await Promise.all(config.priorityPaths.map(async (path) => {
    const expected = `${config.origin}${path}`;
    const [canonicalResult, deploymentResult] = await Promise.all([
      fetchText(
        expected,
        config.bounds.publicRequestTimeoutMs,
        config.bounds.maxHtmlBytes,
        "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE",
        deadline,
        dependencies,
      ),
      fetchText(
        `${environment.deploymentOrigin}${path}`,
        config.bounds.publicRequestTimeoutMs,
        config.bounds.maxHtmlBytes,
        "SEO_HEALTH_PUBLIC_SOURCE_INCOMPLETE",
        deadline,
        dependencies,
      ),
    ]);
    const { response, text } = canonicalResult;
    const signals = htmlSignals(text);
    const deploymentSignals = htmlSignals(deploymentResult.text);
    const headerNoindex = xRobotsNoindex(
      response.headers.get("x-robots-tag") || "",
    );
    const deploymentHeaderNoindex = xRobotsNoindex(
      deploymentResult.response.headers.get("x-robots-tag") || "",
    );
    const canonicalMatches = signals.canonicals.length === 1 && signals.canonicals[0] === expected;
    const deploymentCanonicalMatches = deploymentSignals.canonicals.length === 1
      && deploymentSignals.canonicals[0] === expected;
    const noindex = signals.metaNoindex || headerNoindex;
    const deploymentNoindex = deploymentSignals.metaNoindex || deploymentHeaderNoindex;
    const sitemapListed = locations.has(expected);
    const deploymentSitemapListed = deploymentLocations.has(expected);
    const deploymentParity = response.status === deploymentResult.response.status
      && fixedDigestEqual(sha256(text), sha256(deploymentResult.text))
      && exactUniqueStringSet(signals.canonicals, deploymentSignals.canonicals)
      && noindex === deploymentNoindex
      && sitemapListed === deploymentSitemapListed;
    if (response.status !== 200) incidents.add("priority-url-http", "P1");
    if (!canonicalMatches) incidents.add("priority-url-canonical", "P1");
    if (noindex) incidents.add("priority-url-noindex", "P1");
    if (!sitemapListed) incidents.add("priority-url-not-in-sitemap", "P1");
    if (
      !deploymentParity
      || deploymentResult.response.status !== 200
      || !deploymentCanonicalMatches
      || deploymentNoindex
      || !deploymentSitemapListed
    ) {
      incidents.add("public-deployment-parity-mismatch");
    }
    return { path, status: response.status, canonicalMatches, noindex, sitemapListed };
  }));

  const canonicalUrl = new URL(config.origin);
  const wwwAlias = new URL(config.origin);
  wwwAlias.hostname = `www.${canonicalUrl.hostname}`;
  const httpAlias = new URL(config.origin);
  httpAlias.protocol = "http:";
  const aliases = await Promise.all([
    { aliasType: "www", url: wwwAlias.origin },
    { aliasType: "http", url: httpAlias.origin },
  ].map(async ({ aliasType, url }) => {
    const response = await dependencies.fetch(url, {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutWithinDeadline(
        config.bounds.publicRequestTimeoutMs,
        deadline,
        dependencies.now,
      )),
    });
    const canonicalRedirect = [301, 308].includes(response.status)
      && exactCanonicalRedirect(response.headers.get("location"), config.origin);
    if (!canonicalRedirect) incidents.add("canonical-alias-unexpected", "P1");
    return { aliasType, status: response.status, canonicalRedirect };
  }));

  return {
    complete: true,
    sitemap: { status: sitemapResult.response.status, structurallyValid: true },
    priorityPages: pageResults,
    aliases,
    // Preserve the terminal contract's count of canonical public-surface
    // observations. The unique-deployment mirror is control-plane parity
    // evidence, not an additional canonical surface.
    requestCount: config.priorityPaths.length + 3,
  };
}

function rowString(row: Row, key: string, allowNull = false) {
  const value = row[key];
  if (allowNull && (value === null || value === undefined)) return null;
  if (typeof value !== "string") throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
  if (!allowNull && !value) throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
  return value;
}

function booleanFromSql(value: unknown) {
  if (value === 1 || (typeof value === "bigint" && value.toString() === "1")) return true;
  if (value === 0 || (typeof value === "bigint" && value.toString() === "0")) return false;
  const parsed = strictBoolean(value);
  if (parsed === null) throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
  return parsed;
}

function resultAt(results: ResultSet[], index: number) {
  const result = results[index];
  if (!result || !Array.isArray(result.rows)) {
    throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
  }
  return result;
}

const TURSO_AUTHORIZATION_DENIAL_CODES = new Set([
  "AUTHORIZATION_DENIED",
  "AUTHORIZATION_FAILED",
  "FORBIDDEN",
  "PERMISSION_DENIED",
  "SQLITE_AUTH",
  "SQLITE_AUTH_USER",
]);

function isStructuredTursoAuthorizationDenial(error: unknown) {
  const visited = new Set<unknown>();
  let current: unknown = error;
  for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
    if (visited.has(current)) break;
    visited.add(current);
    const candidate = current as Record<string, unknown>;
    if (candidate.status === 403 || candidate.rawCode === 23) return true;
    for (const value of [candidate.code, candidate.extendedCode]) {
      if (typeof value === "string" && TURSO_AUTHORIZATION_DENIAL_CODES.has(value.toUpperCase())) {
        return true;
      }
    }
    current = candidate.cause;
  }
  return false;
}

async function probeForbiddenDatabaseRead(
  db: DatabaseClient,
  deadline: number,
  incidents: IncidentCollector,
  dependencies: SeoOperationalHealthDependencies,
) {
  try {
    await promiseWithinDeadline(db.execute(
      `SELECT 1 AS "forbiddenReadProbe" FROM "LeadRateLimitBucket" LIMIT 1`,
    ), deadline, dependencies.now);
    incidents.add("database-credential-scope-overprivileged");
    return {
      positiveReadsSucceeded: true as const,
      forbiddenReadDenied: false,
      denialEvidence: "overprivileged" as const,
    };
  } catch (error) {
    if (isStructuredTursoAuthorizationDenial(error)) {
      return {
        positiveReadsSucceeded: true as const,
        forbiddenReadDenied: true,
        denialEvidence: "structured-authorization-denial" as const,
      };
    }
    incidents.add("database-credential-scope-probe-incomplete");
    return {
      positiveReadsSucceeded: true as const,
      forbiddenReadDenied: false,
      denialEvidence: "incomplete" as const,
    };
  }
}

async function readDatabaseSnapshot(
  environment: RequiredEnvironment,
  config: SeoOperationalHealthConfig,
  deadline: number,
  incidents: IncidentCollector,
  dependencies: SeoOperationalHealthDependencies,
): Promise<DatabaseSnapshot> {
  ensureDeadline(deadline, dependencies.now);
  const db = dependencies.createDatabaseClient({
    url: environment.databaseUrl,
    authToken: environment.databaseToken,
  });
  try {
    const results = await promiseWithinDeadline(db.batch([
      `SELECT
        COUNT(*) AS inventory,
        COALESCE(SUM(CASE WHEN "isQa" = 1 OR LOWER("qualificationStatus") = 'test' THEN 1 ELSE 0 END), 0) AS ledgerQaExcluded,
        COALESCE(SUM(CASE WHEN NOT ("isQa" = 1 OR LOWER("qualificationStatus") = 'test') THEN 1 ELSE 0 END), 0) AS ledgerNonQaInventory,
        COALESCE(SUM(CASE WHEN ("isQa" = 1) != (LOWER("qualificationStatus") = 'test') THEN 1 ELSE 0 END), 0) AS qaMarkerMismatches,
        COALESCE(SUM(CASE WHEN "status" NOT IN ('pending','sending','delivered','unknown') THEN 1 ELSE 0 END), 0) AS unexpectedDeliveryStatus,
        COALESCE(SUM(CASE WHEN "ghlSyncStatus" NOT IN ('not-required','pending','synced','error') THEN 1 ELSE 0 END), 0) AS unexpectedGhlStatus,
        COALESCE(SUM(CASE WHEN "formType" IS NOT NULL AND "formType" NOT IN ('quote','request-title-review','upload-contract','investor-due-diligence','subscribe','advertising') THEN 1 ELSE 0 END), 0) AS unexpectedFormType,
        COALESCE(SUM(CASE WHEN LOWER("qualificationStatus") NOT IN ('submitted','qualified','referred','accepted','closed-won','closed/won','lost','test') THEN 1 ELSE 0 END), 0) AS unexpectedQualificationStatus
      FROM "LeadSubmission"`,
      {
        sql: `SELECT "id", "status", "formType", "submittedAt", "deliveredAt", "lastAttemptAt",
          "ghlContactId", "ghlOpportunityId", "ghlSyncStatus", "qualificationStatus", "isQa"
          FROM "LeadSubmission"
          WHERE "status" IN ('pending','sending','unknown')
             OR ("status" = 'delivered' AND "formType" IN ('quote','request-title-review','upload-contract','investor-due-diligence'))
          ORDER BY "submittedAt" ASC, "id" ASC LIMIT ?`,
        args: [config.bounds.maxLedgerRows + 1],
      },
      {
        sql: `SELECT o."submissionId", o."expiresAt", l."id" AS ledgerId,
            l."status" AS ledgerStatus, l."formType", l."ghlSyncStatus",
            l."qualificationStatus", l."isQa"
          FROM "LeadOpportunityOutbox" o
          LEFT JOIN "LeadSubmission" l ON l."id" = o."submissionId"
          ORDER BY o."createdAt" ASC LIMIT ?`,
        args: [config.bounds.maxOutboxRows + 1],
      },
      {
        sql: `SELECT e."submissionId", l."id" AS ledgerId, l."ghlSyncStatus",
            l."qualificationStatus", l."isQa"
          FROM "LeadSubmissionEvent" e
          LEFT JOIN "LeadSubmission" l ON l."id" = e."submissionId"
          WHERE e."eventType" = 'ghl-outbox-expired'
          ORDER BY e."createdAt" ASC LIMIT ?`,
        args: [config.bounds.maxExpiredEventRows + 1],
      },
      `PRAGMA table_info("LeadSubmission")`,
      `PRAGMA table_info("LeadOpportunityOutbox")`,
    ], "read"), deadline, dependencies.now);
    ensureDeadline(deadline, dependencies.now);

    const aggregate = resultAt(results, 0).rows[0];
    if (!aggregate) throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    const inventory = databaseInteger(aggregate.inventory, "SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    const ledgerQaExcluded = databaseInteger(aggregate.ledgerQaExcluded, "SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    const ledgerNonQaInventory = databaseInteger(
      aggregate.ledgerNonQaInventory,
      "SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE",
    );
    const qaMarkerMismatches = databaseInteger(aggregate.qaMarkerMismatches, "SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    if (inventory === 0) incidents.add("ledger-empty-unexpected");
    if (qaMarkerMismatches > 0) incidents.add("ledger-qa-marker-mismatch", "P0", qaMarkerMismatches);
    for (const [field, code] of [
      ["unexpectedDeliveryStatus", "ledger-delivery-status-unexpected"],
      ["unexpectedGhlStatus", "ledger-ghl-status-unexpected"],
      ["unexpectedFormType", "ledger-form-type-unexpected"],
      ["unexpectedQualificationStatus", "ledger-qualification-status-unexpected"],
    ] as const) {
      const count = databaseInteger(aggregate[field], "SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
      if (count > 0) incidents.add(code, "P0", count);
    }

    const requiredLedgerColumns = new Set([
      "id", "status", "formType", "submittedAt", "deliveredAt", "lastAttemptAt",
      "ghlContactId", "ghlOpportunityId", "ghlSyncStatus", "qualificationStatus", "isQa",
    ]);
    const ledgerColumns = new Set(resultAt(results, 4).rows.map((row) => rowString(row, "name")));
    const outboxColumns = new Set(resultAt(results, 5).rows.map((row) => rowString(row, "name")));
    if ([...requiredLedgerColumns].some((column) => !ledgerColumns.has(column))) {
      throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    }
    if (!["submissionId", "expiresAt"].every((column) => outboxColumns.has(column))) {
      throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    }

    const ledgerResult = resultAt(results, 1);
    if (ledgerResult.rows.length > config.bounds.maxLedgerRows) {
      throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    }
    const rows = ledgerResult.rows.map((row): LedgerRow => ({
      id: rowString(row, "id")!,
      status: rowString(row, "status")!,
      formType: rowString(row, "formType", true),
      submittedAt: rowString(row, "submittedAt", true),
      deliveredAt: rowString(row, "deliveredAt", true),
      lastAttemptAt: rowString(row, "lastAttemptAt", true),
      ghlContactId: rowString(row, "ghlContactId", true),
      ghlOpportunityId: rowString(row, "ghlOpportunityId", true),
      ghlSyncStatus: rowString(row, "ghlSyncStatus")!,
      qualificationStatus: rowString(row, "qualificationStatus")!,
      isQa: booleanFromSql(row.isQa),
    }));

    const outboxResult = resultAt(results, 2);
    if (outboxResult.rows.length > config.bounds.maxOutboxRows) {
      throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    }
    const outbox = outboxResult.rows.map((row): OutboxRow => ({
      submissionId: rowString(row, "submissionId")!,
      expiresAt: rowString(row, "expiresAt", true),
      ledgerExists: row.ledgerId !== null && row.ledgerId !== undefined,
      ledgerStatus: rowString(row, "ledgerStatus", true),
      formType: rowString(row, "formType", true),
      ghlSyncStatus: rowString(row, "ghlSyncStatus", true),
      qualificationStatus: rowString(row, "qualificationStatus", true),
      isQa: row.ledgerId === null || row.ledgerId === undefined ? null : booleanFromSql(row.isQa),
    }));

    const expiredResult = resultAt(results, 3);
    if (expiredResult.rows.length > config.bounds.maxExpiredEventRows) {
      throw new SeoOperationalHealthError("SEO_HEALTH_DATABASE_SOURCE_INCOMPLETE");
    }
    const expiredEvents = expiredResult.rows.map((row): ExpiredEventRow => ({
      submissionId: rowString(row, "submissionId")!,
      ghlSyncStatus: rowString(row, "ghlSyncStatus", true),
      ledgerExists: row.ledgerId !== null && row.ledgerId !== undefined,
      qualificationStatus: rowString(row, "qualificationStatus", true),
      isQa: row.ledgerId === null || row.ledgerId === undefined ? null : booleanFromSql(row.isQa),
    }));
    const credentialScope = await probeForbiddenDatabaseRead(
      db,
      deadline,
      incidents,
      dependencies,
    );
    return {
      inventory,
      ledgerQaExcluded,
      ledgerNonQaInventory,
      qaMarkerMismatches,
      rows,
      outbox,
      expiredEvents,
      credentialScope,
    };
  } finally {
    db.close();
  }
}

function parsedTime(value: string | null, nowMs: number, incidents: IncidentCollector, code: string) {
  if (!value) {
    incidents.add(code);
    return null;
  }
  const time = Date.parse(value);
  if (!Number.isFinite(time) || time > nowMs + 5 * 60_000) {
    incidents.add(code);
    return null;
  }
  return time;
}

function reconcileLedgerAndOutbox(
  snapshot: DatabaseSnapshot,
  now: Date,
  incidents: IncidentCollector,
) {
  const nowMs = now.getTime();
  const outboxBySubmission = new Map(snapshot.outbox.map((row) => [row.submissionId, row]));
  const expiredBySubmission = new Set(snapshot.expiredEvents.map((row) => row.submissionId));
  for (const outbox of snapshot.outbox) {
    if (!outbox.ledgerExists) {
      incidents.add("ghl-outbox-orphaned");
      continue;
    }
    const qualificationQa = outbox.qualificationStatus?.toLowerCase() === "test";
    const effectiveQa = outbox.isQa === true || qualificationQa;
    if (effectiveQa) continue;
    const expiresAt = parsedTime(outbox.expiresAt, nowMs, incidents, "ghl-outbox-timestamp-invalid");
    if (expiresAt !== null && expiresAt <= nowMs) incidents.add("ghl-outbox-expired-not-reconciled");
    const transaction = Boolean(outbox.formType && TRANSACTION_FORMS.has(outbox.formType));
    if (
      outbox.ledgerStatus !== "delivered"
      || !transaction
      || !outbox.ghlSyncStatus
      || !["pending", "error"].includes(outbox.ghlSyncStatus)
    ) {
      incidents.add("ghl-outbox-state-mismatch");
    }
  }
  for (const event of snapshot.expiredEvents) {
    if (!event.ledgerExists) {
      incidents.add("ghl-outbox-expired-manual-reconciliation");
      continue;
    }
    const effectiveQa = event.isQa === true || event.qualificationStatus?.toLowerCase() === "test";
    if (effectiveQa) continue;
    if (event.ghlSyncStatus !== "synced") incidents.add("ghl-outbox-expired-manual-reconciliation");
  }

  for (const row of snapshot.rows) {
    const qualificationQa = row.qualificationStatus.toLowerCase() === "test";
    const effectiveQa = row.isQa || qualificationQa;
    if (effectiveQa) continue;
    if (!ALLOWED_DELIVERY_STATUSES.has(row.status)) incidents.add("ledger-delivery-status-unexpected");
    if (!ALLOWED_GHL_SYNC_STATUSES.has(row.ghlSyncStatus)) incidents.add("ledger-ghl-status-unexpected");
    if (!ALLOWED_QUALIFICATION_STATUSES.has(row.qualificationStatus.toLowerCase())) {
      incidents.add("ledger-qualification-status-unexpected");
    }
    if (row.formType && !ALLOWED_FORM_TYPES.has(row.formType)) incidents.add("ledger-form-type-unexpected");
    if (row.status === "unknown") incidents.add("lead-delivery-unknown");
    if (row.status === "sending") {
      const started = parsedTime(row.lastAttemptAt, nowMs, incidents, "lead-delivery-timestamp-invalid");
      if (started !== null && nowMs - started > 5 * 60_000) incidents.add("lead-delivery-sending-stale");
    }
    if (row.status === "pending") {
      const submitted = parsedTime(row.submittedAt, nowMs, incidents, "lead-submission-timestamp-invalid");
      if (submitted !== null && nowMs - submitted > 5 * 60_000) {
        incidents.add("lead-delivery-pending-stale");
      }
    }
    const transaction = Boolean(row.formType && TRANSACTION_FORMS.has(row.formType));
    if (!transaction || row.status !== "delivered") continue;
    const deliveredAt = parsedTime(row.deliveredAt, nowMs, incidents, "lead-delivered-timestamp-invalid");
    if (row.ghlSyncStatus === "not-required") incidents.add("ghl-sync-not-required-for-transaction");
    if (row.ghlSyncStatus === "error") incidents.add("ghl-sync-error");
    if (
      row.ghlSyncStatus === "pending"
      && deliveredAt !== null
      && nowMs - deliveredAt > 10 * 60_000
    ) {
      incidents.add("ghl-sync-pending-stale");
    }
    if (row.ghlSyncStatus === "synced" && (!row.ghlContactId || !row.ghlOpportunityId)) {
      incidents.add("ghl-synced-identifiers-missing");
    }
    if (["pending", "error"].includes(row.ghlSyncStatus)) {
      if (!outboxBySubmission.has(row.id) && !expiredBySubmission.has(row.id)) {
        incidents.add("ghl-outbox-missing-for-unresolved-sync");
      }
    }
  }
}

class GhlReadClient {
  private readonly token: string;
  private readonly config: SeoOperationalHealthConfig;
  private readonly deadline: number;
  private readonly dependencies: SeoOperationalHealthDependencies;
  calls = 0;

  constructor(
    token: string,
    config: SeoOperationalHealthConfig,
    deadline: number,
    dependencies: SeoOperationalHealthDependencies,
  ) {
    this.token = token;
    this.config = config;
    this.deadline = deadline;
    this.dependencies = dependencies;
  }

  async get(path: string) {
    ensureDeadline(this.deadline, this.dependencies.now);
    this.calls += 1;
    if (this.calls > this.config.bounds.maxGhlRequests) {
      throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    }
    const response = await this.dependencies.fetch(`${GHL_API_ORIGIN}${path}`, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Version: "v3",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(timeoutWithinDeadline(
        this.config.bounds.ghlRequestTimeoutMs,
        this.deadline,
        this.dependencies.now,
      )),
    });
    const text = await boundedBody(
      response,
      this.config.bounds.maxGhlResponseBytes,
      "SEO_HEALTH_GHL_SOURCE_INCOMPLETE",
    );
    if (!response.ok) throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    try {
      return record(JSON.parse(text), "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    } catch (error) {
      if (error instanceof SeoOperationalHealthError) throw error;
      throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    }
  }

  async probeForbiddenContactsRead(locationId: string) {
    ensureDeadline(this.deadline, this.dependencies.now);
    this.calls += 1;
    if (this.calls > this.config.bounds.maxGhlRequests) {
      throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    }
    const query = new URLSearchParams({ locationId, limit: "1" });
    const response = await this.dependencies.fetch(`${GHL_API_ORIGIN}/contacts/?${query}`, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Version: "2023-02-21",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(timeoutWithinDeadline(
        this.config.bounds.ghlRequestTimeoutMs,
        this.deadline,
        this.dependencies.now,
      )),
    });
    await response.body?.cancel().catch(() => undefined);
    if (response.status === 401 || response.status === 403) {
      return {
        positiveReadsSucceeded: true as const,
        forbiddenContactReadDenied: true,
        denialEvidence: "structured-authorization-denial" as const,
      };
    }
    if (response.ok) {
      return {
        positiveReadsSucceeded: true as const,
        forbiddenContactReadDenied: false,
        denialEvidence: "overprivileged" as const,
      };
    }
    return {
      positiveReadsSucceeded: true as const,
      forbiddenContactReadDenied: false,
      denialEvidence: "incomplete" as const,
    };
  }
}

async function readGhlBootstrapAndCredentialScope(
  environment: RequiredEnvironment,
  config: SeoOperationalHealthConfig,
  deadline: number,
  incidents: IncidentCollector,
  dependencies: SeoOperationalHealthDependencies,
): Promise<GhlBootstrapSnapshot> {
  const client = new GhlReadClient(environment.ghlToken, config, deadline, dependencies);
  const [locationBody, pipelinesBody, fieldsBody] = await Promise.all([
    client.get(`/locations/${encodeURIComponent(environment.locationId)}`),
    client.get(`/opportunities/pipelines?${new URLSearchParams({ locationId: environment.locationId })}`),
    client.get(`/locations/${encodeURIComponent(environment.locationId)}/customFields?model=opportunity`),
  ]);
  let credentialScope: GhlSnapshot["credentialScope"];
  try {
    credentialScope = await client.probeForbiddenContactsRead(environment.locationId);
    if (credentialScope.denialEvidence === "overprivileged") {
      incidents.add("ghl-credential-scope-overprivileged");
    } else if (credentialScope.denialEvidence === "incomplete") {
      incidents.add("ghl-credential-scope-probe-incomplete");
    }
  } catch {
    incidents.add("ghl-credential-scope-probe-incomplete");
    credentialScope = {
      positiveReadsSucceeded: true,
      forbiddenContactReadDenied: false,
      denialEvidence: "incomplete",
    };
  }
  return { client, locationBody, pipelinesBody, fieldsBody, credentialScope };
}

function projectOpportunity(value: unknown): ProjectedOpportunity {
  const opportunity = record(value, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  const id = stringValue(opportunity.id, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")!;
  const contactRecord = opportunity.contact && typeof opportunity.contact === "object"
    ? record(opportunity.contact, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")
    : null;
  const contactId = typeof opportunity.contactId === "string"
    ? opportunity.contactId
    : typeof contactRecord?.id === "string" ? contactRecord.id : null;
  const fields = new Map<string, unknown[]>();
  for (const rawField of array(opportunity.customFields ?? [], "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")) {
    const field = record(rawField, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    const fieldId = stringValue(field.id, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")!;
    const values = fields.get(fieldId) || [];
    values.push(field.fieldValue);
    fields.set(fieldId, values);
  }
  return {
    id,
    contactId,
    locationId: typeof opportunity.locationId === "string" ? opportunity.locationId : null,
    pipelineId: typeof opportunity.pipelineId === "string" ? opportunity.pipelineId : null,
    fields,
  };
}

function customFieldValue(opportunity: ProjectedOpportunity, fieldId: string) {
  const values = opportunity.fields.get(fieldId);
  if (!values || values.length !== 1) return { complete: false as const, value: null };
  return { complete: true as const, value: values[0] };
}

async function scanGhlOnce(
  client: GhlReadClient,
  environment: RequiredEnvironment,
  config: SeoOperationalHealthConfig,
) {
  const pageSize = 100;
  const opportunities: ProjectedOpportunity[] = [];
  const ids = new Set<string>();
  const cursors = new Set<string>();
  let declaredTotal: number | null = null;
  let startAfter: string | null = null;
  let startAfterId: string | null = null;
  let terminal = false;
  let pages = 0;

  for (; pages < config.bounds.maxGhlPages; pages += 1) {
    const params = new URLSearchParams({
      locationId: environment.locationId,
      pipelineId: environment.pipelineId,
      status: "all",
      order: "added_asc",
      limit: String(pageSize),
    });
    if (startAfter && startAfterId) {
      params.set("startAfter", startAfter);
      params.set("startAfterId", startAfterId);
    }
    const body = await client.get(`/opportunities/search?${params.toString()}`);
    const rows = array(body.opportunities, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    if (rows.length > pageSize) throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    const meta = record(body.meta, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    const pageTotal = ghlInteger(meta.total, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    if (declaredTotal === null) declaredTotal = pageTotal;
    else if (pageTotal !== declaredTotal) throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");

    for (const raw of rows) {
      const opportunity = projectOpportunity(raw);
      if (ids.has(opportunity.id)) throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
      if (opportunity.pipelineId !== environment.pipelineId || opportunity.locationId !== environment.locationId) {
        throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
      }
      ids.add(opportunity.id);
      opportunities.push(opportunity);
    }
    if (opportunities.length > pageTotal) {
      throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    }

    const nextAfter = meta.startAfter;
    const nextId = meta.startAfterId;
    const hasNextCursor = (typeof nextAfter === "number" || typeof nextAfter === "string")
      && String(nextAfter).length > 0
      && typeof nextId === "string"
      && nextId.length > 0;
    if (rows.length < pageSize || !hasNextCursor) {
      if (opportunities.length !== pageTotal) {
        throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
      }
      terminal = true;
      pages += 1;
      break;
    }
    const cursorKey = `${String(nextAfter)}:${nextId}`;
    if (cursors.has(cursorKey)) throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
    cursors.add(cursorKey);
    startAfter = String(nextAfter);
    startAfterId = nextId;
  }
  if (!terminal || declaredTotal === null || opportunities.length !== declaredTotal) {
    throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  }
  const probeParams = new URLSearchParams({
    locationId: environment.locationId,
    pipelineId: environment.pipelineId,
    status: "all",
    order: "added_asc",
    limit: "1",
  });
  const probe = await client.get(`/opportunities/search?${probeParams.toString()}`);
  const probeMeta = record(probe.meta, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  const finalTotal = ghlInteger(probeMeta.total, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  return {
    opportunities,
    declaredTotal,
    pages,
    terminal,
    stableTotal: finalTotal === declaredTotal,
  };
}

async function scanGhl(
  client: GhlReadClient,
  environment: RequiredEnvironment,
  config: SeoOperationalHealthConfig,
) {
  const first = await scanGhlOnce(client, environment, config);
  const second = await scanGhlOnce(client, environment, config);
  const firstIds = first.opportunities.map((opportunity) => opportunity.id).toSorted();
  const secondIds = second.opportunities.map((opportunity) => opportunity.id).toSorted();
  if (
    !first.stableTotal
    || !second.stableTotal
    || first.declaredTotal !== second.declaredTotal
    || firstIds.length !== secondIds.length
    || firstIds.some((id, index) => id !== secondIds[index])
  ) {
    throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  }
  return second;
}

async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  task: (value: T) => Promise<R>,
) {
  const queue = [...values];
  const results: R[] = [];
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (queue.length) {
      const value = queue.shift();
      if (value === undefined) break;
      results.push(await task(value));
    }
  }));
  return results;
}

async function inspectGhl(
  environment: RequiredEnvironment,
  config: SeoOperationalHealthConfig,
  database: DatabaseSnapshot,
  bootstrap: GhlBootstrapSnapshot,
  deadline: number,
  incidents: IncidentCollector,
  dependencies: SeoOperationalHealthDependencies,
): Promise<GhlSnapshot> {
  const { client, locationBody, pipelinesBody, fieldsBody, credentialScope } = bootstrap;
  const location = record(locationBody.location, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  const settings = record(location.settings, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  if (location.id !== environment.locationId || settings.allowDuplicateOpportunity !== false) {
    incidents.add("ghl-location-binding-mismatch");
  }

  const pipelines = array(pipelinesBody.pipelines, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")
    .map((value) => record(value, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE"));
  const matchingPipelines = pipelines.filter((pipeline) => pipeline.id === environment.pipelineId);
  let pipelineAndStage = matchingPipelines.length === 1;
  const pipeline = matchingPipelines[0];
  if (pipeline) {
    const stageNames: string[] = [];
    const stageIds = new Set<string>();
    let submittedStageMatches = 0;
    for (const rawStage of array(pipeline.stages, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")) {
      const stage = record(rawStage, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
      const id = stringValue(stage.id, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")!;
      const name = stringValue(stage.name, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")!;
      if (stageIds.has(id) || stageNames.includes(name)) pipelineAndStage = false;
      stageIds.add(id);
      stageNames.push(name);
      if (id === environment.submittedStageId && name === "Submitted") submittedStageMatches += 1;
    }
    pipelineAndStage = pipelineAndStage
      && pipeline.name === config.expectedPipeline.name
      && pipeline.locationId === environment.locationId
      && submittedStageMatches === 1
      && stageNames.length === config.expectedPipeline.stages.length
      && stageNames.every((stage, index) => stage === config.expectedPipeline.stages[index]);
  }
  if (!pipelineAndStage) incidents.add("ghl-pipeline-stage-binding-mismatch");

  const rawFields = array(fieldsBody.customFields, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")
    .map((value) => record(value, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE"));
  const fieldsByName = new Map<string, JsonRecord[]>();
  for (const field of rawFields) {
    const name = stringValue(field.name, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE")!;
    const values = fieldsByName.get(name) || [];
    values.push(field);
    fieldsByName.set(name, values);
  }
  let customFields = true;
  const requiredFieldIds = new Set<string>();
  const requiredFieldKeys = new Set<string>();
  for (const requiredName of config.requiredOpportunityFields) {
    const matches = fieldsByName.get(requiredName) || [];
    const field = matches[0];
    const fieldId = typeof field?.id === "string" ? field.id.trim() : "";
    const fieldKey = typeof field?.fieldKey === "string" ? field.fieldKey.trim() : "";
    if (
      matches.length !== 1
      || field?.model !== "opportunity"
      || field?.locationId !== environment.locationId
      || field?.dataType !== "TEXT"
      || !fieldKey.startsWith("opportunity.")
      || !fieldId
      || requiredFieldIds.has(fieldId)
      || requiredFieldKeys.has(fieldKey)
    ) {
      customFields = false;
      incidents.add("ghl-required-field-missing-or-ambiguous");
    } else {
      requiredFieldIds.add(fieldId);
      requiredFieldKeys.add(fieldKey);
    }
  }
  const submissionField = fieldsByName.get("SEO Submission ID")?.[0];
  const qaField = fieldsByName.get("SEO QA Excluded")?.[0];
  const submissionFieldId = typeof submissionField?.id === "string" ? submissionField.id : "";
  const qaFieldId = typeof qaField?.id === "string" ? qaField.id : "";
  const targetFingerprint = submissionFieldId.length > 0
    && qaFieldId.length > 0
    && isSha256(config.fingerprints.ghlTargetSha256)
    && fixedDigestEqual(ghlTargetFingerprint({
      locationId: environment.locationId,
      pipelineId: environment.pipelineId,
      submittedStageId: environment.submittedStageId,
      submissionIdFieldId: submissionFieldId,
      qaExcludedFieldId: qaFieldId,
    }), config.fingerprints.ghlTargetSha256);
  if (!targetFingerprint) incidents.add("ghl-target-fingerprint-mismatch");

  const scan = await scanGhl(client, environment, config);
  const bySubmission = new Map<string, ProjectedOpportunity[]>();
  const classifiedByOpportunity = new Map<string, { submissionId: string; qa: boolean }>();
  let qaExcluded = 0;
  let unclassifiable = 0;
  for (const opportunity of scan.opportunities) {
    const submission = customFieldValue(opportunity, submissionFieldId);
    const qa = customFieldValue(opportunity, qaFieldId);
    if (!submission.complete || typeof submission.value !== "string" || !submission.value.trim()) {
      unclassifiable += 1;
      continue;
    }
    if (!qa.complete) {
      unclassifiable += 1;
      continue;
    }
    const qaValue = strictBoolean(qa.value);
    if (qaValue === null) {
      unclassifiable += 1;
      continue;
    }
    if (qaValue) qaExcluded += 1;
    const key = submission.value.trim();
    classifiedByOpportunity.set(opportunity.id, { submissionId: key, qa: qaValue });
    const values = bySubmission.get(key) || [];
    values.push(opportunity);
    bySubmission.set(key, values);
  }
  if (unclassifiable > 0) incidents.add("ghl-opportunity-qa-or-submission-unclassifiable", "P0", unclassifiable);

  const rowsByOpportunity = new Map<string, LedgerRow[]>();
  const ledgerBySubmission = new Map<string, LedgerRow>();
  for (const row of database.rows) {
    ledgerBySubmission.set(row.id, row);
    if (row.status !== "delivered" || !row.formType || !TRANSACTION_FORMS.has(row.formType)) continue;
    if (!row.ghlOpportunityId) continue;
    const values = rowsByOpportunity.get(row.ghlOpportunityId) || [];
    values.push(row);
    rowsByOpportunity.set(row.ghlOpportunityId, values);
  }
  const submittedTimes = new Map<string, number>();
  for (const rows of rowsByOpportunity.values()) {
    for (const row of rows) {
      const submittedAt = Date.parse(row.submittedAt || "");
      if (!Number.isFinite(submittedAt) || submittedAt > dependencies.now().getTime() + 5 * 60_000) {
        incidents.add("lead-submission-timestamp-invalid");
      } else {
        submittedTimes.set(row.id, submittedAt);
      }
    }
  }
  const currentRows: LedgerRow[] = [];
  for (const rows of rowsByOpportunity.values()) {
    const sorted = rows.toSorted((left, right) => {
      const leftTime = submittedTimes.get(left.id);
      const rightTime = submittedTimes.get(right.id);
      if (leftTime !== undefined && rightTime !== undefined && leftTime !== rightTime) return rightTime - leftTime;
      if (leftTime === undefined && rightTime !== undefined) return 1;
      if (leftTime !== undefined && rightTime === undefined) return -1;
      return right.id.localeCompare(left.id);
    });
    const latestTime = submittedTimes.get(sorted[0].id);
    const nextTime = sorted[1] ? submittedTimes.get(sorted[1].id) : undefined;
    if (latestTime !== undefined && nextTime !== undefined && latestTime === nextTime) {
      incidents.add("ghl-opportunity-current-submission-ambiguous");
    }
    currentRows.push(sorted[0]);
  }
  const currentByOpportunity = new Map(
    currentRows.filter(Boolean).map((row) => [row.ghlOpportunityId!, row]),
  );
  const qaParityOpportunityIds = new Set<string>();

  for (const opportunity of scan.opportunities) {
    const classified = classifiedByOpportunity.get(opportunity.id);
    if (!classified) continue;
    const ledger = ledgerBySubmission.get(classified.submissionId);
    if (!ledger) {
      incidents.add("ghl-opportunity-ledger-orphan");
      continue;
    }
    const transaction = Boolean(ledger.formType && TRANSACTION_FORMS.has(ledger.formType));
    if (
      ledger.status !== "delivered"
      || !transaction
      || ledger.ghlOpportunityId !== opportunity.id
    ) {
      incidents.add("ghl-opportunity-ledger-link-mismatch");
    }
    const expectedCurrent = currentByOpportunity.get(opportunity.id);
    if (!expectedCurrent || expectedCurrent.id !== classified.submissionId) {
      incidents.add("ghl-opportunity-stale-submission-mapping");
    }
    const ledgerQa = ledger.isQa || ledger.qualificationStatus.toLowerCase() === "test";
    if (ledgerQa !== classified.qa) {
      qaParityOpportunityIds.add(opportunity.id);
      incidents.add("ghl-ledger-qa-parity-mismatch");
    }
  }
  if (currentRows.length > config.bounds.maxGhlDetailRequests) {
    throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  }
  const details = await mapWithConcurrency(
    currentRows,
    config.bounds.ghlDetailConcurrency,
    async (row) => {
      const body = await client.get(`/opportunities/${encodeURIComponent(row.ghlOpportunityId!)}`);
      const opportunity = projectOpportunity(body.opportunity);
      if (opportunity.locationId !== environment.locationId || opportunity.pipelineId !== environment.pipelineId) {
        throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
      }
      return { row, opportunity };
    },
  );

  for (const { row, opportunity } of details) {
    if (opportunity.id !== row.ghlOpportunityId) incidents.add("ghl-opportunity-id-mismatch");
    if (!row.ghlContactId || !opportunity.contactId || row.ghlContactId !== opportunity.contactId) {
      incidents.add("ghl-contact-id-mismatch-or-missing");
    }
    const submission = customFieldValue(opportunity, submissionFieldId);
    if (!submission.complete || submission.value !== row.id) {
      incidents.add("current-opportunity-submission-mapping-missing");
    }
    const matches = bySubmission.get(row.id) || [];
    if (matches.length !== 1 || matches[0].id !== row.ghlOpportunityId) {
      incidents.add(matches.length > 1 ? "duplicate-opportunity" : "opportunity-mapping-mismatch");
    }
    const qa = customFieldValue(opportunity, qaFieldId);
    const ghlQa = qa.complete ? strictBoolean(qa.value) : null;
    const ledgerQa = row.isQa || row.qualificationStatus.toLowerCase() === "test";
    if (ghlQa === null || ghlQa !== ledgerQa) {
      if (!qaParityOpportunityIds.has(opportunity.id)) {
        incidents.add("ghl-ledger-qa-parity-mismatch");
      }
      qaParityOpportunityIds.add(opportunity.id);
    }
  }

  return {
    targetFingerprint,
    pipelineAndStage,
    customFields,
    inventory: scan.opportunities.length,
    declaredTotal: scan.declaredTotal,
    retrieved: scan.opportunities.length,
    pages: scan.pages,
    cursorTerminal: scan.terminal,
    stableTotal: scan.stableTotal,
    detailsComplete: details.length === currentRows.length,
    qaExcluded,
    mappedSubmissions: bySubmission.size,
    reusedOpportunityCards: [...rowsByOpportunity.values()].filter((rows) => rows.length > 1).length,
    qaParityMismatches: qaParityOpportunityIds.size,
    unclassifiable,
    requestCount: client.calls,
    credentialScope,
  };
}

export function deploymentFingerprintForEnvironment(env: NodeJS.ProcessEnv = process.env) {
  const values = {
    contract: "vercel-deployment-v1",
    projectId: env.VERCEL_PROJECT_ID || "",
    deploymentId: env.VERCEL_DEPLOYMENT_ID || "",
    deploymentUrl: env.VERCEL_URL || "",
    gitProvider: env.VERCEL_GIT_PROVIDER || "",
    gitRepoId: env.VERCEL_GIT_REPO_ID || "",
    gitRepoOwner: env.VERCEL_GIT_REPO_OWNER || "",
    gitRepoSlug: env.VERCEL_GIT_REPO_SLUG || "",
    gitCommitRef: env.VERCEL_GIT_COMMIT_REF || "",
    gitCommitSha: env.VERCEL_GIT_COMMIT_SHA || "",
    productionHostname: env.VERCEL_PROJECT_PRODUCTION_URL || "",
  };
  return Object.values(values).some((value) => !value) ? null : stableJsonDigest(values);
}

export async function runSeoOperationalHealth(
  context: HealthContext,
  options: {
    env?: NodeJS.ProcessEnv;
    config: SeoOperationalHealthConfig;
    dependencies?: Partial<SeoOperationalHealthDependencies>;
  },
) {
  const config = options.config;
  const env = options.env || process.env;
  const dependencies = { ...defaultDependencies, ...options.dependencies };
  const startedAt = dependencies.now();
  const deadline = startedAt.getTime() + config.bounds.internalDeadlineMs;
  const incidents = new IncidentCollector();
  const environment = requiredEnvironment(env, config, startedAt);
  if (
    !environment.vercelSystem
    || !environment.productionBound
    || !environment.targetProductionBound
  ) {
    incidents.add("production-runtime-binding-mismatch");
  }
  if (!environment.runtimeCredentialIsolation) {
    incidents.add("runtime-credential-isolation-mismatch");
  }
  if (!environment.projectFingerprint) incidents.add("vercel-project-binding-mismatch");
  if (
    !environment.gitProviderBound
    || !environment.gitRepoIdFingerprint
    || !environment.gitRepoOwnerFingerprint
    || !environment.gitRepoSlugFingerprint
    || !environment.gitBranchBound
  ) {
    incidents.add("git-source-binding-mismatch");
  }
  if (!environment.gitCommitBound) incidents.add("git-commit-binding-mismatch");
  if (!environment.deploymentIdBound) incidents.add("vercel-deployment-binding-mismatch");
  if (!environment.deploymentUrlBound) incidents.add("vercel-deployment-url-binding-mismatch");
  if (!environment.productionHostnameFingerprint) incidents.add("production-url-binding-mismatch");
  if (!environment.databaseFingerprint) incidents.add("database-target-fingerprint-mismatch");
  if (!environment.databaseCredentialFingerprint) {
    incidents.add("database-credential-fingerprint-mismatch");
  }
  if (!environment.databaseCredentialExpiryMetadata) {
    incidents.add("database-credential-expiry-metadata-mismatch");
  }
  if (!environment.databaseCredentialLifetimePolicy) {
    incidents.add("database-credential-lifetime-policy-mismatch");
  }
  if (!environment.databaseCredentialFinalCheckpointCoverage) {
    incidents.add("database-credential-final-checkpoint-coverage-mismatch");
  }
  if (!environment.databaseCredentialRuntimeValidity) {
    incidents.add("database-credential-expired-or-not-yet-valid");
  }
  if (!environment.databaseCredentialPermissionClaims) {
    incidents.add(
      environment.databaseCredentialPermissionClaimEvidence === "overprivileged"
        ? "database-credential-permission-claims-overprivileged"
        : "database-credential-permission-claims-incomplete",
    );
  }
  if (
    !environment.locationFingerprint
    || !environment.pipelineFingerprint
    || !environment.submittedStageFingerprint
  ) {
    incidents.add("ghl-static-target-fingerprint-mismatch");
  }
  if (!environment.ghlCredentialFingerprint) incidents.add("ghl-credential-fingerprint-mismatch");
  if (!environment.ghlCredentialScopeClaims || !environment.ghlCredentialLocationClaim) {
    incidents.add(
      environment.ghlCredentialScopeClaimEvidence === "overprivileged"
        ? "ghl-credential-scope-claims-overprivileged"
        : "ghl-credential-scope-claims-incomplete",
    );
  }

  const staticBindingsComplete = [
    environment.vercelSystem,
    environment.productionBound,
    environment.targetProductionBound,
    environment.runtimeCredentialIsolation,
    environment.projectFingerprint,
    environment.gitProviderBound,
    environment.gitRepoIdFingerprint,
    environment.gitRepoOwnerFingerprint,
    environment.gitRepoSlugFingerprint,
    environment.gitBranchBound,
    environment.gitCommitBound,
    environment.deploymentIdBound,
    environment.deploymentUrlBound,
    environment.productionHostnameFingerprint,
    environment.databaseFingerprint,
    environment.databaseCredentialFingerprint,
    environment.databaseCredentialExpiryMetadata,
    environment.databaseCredentialLifetimePolicy,
    environment.databaseCredentialFinalCheckpointCoverage,
    environment.databaseCredentialRuntimeValidity,
    environment.databaseCredentialPermissionClaims,
    environment.locationFingerprint,
    environment.pipelineFingerprint,
    environment.submittedStageFingerprint,
    environment.ghlCredentialFingerprint,
    environment.ghlCredentialScopeClaims,
    environment.ghlCredentialLocationClaim,
  ].every(Boolean);

  let publicSite: Awaited<ReturnType<typeof inspectPublicSite>> | null = null;
  let database: DatabaseSnapshot | null = null;
  let ghlBootstrap: GhlBootstrapSnapshot | null = null;
  let ghlCredentialScope: GhlSnapshot["credentialScope"] | null = null;
  let ghlRequestCount = 0;
  let ghl: GhlSnapshot | null = null;
  if (staticBindingsComplete) {
    const [publicResult, databaseResult, ghlBootstrapResult] = await Promise.allSettled([
      inspectPublicSite(environment, config, incidents, deadline, dependencies),
      readDatabaseSnapshot(environment, config, deadline, incidents, dependencies),
      readGhlBootstrapAndCredentialScope(environment, config, deadline, incidents, dependencies),
    ]);
    if (publicResult.status === "fulfilled") {
      publicSite = publicResult.value;
    } else {
      incidents.add("public-source-incomplete");
    }
    if (databaseResult.status === "fulfilled") {
      database = databaseResult.value;
      reconcileLedgerAndOutbox(database, context.now, incidents);
    } else {
      incidents.add("database-source-incomplete");
    }
    if (ghlBootstrapResult.status === "fulfilled") {
      ghlBootstrap = ghlBootstrapResult.value;
      ghlCredentialScope = ghlBootstrap.credentialScope;
      ghlRequestCount = ghlBootstrap.client.calls;
    } else {
      incidents.add("ghl-credential-scope-probe-incomplete");
      incidents.add("ghl-source-incomplete");
    }
    if (database && ghlBootstrap) {
      try {
        ghl = await inspectGhl(
          environment,
          config,
          database,
          ghlBootstrap,
          deadline,
          incidents,
          dependencies,
        );
        ghlRequestCount = ghl.requestCount;
      } catch {
        incidents.add("ghl-source-incomplete");
      }
    } else if (!database) {
      incidents.add("ghl-source-skipped-database-incomplete");
    }
  } else {
    incidents.add("external-sources-skipped-binding-incomplete");
  }
  ensureDeadline(deadline, dependencies.now);

  const incidentList = incidents.list();
  const complete = Boolean(
    publicSite?.complete
    && database
    && ghl
    && ghl.cursorTerminal
    && ghl.stableTotal
    && ghl.detailsComplete
    && ghl.declaredTotal === ghl.retrieved,
  );
  const bindings = {
    vercelSystem: environment.vercelSystem,
    production: environment.productionBound,
    targetProduction: environment.targetProductionBound,
    runtimeCredentialIsolation: environment.runtimeCredentialIsolation,
    projectFingerprint: environment.projectFingerprint,
    gitSource: Boolean(
      environment.gitProviderBound
      && environment.gitRepoIdFingerprint
      && environment.gitRepoOwnerFingerprint
      && environment.gitRepoSlugFingerprint
      && environment.gitBranchBound
    ),
    gitCommit: environment.gitCommitBound,
    deployment: environment.deploymentIdBound && environment.deploymentUrlBound,
    productionHostname: environment.productionHostnameFingerprint,
    origin: new URL(config.origin).protocol === "https:" && new URL(config.origin).origin === config.origin,
    databaseFingerprint: environment.databaseFingerprint,
    databaseCredentialFingerprint: environment.databaseCredentialFingerprint,
    databaseCredentialExpiryMetadata: environment.databaseCredentialExpiryMetadata,
    databaseCredentialLifetimePolicy: environment.databaseCredentialLifetimePolicy,
    databaseCredentialFinalCheckpointCoverage: environment.databaseCredentialFinalCheckpointCoverage,
    databaseCredentialRuntimeValidity: environment.databaseCredentialRuntimeValidity,
    databaseReadScope: Boolean(
      environment.databaseCredentialPermissionClaims
      && database?.credentialScope.forbiddenReadDenied
    ),
    ghlFingerprint: Boolean(ghl?.targetFingerprint),
    ghlCredentialFingerprint: environment.ghlCredentialFingerprint,
    ghlReadScope: Boolean(
      environment.ghlCredentialScopeClaims
      && environment.ghlCredentialLocationClaim
      && ghlCredentialScope?.forbiddenContactReadDenied
    ),
    pipelineAndStage: Boolean(ghl?.pipelineAndStage),
    customFields: Boolean(ghl?.customFields),
  };
  const healthy = complete
    && Object.values(bindings).every(Boolean)
    && incidentList.length === 0;
  const reportWithoutDigest = {
    schemaVersion: config.schemaVersion,
    contractVersion: config.contractVersion,
    scope: SEO_OPERATIONAL_HEALTH_SCOPE,
    checkpoint: {
      id: context.checkpointId,
      scheduledDate: context.effectiveDate,
      timezone: config.timezone,
      runKind: context.runKind,
      scheduleDateMatched: true,
      historicalStateVerifiable: false,
    },
    observation: {
      startedAt: startedAt.toISOString(),
      finishedAt: dependencies.now().toISOString(),
      archiveRecorded: false,
      deploymentFingerprint: deploymentFingerprintForEnvironment(env),
    },
    bindings,
    credentialScope: {
      turso: {
        permissionClaimsExact: environment.databaseCredentialPermissionClaims,
        permissionClaimEvidence: environment.databaseCredentialPermissionClaimEvidence,
        positiveReadsSucceeded: database?.credentialScope.positiveReadsSucceeded ?? false,
        forbiddenReadDenied: database?.credentialScope.forbiddenReadDenied ?? false,
        denialEvidence: database?.credentialScope.denialEvidence ?? "not-observed",
        tokenExpiryMetadataBound: environment.databaseCredentialExpiryMetadata,
        lifetimeWithinPolicy: environment.databaseCredentialLifetimePolicy,
        validThroughFinalCheckpoint: environment.databaseCredentialFinalCheckpointCoverage,
        runtimeValid: environment.databaseCredentialRuntimeValidity,
      },
      ghl: {
        scopeClaimsExact: environment.ghlCredentialScopeClaims,
        locationClaimBound: environment.ghlCredentialLocationClaim,
        scopeClaimEvidence: environment.ghlCredentialScopeClaimEvidence,
        positiveReadsSucceeded: ghlCredentialScope?.positiveReadsSucceeded ?? false,
        forbiddenContactReadDenied: ghlCredentialScope?.forbiddenContactReadDenied ?? false,
        denialEvidence: ghlCredentialScope?.denialEvidence ?? "not-observed",
      },
    },
    completeness: {
      complete,
      ledgerSnapshot: Boolean(database),
      outboxSnapshot: Boolean(database),
      ghl: {
        declaredTotal: ghl?.declaredTotal ?? null,
        retrieved: ghl?.retrieved ?? null,
        pages: ghl?.pages ?? null,
        cursorTerminal: ghl?.cursorTerminal ?? false,
        stableTotal: ghl?.stableTotal ?? false,
        detailsComplete: ghl?.detailsComplete ?? false,
      },
      publicPages: Boolean(publicSite?.complete),
    },
    aggregates: {
      ledgerInventory: database?.inventory ?? null,
      ledgerQaExcluded: database?.ledgerQaExcluded ?? null,
      ledgerNonQaInventory: database?.ledgerNonQaInventory ?? null,
      outboxInventory: database?.outbox.length ?? null,
      ghlInventory: ghl?.inventory ?? null,
      ghlQaExcluded: ghl?.qaExcluded ?? null,
      mappedSubmissions: ghl?.mappedSubmissions ?? null,
      reusedOpportunityCards: ghl?.reusedOpportunityCards ?? null,
      qaParityMismatches: ghl?.qaParityMismatches ?? null,
      unclassifiable: ghl?.unclassifiable ?? null,
    },
    publicSite: publicSite ? {
      sitemap: publicSite.sitemap,
      priorityPages: publicSite.priorityPages,
      aliases: publicSite.aliases,
    } : null,
    requests: {
      public: publicSite?.requestCount ?? 0,
      ghl: ghlRequestCount,
    },
    notObservedByThisRoute: [
      "google-selected-canonical",
      "crawl-index-state",
      "gsc-sitemap-warnings",
      "finalized-gsc-window",
      "local-search-rank",
      "seo-decision-power",
    ],
    incidents: incidentList,
    healthy,
    seoChangeAuthorization: SEO_CHANGE_AUTHORIZATION,
  };
  return {
    ...reportWithoutDigest,
    observation: {
      ...reportWithoutDigest.observation,
      evidenceDigest: stableJsonDigest(reportWithoutDigest),
    },
  };
}
