import {
  createHash,
  createPrivateKey,
  createPublicKey,
  sign,
  timingSafeEqual,
  verify,
} from "node:crypto";

export const ARCHIVE_MARKER_VERSION = "seo-operational-health-evidence-v2";
export const ARCHIVE_SIGNATURE_VERSION = "seo-operational-health-signature-v1";
export const INCIDENT_MARKER_VERSION = "seo-operational-health-incident-v1";

const SEO_HEALTH_FINISH_EVENT = "seo-operational-health.finish";
const SHA256 = /^[a-f0-9]{64}$/;
const GITHUB_SHA = /^[a-f0-9]{40}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SAFE_ID = /^[a-z0-9][a-z0-9._-]{0,127}$/;
const POSITIVE_DECIMAL = /^[1-9]\d*$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const MAX_MARKER_LENGTH = 32 * 1024;
const MAX_SIGNATURE_MARKER_LENGTH = 2048;
const SIGNATURE_ALGORITHM = "Ed25519";
const SIGNATURE_CONFIG_KEYS = Object.freeze([
  "algorithm",
  "keyId",
  "publicKeySpkiBase64",
]);
const SIGNATURE_ENVELOPE_KEYS = Object.freeze([
  "algorithm",
  "keyId",
  "signature",
]);
const INCIDENT_KEYS = Object.freeze([
  "schemaVersion",
  "event",
  "status",
  "checkpointId",
  "scheduledDate",
  "runKind",
  "detectedAt",
  "reasonCode",
  "githubRunId",
  "githubRunAttempt",
  "githubSha",
  "seoChangeAuthorized",
]);

const TRUSTED_AUTHOR = Object.freeze({
  login: "github-actions[bot]",
  id: 41898282,
  type: "Bot",
});

const REQUIRED_BINDINGS = Object.freeze([
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
]);

const TERMINAL_KEYS = Object.freeze([
  "schemaVersion",
  "event",
  "contractVersion",
  "scope",
  "runKind",
  "scheduledDate",
  "checkpointId",
  "startedAt",
  "finishedAt",
  "durationMs",
  "healthy",
  "complete",
  "httpOutcome",
  "evidenceDigest",
  "healthSourceDigest",
  "deploymentFingerprint",
  "bindings",
  "incidentCodes",
  "incidentDistinctBySeverity",
  "seoChangeAuthorized",
  "requests",
  "githubRunId",
  "githubRunAttempt",
  "githubSha",
]);

export class SeoHealthArchiveError extends Error {
  constructor(code) {
    super(code);
    this.name = "SeoHealthArchiveError";
    this.code = code;
  }
}

function fail(code) {
  throw new SeoHealthArchiveError(code);
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

function sha256Bytes(value) {
  return createHash("sha256").update(value).digest();
}

function sha256Hex(value) {
  return sha256Bytes(value).toString("hex");
}

function canonicalBase64Bytes(value) {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > 4096
    || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)
  ) return null;
  try {
    const bytes = Buffer.from(value, "base64");
    return bytes.length > 0 && bytes.toString("base64") === value ? bytes : null;
  } catch {
    return null;
  }
}

function canonicalBase64UrlBytes(value, maxLength = MAX_SIGNATURE_MARKER_LENGTH) {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > maxLength
    || !/^[A-Za-z0-9_-]+$/.test(value)
  ) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    return bytes.length > 0 && bytes.toString("base64url") === value ? bytes : null;
  } catch {
    return null;
  }
}

function loadSignaturePublicKey(signatureConfig) {
  if (
    !exactObjectKeys(signatureConfig, SIGNATURE_CONFIG_KEYS)
    || signatureConfig.algorithm !== SIGNATURE_ALGORITHM
    || !SHA256.test(signatureConfig.keyId || "")
  ) {
    fail("ARCHIVE_SIGNATURE_EXPECTATIONS_INVALID");
  }
  const publicKeyBytes = canonicalBase64Bytes(signatureConfig.publicKeySpkiBase64);
  if (!publicKeyBytes || sha256Hex(publicKeyBytes) !== signatureConfig.keyId) {
    fail("ARCHIVE_SIGNATURE_EXPECTATIONS_INVALID");
  }
  try {
    const publicKey = createPublicKey({
      key: publicKeyBytes,
      format: "der",
      type: "spki",
    });
    const exported = publicKey.export({ format: "der", type: "spki" });
    if (
      publicKey.asymmetricKeyType !== "ed25519"
      || exported.length !== publicKeyBytes.length
      || !timingSafeEqual(exported, publicKeyBytes)
    ) {
      fail("ARCHIVE_SIGNATURE_EXPECTATIONS_INVALID");
    }
    return publicKey;
  } catch (error) {
    if (error instanceof SeoHealthArchiveError) throw error;
    fail("ARCHIVE_SIGNATURE_EXPECTATIONS_INVALID");
  }
}

