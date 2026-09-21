import { createHash, createPublicKey, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { evaluateSeoHealthRolloutControls } from "./lib/seo-health-rollout-controls.mjs";
import { computeSeoHealthSourceDigest } from "./lib/seo-health-source-digest.mjs";

if (process.env.VERCEL_ENV !== "production") {
  console.log("Production environment gate skipped outside a Vercel Production build");
  process.exit(0);
}

const HEALTH_CRON_PATH = "/api/cron/seo-health";
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const FORBIDDEN_SITE_HEALTH_VARIABLES = [
  "SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY",
  "SEO_HEALTH_GITHUB_READ_TOKEN",
  "SEO_HEALTH_VERCEL_CONTROL_TOKEN",
  "SEO_HEALTH_TURSO_DATABASE_URL",
  "SEO_HEALTH_TURSO_AUTH_TOKEN",
  "SEO_HEALTH_GHL_READ_TOKEN",
];

function fail(message) {
  throw new Error(`Production environment gate failed: ${message}`);
}

function requireCondition(condition, message) {
  if (!condition) fail(message);
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function digestMatches(value, expectedDigest) {
  if (!SHA256_PATTERN.test(expectedDigest)) return false;
  return timingSafeEqual(
    Buffer.from(digest(value), "hex"),
    Buffer.from(expectedDigest, "hex"),
  );
}

function productionHostnameDiagnostic(value) {
  if (value === undefined) return "missing";
  if (value === "") return "empty";
  // Only these already-public project domains may appear in a build error.
  // Never echo arbitrary environment input, even if it looks like a hostname.
  const publicProjectHostnames = [
    "dmvtitleguy.io",
    "www.dmvtitleguy.io",
    "dmvtitleguy.com",
    "www.dmvtitleguy.com",
    "dmvtitleguy.vercel.app",
  ];
  return publicProjectHostnames.includes(value) ? value : "other-redacted";
}

function validArchiveSignature(config, required) {
  if (!config || typeof config !== "object" || Array.isArray(config)) return false;
  const expectedKeys = ["algorithm", "keyId", "publicKeySpkiBase64"].sort();
  const actualKeys = Object.keys(config).sort();
  if (
    actualKeys.length !== expectedKeys.length
    || !actualKeys.every((key, index) => key === expectedKeys[index])
    || config.algorithm !== "Ed25519"
  ) return false;
  if (config.keyId === "" && config.publicKeySpkiBase64 === "") return !required;
  if (!/^[a-f0-9]{64}$/.test(config.keyId || "") || typeof config.publicKeySpkiBase64 !== "string") return false;
  try {
    const bytes = Buffer.from(config.publicKeySpkiBase64, "base64");
    if (bytes.length === 0 || bytes.toString("base64") !== config.publicKeySpkiBase64) return false;
    const key = createPublicKey({ key: bytes, format: "der", type: "spki" });
    const exported = key.export({ format: "der", type: "spki" });
    return key.asymmetricKeyType === "ed25519"
      && Buffer.compare(exported, bytes) === 0
      && digest(bytes) === config.keyId;
  } catch {
    return false;
  }
}

function isoDateInTimeZone(now, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return candidate.getUTCFullYear() === year
    && candidate.getUTCMonth() === month - 1
    && candidate.getUTCDate() === day;
}

function previousCalendarDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day - 1)).toISOString().slice(0, 10);
}

function hasPastCheckpointHistory(config) {
  if (!config.checkpointHistory || typeof config.checkpointHistory !== "object" || Array.isArray(config.checkpointHistory)) {
    return false;
  }
  const yesterday = previousCalendarDate(isoDateInTimeZone(new Date(), config.timezone));
  return Object.keys(config.checkpointCalendar)
    .filter((date) => date < yesterday)
    .every((date) => Object.hasOwn(config.checkpointHistory, date));
}

function validCanaryReceipt(receipt) {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  const expectedKeys = [
    "checkpointId", "scheduledDate", "finishedAt", "commentId",
    "commentBodySha256", "deploymentFingerprint", "evidenceDigest", "healthSourceDigest", "githubSha",
  ].sort();
  const actualKeys = Object.keys(receipt).sort();
  if (actualKeys.length !== expectedKeys.length
    || !actualKeys.every((key, index) => key === expectedKeys[index])) return false;
  if (!validIsoDate(receipt.scheduledDate)
    || receipt.checkpointId !== `production-canary-${receipt.scheduledDate}`
    || Object.hasOwn(seoHealthConfig.checkpointCalendar, receipt.scheduledDate)
    || !Number.isSafeInteger(receipt.commentId)
    || receipt.commentId <= 0
    || !/^[a-f0-9]{64}$/.test(receipt.commentBodySha256 || "")
    || !/^[a-f0-9]{64}$/.test(receipt.deploymentFingerprint || "")
    || !/^[a-f0-9]{64}$/.test(receipt.evidenceDigest || "")
    || receipt.healthSourceDigest !== currentHealthSourceDigest
    || !/^[a-f0-9]{40}$/.test(receipt.githubSha || "")) return false;
  const finishedAt = Date.parse(receipt.finishedAt);
  return Number.isFinite(finishedAt)
    && new Date(finishedAt).toISOString() === receipt.finishedAt
    && isoDateInTimeZone(new Date(finishedAt), seoHealthConfig.timezone) === receipt.scheduledDate;
}

