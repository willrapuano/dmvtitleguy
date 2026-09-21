import { createHash, timingSafeEqual } from "node:crypto";
import {
  resolveExistingArchive,
  resolveExistingIncident,
  validateArchiveSignatureConfig,
} from "./seo-health-evidence-archive.mjs";
import { computeSeoHealthSourceDigest } from "./seo-health-source-digest.mjs";

export const CANARY_ARCHIVE_REPOSITORY = "willrapuano/dmvtitleguy";
export const CANARY_ARCHIVE_ISSUE_NUMBER = 47;
export const CANARY_WORKFLOW_PATH = ".github/workflows/seo-operational-health.yml";
export const MISSED_RECOVERY_WORKFLOW_PATH = ".github/workflows/seo-operational-health-recovery.yml";

const RECEIPT_KEYS = Object.freeze([
  "checkpointId",
  "scheduledDate",
  "finishedAt",
  "commentId",
  "commentBodySha256",
  "deploymentFingerprint",
  "evidenceDigest",
  "healthSourceDigest",
  "githubSha",
]);
const SHA256 = /^[a-f0-9]{64}$/;
const GITHUB_SHA = /^[a-f0-9]{40}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_COMMENT_BYTES = 256 * 1024;
const FETCH_TIMEOUT_MS = 15_000;
const WORKFLOW_NAME = "SEO operational health";
const MISSED_RECOVERY_WORKFLOW_NAME = "SEO operational health missed-checkpoint recovery";
const MISSED_RECOVERY_REASONS = new Set([
  "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  "SEO_HEALTH_ROLLOUT_CANARY_CHECKPOINT_MISSED",
  "SEO_HEALTH_ROLLOUT_PERMANENT_CHECKPOINT_MISSED",
]);

export class SeoHealthCanaryReceiptError extends Error {
  constructor(code) {
    super(code);
    this.name = "SeoHealthCanaryReceiptError";
    this.code = code;
  }
}

function fail(code) {
  throw new SeoHealthCanaryReceiptError(code);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactObjectKeys(value, expectedKeys) {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function validCalendarDate(value) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed)
    && new Date(parsed).toISOString().slice(0, 10) === value;
}

function parsedIsoTime(value) {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value
    ? parsed
    : null;
}

function parsedGithubTime(value) {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  const canonical = new Date(parsed).toISOString();
  return value === canonical || value === canonical.replace(/\.000Z$/, "Z")
    ? parsed
    : null;
}

function isoDateInTimeZone(now, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const date = `${values.year}-${values.month}-${values.day}`;
    return validCalendarDate(date) ? date : null;
  } catch {
    return null;
  }
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function digestMatches(value, expected) {
  if (!SHA256.test(expected || "")) return false;
  return timingSafeEqual(
    Buffer.from(sha256(value), "hex"),
    Buffer.from(expected, "hex"),
  );
}

function hexDigestEqual(value, expected) {
  return SHA256.test(value || "")
    && SHA256.test(expected || "")
    && timingSafeEqual(Buffer.from(value, "hex"), Buffer.from(expected, "hex"));
}

