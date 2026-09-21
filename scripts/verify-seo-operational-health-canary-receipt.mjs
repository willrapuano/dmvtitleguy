import assert from "node:assert/strict";
import { createHash, generateKeyPairSync } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  ARCHIVE_MARKER_VERSION,
  ARCHIVE_SIGNATURE_VERSION,
  buildSignedArchiveComment,
  buildSignedIncidentComment,
  validateTerminalEvidence,
} from "./lib/seo-health-evidence-archive.mjs";
import {
  SeoHealthCanaryReceiptError,
  resolveReusableArchiveComments,
  verifyConfiguredCanaryReceipt,
} from "./lib/seo-health-canary-receipt.mjs";
import { computeSeoHealthSourceDigest } from "./lib/seo-health-source-digest.mjs";

const BINDINGS = [
  "vercelSystem",
  "production",
  "targetProduction",
  "runtimeCredentialIsolation",
  "projectFingerprint",
  "gitSource",
  "gitCommit",
  "deployment",
  "productionHostname",
  "origin",
  "databaseFingerprint",
  "databaseCredentialFingerprint",
  "databaseCredentialExpiryMetadata",
  "databaseCredentialLifetimePolicy",
  "databaseCredentialFinalCheckpointCoverage",
  "databaseCredentialRuntimeValidity",
  "databaseReadScope",
  "ghlCredentialFingerprint",
  "ghlFingerprint",
  "ghlReadScope",
  "pipelineAndStage",
  "customFields",
  "githubDeploymentProvenance",
];
const commentId = 987654321;
const githubSha = "a".repeat(40);
const deploymentFingerprint = "b".repeat(64);
const evidenceDigest = "c".repeat(64);
const healthSourceDigest = await computeSeoHealthSourceDigest();
const githubToken = "ghs_fixture_read_only_token_1234567890";
process.env.GITHUB_TOKEN = githubToken;
const scheduledDate = "2026-09-01";
const checkpointId = `production-canary-${scheduledDate}`;
const archiveKeyPair = generateKeyPairSync("ed25519");
const archivePublicKey = archiveKeyPair.publicKey.export({ format: "der", type: "spki" });
const archivePrivateKey = archiveKeyPair.privateKey.export({ format: "der", type: "pkcs8" });
const archiveSignature = Object.freeze({
  algorithm: "Ed25519",
  keyId: createHash("sha256").update(archivePublicKey).digest("hex"),
  publicKeySpkiBase64: archivePublicKey.toString("base64"),
});
const archiveSigning = Object.freeze({
  ...archiveSignature,
  repository: "willrapuano/dmvtitleguy",
  issueNumber: 47,
  privateKeyPkcs8Base64: archivePrivateKey.toString("base64"),
});

const terminal = {
  schemaVersion: 1,
  event: "seo-operational-health.finish",
  contractVersion: "seo-operational-health-v1-test",
  scope: "live-operational-health-only",
  runKind: "canary",
  scheduledDate,
  checkpointId,
  startedAt: "2026-09-01T12:17:00.000Z",
  finishedAt: "2026-09-01T12:17:12.000Z",
  durationMs: 12_000,
  healthy: true,
  complete: true,
  httpOutcome: 200,
  evidenceDigest,
  healthSourceDigest,
  deploymentFingerprint,
  bindings: Object.fromEntries(BINDINGS.map((key) => [key, true])),
  incidentCodes: [],
  incidentDistinctBySeverity: { P0: 0, P1: 0 },
  seoChangeAuthorized: false,
  requests: { public: 9, ghl: 7 },
  githubRunId: "12345678901",
  githubRunAttempt: "1",
  githubSha,
};
const evidence = validateTerminalEvidence(terminal, {
  schemaVersion: terminal.schemaVersion,
  contractVersion: terminal.contractVersion,
  scope: terminal.scope,
  timezone: "America/New_York",
  checkpointId,
  scheduledDate,
  runKind: "canary",
  deploymentFingerprint,
  maxDurationMs: 120_000,
  githubRunId: terminal.githubRunId,
  githubRunAttempt: terminal.githubRunAttempt,
  githubSha,
});
const commentBody = buildSignedArchiveComment(evidence, archiveSigning);
assert.equal(ARCHIVE_MARKER_VERSION, "seo-operational-health-evidence-v2");
assert.equal(ARCHIVE_SIGNATURE_VERSION, "seo-operational-health-signature-v1");

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function fixtureConfig(phase = "permanent") {
  return {
    schemaVersion: 1,
    contractVersion: terminal.contractVersion,
    scope: terminal.scope,
    timezone: "America/New_York",
    rolloutPhase: phase,
    checkpointCalendar: { "2026-09-02": "technical-2026-09-02" },
    checkpointHistory: {},
    bounds: { internalDeadlineMs: 120_000 },
    archiveSignature,
    canaryReceipt: phase === "permanent" ? {
      checkpointId,
      scheduledDate,
      finishedAt: terminal.finishedAt,
      commentId,
      commentBodySha256: sha256(commentBody),
      deploymentFingerprint,
      evidenceDigest,
      healthSourceDigest,
      githubSha,
    } : null,
  };
}