function signatureConfigFrom(value) {
  return value?.archiveSignature || {
    algorithm: value?.algorithm,
    keyId: value?.keyId,
    publicKeySpkiBase64: value?.publicKeySpkiBase64,
  };
}

export function validateArchiveSignatureConfig(signatureConfig) {
  loadSignaturePublicKey(signatureConfig);
  return true;
}

function loadMatchingPrivateKey(privateKeyPkcs8Base64, signatureConfig) {
  const publicKey = loadSignaturePublicKey(signatureConfig);
  const privateKeyBytes = canonicalBase64Bytes(privateKeyPkcs8Base64);
  if (!privateKeyBytes) fail("ARCHIVE_SIGNATURE_PRIVATE_KEY_INVALID");
  try {
    const privateKey = createPrivateKey({
      key: privateKeyBytes,
      format: "der",
      type: "pkcs8",
    });
    const derivedPublic = createPublicKey(privateKey).export({ format: "der", type: "spki" });
    const expectedPublic = publicKey.export({ format: "der", type: "spki" });
    if (
      privateKey.asymmetricKeyType !== "ed25519"
      || derivedPublic.length !== expectedPublic.length
      || !timingSafeEqual(derivedPublic, expectedPublic)
    ) {
      fail("ARCHIVE_SIGNATURE_PRIVATE_KEY_INVALID");
    }
    return privateKey;
  } catch (error) {
    if (error instanceof SeoHealthArchiveError) throw error;
    fail("ARCHIVE_SIGNATURE_PRIVATE_KEY_INVALID");
  }
}

function signaturePayload(unsignedBody, repository, issueNumber) {
  const parts = [
    ARCHIVE_SIGNATURE_VERSION,
    repository,
    String(issueNumber),
    unsignedBody,
  ];
  return Buffer.from(
    parts.map((value) => `${Buffer.byteLength(value, "utf8")}:${value}`).join("|"),
    "utf8",
  );
}

function safePositiveInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function safeNonnegativeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function canonicalPositiveDecimal(value) {
  return typeof value === "string"
    && value.length <= 20
    && POSITIVE_DECIMAL.test(value);
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
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString() !== value) return null;
  return parsed;
}

function isoDateInTimeZone(milliseconds, timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(milliseconds));
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const date = `${values.year}-${values.month}-${values.day}`;
    return validCalendarDate(date) ? date : null;
  } catch {
    return null;
  }
}

function safeExpectedString(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 256;
}

function validCheckpointIdentity(value) {
  return isRecord(value)
    && typeof value.checkpointId === "string"
    && SAFE_ID.test(value.checkpointId)
    && validCalendarDate(value.scheduledDate)
    && (value.runKind === "checkpoint" || value.runKind === "canary");
}

function validateIncident(incident, expectations) {
  if (
    !exactObjectKeys(incident, INCIDENT_KEYS)
    || incident.schemaVersion !== 1
    || incident.event !== "seo-operational-health.incident"
    || incident.status !== "missed"
    || incident.checkpointId !== expectations.checkpointId
    || incident.scheduledDate !== expectations.scheduledDate
    || incident.runKind !== "checkpoint"
    || incident.githubSha !== expectations.githubSha
    || !canonicalPositiveDecimal(incident.githubRunId)
    || !canonicalPositiveDecimal(incident.githubRunAttempt)
    || !GITHUB_SHA.test(incident.githubSha || "")
    || !/^[A-Z0-9_]{3,96}$/.test(incident.reasonCode || "")
    || incident.seoChangeAuthorized !== false
  ) {
    fail("ARCHIVE_INCIDENT_INVALID");
  }
  const detectedAt = parsedIsoTime(incident.detectedAt);
  if (
    detectedAt === null
    || isoDateInTimeZone(detectedAt, expectations.timezone) < expectations.scheduledDate
  ) {
    fail("ARCHIVE_INCIDENT_TIMING_INVALID");
  }
  return { ...incident };
}