function validatePermanentConfig(config) {
  if (
    !isRecord(config)
    || !Number.isSafeInteger(config.schemaVersion)
    || config.schemaVersion <= 0
    || typeof config.contractVersion !== "string"
    || config.contractVersion.length === 0
    || typeof config.scope !== "string"
    || config.scope.length === 0
    || typeof config.timezone !== "string"
    || !isRecord(config.checkpointCalendar)
    || !isRecord(config.bounds)
    || !Number.isSafeInteger(config.bounds.internalDeadlineMs)
    || config.bounds.internalDeadlineMs <= 0
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_CONFIG_INVALID");
  }
  try {
    validateArchiveSignatureConfig(config.archiveSignature);
  } catch {
    fail("SEO_HEALTH_CANARY_RECEIPT_SIGNATURE_CONFIG_INVALID");
  }

  const receipt = config.canaryReceipt;
  if (!exactObjectKeys(receipt, RECEIPT_KEYS)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_SCHEMA_INVALID");
  }
  if (
    !validCalendarDate(receipt.scheduledDate)
    || receipt.checkpointId !== `production-canary-${receipt.scheduledDate}`
    || Object.hasOwn(config.checkpointCalendar, receipt.scheduledDate)
    || !Number.isSafeInteger(receipt.commentId)
    || receipt.commentId <= 0
    || !SHA256.test(receipt.commentBodySha256 || "")
    || !SHA256.test(receipt.deploymentFingerprint || "")
    || !SHA256.test(receipt.evidenceDigest || "")
    || !SHA256.test(receipt.healthSourceDigest || "")
    || !GITHUB_SHA.test(receipt.githubSha || "")
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_SCHEMA_INVALID");
  }
  const finishedAt = parsedIsoTime(receipt.finishedAt);
  if (
    finishedAt === null
    || isoDateInTimeZone(new Date(finishedAt), config.timezone) !== receipt.scheduledDate
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_TIMING_INVALID");
  }
  return receipt;
}

function commentApiUrl(commentId) {
  return `https://api.github.com/repos/${CANARY_ARCHIVE_REPOSITORY}/issues/comments/${commentId}`;
}

function githubHeaders(token) {
  if (typeof token !== "string" || token.length < 20 || /[\r\n]/.test(token)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_GITHUB_TOKEN_INVALID");
  }
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "dmvtitleguy-seo-health-receipt-verifier",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function readBoundedBody(response, {
  maximumBytes,
  tooLargeCode,
  invalidCode,
}) {
  const reader = response?.body?.getReader?.();
  if (!reader) fail(invalidCode);
  const chunks = [];
  let total = 0;
  let tooLarge = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!(value instanceof Uint8Array)) fail(invalidCode);
      total += value.byteLength;
      if (total > maximumBytes) {
        tooLarge = true;
        try {
          await reader.cancel();
        } catch {
          // The size violation is already authoritative.
        }
        break;
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof SeoHealthCanaryReceiptError) throw error;
    fail(invalidCode);
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Releasing a cancelled or errored stream is best-effort cleanup.
    }
  }
  if (tooLarge) fail(tooLargeCode);
  if (total === 0) fail(invalidCode);
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function fetchExactComment(fetchImpl, receipt, token) {
  if (typeof fetchImpl !== "function") {
    fail("SEO_HEALTH_CANARY_RECEIPT_FETCH_UNAVAILABLE");
  }
  const url = commentApiUrl(receipt.commentId);
  const headers = githubHeaders(token);
  let response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      redirect: "error",
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof SeoHealthCanaryReceiptError) throw error;
    fail("SEO_HEALTH_CANARY_RECEIPT_FETCH_FAILED");
  }
  if (
    !response
    || response.status !== 200
    || response.ok !== true
    || response.url !== url
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_RESPONSE_INVALID");
  }
  const contentType = response.headers?.get?.("content-type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_CONTENT_TYPE_INVALID");
  }
  const declaredLength = response.headers?.get?.("content-length");
  if (declaredLength !== null && declaredLength !== undefined && declaredLength !== "") {
    if (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_COMMENT_BYTES) {
      fail("SEO_HEALTH_CANARY_RECEIPT_BODY_TOO_LARGE");
    }
  }

  const bytes = await readBoundedBody(response, {
    maximumBytes: MAX_COMMENT_BYTES,
    tooLargeCode: "SEO_HEALTH_CANARY_RECEIPT_BODY_TOO_LARGE",
    invalidCode: "SEO_HEALTH_CANARY_RECEIPT_BODY_INVALID",
  });
  let comment;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    comment = JSON.parse(text);
  } catch {
    fail("SEO_HEALTH_CANARY_RECEIPT_BODY_INVALID");
  }
  if (!isRecord(comment) || comment.id !== receipt.commentId) {
    fail("SEO_HEALTH_CANARY_RECEIPT_COMMENT_INVALID");
  }
  return comment;
}