function trustedComment(overrides = {}) {
  return {
    id: commentId,
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${commentId}`,
    html_url: `https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-${commentId}`,
    issue_url: "https://api.github.com/repos/willrapuano/dmvtitleguy/issues/47",
    user: { login: "github-actions[bot]", id: 41898282, type: "Bot" },
    body: commentBody,
    created_at: "2026-09-01T12:17:13Z",
    updated_at: "2026-09-01T12:17:13Z",
    ...overrides,
  };
}

function trustedRun(overrides = {}) {
  return {
    id: Number(terminal.githubRunId),
    run_attempt: Number(terminal.githubRunAttempt),
    name: "SEO operational health",
    path: ".github/workflows/seo-operational-health.yml",
    event: "schedule",
    status: "completed",
    conclusion: "success",
    head_branch: "main",
    head_sha: githubSha,
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}`,
    html_url: `https://github.com/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}`,
    repository: { full_name: "willrapuano/dmvtitleguy", private: false },
    head_repository: { full_name: "willrapuano/dmvtitleguy" },
    head_commit: { id: githubSha },
    created_at: "2026-09-01T12:16:00Z",
    run_started_at: "2026-09-01T12:16:30Z",
    updated_at: "2026-09-01T12:18:00Z",
    ...overrides,
  };
}

function trustedCommentFor(id, body, createdAt) {
  return trustedComment({
    id,
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${id}`,
    html_url: `https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-${id}`,
    body,
    created_at: createdAt,
    updated_at: createdAt,
  });
}

function trustedRunFor(evidenceItem, overrides = {}) {
  return trustedRun({
    id: Number(evidenceItem.githubRunId),
    run_attempt: Number(evidenceItem.githubRunAttempt),
    head_sha: evidenceItem.githubSha,
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${evidenceItem.githubRunId}`,
    html_url: `https://github.com/willrapuano/dmvtitleguy/actions/runs/${evidenceItem.githubRunId}`,
    head_commit: { id: evidenceItem.githubSha },
    ...overrides,
  });
}

function jsonResponse(value, overrides = {}) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  const bytes = Buffer.from(text, "utf8");
  const headers = new Map(Object.entries({
    "content-type": "application/json; charset=utf-8",
    "content-length": String(bytes.byteLength),
    ...(overrides.headers || {}),
  }).map(([key, item]) => [key.toLowerCase(), item]));
  return {
    status: 200,
    ok: true,
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${commentId}`,
    ...overrides,
    headers: { get: (name) => headers.get(name.toLowerCase()) ?? null },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }),
  };
}

async function expectCode(code, callback) {
  await assert.rejects(
    callback,
    (error) => error instanceof SeoHealthCanaryReceiptError && error.code === code,
    `expected ${code}`,
  );
}

let fetchCalls = 0;
const forbiddenFetch = async () => {
  fetchCalls += 1;
  throw new Error("network must not be called");
};
assert.deepEqual(
  await verifyConfiguredCanaryReceipt(fixtureConfig("disabled"), { fetchImpl: forbiddenFetch }),
  { checked: false, phase: "disabled" },
);
assert.deepEqual(
  await verifyConfiguredCanaryReceipt(fixtureConfig("canary"), { fetchImpl: forbiddenFetch }),
  { checked: false, phase: "canary", historicalEvidenceChecked: 0 },
);
assert.equal(fetchCalls, 0);
await expectCode("SEO_HEALTH_CANARY_RECEIPT_UNEXPECTED", () => verifyConfiguredCanaryReceipt({
  ...fixtureConfig("disabled"),
  canaryReceipt: fixtureConfig().canaryReceipt,
}, { fetchImpl: forbiddenFetch }));
assert.equal(fetchCalls, 0);

const observedRequests = [];
const success = await verifyConfiguredCanaryReceipt(fixtureConfig(), {
  fetchImpl: async (url, options) => {
    observedRequests.push({ url, options });
    return url.includes("/issues/comments/")
      ? jsonResponse(trustedComment())
      : jsonResponse(trustedRun(), { url });
  },
});
assert.deepEqual(success, {
  checked: true,
  phase: "permanent",
  repository: "willrapuano/dmvtitleguy",
  issueNumber: 47,
  commentId,
  commentUrl: `https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-${commentId}`,
  commentBodySha256: sha256(commentBody),
  githubSha,
  githubRunId: terminal.githubRunId,
  githubRunAttempt: terminal.githubRunAttempt,
  githubRunUrl: `https://github.com/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}`,
  healthSourceDigest,
  archiveSignatureKeyId: archiveSignature.keyId,
  historicalEvidenceChecked: 0,
});
assert.deepEqual(observedRequests.map(({ url }) => url), [
  `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${commentId}`,
  `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}/attempts/${terminal.githubRunAttempt}`,
]);
for (const { options } of observedRequests) {
  assert.equal(options.method, "GET");
  assert.equal(options.redirect, "error");
  assert.equal(options.headers.Accept, "application/vnd.github+json");
  assert.equal(options.headers["X-GitHub-Api-Version"], "2022-11-28");
  assert.equal(options.headers.Authorization, `Bearer ${githubToken}`);
  assert.ok(options.signal instanceof AbortSignal);
}

