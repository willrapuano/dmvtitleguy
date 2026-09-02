import { createHash, createPublicKey, generateKeyPairSync } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { computeSeoHealthSourceDigest } from "./lib/seo-health-source-digest.mjs";
import {
  WATCHDOG_PERMISSIONS,
  WATCHDOG_PROVIDER,
  WATCHDOG_RECEIPT_CONTRACT,
  buildSignedWatchdogReceipt,
  validateWatchdogConfig,
  verifyWatchdogReceipt,
} from "./lib/seo-health-watchdog-receipt.mjs";

const HEALTH_CRON_PATH = "/api/cron/seo-health";
const PHASES = new Set(["disabled", "canary", "permanent"]);
const PERMANENT_SCHEDULE = "17 12 * * *";
const SAFE_CHECKPOINT_ID = /^[a-z0-9][a-z0-9._-]{0,127}$/;
const RECEIPT_KEYS = [
  "checkpointId",
  "scheduledDate",
  "finishedAt",
  "commentId",
  "commentBodySha256",
  "deploymentFingerprint",
  "evidenceDigest",
  "healthSourceDigest",
  "githubSha",
];
const ARCHIVED_HISTORY_KEYS = [...RECEIPT_KEYS, "status"];
const MISSED_HISTORY_KEYS = [
  "status",
  "checkpointId",
  "scheduledDate",
  "detectedAt",
  "reasonCode",
  "commentId",
  "commentBodySha256",
  "githubSha",
];
const WORKFLOW_PATH = ".github/workflows/seo-operational-health.yml";
const repositoryRoot = new URL("../", import.meta.url);
const productionGatePath = fileURLToPath(new URL("verify-production-env.mjs", import.meta.url));
const currentHealthSourceDigest = await computeSeoHealthSourceDigest();

function fail(message) {
  throw new Error(`SEO health rollout verification failed: ${message}`);
}

function requireCondition(condition, message) {
  if (!condition) fail(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
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
      && sha256(bytes) === config.keyId;
  } catch {
    return false;
  }
}

const fixtureArchivePublicKey = generateKeyPairSync("ed25519").publicKey.export({
  format: "der",
  type: "spki",
});
const fixtureArchiveSignature = Object.freeze({
  algorithm: "Ed25519",
  keyId: sha256(fixtureArchivePublicKey),
  publicKeySpkiBase64: fixtureArchivePublicKey.toString("base64"),
});
const fixtureWatchdogKeyPair = generateKeyPairSync("ed25519");
const fixtureWatchdogPublicKey = fixtureWatchdogKeyPair.publicKey.export({ format: "der", type: "spki" });
const fixtureWatchdogPrivateKey = fixtureWatchdogKeyPair.privateKey.export({ format: "der", type: "pkcs8" });
const fixtureWatchdogSignature = Object.freeze({
  algorithm: "Ed25519",
  keyId: sha256(fixtureWatchdogPublicKey),
  publicKeySpkiBase64: fixtureWatchdogPublicKey.toString("base64"),
});

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

function exactKeys(value, expectedKeys) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function canonicalIsoTime(value) {
  if (typeof value !== "string") return null;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value
    ? milliseconds
    : null;
}

function previousCalendarDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  const previous = new Date(Date.UTC(year, month - 1, day - 1));
  return previous.toISOString().slice(0, 10);
}

function validHistoryEntry(entry, scheduledDate, checkpointId, config) {
  if (entry?.status === "archived") {
    if (!exactKeys(entry, ARCHIVED_HISTORY_KEYS)) return false;
    const finishedAt = canonicalIsoTime(entry.finishedAt);
    return entry.checkpointId === checkpointId
      && entry.scheduledDate === scheduledDate
      && finishedAt !== null
      && isoDateInTimeZone(new Date(finishedAt), config.timezone) === scheduledDate
      && Number.isSafeInteger(entry.commentId)
      && entry.commentId > 0
      && /^[a-f0-9]{64}$/.test(entry.commentBodySha256 || "")
      && /^[a-f0-9]{64}$/.test(entry.deploymentFingerprint || "")
      && /^[a-f0-9]{64}$/.test(entry.evidenceDigest || "")
      && /^[a-f0-9]{64}$/.test(entry.healthSourceDigest || "")
      && /^[a-f0-9]{40}$/.test(entry.githubSha || "");
  }
  if (entry?.status === "missed") {
    const detectedAt = canonicalIsoTime(entry.detectedAt);
    return exactKeys(entry, MISSED_HISTORY_KEYS)
      && entry.checkpointId === checkpointId
      && entry.scheduledDate === scheduledDate
      && detectedAt !== null
      && isoDateInTimeZone(new Date(detectedAt), config.timezone) >= scheduledDate
      && /^[A-Z0-9_]{3,96}$/.test(entry.reasonCode || "")
      && Number.isSafeInteger(entry.commentId)
      && entry.commentId > 0
      && /^[a-f0-9]{64}$/.test(entry.commentBodySha256 || "")
      && /^[a-f0-9]{40}$/.test(entry.githubSha || "");
  }
  return false;
}