export async function inspectExactActionsRun(fetchImpl, evidence, token, {
  requireSuccess = true,
  allowedEvents = ["schedule"],
  expectedWorkflowName = WORKFLOW_NAME,
  expectedWorkflowPath = CANARY_WORKFLOW_PATH,
  expectedActor = null,
} = {}) {
  if (typeof fetchImpl !== "function") {
    fail("SEO_HEALTH_CANARY_RECEIPT_FETCH_UNAVAILABLE");
  }
  const baseRunUrl = `https://api.github.com/repos/${CANARY_ARCHIVE_REPOSITORY}/actions/runs/${evidence.githubRunId}`;
  const url = `${baseRunUrl}/attempts/${evidence.githubRunAttempt}`;
  const headers = githubHeaders(token);
  let response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      redirect: "error",
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof SeoHealthCanaryReceiptError) throw error;
    fail("SEO_HEALTH_CANARY_RECEIPT_RUN_FETCH_FAILED");
  }
  if (
    !response
    || response.status !== 200
    || response.ok !== true
    || response.url !== url
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_RUN_RESPONSE_INVALID");
  }
  const contentType = response.headers?.get?.("content-type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_RUN_CONTENT_TYPE_INVALID");
  }
  const declaredLength = response.headers?.get?.("content-length");
  if (declaredLength !== null && declaredLength !== undefined && declaredLength !== "") {
    if (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_COMMENT_BYTES) {
      fail("SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_TOO_LARGE");
    }
  }

  const bytes = await readBoundedBody(response, {
    maximumBytes: MAX_COMMENT_BYTES,
    tooLargeCode: "SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_TOO_LARGE",
    invalidCode: "SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_INVALID",
  });
  let run;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    run = JSON.parse(text);
  } catch {
    fail("SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_INVALID");
  }

  const runId = Number(evidence.githubRunId);
  const runAttempt = Number(evidence.githubRunAttempt);
  const createdAt = parsedGithubTime(run?.created_at);
  const startedAt = parsedGithubTime(run?.run_started_at);
  const updatedAt = parsedGithubTime(run?.updated_at);
  const evidenceFinishedAt = parsedIsoTime(evidence.finishedAt || evidence.detectedAt);
  if (
    !isRecord(run)
    || !Number.isSafeInteger(runId)
    || runId <= 0
    || !Number.isSafeInteger(runAttempt)
    || runAttempt <= 0
    || run.id !== runId
    || run.run_attempt !== runAttempt
    || run.name !== expectedWorkflowName
    || run.path !== expectedWorkflowPath
    || !allowedEvents.includes(run.event)
    || run.status !== "completed"
    || (requireSuccess ? run.conclusion !== "success" : ![
      "failure",
      "cancelled",
      "timed_out",
      "action_required",
      "startup_failure",
    ].includes(run.conclusion))
    || run.head_branch !== "main"
    || run.head_sha !== evidence.githubSha
    || run.url !== baseRunUrl
    || run.html_url !== `https://github.com/${CANARY_ARCHIVE_REPOSITORY}/actions/runs/${evidence.githubRunId}`
    || !isRecord(run.repository)
    || run.repository.full_name !== CANARY_ARCHIVE_REPOSITORY
    || run.repository.private !== false
    || !isRecord(run.head_repository)
    || run.head_repository.full_name !== CANARY_ARCHIVE_REPOSITORY
    || !isRecord(run.head_commit)
    || run.head_commit.id !== evidence.githubSha
    || (expectedActor && (
      run.actor?.login !== expectedActor.login
      || run.actor?.id !== expectedActor.id
      || run.triggering_actor?.login !== expectedActor.login
      || run.triggering_actor?.id !== expectedActor.id
    ))
    || createdAt === null
    || startedAt === null
    || updatedAt === null
    || evidenceFinishedAt === null
    || createdAt > startedAt
    || startedAt > evidenceFinishedAt
    || evidenceFinishedAt > updatedAt
  ) {
    return Object.freeze({ valid: false, run });
  }
  return Object.freeze({ valid: true, run });
}