const archivedCheckpointTerminal = {
  ...terminal,
  runKind: "checkpoint",
  scheduledDate: "2026-09-02",
  checkpointId: "technical-2026-09-02",
  startedAt: "2026-09-02T12:17:00.000Z",
  finishedAt: "2026-09-02T12:17:12.000Z",
  githubRunId: "12345678902",
  githubSha: "d".repeat(40),
};
const archivedCheckpointEvidence = validateTerminalEvidence(archivedCheckpointTerminal, {
  schemaVersion: archivedCheckpointTerminal.schemaVersion,
  contractVersion: archivedCheckpointTerminal.contractVersion,
  scope: archivedCheckpointTerminal.scope,
  timezone: "America/New_York",
  checkpointId: archivedCheckpointTerminal.checkpointId,
  scheduledDate: archivedCheckpointTerminal.scheduledDate,
  runKind: "checkpoint",
  deploymentFingerprint,
  maxDurationMs: 120_000,
  githubRunId: archivedCheckpointTerminal.githubRunId,
  githubRunAttempt: archivedCheckpointTerminal.githubRunAttempt,
  githubSha: archivedCheckpointTerminal.githubSha,
});
const archivedCheckpointBody = buildSignedArchiveComment(archivedCheckpointEvidence, archiveSigning);
const invalidPriorArchiveTerminal = {
  ...archivedCheckpointTerminal,
  githubRunId: "12345678912",
  githubRunAttempt: "2",
};
const invalidPriorArchiveEvidence = validateTerminalEvidence(invalidPriorArchiveTerminal, {
  schemaVersion: invalidPriorArchiveTerminal.schemaVersion,
  contractVersion: invalidPriorArchiveTerminal.contractVersion,
  scope: invalidPriorArchiveTerminal.scope,
  timezone: "America/New_York",
  checkpointId: invalidPriorArchiveTerminal.checkpointId,
  scheduledDate: invalidPriorArchiveTerminal.scheduledDate,
  runKind: "checkpoint",
  deploymentFingerprint,
  maxDurationMs: 120_000,
  githubRunId: invalidPriorArchiveTerminal.githubRunId,
  githubRunAttempt: invalidPriorArchiveTerminal.githubRunAttempt,
  githubSha: invalidPriorArchiveTerminal.githubSha,
});
const invalidPriorArchiveBody = buildSignedArchiveComment(invalidPriorArchiveEvidence, archiveSigning);
const archiveReuseExpectations = {
  schemaVersion: archivedCheckpointTerminal.schemaVersion,
  contractVersion: archivedCheckpointTerminal.contractVersion,
  scope: archivedCheckpointTerminal.scope,
  timezone: "America/New_York",
  checkpointId: archivedCheckpointTerminal.checkpointId,
  scheduledDate: archivedCheckpointTerminal.scheduledDate,
  runKind: "checkpoint",
  deploymentFingerprint,
  maxDurationMs: 120_000,
  githubSha: archivedCheckpointTerminal.githubSha,
  repository: "willrapuano/dmvtitleguy",
  issueNumber: 47,
  archiveSignature,
};
const invalidPriorArchiveComment = trustedCommentFor(
  commentId + 10,
  invalidPriorArchiveBody,
  "2026-09-02T12:17:13Z",
);
const successfulArchiveComment = trustedCommentFor(
  commentId + 11,
  archivedCheckpointBody,
  "2026-09-02T12:17:13Z",
);
const repostedArchiveComment = trustedCommentFor(
  commentId + 12,
  archivedCheckpointBody,
  "2026-09-02T13:00:00Z",
);
for (const conclusion of ["cancelled", "failure"]) {
  const reusable = await resolveReusableArchiveComments([
    invalidPriorArchiveComment,
    repostedArchiveComment,
    successfulArchiveComment,
  ], archiveReuseExpectations, githubToken, {
    fetchImpl: async (url) => {
      if (url.includes(invalidPriorArchiveTerminal.githubRunId)) {
        return jsonResponse(trustedRunFor(invalidPriorArchiveEvidence, {
          status: "completed",
          conclusion,
          created_at: "2026-09-02T12:16:00Z",
          run_started_at: "2026-09-02T12:16:30Z",
          updated_at: "2026-09-02T12:18:00Z",
        }), { url });
      }
      return jsonResponse(trustedRunFor(archivedCheckpointEvidence, {
        created_at: "2026-09-02T12:16:00Z",
        run_started_at: "2026-09-02T12:16:30Z",
        updated_at: "2026-09-02T12:18:00Z",
      }), { url });
    },
  });
  assert.equal(
    reusable?.evidence.githubRunId,
    archivedCheckpointTerminal.githubRunId,
    `${conclusion} archive comments must not poison reuse of a later successful attempt`,
  );
}
const missedCheckpointIncident = {
  schemaVersion: 1,
  event: "seo-operational-health.incident",
  status: "missed",
  checkpointId: "technical-week-1-2026-09-09",
  scheduledDate: "2026-09-09",
  runKind: "checkpoint",
  detectedAt: "2026-09-09T13:00:00.000Z",
  reasonCode: "SEO_HEALTH_PROVIDER_EXECUTION_FAILED",
  githubRunId: "12345678903",
  githubRunAttempt: "1",
  githubSha: "e".repeat(40),
  seoChangeAuthorized: false,
};
const missedCheckpointBody = buildSignedIncidentComment(missedCheckpointIncident, {
  ...archiveSigning,
  checkpointId: missedCheckpointIncident.checkpointId,
  scheduledDate: missedCheckpointIncident.scheduledDate,
  timezone: "America/New_York",
  githubSha: missedCheckpointIncident.githubSha,
});
const archivedCommentId = commentId + 1;
const missedCommentId = commentId + 2;
const historyConfig = fixtureConfig();
historyConfig.checkpointCalendar = {
  "2026-09-02": archivedCheckpointTerminal.checkpointId,
  "2026-09-09": missedCheckpointIncident.checkpointId,
};
historyConfig.checkpointHistory = {
  "2026-09-02": {
    status: "archived",
    checkpointId: archivedCheckpointTerminal.checkpointId,
    scheduledDate: archivedCheckpointTerminal.scheduledDate,
    finishedAt: archivedCheckpointTerminal.finishedAt,
    commentId: archivedCommentId,
    commentBodySha256: sha256(archivedCheckpointBody),
    deploymentFingerprint,
    evidenceDigest,
    healthSourceDigest,
    githubSha: archivedCheckpointTerminal.githubSha,
  },
  "2026-09-09": {
    status: "missed",
    checkpointId: missedCheckpointIncident.checkpointId,
    scheduledDate: missedCheckpointIncident.scheduledDate,
    detectedAt: missedCheckpointIncident.detectedAt,
    reasonCode: missedCheckpointIncident.reasonCode,
    commentId: missedCommentId,
    commentBodySha256: sha256(missedCheckpointBody),
    githubSha: missedCheckpointIncident.githubSha,
  },
};
const historicalResponses = new Map([
  [
    `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${commentId}`,
    trustedComment(),
  ],
  [
    `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}/attempts/${terminal.githubRunAttempt}`,
    trustedRun(),
  ],
  [
    `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${archivedCommentId}`,
    trustedCommentFor(archivedCommentId, archivedCheckpointBody, "2026-09-02T12:17:13Z"),
  ],
  [
    `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${archivedCheckpointTerminal.githubRunId}/attempts/${archivedCheckpointTerminal.githubRunAttempt}`,
    trustedRunFor(archivedCheckpointTerminal, {
      created_at: "2026-09-02T12:16:00Z",
      run_started_at: "2026-09-02T12:16:30Z",
      updated_at: "2026-09-02T12:18:00Z",
    }),
  ],
  [
    `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${missedCommentId}`,
    trustedCommentFor(missedCommentId, missedCheckpointBody, "2026-09-09T13:00:01Z"),
  ],
  [
    `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${missedCheckpointIncident.githubRunId}/attempts/${missedCheckpointIncident.githubRunAttempt}`,
    trustedRunFor(missedCheckpointIncident, {
      conclusion: "failure",
      created_at: "2026-09-09T12:16:00Z",
      run_started_at: "2026-09-09T12:16:30Z",
      updated_at: "2026-09-09T13:01:00Z",
    }),
  ],
]);
const historySuccess = await verifyConfiguredCanaryReceipt(historyConfig, {
  fetchImpl: async (url) => {
    assert.ok(historicalResponses.has(url), `unexpected historical evidence URL: ${url}`);
    return jsonResponse(historicalResponses.get(url), { url });
  },
});
assert.equal(historySuccess.historicalEvidenceChecked, 2);