function validateBaseExpectations(expectations) {
  if (
    !isRecord(expectations)
    || !safePositiveInteger(expectations.schemaVersion)
    || !safeExpectedString(expectations.contractVersion)
    || !safeExpectedString(expectations.scope)
    || expectations.timezone !== "America/New_York"
    || !validCheckpointIdentity(expectations)
    || !SHA256.test(expectations.deploymentFingerprint || "")
    || !safePositiveInteger(expectations.maxDurationMs)
    || !GITHUB_SHA.test(expectations.githubSha || "")
  ) {
    fail("ARCHIVE_EXPECTATIONS_INVALID");
  }
}

function validateRunExpectations(expectations) {
  validateBaseExpectations(expectations);
  if (
    !canonicalPositiveDecimal(expectations.githubRunId)
    || !canonicalPositiveDecimal(expectations.githubRunAttempt)
  ) {
    fail("ARCHIVE_EXPECTATIONS_INVALID");
  }
}

function validateArchiveExpectations(expectations) {
  validateBaseExpectations(expectations);
  if (
    typeof expectations.repository !== "string"
    || !REPOSITORY.test(expectations.repository)
    || !safePositiveInteger(expectations.issueNumber)
  ) {
    fail("ARCHIVE_EXPECTATIONS_INVALID");
  }
  loadSignaturePublicKey(signatureConfigFrom(expectations));
}

function validateIncidentExpectations(expectations) {
  if (
    !isRecord(expectations)
    || expectations.timezone !== "America/New_York"
    || typeof expectations.checkpointId !== "string"
    || !SAFE_ID.test(expectations.checkpointId)
    || !validCalendarDate(expectations.scheduledDate)
    || !GITHUB_SHA.test(expectations.githubSha || "")
    || typeof expectations.repository !== "string"
    || !REPOSITORY.test(expectations.repository)
    || !safePositiveInteger(expectations.issueNumber)
  ) {
    fail("ARCHIVE_INCIDENT_EXPECTATIONS_INVALID");
  }
  loadSignaturePublicKey(signatureConfigFrom(expectations));
}

/**
 * Validate one isolated-runner terminal event against trusted expectations and
 * return a fresh allowlisted projection. Unknown fields are rejected rather
 * than copied, so report payloads can never smuggle secrets into the archive.
 */