export async function resolveReusableArchiveComments(comments, expectations, token, {
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!Array.isArray(comments)) fail("SEO_HEALTH_ARCHIVE_LOOKUP_INVALID");
  const matches = [];
  for (const comment of comments) {
    let resolved;
    try {
      resolved = resolveExistingArchive([comment], expectations);
    } catch {
      // A stale or malformed historical comment cannot prevent a later
      // successful attempt from becoming the canonical reusable receipt.
      continue;
    }
    if (!resolved) continue;
    const inspected = await inspectExactActionsRun(fetchImpl, resolved.evidence, token, {
      requireSuccess: true,
      allowedEvents: expectations.runKind === "canary"
        ? ["schedule"]
        : ["schedule", "workflow_dispatch"],
    });
    if (!inspected.valid) continue;
    try {
      validateCommentRunWindow(comment, inspected.run, resolved.evidence);
    } catch {
      // An edited or reposted body from an otherwise successful attempt is
      // not reusable evidence and must not block a fresh canonical comment.
      continue;
    }
    matches.push(resolved);
  }
  if (matches.length > 1) fail("SEO_HEALTH_ARCHIVE_VALID_DUPLICATE");
  return matches[0] || null;
}

async function fetchExactActionsRun(fetchImpl, evidence, token, options = {}) {
  const inspected = await inspectExactActionsRun(fetchImpl, evidence, token, options);
  if (!inspected.valid) fail("SEO_HEALTH_CANARY_RECEIPT_RUN_PROVENANCE_INVALID");
  return inspected.run;
}

export function validateCommentRunWindow(comment, run, evidence) {
  const commentCreatedAt = parsedGithubTime(comment?.created_at);
  const commentUpdatedAt = parsedGithubTime(comment?.updated_at);
  const runStartedAt = parsedGithubTime(run?.run_started_at);
  const runUpdatedAt = parsedGithubTime(run?.updated_at);
  const evidenceFinishedAt = parsedIsoTime(evidence.finishedAt || evidence.detectedAt);
  // GitHub exposes these API timestamps at whole-second precision. The 999 ms
  // tolerance accounts only for that truncation; it does not widen the run.
  const precisionToleranceMs = 999;
  const archiveRecoveryWindowMs = 24 * 60 * 60 * 1000;
  if (
    commentCreatedAt === null
    || commentUpdatedAt === null
    || runStartedAt === null
    || runUpdatedAt === null
    || evidenceFinishedAt === null
    || commentCreatedAt !== commentUpdatedAt
    || runStartedAt > commentCreatedAt + precisionToleranceMs
    || evidenceFinishedAt > commentCreatedAt + precisionToleranceMs
    || commentCreatedAt - evidenceFinishedAt > archiveRecoveryWindowMs
    || commentCreatedAt > runUpdatedAt + precisionToleranceMs
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_COMMENT_RUN_WINDOW_INVALID");
  }
}