const recoveryIncident = {
  ...missedCheckpointIncident,
  detectedAt: "2026-09-11T13:00:00.000Z",
  reasonCode: "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  githubRunId: "12345678904",
  githubSha: "f".repeat(40),
};
const recoveryBody = buildSignedIncidentComment(recoveryIncident, {
  ...archiveSigning,
  checkpointId: recoveryIncident.checkpointId,
  scheduledDate: recoveryIncident.scheduledDate,
  timezone: "America/New_York",
  githubSha: recoveryIncident.githubSha,
});
const recoveryCommentId = commentId + 3;
const recoveryConfig = fixtureConfig("canary");
recoveryConfig.checkpointCalendar = { [recoveryIncident.scheduledDate]: recoveryIncident.checkpointId };
recoveryConfig.checkpointHistory = {
  [recoveryIncident.scheduledDate]: {
    status: "missed",
    checkpointId: recoveryIncident.checkpointId,
    scheduledDate: recoveryIncident.scheduledDate,
    detectedAt: recoveryIncident.detectedAt,
    reasonCode: recoveryIncident.reasonCode,
    commentId: recoveryCommentId,
    commentBodySha256: sha256(recoveryBody),
    githubSha: recoveryIncident.githubSha,
  },
};
const recoveryComment = trustedCommentFor(
  recoveryCommentId,
  recoveryBody,
  "2026-09-11T13:00:01Z",
);
const recoveryRun = trustedRunFor(recoveryIncident, {
  name: "SEO operational health missed-checkpoint recovery",
  path: ".github/workflows/seo-operational-health-recovery.yml",
  event: "workflow_dispatch",
  conclusion: "success",
  actor: { login: "willrapuano", id: 200251753 },
  triggering_actor: { login: "willrapuano", id: 200251753 },
  created_at: "2026-09-11T12:58:00Z",
  run_started_at: "2026-09-11T12:59:00Z",
  updated_at: "2026-09-11T13:01:00Z",
});
const recoverySuccess = await verifyConfiguredCanaryReceipt(recoveryConfig, {
  fetchImpl: async (url) => url.includes("/issues/comments/")
    ? jsonResponse(recoveryComment, { url })
    : jsonResponse(recoveryRun, { url }),
});
assert.deepEqual(recoverySuccess, {
  checked: false,
  phase: "canary",
  historicalEvidenceChecked: 1,
});
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_PROVENANCE_INVALID",
  () => verifyConfiguredCanaryReceipt(recoveryConfig, {
    fetchImpl: async (url) => url.includes("/issues/comments/")
      ? jsonResponse(recoveryComment, { url })
      : jsonResponse({
          ...recoveryRun,
          actor: { login: "other", id: 1 },
        }, { url }),
  }),
);

