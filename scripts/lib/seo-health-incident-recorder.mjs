import { createHash } from "node:crypto";
import {
  buildSignedIncidentComment,
  resolveExistingIncident,
} from "./seo-health-evidence-archive.mjs";
import {
  inspectExactActionsRun,
  validateCommentRunWindow,
} from "./seo-health-canary-receipt.mjs";

export const SEO_HEALTH_REPOSITORY = "willrapuano/dmvtitleguy";
export const SEO_HEALTH_ARCHIVE_ISSUE = 47;
export const SEO_HEALTH_RECOVERY_WORKFLOW = "SEO operational health missed-checkpoint recovery";
export const SEO_HEALTH_RECOVERY_WORKFLOW_PATH = ".github/workflows/seo-operational-health-recovery.yml";
export const SEO_HEALTH_WORKFLOW = "SEO operational health";
export const SEO_HEALTH_WORKFLOW_PATH = ".github/workflows/seo-operational-health.yml";
export const SEO_HEALTH_OWNER_LOGIN = "willrapuano";
export const SEO_HEALTH_OWNER_ID = "200251753";

const INCIDENT_MARKER = "seo-operational-health-incident-v1";
const RECOVERY_REASON_CODES = new Set([
  "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  "SEO_HEALTH_ROLLOUT_CANARY_CHECKPOINT_MISSED",
  "SEO_HEALTH_ROLLOUT_PERMANENT_CHECKPOINT_MISSED",
]);
const API_ROOT = `https://api.github.com/repos/${SEO_HEALTH_REPOSITORY}`;
const MAX_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;
const FORBIDDEN_INCIDENT_CREDENTIALS = Object.freeze([
  "SEO_HEALTH_ATTESTATION_SECRET",
  "SEO_HEALTH_VERCEL_CONTROL_TOKEN",
  "SEO_HEALTH_ATTESTATION_BUNDLE",
  "SEO_HEALTH_TERMINAL_BUNDLE",
  "SEO_HEALTH_TURSO_DATABASE_URL",
  "SEO_HEALTH_TURSO_AUTH_TOKEN",
  "SEO_HEALTH_GHL_READ_TOKEN",
  "TURSO_AUTH_TOKEN",
  "GHL_PRIVATE_INTEGRATION_TOKEN",
  "CRON_SECRET",
]);

export class SeoHealthIncidentRecorderError extends Error {
  constructor(code) {
    super(code);
    this.name = "SeoHealthIncidentRecorderError";
    this.code = code;
  }
}