async function verifyCheckpointHistory(config, fetchImpl, githubToken) {
  if (!isRecord(config.checkpointHistory)) {
    fail("SEO_HEALTH_CHECKPOINT_HISTORY_INVALID");
  }
  let checked = 0;
  for (const [scheduledDate, entry] of Object.entries(config.checkpointHistory)) {
    if (!isRecord(entry) || config.checkpointCalendar?.[scheduledDate] !== entry.checkpointId) {
      fail("SEO_HEALTH_CHECKPOINT_HISTORY_INVALID");
    }
    const comment = await fetchExactComment(fetchImpl, entry, githubToken);
    if (typeof comment.body !== "string" || !digestMatches(comment.body, entry.commentBodySha256)) {
      fail("SEO_HEALTH_CHECKPOINT_HISTORY_BODY_DIGEST_MISMATCH");
    }
    if (entry.status === "archived") {
      let resolved;
      try {
        resolved = resolveExistingArchive([comment], {
          schemaVersion: config.schemaVersion,
          contractVersion: config.contractVersion,
          scope: config.scope,
          timezone: config.timezone,
          checkpointId: entry.checkpointId,
          scheduledDate,
          runKind: "checkpoint",
          deploymentFingerprint: entry.deploymentFingerprint,
          maxDurationMs: config.bounds.internalDeadlineMs,
          githubSha: entry.githubSha,
          repository: CANARY_ARCHIVE_REPOSITORY,
          issueNumber: CANARY_ARCHIVE_ISSUE_NUMBER,
          archiveSignature: config.archiveSignature,
        });
      } catch {
        fail("SEO_HEALTH_CHECKPOINT_HISTORY_ARCHIVE_INVALID");
      }
      if (
        !resolved
        || resolved.evidence.finishedAt !== entry.finishedAt
        || resolved.evidence.evidenceDigest !== entry.evidenceDigest
        || resolved.evidence.healthSourceDigest !== entry.healthSourceDigest
      ) {
        fail("SEO_HEALTH_CHECKPOINT_HISTORY_ARCHIVE_INVALID");
      }
      const run = await fetchExactActionsRun(fetchImpl, resolved.evidence, githubToken, {
        allowedEvents: ["schedule", "workflow_dispatch"],
      });
      validateCommentRunWindow(comment, run, resolved.evidence);
    } else if (entry.status === "missed") {
      let resolved;
      try {
        resolved = resolveExistingIncident([comment], {
          checkpointId: entry.checkpointId,
          scheduledDate,
          timezone: config.timezone,
          githubSha: entry.githubSha,
          repository: CANARY_ARCHIVE_REPOSITORY,
          issueNumber: CANARY_ARCHIVE_ISSUE_NUMBER,
          archiveSignature: config.archiveSignature,
        });
      } catch {
        fail("SEO_HEALTH_CHECKPOINT_HISTORY_INCIDENT_INVALID");
      }
      if (
        !resolved
        || resolved.incident.detectedAt !== entry.detectedAt
        || resolved.incident.reasonCode !== entry.reasonCode
      ) {
        fail("SEO_HEALTH_CHECKPOINT_HISTORY_INCIDENT_INVALID");
      }
      const recoveredPastDate = MISSED_RECOVERY_REASONS.has(resolved.incident.reasonCode);
      const run = await fetchExactActionsRun(fetchImpl, resolved.incident, githubToken, recoveredPastDate ? {
        requireSuccess: true,
        allowedEvents: ["workflow_dispatch"],
        expectedWorkflowName: MISSED_RECOVERY_WORKFLOW_NAME,
        expectedWorkflowPath: MISSED_RECOVERY_WORKFLOW_PATH,
        expectedActor: { login: "willrapuano", id: 200251753 },
      } : {
        requireSuccess: false,
        allowedEvents: ["schedule", "workflow_dispatch"],
      });
      validateCommentRunWindow(comment, run, resolved.incident);
    } else {
      fail("SEO_HEALTH_CHECKPOINT_HISTORY_INVALID");
    }
    checked += 1;
  }
  return checked;
}

/**
 * Prove that permanent rollout is bound to one exact, canonical, public canary
 * archive. Disabled returns before any fetch. Canary authenticates any elapsed
 * checkpoint-history references but has no canary receipt of its own.
 */