async function verifyWithComment(comment) {
  return verifyConfiguredCanaryReceipt(fixtureConfig(), {
    fetchImpl: async (url) => url.includes("/issues/comments/")
      ? jsonResponse(comment)
      : jsonResponse(trustedRun(), { url }),
  });
}
for (const changedComment of [
  { created_at: "2026-09-01T12:17:10Z", updated_at: "2026-09-01T12:17:10Z" },
  { created_at: "2026-09-01T12:17:13Z", updated_at: "2026-09-01T12:17:14Z" },
  { created_at: "2026-09-01T12:19:00Z", updated_at: "2026-09-01T12:19:00Z" },
  { created_at: "not-a-time", updated_at: "not-a-time" },
]) {
  await expectCode(
    "SEO_HEALTH_CANARY_RECEIPT_COMMENT_RUN_WINDOW_INVALID",
    () => verifyWithComment(trustedComment(changedComment)),
  );
}

const failWithResponse = async (code, response) => expectCode(
  code,
  () => verifyConfiguredCanaryReceipt(fixtureConfig(), { fetchImpl: async () => response }),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_FETCH_FAILED",
  () => verifyConfiguredCanaryReceipt(fixtureConfig(), { fetchImpl: async () => { throw new Error("offline"); } }),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_GITHUB_TOKEN_INVALID",
  () => verifyConfiguredCanaryReceipt(fixtureConfig(), { githubToken: "", fetchImpl: forbiddenFetch }),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_SOURCE_MISMATCH",
  () => verifyConfiguredCanaryReceipt(fixtureConfig(), {
    currentHealthSourceDigest: "0".repeat(64),
    fetchImpl: forbiddenFetch,
  }),
);
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_RESPONSE_INVALID", jsonResponse(trustedComment(), { status: 404, ok: false }));
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_RESPONSE_INVALID", jsonResponse(trustedComment(), { url: "https://example.invalid/redirect" }));
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_CONTENT_TYPE_INVALID", jsonResponse(trustedComment(), { headers: { "content-type": "text/html" } }));
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_BODY_TOO_LARGE", jsonResponse(trustedComment(), { headers: { "content-length": "262145" } }));
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_BODY_INVALID", jsonResponse("not-json"));
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_COMMENT_INVALID", jsonResponse([]));
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_COMMENT_INVALID", jsonResponse(trustedComment({ id: commentId + 1 })));

for (const user of [
  { login: "attacker", id: 41898282, type: "Bot" },
  { login: "github-actions[bot]", id: 1, type: "Bot" },
  { login: "github-actions[bot]", id: 41898282, type: "User" },
]) {
  await failWithResponse(
    "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_UNTRUSTED",
    jsonResponse(trustedComment({ user })),
  );
}
for (const location of [
  { issue_url: "https://api.github.com/repos/other/repo/issues/47" },
  { issue_url: "https://api.github.com/repos/willrapuano/dmvtitleguy/issues/48" },
  { url: `https://api.github.com/repos/other/repo/issues/comments/${commentId}` },
  { url: `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${commentId + 1}` },
  { html_url: `https://github.com/other/repo/issues/47#issuecomment-${commentId}` },
  { html_url: `https://github.com/willrapuano/dmvtitleguy/issues/48#issuecomment-${commentId}` },
  { html_url: `https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-${commentId + 1}` },
  { user: undefined },
]) {
  await failWithResponse(
    "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_UNTRUSTED",
    jsonResponse(trustedComment(location)),
  );
}
await failWithResponse(
  "SEO_HEALTH_CANARY_RECEIPT_BODY_DIGEST_MISMATCH",
  jsonResponse(trustedComment({ body: undefined })),
);
await failWithResponse(
  "SEO_HEALTH_CANARY_RECEIPT_BODY_TOO_LARGE",
  jsonResponse({ oversized: "x".repeat(262_145) }, { headers: { "content-length": undefined } }),
);
await failWithResponse(
  "SEO_HEALTH_CANARY_RECEIPT_BODY_TOO_LARGE",
  jsonResponse(trustedComment(), { headers: { "content-length": "not-a-number" } }),
);
await failWithResponse("SEO_HEALTH_CANARY_RECEIPT_BODY_INVALID", {
  status: 200,
  ok: true,
  url: `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${commentId}`,
  headers: { get: (name) => name.toLowerCase() === "content-type" ? "application/json" : null },
  body: new ReadableStream({
    start(controller) {
      controller.enqueue(Uint8Array.from([0xc3, 0x28]));
      controller.close();
    },
  }),
});

