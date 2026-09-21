import assert from "node:assert/strict";
import { createHash, generateKeyPairSync } from "node:crypto";
import {
  ARCHIVE_MARKER_VERSION,
  ARCHIVE_SIGNATURE_VERSION,
  INCIDENT_MARKER_VERSION,
  SeoHealthArchiveError,
  buildSignedIncidentComment,
  buildSignedArchiveComment,
  buildUnsignedArchiveComment,
  resolveExistingArchive,
  resolveExistingIncident,
  validateTerminalEvidence,
} from "./lib/seo-health-evidence-archive.mjs";

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

const bindingKeys = [
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

const expectations = {
  schemaVersion: 1,
  contractVersion: "seo-operational-health-v1",
  scope: "live-operational-health-only",
  timezone: "America/New_York",
  checkpointId: "technical-2026-09-02",
  scheduledDate: "2026-09-02",
  runKind: "checkpoint",
  deploymentFingerprint: "d".repeat(64),
  maxDurationMs: 180_000,
  githubRunId: "123456789012345678",
  githubRunAttempt: "1",
  githubSha: "a".repeat(40),
};

const terminal = {
  schemaVersion: 1,
  event: "seo-operational-health.finish",
  contractVersion: "seo-operational-health-v1",
  scope: "live-operational-health-only",
  runKind: "checkpoint",
  scheduledDate: "2026-09-02",
  checkpointId: "technical-2026-09-02",
  startedAt: "2026-09-02T12:17:00.000Z",
  finishedAt: "2026-09-02T12:17:12.000Z",
  durationMs: 12_000,
  healthy: true,
  complete: true,
  httpOutcome: 200,
  evidenceDigest: "b".repeat(64),
  healthSourceDigest: "e".repeat(64),
  deploymentFingerprint: "d".repeat(64),
  bindings: Object.fromEntries(bindingKeys.map((key) => [key, true])),
  incidentCodes: [],
  incidentDistinctBySeverity: { P0: 0, P1: 0 },
  seoChangeAuthorized: false,
  requests: { public: 9, ghl: 7 },
  githubRunId: "123456789012345678",
  githubRunAttempt: "1",
  githubSha: "a".repeat(40),
};

const archiveExpectations = {
  schemaVersion: expectations.schemaVersion,
  contractVersion: expectations.contractVersion,
  scope: expectations.scope,
  timezone: expectations.timezone,
  checkpointId: expectations.checkpointId,
  scheduledDate: expectations.scheduledDate,
  runKind: expectations.runKind,
  deploymentFingerprint: expectations.deploymentFingerprint,
  maxDurationMs: expectations.maxDurationMs,
  githubSha: expectations.githubSha,
  repository: "willrapuano/dmvtitleguy",
  issueNumber: 47,
  archiveSignature,
};

function clone(value) {
  return structuredClone(value);
}

function expectCode(code, callback) {
  assert.throws(
    callback,
    (error) => error instanceof SeoHealthArchiveError && error.code === code,
    `expected ${code}`,
  );
}

function markerFor(value) {
  const payload = Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  return `<!-- ${ARCHIVE_MARKER_VERSION}:${payload} -->`;
}

function trustedComment(id, body) {
  return {
    id,
    url: `https://api.github.com/repos/willrapuano/dmvtitleguy/issues/comments/${id}`,
    html_url: `https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-${id}`,
    issue_url: "https://api.github.com/repos/willrapuano/dmvtitleguy/issues/47",
    user: {
      login: "github-actions[bot]",
      id: 41898282,
      type: "Bot",
      unrelatedApiField: "permitted-but-untrusted",
    },
    body,
  };
}

const evidence = validateTerminalEvidence(terminal, expectations);
assert.deepEqual(evidence, terminal);
assert.notEqual(evidence, terminal);
assert.notEqual(evidence.bindings, terminal.bindings);
assert.equal(evidence.bindings.githubDeploymentProvenance, true);

// Unknown top-level data is rejected, never projected into a public archive.
expectCode("ARCHIVE_TERMINAL_SHAPE_INVALID", () => validateTerminalEvidence({
  ...terminal,
  debugSecret: "must-never-be-archived",
}, expectations));
const missingTopLevel = clone(terminal);
delete missingTopLevel.startedAt;
expectCode("ARCHIVE_TERMINAL_SHAPE_INVALID", () => validateTerminalEvidence(missingTopLevel, expectations));

expectCode("ARCHIVE_TERMINAL_IDENTITY_INVALID", () => validateTerminalEvidence({
  ...terminal,
  schemaVersion: 2,
}, expectations));
expectCode("ARCHIVE_TERMINAL_IDENTITY_INVALID", () => validateTerminalEvidence({
  ...terminal,
  githubRunId: "123456789012345679",
}, expectations));
expectCode("ARCHIVE_TERMINAL_IDENTITY_INVALID", () => validateTerminalEvidence({
  ...terminal,
  githubRunAttempt: "2",
}, expectations));
expectCode("ARCHIVE_TERMINAL_IDENTITY_INVALID", () => validateTerminalEvidence({
  ...terminal,
  githubSha: "c".repeat(40),
}, expectations));
expectCode("ARCHIVE_EXPECTATIONS_INVALID", () => validateTerminalEvidence(terminal, {
  ...expectations,
  githubRunId: "01",
}));
expectCode("ARCHIVE_EXPECTATIONS_INVALID", () => validateTerminalEvidence(terminal, {
  ...expectations,
  githubRunId: "1".repeat(21),
}));

expectCode("ARCHIVE_TERMINAL_OUTCOME_INVALID", () => validateTerminalEvidence({
  ...terminal,
  seoChangeAuthorized: true,
}, expectations));
expectCode("ARCHIVE_TERMINAL_OUTCOME_INVALID", () => validateTerminalEvidence({
  ...terminal,
  healthy: false,
}, expectations));
expectCode("ARCHIVE_TERMINAL_OUTCOME_INVALID", () => validateTerminalEvidence({
  ...terminal,
  evidenceDigest: "not-a-digest",
}, expectations));

expectCode("ARCHIVE_TERMINAL_TIMING_INVALID", () => validateTerminalEvidence({
  ...terminal,
  startedAt: "2026-09-01T23:59:59.000Z",
  durationMs: 43_213_000,
}, expectations));
expectCode("ARCHIVE_TERMINAL_TIMING_INVALID", () => validateTerminalEvidence({
  ...terminal,
  startedAt: "2026-09-02T12:17:13.000Z",
  durationMs: 0,
}, expectations));
expectCode("ARCHIVE_TERMINAL_TIMING_INVALID", () => validateTerminalEvidence({
  ...terminal,
  durationMs: 11_999,
}, expectations));
expectCode("ARCHIVE_TERMINAL_TIMING_INVALID", () => validateTerminalEvidence({
  ...terminal,
  finishedAt: "2026-09-02T12:20:01.000Z",
  durationMs: 181_000,
}, expectations));

const missingBinding = clone(terminal);
delete missingBinding.bindings.githubDeploymentProvenance;
expectCode("ARCHIVE_BINDINGS_INVALID", () => validateTerminalEvidence(missingBinding, expectations));
expectCode("ARCHIVE_BINDINGS_INVALID", () => validateTerminalEvidence({
  ...terminal,
  bindings: { ...terminal.bindings, unexpected: true },
}, expectations));
expectCode("ARCHIVE_BINDINGS_FAILED", () => validateTerminalEvidence({
  ...terminal,
  bindings: { ...terminal.bindings, githubDeploymentProvenance: false },
}, expectations));
expectCode("ARCHIVE_INCIDENTS_PRESENT", () => validateTerminalEvidence({
  ...terminal,
  incidentCodes: ["SEO_HEALTH_FIXTURE"],
}, expectations));
expectCode("ARCHIVE_INCIDENT_COUNTS_INVALID", () => validateTerminalEvidence({
  ...terminal,
  incidentDistinctBySeverity: { P0: 0, P1: 1 },
}, expectations));
expectCode("ARCHIVE_REQUEST_COUNTS_INVALID", () => validateTerminalEvidence({
  ...terminal,
  requests: { public: 0, ghl: 7 },
}, expectations));
expectCode("ARCHIVE_REQUEST_COUNTS_INVALID", () => validateTerminalEvidence({
  ...terminal,
  requests: { public: 9, ghl: 0 },
}, expectations));

const commentBody = buildSignedArchiveComment(evidence, archiveSigning);
const unsignedCommentBody = buildUnsignedArchiveComment(evidence);
const [markerLine] = commentBody.split("\n");
const markerMatch = new RegExp(`^<!-- ${ARCHIVE_MARKER_VERSION}:([A-Za-z0-9_-]+) -->$`).exec(markerLine);
assert.ok(markerMatch);
const markerEvidence = JSON.parse(Buffer.from(markerMatch[1], "base64url").toString("utf8"));
assert.deepEqual(markerEvidence, evidence);
assert.equal(commentBody.includes("SEO change authorized: `false`"), true);
assert.equal(commentBody.includes("GitHub run / attempt: `123456789012345678` / `1`"), true);
assert.equal(commentBody.includes("debugSecret"), false);
assert.equal(commentBody.includes("raw CRM"), false);
assert.equal(commentBody.startsWith(`${unsignedCommentBody}\n`), true);
assert.match(commentBody.split("\n").at(-1), new RegExp(`^<!-- ${ARCHIVE_SIGNATURE_VERSION}:`));

assert.equal(resolveExistingArchive([], archiveExpectations), null);
const archived = trustedComment(1001, commentBody);
assert.deepEqual(resolveExistingArchive([archived], archiveExpectations), {
  url: archived.html_url,
  evidence,
});

expectCode("ARCHIVE_SIGNATURE_MISSING", () => resolveExistingArchive([
  trustedComment(1010, unsignedCommentBody),
], archiveExpectations));
expectCode("ARCHIVE_SIGNATURE_BODY_INVALID", () => resolveExistingArchive([
  trustedComment(1011, commentBody.replace("checkpoint — accepted", "checkpoint — forged")),
], archiveExpectations));
const signatureLine = commentBody.split("\n").at(-1);
const signatureMatch = new RegExp(`^<!-- ${ARCHIVE_SIGNATURE_VERSION}:([A-Za-z0-9_-]+) -->$`).exec(signatureLine);
assert.ok(signatureMatch);
const signatureEnvelope = JSON.parse(Buffer.from(signatureMatch[1], "base64url").toString("utf8"));
const signatureBytes = Buffer.from(signatureEnvelope.signature, "base64url");
signatureBytes[0] ^= 1;
const forgedSignatureEnvelope = {
  ...signatureEnvelope,
  signature: signatureBytes.toString("base64url"),
};
const forgedSignatureLine = `<!-- ${ARCHIVE_SIGNATURE_VERSION}:${Buffer.from(
  JSON.stringify(forgedSignatureEnvelope),
  "utf8",
).toString("base64url")} -->`;
expectCode("ARCHIVE_SIGNATURE_INVALID", () => resolveExistingArchive([
  trustedComment(1012, `${unsignedCommentBody}\n${forgedSignatureLine}`),
], archiveExpectations));

const unrelatedKeyPair = generateKeyPairSync("ed25519");
const unrelatedPublic = unrelatedKeyPair.publicKey.export({ format: "der", type: "spki" });
const unrelatedPrivate = unrelatedKeyPair.privateKey.export({ format: "der", type: "pkcs8" });
const unrelatedSignature = {
  algorithm: "Ed25519",
  keyId: createHash("sha256").update(unrelatedPublic).digest("hex"),
  publicKeySpkiBase64: unrelatedPublic.toString("base64"),
};
expectCode("ARCHIVE_SIGNATURE_BODY_INVALID", () => resolveExistingArchive([archived], {
  ...archiveExpectations,
  archiveSignature: unrelatedSignature,
}));
expectCode("ARCHIVE_TERMINAL_OUTCOME_INVALID", () => validateTerminalEvidence({
  ...terminal,
  healthSourceDigest: "not-a-digest",
}, expectations));

// UTC has already rolled to September 3, but both timestamps are still on the
// scheduled September 2 date in America/New_York and must be accepted.
const easternLateTerminal = {
  ...terminal,
  startedAt: "2026-09-03T01:59:00.000Z",
  finishedAt: "2026-09-03T01:59:12.000Z",
};
assert.equal(validateTerminalEvidence(easternLateTerminal, expectations).scheduledDate, "2026-09-02");
expectCode("ARCHIVE_SIGNATURE_PRIVATE_KEY_INVALID", () => buildSignedArchiveComment(evidence, {
  ...archiveSigning,
  privateKeyPkcs8Base64: unrelatedPrivate.toString("base64"),
}));

const issue48Comment = {
  ...archived,
  issue_url: "https://api.github.com/repos/willrapuano/dmvtitleguy/issues/48",
  html_url: `https://github.com/willrapuano/dmvtitleguy/issues/48#issuecomment-${archived.id}`,
};
expectCode("ARCHIVE_SIGNATURE_INVALID", () => resolveExistingArchive([issue48Comment], {
  ...archiveExpectations,
  issueNumber: 48,
}));

// Forged bot markers and attacker-controlled floods are ignored before decode.
const untrustedFlood = Array.from({ length: 1_000 }, (_, index) => {
  const item = trustedComment(index + 2000, `<!-- ${ARCHIVE_MARKER_VERSION}:not+base64 -->`);
  item.user = { login: "attacker", id: 41898282, type: "Bot" };
  return item;
});
assert.equal(resolveExistingArchive(untrustedFlood, archiveExpectations), null);
for (const spoofedUser of [
  { login: "github-actions[bot]", id: 1, type: "Bot" },
  { login: "github-actions", id: 41898282, type: "Bot" },
  { login: "github-actions[bot]", id: 41898282, type: "User" },
]) {
  const spoof = trustedComment(3100, commentBody);
  spoof.user = spoofedUser;
  assert.equal(resolveExistingArchive([spoof], archiveExpectations), null);
}

// Exact repository, issue, comment API URL, and web URL are all required.
for (const changedLocation of [
  { issue_url: "https://api.github.com/repos/other/repo/issues/47" },
  { url: "https://api.github.com/repos/other/repo/issues/comments/1001" },
  { html_url: "https://github.com/other/repo/issues/47#issuecomment-1001" },
]) {
  assert.equal(resolveExistingArchive([{ ...archived, ...changedLocation }], archiveExpectations), null);
}

expectCode("ARCHIVE_MARKER_INVALID", () => resolveExistingArchive([
  trustedComment(1002, `<!-- ${ARCHIVE_MARKER_VERSION}:not+base64 -->`),
], archiveExpectations));

const falseGreen = clone(evidence);
falseGreen.bindings.githubDeploymentProvenance = false;
expectCode("ARCHIVE_BINDINGS_FAILED", () => resolveExistingArchive([
  trustedComment(1003, markerFor(falseGreen)),
], archiveExpectations));

const secretPoison = { ...evidence, debugSecret: "exfiltrate-me" };
expectCode("ARCHIVE_TERMINAL_SHAPE_INVALID", () => resolveExistingArchive([
  trustedComment(1004, markerFor(secretPoison)),
], archiveExpectations));

expectCode("ARCHIVE_SIGNATURE_MISSING", () => resolveExistingArchive([
  trustedComment(1005, `${commentBody}\nchanged human summary`),
], archiveExpectations));

const otherCheckpointTerminal = {
  ...terminal,
  checkpointId: "technical-2026-09-03",
  scheduledDate: "2026-09-03",
  startedAt: "2026-09-03T12:17:00.000Z",
  finishedAt: "2026-09-03T12:17:12.000Z",
};
const otherCheckpointEvidence = validateTerminalEvidence(otherCheckpointTerminal, {
  ...expectations,
  checkpointId: "technical-2026-09-03",
  scheduledDate: "2026-09-03",
});
assert.equal(resolveExistingArchive([
  trustedComment(1006, buildSignedArchiveComment(otherCheckpointEvidence, archiveSigning)),
], archiveExpectations), null);

expectCode("ARCHIVE_COMMENT_DUPLICATE", () => resolveExistingArchive([
  archived,
  trustedComment(1007, commentBody),
], archiveExpectations));

// A fresh rerun has different timestamps, run identity, and evidence digest,
// but must reuse the first trusted archive for this checkpoint.
const rerunTerminal = {
  ...terminal,
  startedAt: "2026-09-02T13:00:00.000Z",
  finishedAt: "2026-09-02T13:00:09.000Z",
  durationMs: 9_000,
  evidenceDigest: "c".repeat(64),
  githubRunId: "123456789012345999",
  githubRunAttempt: "2",
};
const rerunEvidence = validateTerminalEvidence(rerunTerminal, {
  ...expectations,
  githubRunId: rerunTerminal.githubRunId,
  githubRunAttempt: rerunTerminal.githubRunAttempt,
});
assert.notEqual(buildSignedArchiveComment(rerunEvidence, archiveSigning), commentBody);
assert.deepEqual(resolveExistingArchive([archived], archiveExpectations), {
  url: archived.html_url,
  evidence,
});

expectCode("ARCHIVE_EXPECTATIONS_INVALID", () => resolveExistingArchive([], {
  ...archiveExpectations,
  repository: "https://github.com/willrapuano/dmvtitleguy",
}));
expectCode("ARCHIVE_COMMENTS_INVALID", () => resolveExistingArchive({}, archiveExpectations));

const missedIncident = {
  schemaVersion: 1,
  event: "seo-operational-health.incident",
  status: "missed",
  checkpointId: expectations.checkpointId,
  scheduledDate: expectations.scheduledDate,
  runKind: "checkpoint",
  detectedAt: "2026-09-03T03:59:59.000Z",
  reasonCode: "SEO_HEALTH_PROVIDER_EXECUTION_FAILED",
  githubRunId: expectations.githubRunId,
  githubRunAttempt: expectations.githubRunAttempt,
  githubSha: expectations.githubSha,
  seoChangeAuthorized: false,
};
const incidentExpectations = {
  checkpointId: expectations.checkpointId,
  scheduledDate: expectations.scheduledDate,
  timezone: expectations.timezone,
  githubSha: expectations.githubSha,
  repository: "willrapuano/dmvtitleguy",
  issueNumber: 47,
  archiveSignature,
};
const incidentBody = buildSignedIncidentComment(missedIncident, {
  ...archiveSigning,
  checkpointId: expectations.checkpointId,
  scheduledDate: expectations.scheduledDate,
  timezone: expectations.timezone,
  githubSha: expectations.githubSha,
});
assert.match(incidentBody, new RegExp(`^<!-- ${INCIDENT_MARKER_VERSION}:`));
const incidentComment = trustedComment(1015, incidentBody);
assert.deepEqual(resolveExistingIncident([incidentComment], incidentExpectations), {
  url: incidentComment.html_url,
  incident: missedIncident,
});
expectCode("ARCHIVE_SIGNATURE_BODY_INVALID", () => resolveExistingIncident([{
  ...incidentComment,
  body: incidentBody.replace("checkpoint — missed", "checkpoint — accepted"),
}], incidentExpectations));
expectCode("ARCHIVE_INCIDENT_INVALID", () => buildSignedIncidentComment({
  ...missedIncident,
  seoChangeAuthorized: true,
}, {
  ...archiveSigning,
  checkpointId: expectations.checkpointId,
  scheduledDate: expectations.scheduledDate,
  timezone: expectations.timezone,
  githubSha: expectations.githubSha,
}));

console.log("SEO operational-health evidence archive verification passed");