export function validateTerminalEvidence(terminal, expectations) {
  validateRunExpectations(expectations);
  if (!exactObjectKeys(terminal, TERMINAL_KEYS)) {
    fail("ARCHIVE_TERMINAL_SHAPE_INVALID");
  }
  if (
    terminal.schemaVersion !== expectations.schemaVersion
    || terminal.event !== SEO_HEALTH_FINISH_EVENT
    || terminal.contractVersion !== expectations.contractVersion
    || terminal.scope !== expectations.scope
    || terminal.checkpointId !== expectations.checkpointId
    || terminal.scheduledDate !== expectations.scheduledDate
    || terminal.runKind !== expectations.runKind
    || terminal.deploymentFingerprint !== expectations.deploymentFingerprint
    || terminal.githubRunId !== expectations.githubRunId
    || terminal.githubRunAttempt !== expectations.githubRunAttempt
    || terminal.githubSha !== expectations.githubSha
  ) {
    fail("ARCHIVE_TERMINAL_IDENTITY_INVALID");
  }
  if (
    terminal.healthy !== true
    || terminal.complete !== true
    || terminal.httpOutcome !== 200
    || terminal.seoChangeAuthorized !== false
    || !SHA256.test(terminal.evidenceDigest || "")
    || !SHA256.test(terminal.healthSourceDigest || "")
  ) {
    fail("ARCHIVE_TERMINAL_OUTCOME_INVALID");
  }

  const startedAtMs = parsedIsoTime(terminal.startedAt);
  const finishedAtMs = parsedIsoTime(terminal.finishedAt);
  if (
    startedAtMs === null
    || finishedAtMs === null
    || isoDateInTimeZone(startedAtMs, expectations.timezone) !== expectations.scheduledDate
    || isoDateInTimeZone(finishedAtMs, expectations.timezone) !== expectations.scheduledDate
    || finishedAtMs < startedAtMs
    || !safeNonnegativeInteger(terminal.durationMs)
    || terminal.durationMs !== finishedAtMs - startedAtMs
    || terminal.durationMs > expectations.maxDurationMs
  ) {
    fail("ARCHIVE_TERMINAL_TIMING_INVALID");
  }

  if (!exactObjectKeys(terminal.bindings, REQUIRED_BINDINGS)) {
    fail("ARCHIVE_BINDINGS_INVALID");
  }
  if (REQUIRED_BINDINGS.some((key) => terminal.bindings[key] !== true)) {
    fail("ARCHIVE_BINDINGS_FAILED");
  }
  if (!Array.isArray(terminal.incidentCodes) || terminal.incidentCodes.length !== 0) {
    fail("ARCHIVE_INCIDENTS_PRESENT");
  }
  if (
    !exactObjectKeys(terminal.incidentDistinctBySeverity, ["P0", "P1"])
    || terminal.incidentDistinctBySeverity.P0 !== 0
    || terminal.incidentDistinctBySeverity.P1 !== 0
  ) {
    fail("ARCHIVE_INCIDENT_COUNTS_INVALID");
  }
  if (
    !exactObjectKeys(terminal.requests, ["public", "ghl"])
    || !safePositiveInteger(terminal.requests.public)
    || !safePositiveInteger(terminal.requests.ghl)
  ) {
    fail("ARCHIVE_REQUEST_COUNTS_INVALID");
  }

  return {
    schemaVersion: terminal.schemaVersion,
    event: SEO_HEALTH_FINISH_EVENT,
    contractVersion: terminal.contractVersion,
    scope: terminal.scope,
    runKind: terminal.runKind,
    scheduledDate: terminal.scheduledDate,
    checkpointId: terminal.checkpointId,
    startedAt: terminal.startedAt,
    finishedAt: terminal.finishedAt,
    durationMs: terminal.durationMs,
    healthy: true,
    complete: true,
    httpOutcome: 200,
    evidenceDigest: terminal.evidenceDigest,
    healthSourceDigest: terminal.healthSourceDigest,
    deploymentFingerprint: terminal.deploymentFingerprint,
    bindings: Object.fromEntries(REQUIRED_BINDINGS.map((key) => [key, true])),
    incidentCodes: [],
    incidentDistinctBySeverity: { P0: 0, P1: 0 },
    seoChangeAuthorized: false,
    requests: {
      public: terminal.requests.public,
      ghl: terminal.requests.ghl,
    },
    githubRunId: terminal.githubRunId,
    githubRunAttempt: terminal.githubRunAttempt,
    githubSha: terminal.githubSha,
  };
}

function expectationsFromEvidence(evidence) {
  return {
    schemaVersion: evidence.schemaVersion,
    contractVersion: evidence.contractVersion,
    scope: evidence.scope,
    timezone: "America/New_York",
    checkpointId: evidence.checkpointId,
    scheduledDate: evidence.scheduledDate,
    runKind: evidence.runKind,
    deploymentFingerprint: evidence.deploymentFingerprint,
    maxDurationMs: Math.max(1, evidence.durationMs || 0),
    githubRunId: evidence.githubRunId,
    githubRunAttempt: evidence.githubRunAttempt,
    githubSha: evidence.githubSha,
  };
}

function validatedForRendering(evidence) {
  if (!isRecord(evidence)) fail("ARCHIVE_TERMINAL_SHAPE_INVALID");
  return validateTerminalEvidence(evidence, expectationsFromEvidence(evidence));
}

function evidenceMarker(evidence) {
  const payload = Buffer.from(JSON.stringify(evidence), "utf8").toString("base64url");
  return `<!-- ${ARCHIVE_MARKER_VERSION}:${payload} -->`;
}

/**
 * Render a canonical issue comment whose first line carries the complete,
 * sanitized evidence in a machine-readable base64url JSON marker.
 */