const changedBodyConfig = fixtureConfig();
changedBodyConfig.canaryReceipt.commentBodySha256 = "d".repeat(64);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_BODY_DIGEST_MISMATCH",
  () => verifyConfiguredCanaryReceipt(changedBodyConfig, { fetchImpl: async () => jsonResponse(trustedComment()) }),
);
const noncanonicalBody = `${commentBody}\nchanged human summary`;
const noncanonicalConfig = fixtureConfig();
noncanonicalConfig.canaryReceipt.commentBodySha256 = sha256(noncanonicalBody);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_INVALID",
  () => verifyConfiguredCanaryReceipt(noncanonicalConfig, {
    fetchImpl: async () => jsonResponse(trustedComment({ body: noncanonicalBody })),
  }),
);
const v1Body = commentBody.replace(ARCHIVE_MARKER_VERSION, "seo-operational-health-evidence-v1");
const v1Config = fixtureConfig();
v1Config.canaryReceipt.commentBodySha256 = sha256(v1Body);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_UNTRUSTED",
  () => verifyConfiguredCanaryReceipt(v1Config, {
    fetchImpl: async () => jsonResponse(trustedComment({ body: v1Body })),
  }),
);

const unsignedBody = commentBody.slice(0, commentBody.lastIndexOf("\n"));
const unsignedConfig = fixtureConfig();
unsignedConfig.canaryReceipt.commentBodySha256 = sha256(unsignedBody);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_INVALID",
  () => verifyConfiguredCanaryReceipt(unsignedConfig, {
    fetchImpl: async () => jsonResponse(trustedComment({ body: unsignedBody })),
  }),
);
const signatureLine = commentBody.split("\n").at(-1);
const signatureMatch = new RegExp(`^<!-- ${ARCHIVE_SIGNATURE_VERSION}:([A-Za-z0-9_-]+) -->$`).exec(signatureLine);
assert.ok(signatureMatch);
const signatureEnvelope = JSON.parse(Buffer.from(signatureMatch[1], "base64url").toString("utf8"));
const forgedSignatureBytes = Buffer.from(signatureEnvelope.signature, "base64url");
forgedSignatureBytes[0] ^= 1;
const forgedSignatureLine = `<!-- ${ARCHIVE_SIGNATURE_VERSION}:${Buffer.from(JSON.stringify({
  ...signatureEnvelope,
  signature: forgedSignatureBytes.toString("base64url"),
}), "utf8").toString("base64url")} -->`;
const forgedSignatureBody = `${unsignedBody}\n${forgedSignatureLine}`;
const forgedSignatureConfig = fixtureConfig();
forgedSignatureConfig.canaryReceipt.commentBodySha256 = sha256(forgedSignatureBody);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_INVALID",
  () => verifyConfiguredCanaryReceipt(forgedSignatureConfig, {
    fetchImpl: async () => jsonResponse(trustedComment({ body: forgedSignatureBody })),
  }),
);

const unrelatedKeyPair = generateKeyPairSync("ed25519");
const unrelatedPublicKey = unrelatedKeyPair.publicKey.export({ format: "der", type: "spki" });
const unrelatedSignatureConfig = fixtureConfig();
unrelatedSignatureConfig.archiveSignature = {
  algorithm: "Ed25519",
  keyId: createHash("sha256").update(unrelatedPublicKey).digest("hex"),
  publicKeySpkiBase64: unrelatedPublicKey.toString("base64"),
};
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_INVALID",
  () => verifyConfiguredCanaryReceipt(unrelatedSignatureConfig, {
    fetchImpl: async () => jsonResponse(trustedComment()),
  }),
);
const malformedSignatureConfig = fixtureConfig();
malformedSignatureConfig.archiveSignature = {
  algorithm: "Ed25519",
  keyId: "0".repeat(64),
  publicKeySpkiBase64: "not-base64",
};
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_SIGNATURE_CONFIG_INVALID",
  () => verifyConfiguredCanaryReceipt(malformedSignatureConfig, { fetchImpl: forbiddenFetch }),
);

for (const [field, value] of [
  ["checkpointId", "production-canary-2026-09-03"],
  ["scheduledDate", "2026-09-03"],
  ["finishedAt", "2026-09-01T12:17:13.000Z"],
  ["deploymentFingerprint", "e".repeat(64)],
  ["evidenceDigest", "f".repeat(64)],
  ["githubSha", "1".repeat(40)],
]) {
  const changed = fixtureConfig();
  changed.canaryReceipt[field] = value;
  const expectedCode = field === "checkpointId" || field === "scheduledDate"
    ? "SEO_HEALTH_CANARY_RECEIPT_SCHEMA_INVALID"
    : field === "deploymentFingerprint" || field === "githubSha"
      ? "SEO_HEALTH_CANARY_RECEIPT_ARCHIVE_INVALID"
      : "SEO_HEALTH_CANARY_RECEIPT_EVIDENCE_MISMATCH";
  await expectCode(
    expectedCode,
    () => verifyConfiguredCanaryReceipt(changed, { fetchImpl: async () => jsonResponse(trustedComment()) }),
  );
}