function validateCheckpointHistory(config, now) {
  requireCondition(
    config.checkpointHistory
      && typeof config.checkpointHistory === "object"
      && !Array.isArray(config.checkpointHistory),
    "checkpointHistory must be an object",
  );
  requireCondition(
    Object.keys(config.checkpointHistory).every((date) => Object.hasOwn(config.checkpointCalendar, date)),
    "checkpointHistory may contain only checkpoint calendar dates",
  );
  for (const [date, entry] of Object.entries(config.checkpointHistory)) {
    requireCondition(
      validHistoryEntry(entry, date, config.checkpointCalendar[date], config),
      `checkpointHistory entry ${date} must be a canonical archived receipt or signed missed-checkpoint incident reference`,
    );
  }
  if (config.rolloutPhase === "disabled") return;
  // A checkpoint does not become a required historical record until the full
  // following Eastern calendar day has remained available for recovery and
  // archival. The public comment itself is separately bounded to +24 hours.
  const yesterday = previousCalendarDate(isoDateInTimeZone(now, config.timezone));
  const requiredDates = Object.keys(config.checkpointCalendar).filter((date) => date < yesterday);
  requireCondition(
    requiredDates.every((date) => Object.hasOwn(config.checkpointHistory, date)),
    "permanent activation requires archived evidence or a signed missed-checkpoint incident for every past checkpoint",
  );
}

function validateSchedulerContinuity(config, now) {
  try {
    validateWatchdogConfig(config, { required: config.rolloutPhase !== "disabled" });
    if (config.rolloutPhase !== "disabled") verifyWatchdogReceipt(config, { now });
  } catch {
    requireCondition(
      false,
      config.rolloutPhase === "disabled"
        ? "scheduler continuity must pin the public-repository 60-day risk, one-hour detection, 24-hour recovery, receipt freshness, and workflow path"
        : "canary and permanent rollout require a signed fresh external GitHub App watchdog receipt and recovery drill",
    );
  }
}