export function buildUnsignedArchiveComment(validatedEvidence) {
  const evidence = validatedForRendering(validatedEvidence);
  const bindings = REQUIRED_BINDINGS
    .map((key) => `  - ${key}: \`true\``)
    .join("\n");
  return `${evidenceMarker(evidence)}
## SEO operational-health checkpoint — accepted

- Checkpoint: \`${evidence.checkpointId}\`
- Scheduled date: \`${evidence.scheduledDate}\`
- Run kind: \`${evidence.runKind}\`
- GitHub run / attempt: \`${evidence.githubRunId}\` / \`${evidence.githubRunAttempt}\`
- Git commit: \`${evidence.githubSha}\`
- Terminal HTTP outcome: \`200\`
- Healthy / complete: \`true\` / \`true\`
- Started at: \`${evidence.startedAt}\`
- Finished at: \`${evidence.finishedAt}\`
- Duration: \`${evidence.durationMs} ms\`
- Deployment fingerprint: \`${evidence.deploymentFingerprint}\`
- Evidence digest: \`${evidence.evidenceDigest}\`
- Health-source digest: \`${evidence.healthSourceDigest}\`
- Incident codes: none
- Distinct P0 / P1 codes: \`0\` / \`0\`
- Public / GHL requests: \`${evidence.requests.public}\` / \`${evidence.requests.ghl}\`
- SEO change authorized: \`false\`
- Sanitized bindings:
${bindings}

This archive records operational evidence only. It does not authorize an SEO change.`;
}

function signatureMarker(envelope) {
  if (
    !exactObjectKeys(envelope, SIGNATURE_ENVELOPE_KEYS)
    || envelope.algorithm !== SIGNATURE_ALGORITHM
    || !SHA256.test(envelope.keyId || "")
    || canonicalBase64UrlBytes(envelope.signature, 256)?.length !== 64
  ) {
    fail("ARCHIVE_SIGNATURE_INVALID");
  }
  const payload = Buffer.from(JSON.stringify(envelope), "utf8").toString("base64url");
  return `<!-- ${ARCHIVE_SIGNATURE_VERSION}:${payload} -->`;
}

/**
 * Sign the exact canonical v2 evidence comment with the archive-only Ed25519
 * private key. The signature is domain-separated and bound to repository and
 * issue, so a valid comment cannot be replayed to another archive location.
 */
export function buildSignedArchiveComment(validatedEvidence, signing) {
  if (
    !isRecord(signing)
    || typeof signing.repository !== "string"
    || !REPOSITORY.test(signing.repository)
    || !safePositiveInteger(signing.issueNumber)
  ) {
    fail("ARCHIVE_SIGNATURE_EXPECTATIONS_INVALID");
  }
  const signatureConfig = {
    algorithm: signing.algorithm,
    keyId: signing.keyId,
    publicKeySpkiBase64: signing.publicKeySpkiBase64,
  };
  const privateKey = loadMatchingPrivateKey(signing.privateKeyPkcs8Base64, signatureConfig);
  const unsignedBody = buildUnsignedArchiveComment(validatedEvidence);
  let signatureBytes;
  try {
    signatureBytes = sign(
      null,
      signaturePayload(unsignedBody, signing.repository, signing.issueNumber),
      privateKey,
    );
  } catch {
    fail("ARCHIVE_SIGNATURE_PRIVATE_KEY_INVALID");
  }
  const marker = signatureMarker({
    algorithm: SIGNATURE_ALGORITHM,
    keyId: signing.keyId,
    signature: signatureBytes.toString("base64url"),
  });
  return `${unsignedBody}\n${marker}`;
}

function parseSignatureMarker(body) {
  if (typeof body !== "string") fail("ARCHIVE_SIGNATURE_MISSING");
  const lastLineStart = body.lastIndexOf("\n");
  if (lastLineStart < 0) fail("ARCHIVE_SIGNATURE_MISSING");
  const unsignedBody = body.slice(0, lastLineStart);
  const marker = body.slice(lastLineStart + 1);
  const exact = new RegExp(`^<!-- ${ARCHIVE_SIGNATURE_VERSION}:([A-Za-z0-9_-]+) -->$`).exec(marker);
  if (!exact || exact[1].length > MAX_SIGNATURE_MARKER_LENGTH) {
    fail("ARCHIVE_SIGNATURE_MISSING");
  }
  const bytes = canonicalBase64UrlBytes(exact[1]);
  if (!bytes) fail("ARCHIVE_SIGNATURE_INVALID");
  let envelope;
  try {
    envelope = JSON.parse(bytes.toString("utf8"));
  } catch {
    fail("ARCHIVE_SIGNATURE_INVALID");
  }
  if (
    !exactObjectKeys(envelope, SIGNATURE_ENVELOPE_KEYS)
    || envelope.algorithm !== SIGNATURE_ALGORITHM
    || !SHA256.test(envelope.keyId || "")
    || canonicalBase64UrlBytes(envelope.signature, 256)?.length !== 64
    || Buffer.from(JSON.stringify(envelope), "utf8").toString("base64url") !== exact[1]
  ) {
    fail("ARCHIVE_SIGNATURE_INVALID");
  }
  return { unsignedBody, envelope };
}