for (const invalidReceipt of [
  { ...fixtureConfig().canaryReceipt, extra: true },
  { ...fixtureConfig().canaryReceipt, githubSha: "short" },
  { ...fixtureConfig().canaryReceipt, commentId: 0 },
]) {
  await expectCode(
    "SEO_HEALTH_CANARY_RECEIPT_SCHEMA_INVALID",
    () => verifyConfiguredCanaryReceipt({
      ...fixtureConfig(),
      canaryReceipt: invalidReceipt,
    }, { fetchImpl: forbiddenFetch }),
  );
}

const wrongLocalDate = fixtureConfig();
wrongLocalDate.canaryReceipt.finishedAt = "2026-09-02T04:01:00.000Z";
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_TIMING_INVALID",
  () => verifyConfiguredCanaryReceipt(wrongLocalDate, { fetchImpl: forbiddenFetch }),
);

async function verifyWithRun(runOrError) {
  let call = 0;
  return verifyConfiguredCanaryReceipt(fixtureConfig(), {
    fetchImpl: async (url) => {
      call += 1;
      if (call === 1) return jsonResponse(trustedComment());
      if (runOrError instanceof Error) throw runOrError;
      return jsonResponse(runOrError, { url });
    },
  });
}

async function verifyWithRawRunResponse(response) {
  let call = 0;
  return verifyConfiguredCanaryReceipt(fixtureConfig(), {
    fetchImpl: async () => {
      call += 1;
      return call === 1 ? jsonResponse(trustedComment()) : response;
    },
  });
}

const exactRecoveryBoundary = await verifyConfiguredCanaryReceipt(fixtureConfig(), {
  fetchImpl: async (url) => url.includes("/issues/comments/")
    ? jsonResponse(trustedComment({
        created_at: "2026-09-02T12:17:12Z",
        updated_at: "2026-09-02T12:17:12Z",
      }))
    : jsonResponse(trustedRun({ updated_at: "2026-09-02T12:17:12Z" }), { url }),
});
assert.equal(exactRecoveryBoundary.checked, true, "the complete 24-hour archive window must remain usable");

await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_COMMENT_RUN_WINDOW_INVALID",
  () => verifyConfiguredCanaryReceipt(fixtureConfig(), {
    fetchImpl: async (url) => url.includes("/issues/comments/")
      ? jsonResponse(trustedComment({
          created_at: "2026-09-02T13:17:13Z",
          updated_at: "2026-09-02T13:17:13Z",
        }))
      : jsonResponse(trustedRun({ updated_at: "2026-09-02T14:17:13Z" }), { url }),
  }),
);

await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_FETCH_FAILED",
  () => verifyWithRun(new Error("actions API unavailable")),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_RESPONSE_INVALID",
  () => verifyWithRawRunResponse(jsonResponse(trustedRun(), { status: 404, ok: false })),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_RESPONSE_INVALID",
  () => verifyWithRawRunResponse(jsonResponse(trustedRun(), { url: "https://example.invalid/redirect" })),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_CONTENT_TYPE_INVALID",
  () => verifyWithRawRunResponse(jsonResponse(trustedRun(), {
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}/attempts/${terminal.githubRunAttempt}`,
    headers: { "content-type": "text/html" },
  })),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_TOO_LARGE",
  () => verifyWithRawRunResponse(jsonResponse(trustedRun(), {
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}/attempts/${terminal.githubRunAttempt}`,
    headers: { "content-length": "262145" },
  })),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_TOO_LARGE",
  () => verifyWithRawRunResponse(jsonResponse({ oversized: "x".repeat(262_145) }, {
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}/attempts/${terminal.githubRunAttempt}`,
    headers: { "content-length": undefined },
  })),
);
await expectCode(
  "SEO_HEALTH_CANARY_RECEIPT_RUN_BODY_INVALID",
  () => verifyWithRawRunResponse(jsonResponse("not-json", {
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/actions/runs/${terminal.githubRunId}/attempts/${terminal.githubRunAttempt}`,
  })),
);
for (const changedRun of [
  { id: Number(terminal.githubRunId) + 1 },
  { run_attempt: 2 },
  { name: "Other workflow" },
  { path: ".github/workflows/other.yml" },
  { event: "workflow_dispatch" },
  { status: "in_progress" },
  { conclusion: "failure" },
  { head_branch: "feature" },
  { head_sha: "d".repeat(40) },
  { url: `https://api.github.com/repos/other/repo/actions/runs/${terminal.githubRunId}` },
  { html_url: `https://github.com/other/repo/actions/runs/${terminal.githubRunId}` },
  { repository: { full_name: "other/repo", private: false } },
  { repository: { full_name: "willrapuano/dmvtitleguy", private: true } },
  { head_repository: { full_name: "other/repo" } },
  { head_commit: { id: "d".repeat(40) } },
  { run_started_at: "2026-09-01T12:17:13.000Z" },
  { updated_at: "2026-09-01T12:17:11.000Z" },
]) {
  await expectCode(
    "SEO_HEALTH_CANARY_RECEIPT_RUN_PROVENANCE_INVALID",
    () => verifyWithRun(trustedRun(changedRun)),
  );
}