function validCanaryReceipt(receipt, config) {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  const actualKeys = Object.keys(receipt).sort();
  const expectedKeys = [...RECEIPT_KEYS].sort();
  if (actualKeys.length !== expectedKeys.length
    || !actualKeys.every((key, index) => key === expectedKeys[index])) return false;
  if (!validIsoDate(receipt.scheduledDate)
    || receipt.checkpointId !== `production-canary-${receipt.scheduledDate}`
    || Object.hasOwn(config.checkpointCalendar, receipt.scheduledDate)
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
    && isoDateInTimeZone(new Date(finishedAt), config.timezone) === receipt.scheduledDate;
}

function healthCronEntries(manifest) {
  return (manifest.crons || []).filter(({ path }) => path === HEALTH_CRON_PATH);
}

function manifestWithoutHealthCron(manifest) {
  return {
    ...structuredClone(manifest),
    crons: (manifest.crons || []).filter(({ path }) => path !== HEALTH_CRON_PATH),
  };
}

function jsonEqual(left, right) {
  return isDeepStrictEqual(left, right);
}

function validateRollout(config, manifest, now = new Date()) {
  requireCondition(PHASES.has(config.rolloutPhase), "rolloutPhase must be disabled, canary, or permanent");
  requireCondition(config.scheduler === "github-actions", "scheduler must remain isolated in GitHub Actions");
  requireCondition(config.permanentCronSchedule === PERMANENT_SCHEDULE, "GitHub Actions must run at 12:17 UTC");
  requireCondition(config.timezone === "America/New_York", "rollout date gates must use America/New_York");
  requireCondition(
    validArchiveSignature(config.archiveSignature, config.rolloutPhase !== "disabled"),
    "canary and permanent phases require a valid pinned Ed25519 archive public key",
  );
  requireCondition(
    config.checkpointCalendar
      && typeof config.checkpointCalendar === "object"
      && !Array.isArray(config.checkpointCalendar)
      && Object.keys(config.checkpointCalendar).length > 0,
    "the immutable checkpoint calendar is required",
  );
  requireCondition(
    Object.keys(config.checkpointCalendar).every(validIsoDate),
    "every checkpoint calendar key must be a valid ISO date",
  );
  const checkpointIds = Object.values(config.checkpointCalendar);
  requireCondition(
    checkpointIds.every((value) => typeof value === "string" && SAFE_CHECKPOINT_ID.test(value)),
    "every checkpoint ID must be nonempty and safe",
  );
  requireCondition(
    new Set(checkpointIds).size === checkpointIds.length,
    "checkpoint IDs must be unique",
  );
  requireCondition(
    config.checkpointDates
      && typeof config.checkpointDates === "object"
      && !Array.isArray(config.checkpointDates),
    "active checkpointDates must be an object",
  );
  requireCondition(Array.isArray(config.canaryDates), "canaryDates must be an array");
  requireCondition(config.canaryReceipt === null || typeof config.canaryReceipt === "object", "canaryReceipt must be null or an object");
  requireCondition(new Set(config.canaryDates).size === config.canaryDates.length, "canary dates must be unique");

  const healthCrons = healthCronEntries(manifest);
  requireCondition(healthCrons.length === 0, "the Vercel manifest must never schedule the SEO health job");

  if (config.rolloutPhase === "disabled") {
    requireCondition(Object.keys(config.checkpointDates).length === 0, "disabled phase must disable checkpoint execution");
    requireCondition(config.canaryDates.length === 0, "disabled phase must not retain a canary date");
    requireCondition(config.canaryReceipt === null, "disabled phase must not retain a canary receipt");
    validateCheckpointHistory(config, now);
    validateSchedulerContinuity(config, now);
    return;
  }

  if (config.rolloutPhase === "canary") {
    requireCondition(Object.keys(config.checkpointDates).length === 0, "canary phase must disable checkpoint execution");
    requireCondition(config.canaryDates.length === 1, "canary phase requires exactly one date");
    requireCondition(config.canaryReceipt === null, "canary phase must not predeclare an accepted receipt");
    const canaryDate = config.canaryDates[0];
    requireCondition(validIsoDate(canaryDate), "the canary date must be a valid ISO calendar date");
    requireCondition(
      !Object.hasOwn(config.checkpointCalendar, canaryDate),
      "the canary date may not overlap the checkpoint calendar",
    );
    requireCondition(
      canaryDate > isoDateInTimeZone(now, config.timezone),
      "the canary date must be future-dated in America/New_York",
    );
    validateCheckpointHistory(config, now);
    validateSchedulerContinuity(config, now);
    return;
  }

  requireCondition(config.canaryDates.length === 0, "permanent phase must not retain a canary date");
  requireCondition(validCanaryReceipt(config.canaryReceipt, config), "permanent phase requires a valid accepted canary receipt");
  requireCondition(
    jsonEqual(config.checkpointDates, config.checkpointCalendar),
    "permanent phase must enable the complete checkpoint calendar",
  );
  validateCheckpointHistory(config, now);
  validateSchedulerContinuity(config, now);
}

function expectInvalid(config, manifest, expectedFragment, now) {
  let message = "";
  try {
    validateRollout(config, manifest, now);
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }
  requireCondition(message.includes(expectedFragment), `invalid rollout fixture did not fail on: ${expectedFragment}`);
}

function minimalManifest(withHealthCron) {
  return {
    crons: [
      { path: "/api/cron/reconcile-ghl-opportunities", schedule: "*/15 * * * *" },
      ...(withHealthCron ? [{ path: HEALTH_CRON_PATH, schedule: PERMANENT_SCHEDULE }] : []),
    ],
  };
}

function productionFixtureConfig({
  phase,
  withCredentialPins,
  values,
}) {
  const checkpointCalendar = { "2026-09-02": "technical-2026-09-02" };
  return {
    scheduler: "github-actions",
    rolloutPhase: phase,
    permanentCronSchedule: PERMANENT_SCHEDULE,
    archiveSignature: phase === "disabled"
      ? { algorithm: "Ed25519", keyId: "", publicKeySpkiBase64: "" }
      : fixtureArchiveSignature,
    timezone: "America/New_York",
    checkpointCalendar,
    checkpointDates: phase === "permanent" ? checkpointCalendar : {},
    canaryDates: phase === "canary" ? ["2099-01-02"] : [],
    canaryReceipt: phase === "permanent" ? {
      checkpointId: "production-canary-2027-01-02",
      scheduledDate: "2027-01-02",
      finishedAt: "2027-01-02T12:17:01.000Z",
      commentId: 123456,
      commentBodySha256: "b".repeat(64),
      deploymentFingerprint: "c".repeat(64),
      evidenceDigest: "d".repeat(64),
      healthSourceDigest: currentHealthSourceDigest,
      githubSha: "e".repeat(40),
    } : null,
    checkpointHistory: {},
    schedulerContinuity: phase === "disabled" ? {
      publicRepositoryInactivityDisableDays: 60,
      maximumDetectionMinutes: 60,
      maximumOwnerRecoveryHours: 24,
      maximumReceiptAgeHours: 168,
      maximumRecoveryDrillAgeDays: 30,
      independentWatchdog: {
        provider: "",
        monitorIdSha256: "",
        githubAppIdSha256: "",
        installationIdSha256: "",
        workflowPathSha256: sha256(WORKFLOW_PATH),
        requiredPermissions: structuredClone(WATCHDOG_PERMISSIONS),
        receiptSignature: { algorithm: "Ed25519", keyId: "", publicKeySpkiBase64: "" },
        receipt: null,
      },
    } : fixtureSchedulerContinuity(sha256(values.VERCEL_GIT_REPO_ID)),
    deploymentBinding: {
      gitProvider: values.VERCEL_GIT_PROVIDER,
      productionBranch: values.VERCEL_GIT_COMMIT_REF,
      fingerprints: {
        projectIdSha256: sha256(values.VERCEL_PROJECT_ID),
        gitRepoIdSha256: sha256(values.VERCEL_GIT_REPO_ID),
        gitRepoOwnerSha256: sha256(values.VERCEL_GIT_REPO_OWNER),
        gitRepoSlugSha256: sha256(values.VERCEL_GIT_REPO_SLUG),
        productionHostnameSha256: sha256(values.VERCEL_PROJECT_PRODUCTION_URL),
      },
    },
    fingerprints: {
      databaseUrlSha256: sha256(values.SEO_HEALTH_TURSO_DATABASE_URL || values.TURSO_DATABASE_URL),
      databaseTokenSha256: withCredentialPins ? sha256(values.SEO_HEALTH_TURSO_AUTH_TOKEN) : "",
      ghlLocationIdSha256: sha256(values.GHL_LOCATION_ID),
      ghlPipelineIdSha256: sha256(values.GHL_WEBSITE_PIPELINE_ID),
      ghlSubmittedStageIdSha256: sha256(values.GHL_WEBSITE_SUBMITTED_STAGE_ID),
      ghlReadTokenSha256: withCredentialPins ? sha256(values.SEO_HEALTH_GHL_READ_TOKEN) : "",
      ghlTargetSha256: withCredentialPins ? "a".repeat(64) : "",
    },
  };
}

function fixtureSchedulerContinuity(repositoryIdSha256, observedAt = "2026-08-30T12:00:00.000Z") {
  const monitorIdSha256 = "6".repeat(64);
  const githubAppIdSha256 = "5".repeat(64);
  const installationIdSha256 = "7".repeat(64);
  const workflowPathSha256 = sha256(WORKFLOW_PATH);
  const observedMs = Date.parse(observedAt);
  const unsigned = {
    schemaVersion: 1,
    contractVersion: WATCHDOG_RECEIPT_CONTRACT,
    provider: WATCHDOG_PROVIDER,
    monitorIdSha256,
    githubAppIdSha256,
    installationIdSha256,
    repository: "willrapuano/dmvtitleguy",
    repositoryIdSha256,
    workflowPath: WORKFLOW_PATH,
    workflowPathSha256,
    permissions: structuredClone(WATCHDOG_PERMISSIONS),
    observedAt,
    workflowState: "active",
    drill: {
      disabledAt: new Date(observedMs - 50 * 60_000).toISOString(),
      detectedAt: new Date(observedMs - 45 * 60_000).toISOString(),
      reenabledAt: new Date(observedMs - 40 * 60_000).toISOString(),
      alertedAt: new Date(observedMs - 44 * 60_000).toISOString(),
      workflowReenabled: true,
      ownerAlertDelivered: true,
    },
  };
  return {
    publicRepositoryInactivityDisableDays: 60,
    maximumDetectionMinutes: 60,
    maximumOwnerRecoveryHours: 24,
    maximumReceiptAgeHours: 168,
    maximumRecoveryDrillAgeDays: 30,
    independentWatchdog: {
      provider: WATCHDOG_PROVIDER,
      monitorIdSha256,
      githubAppIdSha256,
      installationIdSha256,
      workflowPathSha256,
      requiredPermissions: structuredClone(WATCHDOG_PERMISSIONS),
      receiptSignature: fixtureWatchdogSignature,
      receipt: buildSignedWatchdogReceipt(unsigned, {
        keyId: fixtureWatchdogSignature.keyId,
        privateKeyPkcs8Base64: fixtureWatchdogPrivateKey.toString("base64"),
      }),
    },
  };
}

function productionFixtureEnvironment() {
  return {
    VERCEL_ENV: "production",
    VERCEL: "1",
    VERCEL_TARGET_ENV: "production",
    VERCEL_PROJECT_ID: "fixture-project-id",
    VERCEL_GIT_PROVIDER: "github",
    VERCEL_GIT_REPO_ID: "987654321",
    VERCEL_GIT_REPO_OWNER: "fixture-owner",
    VERCEL_GIT_REPO_SLUG: "fixture-repository",
    VERCEL_GIT_COMMIT_REF: "main",
    VERCEL_GIT_COMMIT_SHA: "b".repeat(40),
    VERCEL_DEPLOYMENT_ID: "dpl_fixturedeployment123456",
    VERCEL_URL: "fixture-deployment.vercel.app",
    VERCEL_PROJECT_PRODUCTION_URL: "fixture-production.example.invalid",
    GHL_WEBHOOK_URL: "https://fixture-webhook.example.invalid/lead",
    LEAD_PROTECTION_SECRET: "fixture-protection-secret-".padEnd(72, "p"),
    TURSO_DATABASE_URL: "libsql://fixture-database.example.invalid",
    TURSO_AUTH_TOKEN: "fixture-application-turso-secret",
    GHL_PRIVATE_INTEGRATION_TOKEN: "fixture-application-ghl-secret",
    GHL_LOCATION_ID: "fixture-location",
    GHL_WEBSITE_PIPELINE_ID: "fixture-pipeline",
    GHL_WEBSITE_SUBMITTED_STAGE_ID: "fixture-submitted-stage",
    CRON_SECRET: "fixture-cron-secret-".padEnd(48, "c"),
    SEO_HEALTH_ATTESTATION_SECRET: "fixture-attestation-secret-".padEnd(48, "a"),
    SEO_HEALTH_GITHUB_READ_TOKEN: "ghs_fixture-read-only-token-1234567890",
    SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY: "fixture-archive-signing-private-key",
    SEO_HEALTH_VERCEL_CONTROL_TOKEN: "fixture-vercel-control-token-that-must-stay-out-of-production",
    SEO_HEALTH_TURSO_DATABASE_URL: "libsql://fixture-database.example.invalid",
    SEO_HEALTH_TURSO_AUTH_TOKEN: "fixture-seo-health-turso-secret",
    SEO_HEALTH_GHL_READ_TOKEN: "fixture-seo-health-ghl-secret",
  };
}

async function runProductionGateFixture({ config, manifest, environment }) {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "seo-health-production-gate-"));
  try {
    await mkdir(join(fixtureRoot, "config"));
    await writeFile(
      join(fixtureRoot, "config", "seo-operational-health.json"),
      `${JSON.stringify(config, null, 2)}\n`,
      { mode: 0o600 },
    );
    await writeFile(
      join(fixtureRoot, "vercel.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      { mode: 0o600 },
    );
    return spawnSync(process.execPath, [productionGatePath], {
      cwd: fixtureRoot,
      encoding: "utf8",
      env: { ...environment },
      timeout: 15_000,
    });
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}

function outputOf(result) {
  return `${result.stdout || ""}\n${result.stderr || ""}`;
}

function assertNoFixtureSecrets(output, environment) {
  for (const name of [
    "LEAD_PROTECTION_SECRET",
    "TURSO_AUTH_TOKEN",
    "GHL_PRIVATE_INTEGRATION_TOKEN",
    "CRON_SECRET",
    "SEO_HEALTH_ATTESTATION_SECRET",
    "SEO_HEALTH_GITHUB_READ_TOKEN",
    "SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY",
    "SEO_HEALTH_TURSO_AUTH_TOKEN",
    "SEO_HEALTH_GHL_READ_TOKEN",
  ]) {
    const secret = environment[name];
    requireCondition(!output.includes(secret), `production gate output exposed fixture variable ${name}`);
  }
}

const config = JSON.parse(await readFile(new URL("config/seo-operational-health.json", repositoryRoot), "utf8"));
const manifest = JSON.parse(await readFile(new URL("vercel.json", repositoryRoot), "utf8"));
const cronOff = JSON.parse(await readFile(new URL("ops/vercel.cron-off.json", repositoryRoot), "utf8"));
validateRollout(config, manifest);
requireCondition(
  healthCronEntries(manifest).length === 0,
  "the active Vercel manifest must never contain the SEO health cron",
);
requireCondition(
  jsonEqual(cronOff, manifest),
  "ops/vercel.cron-off.json must deep-equal the active Vercel manifest",
);
requireCondition(
  jsonEqual(cronOff, manifestWithoutHealthCron(manifest)),
  "cron-off recovery must differ from the active manifest by no field other than a removed SEO health cron",
);

const fixedNow = new Date("2026-08-31T16:00:00.000Z");
const isolatedManifest = minimalManifest(false);
const canaryConfig = {
  ...structuredClone(config),
  rolloutPhase: "canary",
  checkpointDates: {},
  canaryDates: ["2027-01-02"],
  canaryReceipt: null,
  archiveSignature: fixtureArchiveSignature,
  schedulerContinuity: fixtureSchedulerContinuity(config.deploymentBinding.fingerprints.gitRepoIdSha256),
};
validateRollout(canaryConfig, isolatedManifest, fixedNow);
expectInvalid(
  {
    ...canaryConfig,
    archiveSignature: { algorithm: "Ed25519", keyId: "", publicKeySpkiBase64: "" },
  },
  isolatedManifest,
  "valid pinned Ed25519 archive public key",
  fixedNow,
);
validateRollout({
  ...structuredClone(config),
  rolloutPhase: "permanent",
  checkpointDates: structuredClone(config.checkpointCalendar),
  canaryDates: [],
  canaryReceipt: {
    checkpointId: "production-canary-2027-01-02",
    scheduledDate: "2027-01-02",
    finishedAt: "2027-01-02T12:17:01.000Z",
    commentId: 123456,
    commentBodySha256: "b".repeat(64),
    deploymentFingerprint: "c".repeat(64),
    evidenceDigest: "d".repeat(64),
    healthSourceDigest: currentHealthSourceDigest,
    githubSha: "e".repeat(40),
  },
  archiveSignature: fixtureArchiveSignature,
  schedulerContinuity: fixtureSchedulerContinuity(config.deploymentBinding.fingerprints.gitRepoIdSha256),
}, isolatedManifest, fixedNow);
expectInvalid({ ...canaryConfig, canaryDates: [] }, isolatedManifest, "exactly one date", fixedNow);
expectInvalid(
  { ...canaryConfig, canaryDates: ["2027-01-02", "2027-01-03"] },
  isolatedManifest,
  "exactly one date",
  fixedNow,
);
expectInvalid(
  {
    ...canaryConfig,
    checkpointCalendar: { ...canaryConfig.checkpointCalendar, "2027-01-02": "collision" },
  },
  isolatedManifest,
  "may not overlap",
  fixedNow,
);
expectInvalid(
  { ...canaryConfig, checkpointCalendar: { "2026-09-02": "" } },
  isolatedManifest,
  "nonempty and safe",
  fixedNow,
);
expectInvalid(
  {
    ...canaryConfig,
    checkpointCalendar: {
      "2026-09-02": "duplicate-checkpoint",
      "2026-09-09": "duplicate-checkpoint",
    },
  },
  isolatedManifest,
  "must be unique",
  fixedNow,
);
expectInvalid(
  { ...canaryConfig, checkpointDates: { "2026-09-02": "technical-2026-09-02" } },
  isolatedManifest,
  "disable checkpoint execution",
  fixedNow,
);
expectInvalid(
  {
    ...structuredClone(config),
    rolloutPhase: "permanent",
    checkpointDates: {},
    canaryDates: [],
    canaryReceipt: {
      checkpointId: "production-canary-2027-01-02",
      scheduledDate: "2027-01-02",
      finishedAt: "2027-01-02T12:17:01.000Z",
      commentId: 123456,
      commentBodySha256: "b".repeat(64),
      deploymentFingerprint: "c".repeat(64),
      evidenceDigest: "d".repeat(64),
      healthSourceDigest: currentHealthSourceDigest,
      githubSha: "e".repeat(40),
    },
    archiveSignature: fixtureArchiveSignature,
  },
  isolatedManifest,
  "complete checkpoint calendar",
  fixedNow,
);
expectInvalid(
  {
    ...structuredClone(config),
    rolloutPhase: "permanent",
    checkpointDates: structuredClone(config.checkpointCalendar),
    canaryDates: [],
    canaryReceipt: null,
    archiveSignature: fixtureArchiveSignature,
  },
  isolatedManifest,
  "accepted canary receipt",
  fixedNow,
);
expectInvalid(config, minimalManifest(true), "must never schedule", fixedNow);

expectInvalid(
  {
    ...canaryConfig,
    schedulerContinuity: structuredClone(config.schedulerContinuity),
  },
  isolatedManifest,
  "signed fresh external GitHub App watchdog receipt",
  fixedNow,
);
const sourceMismatchPermanent = {
  ...structuredClone(config),
  rolloutPhase: "permanent",
  checkpointDates: structuredClone(config.checkpointCalendar),
  canaryDates: [],
  canaryReceipt: {
    checkpointId: "production-canary-2027-01-02",
    scheduledDate: "2027-01-02",
    finishedAt: "2027-01-02T12:17:01.000Z",
    commentId: 123456,
    commentBodySha256: "b".repeat(64),
    deploymentFingerprint: "c".repeat(64),
    evidenceDigest: "d".repeat(64),
    healthSourceDigest: "0".repeat(64),
    githubSha: "e".repeat(40),
  },
  archiveSignature: fixtureArchiveSignature,
  schedulerContinuity: fixtureSchedulerContinuity(config.deploymentBinding.fingerprints.gitRepoIdSha256),
};
expectInvalid(sourceMismatchPermanent, isolatedManifest, "accepted canary receipt", fixedNow);

function missedHistoryEntry(date, checkpointId, index) {
  const nextDate = new Date(`${date}T12:00:00.000Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return {
    status: "missed",
    checkpointId,
    scheduledDate: date,
    detectedAt: nextDate.toISOString(),
    reasonCode: "SEO_HEALTH_SCHEDULED_RUN_MISSED",
    commentId: 9000 + index,
    commentBodySha256: String(index + 1).repeat(64).slice(0, 64),
    githubSha: "e".repeat(40),
  };
}
const historyNow = new Date("2026-09-11T16:00:00.000Z");
const historyConfig = {
  ...structuredClone(config),
  rolloutPhase: "permanent",
  checkpointDates: structuredClone(config.checkpointCalendar),
  canaryDates: [],
  canaryReceipt: {
    checkpointId: "production-canary-2026-09-01",
    scheduledDate: "2026-09-01",
    finishedAt: "2026-09-01T12:17:01.000Z",
    commentId: 123456,
    commentBodySha256: "b".repeat(64),
    deploymentFingerprint: "c".repeat(64),
    evidenceDigest: "d".repeat(64),
    healthSourceDigest: currentHealthSourceDigest,
    githubSha: "e".repeat(40),
  },
  checkpointHistory: {
    "2026-09-02": missedHistoryEntry("2026-09-02", config.checkpointCalendar["2026-09-02"], 1),
    "2026-09-09": missedHistoryEntry("2026-09-09", config.checkpointCalendar["2026-09-09"], 2),
  },
  archiveSignature: fixtureArchiveSignature,
  schedulerContinuity: fixtureSchedulerContinuity(
    config.deploymentBinding.fingerprints.gitRepoIdSha256,
    "2026-09-10T12:00:00.000Z",
  ),
};
validateRollout(historyConfig, isolatedManifest, historyNow);
const missingHistory = structuredClone(historyConfig);
delete missingHistory.checkpointHistory["2026-09-09"];
expectInvalid(
  missingHistory,
  isolatedManifest,
  "every past checkpoint",
  historyNow,
);
const forgedHistory = structuredClone(historyConfig);
forgedHistory.checkpointHistory["2026-09-02"].reasonCode = "not-safe";
expectInvalid(
  forgedHistory,
  isolatedManifest,
  "canonical archived receipt or signed missed-checkpoint incident reference",
  historyNow,
);

const fixtureEnvironment = productionFixtureEnvironment();
const siteEnvironment = { ...fixtureEnvironment };
delete siteEnvironment.SEO_HEALTH_ATTESTATION_SECRET;
delete siteEnvironment.SEO_HEALTH_GITHUB_READ_TOKEN;
delete siteEnvironment.SEO_HEALTH_TURSO_DATABASE_URL;
delete siteEnvironment.SEO_HEALTH_TURSO_AUTH_TOKEN;
delete siteEnvironment.SEO_HEALTH_GHL_READ_TOKEN;
delete siteEnvironment.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY;
delete siteEnvironment.SEO_HEALTH_VERCEL_CONTROL_TOKEN;
let fixtureResult = await runProductionGateFixture({
  config: productionFixtureConfig({
    phase: "disabled",
    withCredentialPins: false,
    values: siteEnvironment,
  }),
  manifest: minimalManifest(false),
  environment: siteEnvironment,
});
let fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status === 0, "cron-off Production build unexpectedly required provider health secrets");
requireCondition(
  fixtureOutput.includes("static isolated SEO health controls"),
  "disabled Production bootstrap did not report static health-control readiness",
);
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

// A diagnostic must identify known public aliases without accepting them or
// printing an unknown value that might accidentally contain a credential.
const canonicalSiteEnvironment = {
  ...siteEnvironment,
  VERCEL_PROJECT_PRODUCTION_URL: "dmvtitleguy.io",
};
const canonicalSiteConfig = productionFixtureConfig({
  phase: "disabled",
  withCredentialPins: false,
  values: canonicalSiteEnvironment,
});
fixtureResult = await runProductionGateFixture({
  config: canonicalSiteConfig,
  manifest: isolatedManifest,
  environment: canonicalSiteEnvironment,
});
requireCondition(fixtureResult.status === 0, "the exact pinned canonical hostname was rejected");
assertNoFixtureSecrets(outputOf(fixtureResult), fixtureEnvironment);

const wrongHostnamePinConfig = structuredClone(canonicalSiteConfig);
wrongHostnamePinConfig.deploymentBinding.fingerprints.productionHostnameSha256 = "0".repeat(64);
fixtureResult = await runProductionGateFixture({
  config: wrongHostnamePinConfig,
  manifest: isolatedManifest,
  environment: canonicalSiteEnvironment,
});
fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status === 1, "a recognized hostname bypassed a mismatched fingerprint");
requireCondition(
  fixtureOutput.includes("Production hostname fingerprint mismatch (VERCEL_PROJECT_PRODUCTION_URL=dmvtitleguy.io)"),
  "canonical hostname diagnostic was missing after a fingerprint mismatch",
);
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

for (const [value, expectedDiagnostic] of [
  [undefined, "missing"],
  ["", "empty"],
  ["www.dmvtitleguy.io", "www.dmvtitleguy.io"],
  ["dmvtitleguy.com", "dmvtitleguy.com"],
  ["www.dmvtitleguy.com", "www.dmvtitleguy.com"],
  ["dmvtitleguy.vercel.app", "dmvtitleguy.vercel.app"],
  ["unknown.example.invalid", "other-redacted"],
  ["https://dmvtitleguy.io", "other-redacted"],
  ["dmvtitleguy.io ", "other-redacted"],
  ["dmvtitleguy.io\nfixture-injected-log-entry", "other-redacted"],
  [fixtureEnvironment.TURSO_AUTH_TOKEN, "other-redacted"],
  ["fixture-oversized-input-".repeat(500), "other-redacted"],
]) {
  const environment = { ...canonicalSiteEnvironment };
  if (value === undefined) delete environment.VERCEL_PROJECT_PRODUCTION_URL;
  else environment.VERCEL_PROJECT_PRODUCTION_URL = value;
  const result = await runProductionGateFixture({
    config: canonicalSiteConfig,
    manifest: isolatedManifest,
    environment,
  });
  const output = outputOf(result);
  requireCondition(result.status === 1, "a noncanonical hostname did not fail closed");
  requireCondition(
    output.includes(`Production hostname fingerprint mismatch (VERCEL_PROJECT_PRODUCTION_URL=${expectedDiagnostic})`),
    "hostname mismatch did not include the bounded diagnostic",
  );
  if (expectedDiagnostic === "other-redacted") {
    requireCondition(!output.includes(value), "hostname diagnostic exposed unknown environment input");
  }
  assertNoFixtureSecrets(output, fixtureEnvironment);
}

const siteEnvironmentWithAttestation = {
  ...siteEnvironment,
  SEO_HEALTH_ATTESTATION_SECRET: fixtureEnvironment.SEO_HEALTH_ATTESTATION_SECRET,
};
fixtureResult = await runProductionGateFixture({
  config: productionFixtureConfig({
    phase: "disabled",
    withCredentialPins: false,
    values: siteEnvironmentWithAttestation,
  }),
  manifest: minimalManifest(false),
  environment: siteEnvironmentWithAttestation,
});
fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status === 0, "valid optional disabled-rollout attestation secret was rejected");
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

const invalidCanaryConfig = productionFixtureConfig({
  phase: "canary",
  withCredentialPins: false,
  values: siteEnvironment,
});
invalidCanaryConfig.checkpointDates = structuredClone(invalidCanaryConfig.checkpointCalendar);
fixtureResult = await runProductionGateFixture({
  config: invalidCanaryConfig,
  manifest: isolatedManifest,
  environment: siteEnvironmentWithAttestation,
});
fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status !== 0, "canary with checkpoint execution enabled unexpectedly passed");
requireCondition(
  fixtureOutput.includes("canary rollout must disable checkpoints"),
  "invalid canary failed without the expected safe error",
);
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

fixtureResult = await runProductionGateFixture({
  config: productionFixtureConfig({
    phase: "disabled",
    withCredentialPins: true,
    values: fixtureEnvironment,
  }),
  manifest: isolatedManifest,
  environment: fixtureEnvironment,
});
fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status !== 0, "isolated health credentials unexpectedly passed into the Vercel site gate");
requireCondition(
  fixtureOutput.includes("isolated health credentials must not be present"),
  "forbidden isolated health credentials failed without the expected safe error",
);
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

const githubCredentialSiteEnvironment = {
  ...siteEnvironment,
  SEO_HEALTH_GITHUB_READ_TOKEN: fixtureEnvironment.SEO_HEALTH_GITHUB_READ_TOKEN,
};
fixtureResult = await runProductionGateFixture({
  config: productionFixtureConfig({
    phase: "disabled",
    withCredentialPins: false,
    values: githubCredentialSiteEnvironment,
  }),
  manifest: isolatedManifest,
  environment: githubCredentialSiteEnvironment,
});
fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status !== 0, "a GitHub read credential unexpectedly passed into the Vercel site gate");
requireCondition(
  fixtureOutput.includes("isolated health credentials must not be present"),
  "the forbidden Vercel GitHub credential failed without the expected safe error",
);
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

const malformedAttestationEnvironment = {
  ...siteEnvironment,
  SEO_HEALTH_ATTESTATION_SECRET: "too-short",
};
fixtureResult = await runProductionGateFixture({
  config: productionFixtureConfig({
    phase: "disabled",
    withCredentialPins: false,
    values: malformedAttestationEnvironment,
  }),
  manifest: isolatedManifest,
  environment: malformedAttestationEnvironment,
});
fixtureOutput = outputOf(fixtureResult);
requireCondition(fixtureResult.status !== 0, "malformed optional attestation secret unexpectedly passed the Production gate");
requireCondition(
  fixtureOutput.includes("must be absent or contain at least 32 random bytes while rollout is disabled"),
  "malformed optional attestation secret failed without the expected safe error",
);
assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);

for (const phase of ["canary", "permanent"]) {
  fixtureResult = await runProductionGateFixture({
    config: productionFixtureConfig({
      phase,
      withCredentialPins: false,
      values: siteEnvironment,
    }),
    manifest: isolatedManifest,
    environment: siteEnvironment,
  });
  fixtureOutput = outputOf(fixtureResult);
  requireCondition(fixtureResult.status !== 0, `${phase} rollout unexpectedly passed without an attestation secret`);
  requireCondition(
    fixtureOutput.includes("must contain at least 32 random bytes for canary or permanent rollout"),
    `${phase} rollout failed without the expected attestation error`,
  );
  assertNoFixtureSecrets(fixtureOutput, fixtureEnvironment);
}

console.log(
  "SEO operational-health rollout verification passed: isolated scheduling, phases, cron-off parity, attestation, and secret redaction are locked",
);