const webhook = process.env.GHL_WEBHOOK_URL || "";
const protectionSecret = process.env.LEAD_PROTECTION_SECRET || "";
const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "";
const databaseToken = process.env.TURSO_AUTH_TOKEN || "";
const ghlPrivateToken = process.env.GHL_PRIVATE_INTEGRATION_TOKEN || "";
const ghlLocationId = process.env.GHL_LOCATION_ID || "";
const ghlPipelineId = process.env.GHL_WEBSITE_PIPELINE_ID || "";
const ghlSubmittedStageId = process.env.GHL_WEBSITE_SUBMITTED_STAGE_ID || "";
const cronSecret = process.env.CRON_SECRET || "";
const hasSeoHealthAttestationSecret = Object.hasOwn(process.env, "SEO_HEALTH_ATTESTATION_SECRET");
const seoHealthAttestationSecret = process.env.SEO_HEALTH_ATTESTATION_SECRET || "";
const seoHealthConfig = JSON.parse(readFileSync("config/seo-operational-health.json", "utf8"));
const currentHealthSourceDigest = await computeSeoHealthSourceDigest();
const rolloutControls = evaluateSeoHealthRolloutControls(seoHealthConfig, { now: new Date() });
const vercelManifest = JSON.parse(readFileSync("vercel.json", "utf8"));
const healthCronEntries = (vercelManifest.crons || []).filter(({ path }) => path === HEALTH_CRON_PATH);

requireCondition(
  healthCronEntries.length === 0,
  "the Vercel project must never schedule the isolated SEO health job",
);
requireCondition(
  seoHealthConfig.scheduler === "github-actions",
  "the SEO health scheduler must remain isolated in GitHub Actions",
);
requireCondition(
  ["disabled", "canary", "permanent"].includes(seoHealthConfig.rolloutPhase),
  "SEO health rolloutPhase must be disabled, canary, or permanent",
);
if (seoHealthConfig.rolloutPhase === "disabled") {
  requireCondition(
    !hasSeoHealthAttestationSecret || seoHealthAttestationSecret.length >= 32,
    "SEO_HEALTH_ATTESTATION_SECRET must be absent or contain at least 32 random bytes while rollout is disabled",
  );
} else {
  requireCondition(
    hasSeoHealthAttestationSecret && seoHealthAttestationSecret.length >= 32,
    "SEO_HEALTH_ATTESTATION_SECRET must contain at least 32 random bytes for canary or permanent rollout",
  );
}
requireCondition(
  validArchiveSignature(
    seoHealthConfig.archiveSignature,
    seoHealthConfig.rolloutPhase !== "disabled",
  ),
  "canary and permanent rollout require a valid pinned Ed25519 archive public key",
);
requireCondition(
  FORBIDDEN_SITE_HEALTH_VARIABLES.every((name) => !Object.hasOwn(process.env, name)),
  "isolated health credentials must not be present in the Vercel site environment",
);
requireCondition(
  seoHealthConfig.permanentCronSchedule === "17 12 * * *",
  "the GitHub Actions SEO health schedule must run at 12:17 UTC",
);
requireCondition(
  seoHealthConfig.timezone === "America/New_York",
  "SEO health rollout dates must use America/New_York",
);
requireCondition(
  seoHealthConfig.rolloutPhase === "disabled" || rolloutControls.ready,
  `canary and permanent rollout require complete history and a fresh signed watchdog receipt (${rolloutControls.code})`,
);
requireCondition(
  seoHealthConfig.checkpointCalendar
    && typeof seoHealthConfig.checkpointCalendar === "object"
    && !Array.isArray(seoHealthConfig.checkpointCalendar)
    && Object.keys(seoHealthConfig.checkpointCalendar).length > 0,
  "the immutable SEO health checkpoint calendar is required",
);
requireCondition(
  seoHealthConfig.checkpointDates
    && typeof seoHealthConfig.checkpointDates === "object"
    && !Array.isArray(seoHealthConfig.checkpointDates),
  "active SEO health checkpoint dates must be an object",
);
requireCondition(Array.isArray(seoHealthConfig.canaryDates), "SEO health canary dates must be an array");
if (seoHealthConfig.rolloutPhase === "disabled") {
  requireCondition(Object.keys(seoHealthConfig.checkpointDates).length === 0, "disabled rollout must disable checkpoints");
  requireCondition(seoHealthConfig.canaryDates.length === 0, "disabled rollout must not retain a canary date");
  requireCondition(seoHealthConfig.canaryReceipt === null, "disabled rollout must not retain a canary receipt");
} else if (seoHealthConfig.rolloutPhase === "canary") {
  requireCondition(Object.keys(seoHealthConfig.checkpointDates).length === 0, "canary rollout must disable checkpoints");
  requireCondition(seoHealthConfig.canaryDates.length === 1, "canary rollout requires exactly one date");
  requireCondition(seoHealthConfig.canaryReceipt === null, "canary rollout must not predeclare an accepted receipt");
  const canaryDate = seoHealthConfig.canaryDates[0];
  requireCondition(validIsoDate(canaryDate), "the canary date must be a valid ISO calendar date");
  requireCondition(
    !Object.hasOwn(seoHealthConfig.checkpointCalendar, canaryDate),
    "the canary date may not overlap a checkpoint",
  );
  requireCondition(
    canaryDate > isoDateInTimeZone(new Date(), "America/New_York"),
    "the canary date must be future-dated in America/New_York",
  );
} else if (seoHealthConfig.rolloutPhase === "permanent") {
  requireCondition(seoHealthConfig.canaryDates.length === 0, "permanent rollout must not retain a canary date");
  requireCondition(
    isDeepStrictEqual(seoHealthConfig.checkpointDates, seoHealthConfig.checkpointCalendar),
    "permanent rollout must enable the complete checkpoint calendar",
  );
  requireCondition(validCanaryReceipt(seoHealthConfig.canaryReceipt), "permanent rollout requires a valid canary receipt");
  requireCondition(
    hasPastCheckpointHistory(seoHealthConfig),
    "permanent rollout requires archived evidence or a signed missed-checkpoint incident for every past checkpoint",
  );
}