export async function verifyConfiguredCanaryReceipt(config, {
  fetchImpl = globalThis.fetch,
  githubToken = process.env.GITHUB_TOKEN,
  currentHealthSourceDigest,
} = {}) {
  if (!isRecord(config) || !["disabled", "canary", "permanent"].includes(config.rolloutPhase)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_CONFIG_INVALID");
  }
  if (config.rolloutPhase === "disabled") {
    if (config.canaryReceipt !== null) {
      fail("SEO_HEALTH_CANARY_RECEIPT_UNEXPECTED");
    }
    return Object.freeze({ checked: false, phase: "disabled" });
  }
  if (config.rolloutPhase === "canary") {
    if (config.canaryReceipt !== null) {
      fail("SEO_HEALTH_CANARY_RECEIPT_UNEXPECTED");
    }
    const historicalEvidenceChecked = Object.keys(config.checkpointHistory || {}).length === 0
      ? 0
      : await verifyCheckpointHistory(config, fetchImpl, githubToken);
    return Object.freeze({ checked: false, phase: "canary", historicalEvidenceChecked });
  }

  const receipt = validatePermanentConfig(config);
  const sourceDigest = currentHealthSourceDigest || await computeSeoHealthSourceDigest();
  if (!hexDigestEqual(sourceDigest, receipt.healthSourceDigest)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_SOURCE_MISMATCH");
  }
  const comment = await fetchExactComment(fetchImpl, receipt, githubToken);
  if (typeof comment.body !== "string" || !digestMatches(comment.body, receipt.commentBodySha256)) {
    fail("SEO_HEALTH_CANARY_RECEIPT_BODY_DIGEST_MISMATCH");
  }

  let resolved;
  try {
    resolved = resolveExistingArchive([comment], {
      schemaVersion: config.schemaVersion,
      contractVersion: config.contractVersion,
      scope: config.scope,
      timezone: config.timezone,
      checkpointId: receipt.checkpointId,
      scheduledDate: receipt.scheduledDate,
      runKind: "canary",
      deploymentFingerprint: receipt.deploymentFingerprint,
      maxDurationMs: config.bounds.internalDeadlineMs,
      githubSha: receipt.githubSha,
      repository: CANARY_ARCHIVE_REPOSITORY,
      issueNumber: CANARY_ARCHIVE_ISSUE_NUMBER,
      archiveSignature: config.archiveSignature,
    });
  } catch {
    fail("SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_INVALID");
  }
  if (!resolved) {
    fail("SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_UNTRUSTED");
  }
  if (
    resolved.evidence.runKind !== "canary"
    || resolved.evidence.checkpointId !== receipt.checkpointId
    || resolved.evidence.scheduledDate !== receipt.scheduledDate
    || resolved.evidence.deploymentFingerprint !== receipt.deploymentFingerprint
    || resolved.evidence.evidenceDigest !== receipt.evidenceDigest
    || resolved.evidence.healthSourceDigest !== receipt.healthSourceDigest
    || resolved.evidence.finishedAt !== receipt.finishedAt
    || resolved.evidence.githubSha !== receipt.githubSha
  ) {
    fail("SEO_HEALTH_CANARY_RECEIPT_EVIDENCE_MISMATCH");
  }
  const run = await fetchExactActionsRun(fetchImpl, resolved.evidence, githubToken);
  validateCommentRunWindow(comment, run, resolved.evidence);
  const historicalEvidenceChecked = await verifyCheckpointHistory(config, fetchImpl, githubToken);

  return Object.freeze({
    checked: true,
    phase: "permanent",
    repository: CANARY_ARCHIVE_REPOSITORY,
    issueNumber: CANARY_ARCHIVE_ISSUE_NUMBER,
    commentId: receipt.commentId,
    commentUrl: resolved.url,
    commentBodySha256: receipt.commentBodySha256,
    healthSourceDigest: receipt.healthSourceDigest,
    githubSha: receipt.githubSha,
    githubRunId: resolved.evidence.githubRunId,
    githubRunAttempt: resolved.evidence.githubRunAttempt,
    githubRunUrl: run.html_url,
    archiveSignatureKeyId: config.archiveSignature.keyId,
    historicalEvidenceChecked,
  });
}