function verifySignedArchiveComment(body, evidence, expectations) {
  const { unsignedBody, envelope } = parseSignatureMarker(body);
  if (
    unsignedBody !== buildUnsignedArchiveComment(evidence)
    || envelope.keyId !== expectations.archiveSignature.keyId
  ) {
    fail("ARCHIVE_SIGNATURE_BODY_INVALID");
  }
  const publicKey = loadSignaturePublicKey(expectations.archiveSignature);
  const signatureBytes = canonicalBase64UrlBytes(envelope.signature, 256);
  let valid = false;
  try {
    valid = verify(
      null,
      signaturePayload(unsignedBody, expectations.repository, expectations.issueNumber),
      publicKey,
      signatureBytes,
    );
  } catch {
    valid = false;
  }
  if (!valid) fail("ARCHIVE_SIGNATURE_INVALID");
}

function verifySignedCanonicalComment(body, unsignedBody, expectations) {
  const parsed = parseSignatureMarker(body);
  if (parsed.unsignedBody !== unsignedBody || parsed.envelope.keyId !== expectations.archiveSignature.keyId) {
    fail("ARCHIVE_SIGNATURE_BODY_INVALID");
  }
  const publicKey = loadSignaturePublicKey(expectations.archiveSignature);
  const signatureBytes = canonicalBase64UrlBytes(parsed.envelope.signature, 256);
  let valid = false;
  try {
    valid = verify(
      null,
      signaturePayload(unsignedBody, expectations.repository, expectations.issueNumber),
      publicKey,
      signatureBytes,
    );
  } catch {
    valid = false;
  }
  if (!valid) fail("ARCHIVE_SIGNATURE_INVALID");
}

function markerPayload(body) {
  if (typeof body !== "string") return null;
  const firstLineEnd = body.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? body : body.slice(0, firstLineEnd);
  const prefix = `<!-- ${ARCHIVE_MARKER_VERSION}:`;
  if (!firstLine.startsWith(prefix)) return null;
  const exact = new RegExp(`^<!-- ${ARCHIVE_MARKER_VERSION}:([A-Za-z0-9_-]+) -->$`).exec(firstLine);
  if (!exact || exact[1].length > MAX_MARKER_LENGTH) {
    fail("ARCHIVE_MARKER_INVALID");
  }
  return exact[1];
}

function decodeMarker(payload) {
  try {
    const bytes = Buffer.from(payload, "base64url");
    if (bytes.length === 0 || bytes.toString("base64url") !== payload) {
      fail("ARCHIVE_MARKER_INVALID");
    }
    const parsed = JSON.parse(bytes.toString("utf8"));
    if (!isRecord(parsed)) fail("ARCHIVE_MARKER_INVALID");
    return parsed;
  } catch (error) {
    if (error instanceof SeoHealthArchiveError) throw error;
    fail("ARCHIVE_MARKER_INVALID");
  }
}

function hasTrustedIdentity(comment) {
  return isRecord(comment?.user)
    && comment.user.login === TRUSTED_AUTHOR.login
    && comment.user.id === TRUSTED_AUTHOR.id
    && comment.user.type === TRUSTED_AUTHOR.type;
}

function hasTrustedLocation(comment, expectations) {
  if (!safePositiveInteger(comment?.id)) return false;
  const issueWebUrl = `https://github.com/${expectations.repository}/issues/${expectations.issueNumber}`;
  const issueApiUrl = `https://api.github.com/repos/${expectations.repository}/issues/${expectations.issueNumber}`;
  return comment.issue_url === issueApiUrl
    && comment.html_url === `${issueWebUrl}#issuecomment-${comment.id}`
    && comment.url === `https://api.github.com/repos/${expectations.repository}/issues/comments/${comment.id}`;
}

function sameCheckpointIdentity(evidence, expectations) {
  return isRecord(evidence)
    && evidence.checkpointId === expectations.checkpointId
    && evidence.scheduledDate === expectations.scheduledDate
    && evidence.runKind === expectations.runKind;
}

/**
 * Resolve the first canonical archive for a checkpoint. A rerun deliberately
 * reuses valid evidence from an earlier GitHub run; run ID and attempt are
 * validated from the signed marker itself instead of compared with the rerun.
 */
