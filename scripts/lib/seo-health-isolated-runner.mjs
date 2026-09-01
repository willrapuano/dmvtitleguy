import {
  SEO_HEALTH_ATTESTATION_CONTRACT,
  deploymentFingerprintFromAttestationEnvironment,
} from "../../src/lib/seo-health-deployment-attestation.ts";
import {
  SEO_CHANGE_AUTHORIZATION,
  SEO_OPERATIONAL_HEALTH_SCOPE,
  fixedDigestEqual,
  isSha256,
  isVercelDeploymentHostname,
  resolveSeoHealthSchedule,
  sha256,
  stableJsonDigest,
} from "../../src/lib/seo-operational-health-contract.ts";

const ATTESTATION_KEYS = [
  "schemaVersion",
  "contractVersion",
  "scope",
  "healthy",
  "complete",
  "environment",
  "deploymentFingerprint",
  "bindings",
];
const ATTESTATION_BINDING_KEYS = [
  "vercelSystem",
  "production",
  "targetProduction",
  "projectFingerprint",
  "gitSource",
  "gitCommit",
  "deployment",
  "productionHostname",
  "origin",
];
const ATTESTED_ENVIRONMENT_KEYS = [
  "VERCEL",
  "VERCEL_ENV",
  "VERCEL_TARGET_ENV",
  "VERCEL_PROJECT_ID",
  "VERCEL_DEPLOYMENT_ID",
  "VERCEL_URL",
  "VERCEL_GIT_PROVIDER",
  "VERCEL_GIT_REPO_ID",
  "VERCEL_GIT_REPO_OWNER",
  "VERCEL_GIT_REPO_SLUG",
  "VERCEL_GIT_COMMIT_REF",
  "VERCEL_GIT_COMMIT_SHA",
  "VERCEL_PROJECT_PRODUCTION_URL",
];
const PROVIDER_ENVIRONMENT_KEYS = [
  "SEO_HEALTH_TURSO_DATABASE_URL",
  "SEO_HEALTH_TURSO_AUTH_TOKEN",
  "SEO_HEALTH_GHL_READ_TOKEN",
  "GHL_LOCATION_ID",
  "GHL_WEBSITE_PIPELINE_ID",
  "GHL_WEBSITE_SUBMITTED_STAGE_ID",
];
const APPLICATION_WRITE_TOKEN_KEYS = [
  "TURSO_AUTH_TOKEN",
  "GHL_PRIVATE_INTEGRATION_TOKEN",
];

export class SeoHealthIsolatedRunnerError extends Error {
  constructor(code) {
    super(code);
    this.name = "SeoHealthIsolatedRunnerError";
    this.code = code;
  }
}

function fail(code) {
  throw new SeoHealthIsolatedRunnerError(code);
}