function fail(code) {
  throw new SeoHealthIncidentRecorderError(code);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function tokenHeaders(token) {
  if (typeof token !== "string" || token.length < 20 || token.length > 512 || /[\r\n]/.test(token)) {
    fail("SEO_HEALTH_INCIDENT_GITHUB_TOKEN_INVALID");
  }
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "dmvtitleguy-seo-health-incident-recorder",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function readBoundedBody(response, code) {
  const reader = response?.body?.getReader?.();
  if (!reader) fail(code);
  const chunks = [];
  let total = 0;
  let tooLarge = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!(value instanceof Uint8Array)) fail(code);
      total += value.byteLength;
      if (total > MAX_BYTES) {
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
    if (error instanceof SeoHealthIncidentRecorderError) throw error;
    fail(code);
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Releasing a cancelled or errored stream is best-effort cleanup.
    }
  }
  if (tooLarge || total === 0) fail(code);
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function boundedJson(fetchImpl, url, options, code) {
  let response;
  try {
    response = await fetchImpl(url, {
      ...options,
      redirect: "error",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    fail(code);
  }
  if (!response || !response.ok || response.url !== url) fail(code);
  const contentType = response.headers?.get?.("content-type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) fail(code);
  const declared = response.headers?.get?.("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BYTES)) fail(code);
  const bytes = await readBoundedBody(response, code);
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    fail(code);
  }
}

export function assertIncidentCredentialIsolation(env = process.env) {
  if (FORBIDDEN_INCIDENT_CREDENTIALS.some((name) => Object.hasOwn(env, name))) {
    fail("SEO_HEALTH_INCIDENT_FORBIDDEN_CREDENTIAL_PRESENT");
  }
}

export function assertRecoveryWorkflowContext(env = process.env) {
  const expectedRef = `refs/heads/main`;
  const expectedWorkflowRef = `${SEO_HEALTH_REPOSITORY}/${SEO_HEALTH_RECOVERY_WORKFLOW_PATH}@${expectedRef}`;
  if (
    env.GITHUB_ACTIONS !== "true"
    || env.GITHUB_REPOSITORY !== SEO_HEALTH_REPOSITORY
    || env.GITHUB_REF !== expectedRef
    || env.GITHUB_REF_NAME !== "main"
    || env.GITHUB_WORKFLOW_REF !== expectedWorkflowRef
    || env.GITHUB_WORKFLOW !== SEO_HEALTH_RECOVERY_WORKFLOW
    || env.GITHUB_EVENT_NAME !== "workflow_dispatch"
    || env.GITHUB_ACTOR !== SEO_HEALTH_OWNER_LOGIN
    || env.GITHUB_ACTOR_ID !== SEO_HEALTH_OWNER_ID
    || !/^[a-f0-9]{40}$/.test(env.GITHUB_SHA || "")
    || !/^[1-9]\d{0,19}$/.test(env.GITHUB_RUN_ID || "")
    || !/^[1-9]\d{0,19}$/.test(env.GITHUB_RUN_ATTEMPT || "")
  ) fail("SEO_HEALTH_RECOVERY_WORKFLOW_IDENTITY_INVALID");
  return Object.freeze({
    sha: env.GITHUB_SHA,
    runId: env.GITHUB_RUN_ID,
    runAttempt: env.GITHUB_RUN_ATTEMPT,
  });
}

export async function verifyProtectedMainRecoveryRun(github, token, {
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== "function") fail("SEO_HEALTH_RECOVERY_FETCH_UNAVAILABLE");
  const headers = tokenHeaders(token);
  const runUrl = `${API_ROOT}/actions/runs/${github.runId}/attempts/${github.runAttempt}`;
  const branchUrl = `${API_ROOT}/branches/main`;
  const repositoryUrl = API_ROOT;
  const [run, branch, repository] = await Promise.all([
    boundedJson(fetchImpl, runUrl, { method: "GET", headers }, "SEO_HEALTH_RECOVERY_RUN_INVALID"),
    boundedJson(fetchImpl, branchUrl, { method: "GET", headers }, "SEO_HEALTH_RECOVERY_BRANCH_INVALID"),
    boundedJson(fetchImpl, repositoryUrl, { method: "GET", headers }, "SEO_HEALTH_RECOVERY_REPOSITORY_INVALID"),
  ]);
  if (
    run?.id !== Number(github.runId)
    || run?.run_attempt !== Number(github.runAttempt)
    || run?.name !== SEO_HEALTH_RECOVERY_WORKFLOW
    || run?.path !== SEO_HEALTH_RECOVERY_WORKFLOW_PATH
    || run?.event !== "workflow_dispatch"
    || !["queued", "in_progress"].includes(run?.status)
    || run?.conclusion !== null
    || run?.head_branch !== "main"
    || run?.head_sha !== github.sha
    || run?.url !== `${API_ROOT}/actions/runs/${github.runId}`
    || run?.html_url !== `https://github.com/${SEO_HEALTH_REPOSITORY}/actions/runs/${github.runId}`
    || run?.repository?.full_name !== SEO_HEALTH_REPOSITORY
    || run?.head_repository?.full_name !== SEO_HEALTH_REPOSITORY
    || run?.head_commit?.id !== github.sha
    || run?.actor?.login !== SEO_HEALTH_OWNER_LOGIN
    || String(run?.actor?.id) !== SEO_HEALTH_OWNER_ID
    || run?.triggering_actor?.login !== SEO_HEALTH_OWNER_LOGIN
    || String(run?.triggering_actor?.id) !== SEO_HEALTH_OWNER_ID
    || branch?.name !== "main"
    || branch?.protected !== true
    || branch?.commit?.sha !== github.sha
    || repository?.full_name !== SEO_HEALTH_REPOSITORY
    || repository?.default_branch !== "main"
    || repository?.private !== false
  ) fail("SEO_HEALTH_RECOVERY_PROVENANCE_INVALID");
  return Object.freeze({ protected: true, runUrl: run.html_url });
}

function incidentFromMarker(body) {
  if (typeof body !== "string") return null;
  const line = body.split("\n", 1)[0];
  const match = new RegExp(`^<!-- ${INCIDENT_MARKER}:([A-Za-z0-9_-]+) -->$`).exec(line);
  if (!match) return null;
  try {
    const bytes = Buffer.from(match[1], "base64url");
    if (bytes.toString("base64url") !== match[1]) return null;
    const value = JSON.parse(bytes.toString("utf8"));
    return isRecord(value) ? value : null;
  } catch {
    return null;
  }
}

async function listIssueComments(token, fetchImpl) {
  const headers = tokenHeaders(token);
  const comments = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = `${API_ROOT}/issues/${SEO_HEALTH_ARCHIVE_ISSUE}/comments?per_page=100&page=${page}`;
    const batch = await boundedJson(fetchImpl, url, { method: "GET", headers }, "SEO_HEALTH_INCIDENT_COMMENTS_INVALID");
    if (!Array.isArray(batch)) fail("SEO_HEALTH_INCIDENT_COMMENTS_INVALID");
    comments.push(...batch);
    if (batch.length < 100) return comments;
  }
  fail("SEO_HEALTH_INCIDENT_COMMENTS_LIMIT_EXCEEDED");
}

function expectations(config, incident, githubSha) {
  return {
    checkpointId: incident.checkpointId,
    scheduledDate: incident.scheduledDate,
    timezone: config.timezone,
    githubSha,
    repository: SEO_HEALTH_REPOSITORY,
    issueNumber: SEO_HEALTH_ARCHIVE_ISSUE,
    archiveSignature: config.archiveSignature,
  };
}

function historyReference(comment, incident) {
  return Object.freeze({
    status: "missed",
    checkpointId: incident.checkpointId,
    scheduledDate: incident.scheduledDate,
    detectedAt: incident.detectedAt,
    reasonCode: incident.reasonCode,
    commentId: comment.id,
    commentBodySha256: createHash("sha256").update(comment.body, "utf8").digest("hex"),
    githubSha: incident.githubSha,
  });
}

async function reusableIncidentAttempt(comment, candidate, requested, githubToken, fetchImpl) {
  const recoveryIncident = RECOVERY_REASON_CODES.has(candidate.reasonCode);
  const sameCurrentAttempt = candidate.githubRunId === requested.githubRunId
    && candidate.githubRunAttempt === requested.githubRunAttempt
    && candidate.githubSha === requested.githubSha;
  // Archive and fallback run in the same failed checkpoint attempt. The
  // archive can write the incident before fallback executes, while the exact
  // attempt is necessarily still in progress. Reuse is safe because fallback
  // deliberately leaves that same attempt unsuccessful.
  if (sameCurrentAttempt && !recoveryIncident) return true;

  const inspected = await inspectExactActionsRun(fetchImpl, candidate, githubToken, recoveryIncident ? {
    requireSuccess: true,
    allowedEvents: ["workflow_dispatch"],
    expectedWorkflowName: SEO_HEALTH_RECOVERY_WORKFLOW,
    expectedWorkflowPath: SEO_HEALTH_RECOVERY_WORKFLOW_PATH,
    expectedActor: { login: SEO_HEALTH_OWNER_LOGIN, id: Number(SEO_HEALTH_OWNER_ID) },
  } : {
    requireSuccess: false,
    allowedEvents: ["schedule", "workflow_dispatch"],
    expectedWorkflowName: SEO_HEALTH_WORKFLOW,
    expectedWorkflowPath: SEO_HEALTH_WORKFLOW_PATH,
  });
  if (!inspected.valid) return false;
  try {
    validateCommentRunWindow(comment, inspected.run, candidate);
    return true;
  } catch {
    return false;
  }
}

export async function recordSignedIncident(config, incident, {
  githubToken,
  privateKeyPkcs8Base64,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== "function") fail("SEO_HEALTH_INCIDENT_FETCH_UNAVAILABLE");
  const comments = await listIssueComments(githubToken, fetchImpl);
  const matches = [];
  for (const comment of comments) {
    const candidate = incidentFromMarker(comment?.body);
    if (
      candidate?.checkpointId !== incident.checkpointId
      || candidate?.scheduledDate !== incident.scheduledDate
    ) continue;
    let resolved;
    try {
      resolved = resolveExistingIncident([comment], expectations(config, incident, candidate.githubSha));
    } catch {
      fail("SEO_HEALTH_INCIDENT_EXISTING_INVALID");
    }
    if (
      resolved
      && await reusableIncidentAttempt(comment, resolved.incident, incident, githubToken, fetchImpl)
    ) matches.push({ comment, incident: resolved.incident, url: resolved.url });
  }
  if (matches.length > 1) fail("SEO_HEALTH_INCIDENT_DUPLICATE");
  if (matches.length === 1) {
    return Object.freeze({
      created: false,
      url: matches[0].url,
      history: historyReference(matches[0].comment, matches[0].incident),
    });
  }

  const body = buildSignedIncidentComment(incident, {
    ...expectations(config, incident, incident.githubSha),
    privateKeyPkcs8Base64,
  });
  const createUrl = `${API_ROOT}/issues/${SEO_HEALTH_ARCHIVE_ISSUE}/comments`;
  const created = await boundedJson(fetchImpl, createUrl, {
    method: "POST",
    headers: { ...tokenHeaders(githubToken), "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  }, "SEO_HEALTH_INCIDENT_CREATE_FAILED");
  let resolved;
  try {
    resolved = resolveExistingIncident([created], expectations(config, incident, incident.githubSha));
  } catch {
    fail("SEO_HEALTH_INCIDENT_CREATED_INVALID");
  }
  if (!resolved || created.body !== body) fail("SEO_HEALTH_INCIDENT_CREATED_INVALID");
  return Object.freeze({
    created: true,
    url: resolved.url,
    history: historyReference(created, resolved.incident),
  });
}