export function resolveExistingArchive(comments, expectations) {
  validateArchiveExpectations(expectations);
  if (!Array.isArray(comments)) fail("ARCHIVE_COMMENTS_INVALID");

  const matches = [];
  for (const comment of comments) {
    // Identity and repository provenance are checked before parsing attacker-
    // controlled bodies, so forged/flooded marker comments are inert.
    if (!hasTrustedIdentity(comment) || !hasTrustedLocation(comment, expectations)) continue;
    const payload = markerPayload(comment.body);
    if (payload === null) continue;
    const candidate = decodeMarker(payload);
    if (!sameCheckpointIdentity(candidate, expectations)) continue;
    const evidence = validateTerminalEvidence(candidate, {
      ...expectations,
      githubRunId: candidate.githubRunId,
      githubRunAttempt: candidate.githubRunAttempt,
    });
    verifySignedArchiveComment(comment.body, evidence, expectations);
    matches.push({ url: comment.html_url, evidence });
  }

  if (matches.length > 1) fail("ARCHIVE_COMMENT_DUPLICATE");
  return matches[0] || null;
}

function incidentMarker(incident) {
  const payload = Buffer.from(JSON.stringify(incident), "utf8").toString("base64url");
  return `<!-- ${INCIDENT_MARKER_VERSION}:${payload} -->`;
}

function buildUnsignedIncidentComment(incident, expectations) {
  const validated = validateIncident(incident, expectations);
  return `${incidentMarker(validated)}
## SEO operational-health checkpoint — missed

- Checkpoint: \`${validated.checkpointId}\`
- Scheduled date: \`${validated.scheduledDate}\`
- Detected at: \`${validated.detectedAt}\`
- Reason code: \`${validated.reasonCode}\`
- GitHub run / attempt: \`${validated.githubRunId}\` / \`${validated.githubRunAttempt}\`
- Git commit: \`${validated.githubSha}\`
- SEO change authorized: \`false\`

This signed incident preserves a missing or failed checkpoint as explicit evidence. It does not convert the checkpoint into a pass and does not authorize an SEO change.`;
}

export function buildSignedIncidentComment(incident, signing) {
  validateIncidentExpectations(signing);
  const privateKey = loadMatchingPrivateKey(signing.privateKeyPkcs8Base64, signatureConfigFrom(signing));
  const unsignedBody = buildUnsignedIncidentComment(incident, signing);
  let signatureBytes;
  try {
    signatureBytes = sign(
      null,
      signaturePayload(unsignedBody, signing.repository, signing.issueNumber),
      privateKey,
    );
  } catch {
    fail("ARCHIVE_SIGNATURE_PRIVATE_KEY_INVALID");
  }
  return `${unsignedBody}\n${signatureMarker({
    algorithm: SIGNATURE_ALGORITHM,
    keyId: signing.archiveSignature?.keyId || signing.keyId,
    signature: signatureBytes.toString("base64url"),
  })}`;
}

function incidentPayload(body) {
  if (typeof body !== "string") return null;
  const firstLineEnd = body.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? body : body.slice(0, firstLineEnd);
  const exact = new RegExp(`^<!-- ${INCIDENT_MARKER_VERSION}:([A-Za-z0-9_-]+) -->$`).exec(firstLine);
  if (!exact || exact[1].length > MAX_MARKER_LENGTH) return null;
  return decodeMarker(exact[1]);
}

export function resolveExistingIncident(comments, expectations) {
  validateIncidentExpectations(expectations);
  if (!Array.isArray(comments)) fail("ARCHIVE_COMMENTS_INVALID");
  const matches = [];
  for (const comment of comments) {
    if (!hasTrustedIdentity(comment) || !hasTrustedLocation(comment, expectations)) continue;
    const candidate = incidentPayload(comment.body);
    if (!candidate) continue;
    if (
      candidate.checkpointId !== expectations.checkpointId
      || candidate.scheduledDate !== expectations.scheduledDate
    ) continue;
    const incident = validateIncident(candidate, expectations);
    const unsignedBody = buildUnsignedIncidentComment(incident, expectations);
    verifySignedCanonicalComment(comment.body, unsignedBody, expectations);
    matches.push({ url: comment.html_url, incident });
  }
  if (matches.length > 1) fail("ARCHIVE_INCIDENT_DUPLICATE");
  return matches[0] || null;
}