const repositoryRoot = new URL("../", import.meta.url);
const workflow = await readFile(new URL(".github/workflows/seo-operational-health.yml", repositoryRoot), "utf8");
const ciWorkflow = await readFile(new URL(".github/workflows/ci.yml", repositoryRoot), "utf8");
const packageJson = JSON.parse(await readFile(new URL("package.json", repositoryRoot), "utf8"));
const productionGate = await readFile(new URL("scripts/verify-production-env.mjs", repositoryRoot), "utf8");
const scheduleJob = workflow.split("\n  pre_attestation:")[0];
assert.match(scheduleJob, /if:\s*steps\.schedule\.outputs\.due == 'true'/);
assert.match(scheduleJob, /run:\s*npm run checkpoint:seo-operational-health:verify-canary-receipt/);
assert.doesNotMatch(scheduleJob, /continue-on-error:\s*true/);
assert.ok(
  scheduleJob.indexOf("checkpoint:seo-operational-health:gate")
    < scheduleJob.indexOf("checkpoint:seo-operational-health:verify-canary-receipt"),
);
assert.match(workflow, /pre_attestation:[\s\S]*?needs:\s*schedule/);
assert.match(workflow, /provider:[\s\S]*?needs:\s*\[schedule, pre_attestation\]/);
assert.match(workflow, /archive:[\s\S]*?needs:\s*\[schedule, pre_attestation, provider\]/);
assert.match(
  workflow,
  /archive:[\s\S]*?if:\s*>-[\s\S]*?always\(\) &&[\s\S]*?needs\.schedule\.result == 'success' &&[\s\S]*?needs\.schedule\.outputs\.due == 'true'/,
);
const ciHeader = ciWorkflow.split("\njobs:")[0];
const configuredReceiptJobOffset = ciWorkflow.indexOf("\n  configured-receipt:");
const verifyJobOffset = ciWorkflow.indexOf("\n  verify:");
assert.ok(configuredReceiptJobOffset > 0, "CI must define a configured-receipt job");
assert.ok(verifyJobOffset > configuredReceiptJobOffset, "CI verify must follow configured-receipt");
const configuredReceiptJob = ciWorkflow.slice(configuredReceiptJobOffset, verifyJobOffset);
const verifyJob = ciWorkflow.slice(verifyJobOffset);
assert.match(ciHeader, /permissions:\s*\n\s+contents:\s*read/);
assert.doesNotMatch(ciHeader, /actions:\s*read|issues:\s*read/);
assert.match(configuredReceiptJob, /permissions:[\s\S]*?actions:\s*read[\s\S]*?contents:\s*read[\s\S]*?issues:\s*read/);
assert.match(
  configuredReceiptJob,
  /Authenticate configured SEO health receipts[\s\S]*?GITHUB_TOKEN:\s*\$\{\{ github\.token \}\}/,
);
assert.match(configuredReceiptJob, /verify:seo-operational-health:configured-receipt/);
assert.doesNotMatch(configuredReceiptJob, /npm\s+(?:ci|install)\b/);
assert.match(configuredReceiptJob, /actions\/checkout@11d5960a326750d5838078e36cf38b85af677262/);
assert.match(configuredReceiptJob, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/);
assert.match(configuredReceiptJob, /persist-credentials:\s*false/);
assert.match(verifyJob, /needs:\s*configured-receipt/);
assert.doesNotMatch(verifyJob, /GITHUB_TOKEN|actions:\s*read|issues:\s*read/);
assert.match(verifyJob, /actions\/checkout@11d5960a326750d5838078e36cf38b85af677262/);
assert.match(verifyJob, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/);
assert.match(verifyJob, /persist-credentials:\s*false/);
assert.doesNotMatch(ciWorkflow, /actions\/(?:checkout|setup-node)@v\d+/);
assert.match(
  packageJson.scripts["checkpoint:seo-operational-health:verify-canary-receipt"],
  /check-seo-operational-health-canary-receipt\.mjs/,
);
assert.equal(
  packageJson.scripts["verify:seo-operational-health:configured-receipt"],
  "node scripts/check-seo-operational-health-canary-receipt.mjs",
);
assert.equal(
  packageJson.scripts["verify:seo-operational-health:canary-receipt"],
  "node scripts/verify-seo-operational-health-canary-receipt.mjs",
);
assert.match(productionGate, /FORBIDDEN_SITE_HEALTH_VARIABLES[\s\S]*SEO_HEALTH_GITHUB_READ_TOKEN/);
assert.doesNotMatch(productionGate, /verifyConfiguredCanaryReceipt|githubToken|github\.com\/repos|api\.github\.com/);
assert.match(productionGate, /hasSeoHealthAttestationSecret/);
assert.match(productionGate, /rolloutPhase === "disabled"[\s\S]*!hasSeoHealthAttestationSecret \|\| seoHealthAttestationSecret\.length >= 32/);
assert.match(productionGate, /hasSeoHealthAttestationSecret && seoHealthAttestationSecret\.length >= 32/);

console.log("SEO operational-health canary receipt verification passed");