function record(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function hasExactKeys(value, expectedKeys) {
  const item = record(value);
  if (!item) return false;
  const actual = Object.keys(item).sort();
  const expected = [...expectedKeys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

export function resolveIsolatedSchedule(config, now = new Date()) {
  if (config?.scheduler !== "github-actions") fail("ISOLATED_SCHEDULER_MISMATCH");
  const match = resolveSeoHealthSchedule(now, config);
  if (!match.due || !match.checkpointId || match.runKind === "off-date") return match;
  if (![
    config.rolloutPhase === "canary" && match.runKind === "canary",
    config.rolloutPhase === "permanent" && match.runKind === "checkpoint",
  ].some(Boolean)) {
    fail("ISOLATED_ROLLOUT_PHASE_MISMATCH");
  }
  return match;
}

export function pinnedIsolatedScheduleFromEnvironment(config, env = process.env) {
  if (config?.scheduler !== "github-actions") fail("ISOLATED_SCHEDULER_MISMATCH");
  const effectiveDate = env.SEO_HEALTH_SCHEDULE_EFFECTIVE_DATE;
  const checkpointId = env.SEO_HEALTH_SCHEDULE_CHECKPOINT_ID;
  const runKind = env.SEO_HEALTH_SCHEDULE_RUN_KIND;
  const parsedEffectiveDate = Date.parse(`${effectiveDate || ""}T00:00:00.000Z`);
  const validEffectiveDate = /^\d{4}-\d{2}-\d{2}$/.test(effectiveDate || "")
    && Number.isFinite(parsedEffectiveDate)
    && new Date(parsedEffectiveDate).toISOString().slice(0, 10) === effectiveDate;
  if (
    env.SEO_HEALTH_SCHEDULE_DUE !== "true"
    || !validEffectiveDate
    || !/^[a-z0-9][a-z0-9._-]{0,127}$/.test(checkpointId || "")
    || !["checkpoint", "canary"].includes(runKind)
  ) fail("ISOLATED_PINNED_SCHEDULE_INVALID");

  const checkpointExpected = runKind === "checkpoint"
    && config.rolloutPhase === "permanent"
    && config.checkpointDates?.[effectiveDate] === checkpointId;
  const canaryExpected = runKind === "canary"
    && config.rolloutPhase === "canary"
    && config.canaryDates?.includes(effectiveDate)
    && checkpointId === `production-canary-${effectiveDate}`;
  if (!checkpointExpected && !canaryExpected) fail("ISOLATED_PINNED_SCHEDULE_MISMATCH");
  return Object.freeze({
    due: true,
    effectiveDate,
    checkpointId,
    runKind,
  });
}

export function validateRemoteAttestation(value, config, github) {
  if (!hasExactKeys(value, ATTESTATION_KEYS)) fail("ISOLATED_ATTESTATION_SHAPE_INVALID");
  if (!hasExactKeys(value.environment, ATTESTED_ENVIRONMENT_KEYS)) {
    fail("ISOLATED_ATTESTATION_ENVIRONMENT_INVALID");
  }
  if (!hasExactKeys(value.bindings, ATTESTATION_BINDING_KEYS)) {
    fail("ISOLATED_ATTESTATION_BINDINGS_INVALID");
  }
  if (
    value.schemaVersion !== config.schemaVersion
    || value.contractVersion !== SEO_HEALTH_ATTESTATION_CONTRACT
    || value.scope !== SEO_OPERATIONAL_HEALTH_SCOPE
    || value.healthy !== true
    || value.complete !== true
    || Object.values(value.bindings).some((binding) => binding !== true)
  ) {
    fail("ISOLATED_ATTESTATION_FAILED");
  }
  const environment = value.environment;
  const expectedFingerprint = deploymentFingerprintFromAttestationEnvironment(environment);
  if (
    !isSha256(value.deploymentFingerprint)
    || !fixedDigestEqual(value.deploymentFingerprint, expectedFingerprint)
    || environment.VERCEL !== "1"
    || environment.VERCEL_ENV !== "production"
    || environment.VERCEL_TARGET_ENV !== "production"
    || environment.VERCEL_GIT_PROVIDER !== config.deploymentBinding.gitProvider
    || environment.VERCEL_GIT_COMMIT_REF !== config.deploymentBinding.productionBranch
    || !/^[a-f0-9]{40}$/.test(environment.VERCEL_GIT_COMMIT_SHA)
    || !/^dpl_[A-Za-z0-9]{16,}$/.test(environment.VERCEL_DEPLOYMENT_ID)
    || !isVercelDeploymentHostname(environment.VERCEL_URL)
  ) {
    fail("ISOLATED_ATTESTATION_IDENTITY_INVALID");
  }
  if (
    !fixedDigestEqual(sha256(environment.VERCEL_PROJECT_ID), config.deploymentBinding.fingerprints.projectIdSha256)
    || !fixedDigestEqual(sha256(environment.VERCEL_GIT_REPO_ID), config.deploymentBinding.fingerprints.gitRepoIdSha256)
    || !fixedDigestEqual(sha256(environment.VERCEL_GIT_REPO_OWNER), config.deploymentBinding.fingerprints.gitRepoOwnerSha256)
    || !fixedDigestEqual(sha256(environment.VERCEL_GIT_REPO_SLUG), config.deploymentBinding.fingerprints.gitRepoSlugSha256)
    || !fixedDigestEqual(
      sha256(environment.VERCEL_PROJECT_PRODUCTION_URL),
      config.deploymentBinding.fingerprints.productionHostnameSha256,
    )
  ) {
    fail("ISOLATED_ATTESTATION_PIN_MISMATCH");
  }
  if (
    github.actions !== "true"
    || github.repository !== `${environment.VERCEL_GIT_REPO_OWNER}/${environment.VERCEL_GIT_REPO_SLUG}`
    || github.refName !== config.deploymentBinding.productionBranch
    || github.sha !== environment.VERCEL_GIT_COMMIT_SHA
  ) {
    fail("ISOLATED_GITHUB_DEPLOYMENT_MISMATCH");
  }
  return {
    environment: Object.fromEntries(
      ATTESTED_ENVIRONMENT_KEYS.map((key) => [key, environment[key]]),
    ),
    deploymentFingerprint: value.deploymentFingerprint,
  };
}

export function assertMatchingAttestations(canonical, deployment) {
  if (!fixedDigestEqual(stableJsonDigest(canonical), stableJsonDigest(deployment))) {
    fail("ISOLATED_ATTESTATION_HOST_MISMATCH");
  }
}

export function createIsolatedRunnerEnvironment(attestedEnvironment, providerEnvironment) {
  if (APPLICATION_WRITE_TOKEN_KEYS.some((key) => Object.hasOwn(providerEnvironment, key))) {
    fail("ISOLATED_WRITE_CREDENTIAL_PRESENT");
  }
  const provider = {};
  for (const key of PROVIDER_ENVIRONMENT_KEYS) {
    const value = providerEnvironment[key];
    if (typeof value !== "string" || !value) fail("ISOLATED_PROVIDER_ENVIRONMENT_INCOMPLETE");
    provider[key] = value;
  }
  return {
    ...Object.fromEntries(
      ATTESTED_ENVIRONMENT_KEYS.map((key) => [key, attestedEnvironment[key]]),
    ),
    ...provider,
  };
}

export function terminalEventFromProjection(projection, github, healthSourceDigest) {
  if (
    !projection
    || projection.healthy !== true
    || projection.completeness?.complete !== true
    || projection.seoChangeAuthorization?.authorized !== false
    || projection.seoChangeAuthorization?.reason !== SEO_CHANGE_AUTHORIZATION.reason
    || !/^[1-9]\d{0,19}$/.test(github?.runId || "")
    || !/^[1-9]\d{0,19}$/.test(github?.runAttempt || "")
    || !/^[a-f0-9]{40}$/.test(github?.sha || "")
    || !isSha256(healthSourceDigest)
  ) {
    fail("ISOLATED_TERMINAL_PROJECTION_INVALID");
  }
  return {
    schemaVersion: projection.schemaVersion,
    event: "seo-operational-health.finish",
    contractVersion: projection.contractVersion,
    scope: projection.scope,
    runKind: projection.checkpoint.runKind,
    scheduledDate: projection.checkpoint.scheduledDate,
    checkpointId: projection.checkpoint.id,
    startedAt: projection.observation.startedAt,
    finishedAt: projection.observation.finishedAt,
    durationMs: projection.observation.durationMs,
    healthy: true,
    complete: true,
    httpOutcome: 200,
    evidenceDigest: projection.observation.evidenceDigest,
    healthSourceDigest,
    deploymentFingerprint: projection.observation.deploymentFingerprint,
    bindings: {
      ...projection.bindings,
      githubDeploymentProvenance: true,
    },
    incidentCodes: [],
    incidentDistinctBySeverity: { P0: 0, P1: 0 },
    seoChangeAuthorized: false,
    requests: projection.requests,
    githubRunId: github.runId,
    githubRunAttempt: github.runAttempt,
    githubSha: github.sha,
  };
}

export function safeRunnerFailure(code, context = {}) {
  return {
    schemaVersion: 1,
    event: "seo-operational-health.failure",
    healthy: false,
    complete: false,
    checkpointId: typeof context.checkpointId === "string" ? context.checkpointId : null,
    scheduledDate: typeof context.scheduledDate === "string" ? context.scheduledDate : null,
    runKind: context.runKind === "checkpoint" || context.runKind === "canary" ? context.runKind : null,
    code: typeof code === "string" && /^[A-Z0-9_]{3,96}$/.test(code)
      ? code
      : "ISOLATED_RUNNER_FAILED",
    seoChangeAuthorized: false,
  };
}