requireCondition(process.env.VERCEL === "1", "Vercel system environment variables are required");
requireCondition(process.env.VERCEL_TARGET_ENV === "production", "the Vercel Production target is required");
requireCondition(
  digestMatches(process.env.VERCEL_PROJECT_ID || "", seoHealthConfig.deploymentBinding.fingerprints.projectIdSha256),
  "Vercel project fingerprint mismatch",
);
requireCondition(
  process.env.VERCEL_GIT_PROVIDER === seoHealthConfig.deploymentBinding.gitProvider,
  "the pinned Git provider is required",
);
requireCondition(
  digestMatches(process.env.VERCEL_GIT_REPO_ID || "", seoHealthConfig.deploymentBinding.fingerprints.gitRepoIdSha256),
  "Git repository ID fingerprint mismatch",
);
requireCondition(
  digestMatches(process.env.VERCEL_GIT_REPO_OWNER || "", seoHealthConfig.deploymentBinding.fingerprints.gitRepoOwnerSha256),
  "Git owner fingerprint mismatch",
);
requireCondition(
  digestMatches(process.env.VERCEL_GIT_REPO_SLUG || "", seoHealthConfig.deploymentBinding.fingerprints.gitRepoSlugSha256),
  "Git repository fingerprint mismatch",
);
requireCondition(
  process.env.VERCEL_GIT_COMMIT_REF === seoHealthConfig.deploymentBinding.productionBranch,
  "the pinned production branch is required",
);
requireCondition(/^[a-f0-9]{40}$/.test(process.env.VERCEL_GIT_COMMIT_SHA || ""), "a full Git commit SHA is required");
requireCondition(/^dpl_[A-Za-z0-9]{16,}$/.test(process.env.VERCEL_DEPLOYMENT_ID || ""), "a Vercel deployment ID is required");
requireCondition(
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.vercel\.app$/.test(process.env.VERCEL_URL || ""),
  "a generated Vercel deployment URL is required",
);
requireCondition(
  digestMatches(
    process.env.VERCEL_PROJECT_PRODUCTION_URL || "",
    seoHealthConfig.deploymentBinding.fingerprints.productionHostnameSha256,
  ),
  `Production hostname fingerprint mismatch (VERCEL_PROJECT_PRODUCTION_URL=${productionHostnameDiagnostic(process.env.VERCEL_PROJECT_PRODUCTION_URL)})`,
);
requireCondition(/^https:\/\/[^\s]+$/.test(webhook), "GHL_WEBHOOK_URL must be an HTTPS URL");
requireCondition(protectionSecret.length >= 64, "LEAD_PROTECTION_SECRET must contain at least 32 random bytes");
requireCondition(databaseUrl && databaseUrl !== "file:dev.db", "a durable TURSO_DATABASE_URL or DATABASE_URL is required");
if (/^(libsql|https):/i.test(databaseUrl)) {
  requireCondition(databaseToken.length >= 20, "TURSO_AUTH_TOKEN is required for the remote database");
}
requireCondition(ghlPrivateToken.length >= 20, "GHL_PRIVATE_INTEGRATION_TOKEN is required for opportunity measurement");
requireCondition(Boolean(ghlLocationId), "GHL_LOCATION_ID is required");
requireCondition(Boolean(ghlPipelineId), "GHL_WEBSITE_PIPELINE_ID is required");
requireCondition(Boolean(ghlSubmittedStageId), "GHL_WEBSITE_SUBMITTED_STAGE_ID is required");
requireCondition(cronSecret.length >= 32, "CRON_SECRET is required for Production reconciliation");
console.log("Production environment gate passed: lead delivery and static isolated SEO health controls are configured");
