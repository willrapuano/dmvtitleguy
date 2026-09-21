import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  canonicalFingerprint,
  dateInTimeZone,
  fixedDigestEqual,
  ghlTargetFingerprint,
  isAuthorizedCronRequest,
  resolveSeoHealthSchedule,
  sha256,
  stableJsonDigest,
  strictBoolean,
  SEO_CHANGE_AUTHORIZATION,
  SeoOperationalHealthError,
} from "../src/lib/seo-operational-health-contract.ts";
import {
  createSeoOperationalHealthHandler,
  methodNotAllowed,
} from "../src/lib/seo-operational-health-handler.ts";
import { computeSeoHealthSourceDigest } from "./lib/seo-health-source-digest.mjs";
import { evaluateSeoHealthRolloutControls } from "./lib/seo-health-rollout-controls.mjs";
import { validateWatchdogConfig } from "./lib/seo-health-watchdog-receipt.mjs";

const repositoryRoot = new URL("../", import.meta.url);
const config = JSON.parse(await readFile(new URL("config/seo-operational-health.json", repositoryRoot), "utf8"));
const packageJson = JSON.parse(await readFile(new URL("package.json", repositoryRoot), "utf8"));
const vercel = JSON.parse(await readFile(new URL("vercel.json", repositoryRoot), "utf8"));
const cronOff = JSON.parse(await readFile(new URL("ops/vercel.cron-off.json", repositoryRoot), "utf8"));
const runnerSource = await readFile(new URL("src/lib/seo-operational-health.ts", repositoryRoot), "utf8");
const productionGateSource = await readFile(new URL("scripts/verify-production-env.mjs", repositoryRoot), "utf8");
const crmSource = await readFile(new URL("src/lib/ghl-crm.ts", repositoryRoot), "utf8");
const operationsContract = await readFile(new URL("docs/seo-checkpoint-operations-2026-08-26.md", repositoryRoot), "utf8");
const codeownersSource = await readFile(new URL(".github/CODEOWNERS", repositoryRoot), "utf8");
const schedulerWorkflow = await readFile(new URL(".github/workflows/seo-operational-health.yml", repositoryRoot), "utf8");
const scheduleResolverSource = await readFile(new URL("scripts/resolve-seo-operational-health-schedule.mjs", repositoryRoot), "utf8");
const preAttestationSource = await readFile(new URL("scripts/preflight-seo-operational-health-attestation.mjs", repositoryRoot), "utf8");
const providerProcessSource = await readFile(new URL("scripts/run-seo-operational-health-provider.mjs", repositoryRoot), "utf8");
const archiveProcessSource = await readFile(new URL("scripts/archive-seo-operational-health.mjs", repositoryRoot), "utf8");
const receiptVerifierSource = await readFile(new URL("scripts/lib/seo-health-canary-receipt.mjs", repositoryRoot), "utf8");
const evidenceArchiveSource = await readFile(new URL("scripts/lib/seo-health-evidence-archive.mjs", repositoryRoot), "utf8");
const currentHealthSourceDigest = await computeSeoHealthSourceDigest();
assert.match(currentHealthSourceDigest, /^[a-f0-9]{64}$/);

const expectedDates = [
  "2026-09-02",
  "2026-09-09",
  "2026-09-23",
  "2026-09-26",
  "2026-09-30",
  "2026-10-25",
  "2026-11-24",
  "2027-02-22",
];
assert.deepEqual(Object.keys(config.checkpointCalendar), expectedDates);
assert.ok(["disabled", "canary", "permanent"].includes(config.rolloutPhase));
if (config.rolloutPhase === "disabled") {
  assert.deepEqual(config.checkpointDates, {});
  assert.deepEqual(config.canaryDates, []);
  assert.equal(config.canaryReceipt, null);
} else if (config.rolloutPhase === "canary") {
  assert.deepEqual(config.checkpointDates, {});
  assert.equal(config.canaryDates.length, 1);
  assert.equal(Object.hasOwn(config.checkpointCalendar, config.canaryDates[0]), false);
  assert.equal(config.canaryReceipt, null);
} else {
  assert.deepEqual(config.checkpointDates, config.checkpointCalendar);
  assert.deepEqual(config.canaryDates, []);
  assert.ok(config.canaryReceipt && typeof config.canaryReceipt === "object");
  assert.equal(config.canaryReceipt.healthSourceDigest, currentHealthSourceDigest);
}
assert.ok(config.checkpointHistory && typeof config.checkpointHistory === "object");
assert.equal(Array.isArray(config.checkpointHistory), false);
assert.equal(config.schedulerContinuity.publicRepositoryInactivityDisableDays, 60);
assert.ok(config.schedulerContinuity.maximumDetectionMinutes > 0);
assert.ok(config.schedulerContinuity.maximumDetectionMinutes <= 60);
assert.equal(config.schedulerContinuity.maximumOwnerRecoveryHours, 24);
assert.equal(config.schedulerContinuity.maximumReceiptAgeHours, 168);
assert.equal(config.schedulerContinuity.maximumRecoveryDrillAgeDays, 30);
assert.equal(
  config.schedulerContinuity.independentWatchdog.workflowPathSha256,
  sha256(".github/workflows/seo-operational-health.yml"),
);
if (config.rolloutPhase !== "disabled") {
  const watchdog = config.schedulerContinuity.independentWatchdog;
  assert.equal(watchdog.provider, "external-github-app");
  assert.match(watchdog.monitorIdSha256, /^[a-f0-9]{64}$/);
  assert.match(watchdog.githubAppIdSha256, /^[a-f0-9]{64}$/);
  assert.match(watchdog.installationIdSha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(watchdog.requiredPermissions, { actions: "write", metadata: "read" });
  assert.ok(watchdog.receipt && typeof watchdog.receipt === "object");
}
assert.doesNotThrow(() => validateWatchdogConfig(config, { required: config.rolloutPhase !== "disabled" }));
assert.equal(config.timezone, "America/New_York");
assert.equal(config.origin, "https://dmvtitleguy.io");
assert.equal(config.scope, "live-operational-health-only");
assert.equal(config.scheduler, "github-actions");
assert.equal(config.permanentCronSchedule, "17 12 * * *");
assert.deepEqual(Object.keys(config.archiveSignature).sort(), [
  "algorithm",
  "keyId",
  "publicKeySpkiBase64",
]);
assert.equal(config.archiveSignature.algorithm, "Ed25519");
if (config.archiveSignature.keyId === "" || config.archiveSignature.publicKeySpkiBase64 === "") {
  assert.equal(config.archiveSignature.keyId, "");
  assert.equal(config.archiveSignature.publicKeySpkiBase64, "");
} else {
  assert.match(config.archiveSignature.keyId, /^[a-f0-9]{64}$/);
  assert.match(config.archiveSignature.publicKeySpkiBase64, /^[A-Za-z0-9+/]+={0,2}$/);
}
assert.equal(config.deploymentBinding.gitProvider, "github");
assert.equal(config.deploymentBinding.productionBranch, "main");
assert.deepEqual(config.deploymentBinding.githubDeployment, {
  environment: "Production",
  creatorLogin: "vercel[bot]",
  creatorId: 35613825,
  creatorType: "Bot",
  maxDeployments: 50,
});
assert.deepEqual(config.deploymentBinding.vercelControlPlane.requiredResourceScopes, [
  "read:deployment",
  "read:domain",
  "read:integration-configuration",
  "read:project",
]);
assert.equal(config.deploymentBinding.vercelControlPlane.canonicalAlias, "dmvtitleguy.io");
assert.equal(config.deploymentBinding.vercelControlPlane.projectSelection, "selected");
assert.match(config.deploymentBinding.vercelControlPlane.teamId, /^team_[A-Za-z0-9]{16,}$/);
for (const value of [
  config.deploymentBinding.vercelControlPlane.integrationConfigurationId,
  config.deploymentBinding.vercelControlPlane.integrationId,
  config.deploymentBinding.vercelControlPlane.integrationSlug,
  config.deploymentBinding.fingerprints.vercelControlTokenSha256,
]) assert.equal(typeof value, "string");
assert.match(config.deploymentBinding.fingerprints.projectIdSha256, /^[a-f0-9]{64}$/);
assert.match(config.deploymentBinding.fingerprints.gitRepoIdSha256, /^[a-f0-9]{64}$/);
assert.match(config.deploymentBinding.fingerprints.gitRepoOwnerSha256, /^[a-f0-9]{64}$/);
assert.match(config.deploymentBinding.fingerprints.gitRepoSlugSha256, /^[a-f0-9]{64}$/);
assert.match(config.deploymentBinding.fingerprints.productionHostnameSha256, /^[a-f0-9]{64}$/);
assert.match(config.fingerprints.databaseUrlSha256, /^[a-f0-9]{64}$/);
assert.match(config.fingerprints.ghlLocationIdSha256, /^[a-f0-9]{64}$/);
assert.match(config.fingerprints.ghlPipelineIdSha256, /^[a-f0-9]{64}$/);
assert.match(config.fingerprints.ghlSubmittedStageIdSha256, /^[a-f0-9]{64}$/);

assert.equal(dateInTimeZone(new Date("2026-09-02T03:59:59.999Z"), config.timezone), "2026-09-01");
assert.equal(dateInTimeZone(new Date("2026-09-02T04:00:00.000Z"), config.timezone), "2026-09-02");
assert.equal(dateInTimeZone(new Date("2027-02-22T04:59:59.999Z"), config.timezone), "2027-02-21");
assert.equal(dateInTimeZone(new Date("2027-02-22T05:00:00.000Z"), config.timezone), "2027-02-22");
const permanentSchedule = {
  ...config,
  checkpointDates: config.checkpointCalendar,
  canaryDates: [],
};
for (const date of expectedDates) {
  assert.equal(
    resolveSeoHealthSchedule(new Date(`${date}T15:00:00.000Z`), config).due,
    false,
    "disabled rollout must not execute a checkpoint",
  );
  const match = resolveSeoHealthSchedule(new Date(`${date}T15:00:00.000Z`), permanentSchedule);
  assert.equal(match.due, true);
  assert.equal(match.runKind, "checkpoint");
  assert.equal(match.effectiveDate, date);
}
assert.equal(resolveSeoHealthSchedule(new Date("2026-09-01T15:00:00.000Z"), config).due, false);

const secret = "s".repeat(32);
const deploymentHostname = "fixture-deployment.vercel.app";
const productionHostname = "dmvtitleguy.io";
const requestBinding = {
  deploymentHostname: () => deploymentHostname,
  productionHostname: () => productionHostname,
};
const cronUrl = `https://${deploymentHostname}/api/cron/seo-health`;
const cronHeaders = (authorization = `Bearer ${secret}`) => ({
  Authorization: authorization,
  Host: deploymentHostname,
  "User-Agent": "vercel-cron/1.0",
  "X-Vercel-Deployment-Url": deploymentHostname,
});
assert.equal(isAuthorizedCronRequest(null, secret), false);
assert.equal(isAuthorizedCronRequest(`Bearer ${secret}`, undefined), false);
assert.equal(isAuthorizedCronRequest(`Bearer ${"s".repeat(31)}`, secret), false);
assert.equal(isAuthorizedCronRequest(`Bearer ${secret}`, secret), true);
assert.equal(isAuthorizedCronRequest(`bearer ${secret}`, secret), false);

assert.equal(strictBoolean(true), true);
assert.equal(strictBoolean(" TRUE "), true);
assert.equal(strictBoolean(0), null);
assert.equal(strictBoolean("false"), false);
assert.equal(strictBoolean("yes"), null);
assert.equal(strictBoolean({ value: true }), null);
assert.equal(fixedDigestEqual(sha256("same"), sha256("same")), true);
assert.equal(fixedDigestEqual(sha256("left"), sha256("right")), false);
assert.equal(canonicalFingerprint(["ab", "c"]), sha256("2:ab|1:c"));
assert.equal(
  ghlTargetFingerprint({
    locationId: "location",
    pipelineId: "pipeline",
    submittedStageId: "stage",
    submissionIdFieldId: "submission-field",
    qaExcludedFieldId: "qa-field",
  }),
  sha256("13:ghl-target-v1|8:location|8:pipeline|5:stage|16:submission-field|8:qa-field"),
);

let calls = 0;
const dueSchedule = {
  timezone: config.timezone,
  checkpointDates: { "2026-09-02": "technical-2026-09-02" },
  canaryDates: [],
};
const healthyReport = {
  schemaVersion: 1,
  contractVersion: "seo-operational-health-test-v1",
  scope: "live-operational-health-only",
  healthy: true,
  checkpoint: {
    id: "technical-2026-09-02",
    scheduledDate: "2026-09-02",
    timezone: config.timezone,
    runKind: "checkpoint",
    scheduleDateMatched: true,
    historicalStateVerifiable: false,
  },
  completeness: {
    complete: true,
    ledgerSnapshot: true,
    outboxSnapshot: true,
    ghl: {
      declaredTotal: 1,
      retrieved: 1,
      pages: 1,
      cursorTerminal: true,
      stableTotal: true,
      detailsComplete: true,
    },
    publicPages: true,
  },
  observation: {
    startedAt: "2026-09-02T14:07:00.000Z",
    finishedAt: "2026-09-02T14:07:01.250Z",
    archiveRecorded: false,
    deploymentFingerprint: "b".repeat(64),
    evidenceDigest: "",
  },
  bindings: Object.fromEntries([
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
    "ghlFingerprint",
    "ghlCredentialFingerprint",
    "ghlReadScope",
    "pipelineAndStage",
    "customFields",
  ].map((key) => [key, true])),
  aggregates: {
    ledgerInventory: 1,
    ledgerQaExcluded: 0,
    ledgerNonQaInventory: 1,
    outboxInventory: 0,
    ghlInventory: 1,
    ghlQaExcluded: 0,
    mappedSubmissions: 1,
    reusedOpportunityCards: 0,
    qaParityMismatches: 0,
    unclassifiable: 0,
  },
  publicSite: {
    sitemap: { status: 200, structurallyValid: true },
    priorityPages: config.priorityPaths.map((path) => ({
      path,
      status: 200,
      canonicalMatches: true,
      noindex: false,
      sitemapListed: true,
    })),
    aliases: ["www", "http"].map((aliasType) => ({
      aliasType,
      status: 308,
      canonicalRedirect: true,
    })),
  },
  credentialScope: {
    turso: {
      permissionClaimsExact: true,
      permissionClaimEvidence: "exact-provider-jwt-claims",
      positiveReadsSucceeded: true,
      forbiddenReadDenied: true,
      denialEvidence: "structured-authorization-denial",
      tokenExpiryMetadataBound: true,
      lifetimeWithinPolicy: true,
      validThroughFinalCheckpoint: true,
      runtimeValid: true,
    },
    ghl: {
      scopeClaimsExact: true,
      locationClaimBound: true,
      scopeClaimEvidence: "exact-provider-jwt-claims",
      positiveReadsSucceeded: true,
      forbiddenContactReadDenied: true,
      denialEvidence: "structured-authorization-denial",
    },
  },
  notObservedByThisRoute: [
    "google-selected-canonical",
    "crawl-index-state",
    "gsc-sitemap-warnings",
    "finalized-gsc-window",
    "local-search-rank",
    "seo-decision-power",
  ],
  incidents: [],
  requests: { public: 8, ghl: 7 },
  seoChangeAuthorization: SEO_CHANGE_AUTHORIZATION,
};
delete healthyReport.observation.evidenceDigest;
healthyReport.observation.evidenceDigest = stableJsonDigest(healthyReport);
const expectedEvidence = {
  schemaVersion: healthyReport.schemaVersion,
  contractVersion: healthyReport.contractVersion,
  scope: healthyReport.scope,
};
const handlerDependencies = {
  expectedEvidence,
  expectedPublicSite: {
    priorityPaths: config.priorityPaths,
    aliasTypes: ["www", "http"],
  },
  maxEvidenceDurationMs: config.bounds.internalDeadlineMs,
  requestBinding,
  deploymentFingerprint: () => healthyReport.observation.deploymentFingerprint,
};
const handlerLogs = [];
const dueHandler = createSeoOperationalHealthHandler({
  ...handlerDependencies,
  schedule: dueSchedule,
  now: () => new Date("2026-09-02T14:07:00.000Z"),
  cronSecret: () => secret,
  run: async () => {
    calls += 1;
    return healthyReport;
  },
  log: (event, details) => handlerLogs.push({ event, details }),
});
let response = await dueHandler(new Request("https://dmvtitleguy.io/api/cron/seo-health"));
assert.equal(response.status, 401);
assert.equal(calls, 0);
response = await dueHandler(new Request(cronUrl, {
  headers: cronHeaders(),
}));
assert.equal(response.status, 200);
assert.equal(calls, 1);
assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
assert.equal((await response.json()).seoChangeAuthorization.authorized, false);
assert.deepEqual(handlerLogs.at(-1), {
  event: "finish",
  details: {
    schemaVersion: 1,
    contractVersion: "seo-operational-health-test-v1",
    scope: "live-operational-health-only",
    runKind: "checkpoint",
    scheduledDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    finishedAt: "2026-09-02T14:07:01.250Z",
    durationMs: 1250,
    healthy: true,
    complete: true,
    httpOutcome: 200,
    evidenceDigest: healthyReport.observation.evidenceDigest,
    deploymentFingerprint: "b".repeat(64),
    bindings: healthyReport.bindings,
    incidentCodes: [],
    incidentDistinctBySeverity: { P0: 0, P1: 0 },
    seoChangeAuthorized: false,
    requests: { public: 8, ghl: 7 },
  },
});

const malformedHealthyReports = [
  { ...healthyReport, completeness: { complete: false } },
  { ...healthyReport, observation: { ...healthyReport.observation, evidenceDigest: "not-a-digest" } },
  { ...healthyReport, observation: { evidenceDigest: healthyReport.observation.evidenceDigest } },
  { ...healthyReport, incidents: undefined },
  { ...healthyReport, incidents: [{ code: "unexpected", severity: "P0", count: 1 }] },
];
for (const malformed of malformedHealthyReports) {
  const malformedHandler = createSeoOperationalHealthHandler({
    ...handlerDependencies,
    schedule: dueSchedule,
    now: () => new Date("2026-09-02T14:07:00.000Z"),
    cronSecret: () => secret,
    run: async () => malformed,
  });
  const malformedResponse = await malformedHandler(new Request(cronUrl, { headers: cronHeaders() }));
  assert.equal(malformedResponse.status, 503, "malformed terminal evidence must fail closed");
  assert.equal((await malformedResponse.json()).healthy, false);
}

const unhealthyHandler = createSeoOperationalHealthHandler({
  ...handlerDependencies,
  schedule: dueSchedule,
  now: () => new Date("2026-09-02T14:07:00.000Z"),
  cronSecret: () => secret,
  run: async () => ({
    healthy: false,
    scope: "live-operational-health-only",
    seoChangeAuthorization: { authorized: false },
  }),
});
response = await unhealthyHandler(new Request(cronUrl, {
  headers: cronHeaders(),
}));
assert.equal(response.status, 503, "an unhealthy completed report must fail closed");
assert.equal((await response.json()).seoChangeAuthorization.authorized, false);

const offDateHandler = createSeoOperationalHealthHandler({
  ...handlerDependencies,
  schedule: dueSchedule,
  now: () => new Date("2026-09-01T14:07:00.000Z"),
  cronSecret: () => secret,
  run: async () => {
    calls += 1;
    return healthyReport;
  },
});
response = await offDateHandler(new Request(cronUrl, {
  headers: cronHeaders(),
}));
assert.equal(response.status, 204);
assert.equal(calls, 1, "off-date invocation must make zero runner/external calls");

const failureHandler = createSeoOperationalHealthHandler({
  ...handlerDependencies,
  schedule: dueSchedule,
  now: () => new Date("2026-09-02T14:07:00.000Z"),
  cronSecret: () => secret,
  run: async () => {
    throw new SeoOperationalHealthError("SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
  },
});
response = await failureHandler(new Request(cronUrl, {
  headers: cronHeaders(),
}));
assert.equal(response.status, 503);
const failure = await response.json();
assert.equal(failure.error.code, "SEO_HEALTH_GHL_SOURCE_INCOMPLETE");
assert.equal(failure.seoChangeAuthorization.authorized, false);
assert.ok(!JSON.stringify(failure).includes(secret));

response = await dueHandler(new Request(cronUrl, {
  headers: { ...cronHeaders(), "User-Agent": "not-vercel-cron" },
}));
assert.equal(response.status, 503);
assert.equal((await response.json()).error.code, "SEO_HEALTH_REQUEST_BINDING_MISMATCH");
assert.equal(calls, 1, "a request-binding mismatch must make zero runner/external calls");
assert.equal(methodNotAllowed().status, 405);

assert.deepEqual(vercel.crons, [
  { path: "/api/cron/reconcile-ghl-opportunities", schedule: "*/15 * * * *" },
]);
assert.deepEqual(cronOff.crons, [
  { path: "/api/cron/reconcile-ghl-opportunities", schedule: "*/15 * * * *" },
]);
assert.equal(
  Object.hasOwn(vercel.functions ?? {}, "src/app/api/cron/seo-health/route.ts"),
  false,
  "the retired public SEO-health cron route must not remain deployable",
);
assert.doesNotMatch(runnerSource, /@\/lib\/prisma|ghl-crm|ghl-opportunity-outbox/);
assert.doesNotMatch(runnerSource, /method:\s*["'](?:POST|PUT|PATCH|DELETE)["']/);
assert.match(runnerSource, /SEO_HEALTH_TURSO_AUTH_TOKEN/);
assert.match(runnerSource, /SEO_HEALTH_GHL_READ_TOKEN/);
assert.match(runnerSource, /seoChangeAuthorization: SEO_CHANGE_AUTHORIZATION/);
assert.match(runnerSource, /notObservedByThisRoute/);
assert.doesNotMatch(productionGateSource, /assert\.notEqual|notEqual\(seoHealth/);
assert.match(productionGateSource, /FORBIDDEN_SITE_HEALTH_VARIABLES/);
assert.doesNotMatch(productionGateSource, /seoHealthDatabaseUrl|seoHealthDatabaseToken|seoHealthGhlToken/);
assert.doesNotMatch(productionGateSource, /fingerprints\.(?:databaseTokenSha256|ghlReadTokenSha256)/);
assert.match(productionGateSource, /SEO_HEALTH_ATTESTATION_SECRET/);
assert.match(productionGateSource, /SEO_HEALTH_GITHUB_READ_TOKEN/);
assert.doesNotMatch(productionGateSource, /verifyConfiguredCanaryReceipt|githubToken|api\.github\.com/);
assert.match(productionGateSource, /!hasSeoHealthAttestationSecret \|\| seoHealthAttestationSecret\.length >= 32/);
assert.match(productionGateSource, /hasSeoHealthAttestationSecret && seoHealthAttestationSecret\.length >= 32/);
assert.match(productionGateSource, /currentHealthSourceDigest/);
assert.match(productionGateSource, /hasPastCheckpointHistory/);
assert.match(productionGateSource, /evaluateSeoHealthRolloutControls/);
assert.match(productionGateSource, /healthCronEntries\.length === 0/);
assert.match(productionGateSource, /scheduler === "github-actions"/);
const workflowSchedules = [...schedulerWorkflow.matchAll(/^\s*-\s*cron:\s*["']([^"']+)["']\s*$/gm)]
  .map((match) => match[1]);
assert.deepEqual(workflowSchedules, [config.permanentCronSchedule]);
assert.match(schedulerWorkflow, /environment:\s*seo-health-production/);
assert.match(
  schedulerWorkflow,
  /uses:\s*actions\/checkout@11d5960a326750d5838078e36cf38b85af677262/,
);
assert.match(schedulerWorkflow, /persist-credentials:\s*false/);
assert.match(
  schedulerWorkflow,
  /uses:\s*actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/,
);
assert.doesNotMatch(schedulerWorkflow, /uses:\s*actions\/(?:checkout|setup-node)@v\d+/);
assert.match(schedulerWorkflow, /name:\s*Secretless date gate/);
assert.match(schedulerWorkflow, /run:\s*npm run checkpoint:seo-operational-health:gate/);
assert.match(schedulerWorkflow, /run:\s*npm run checkpoint:seo-operational-health:verify-canary-receipt/);
assert.match(schedulerWorkflow, /needs:\s*schedule/);
assert.match(
  schedulerWorkflow,
  /if:\s*>-[\s\S]*?needs\.schedule\.outputs\.due == 'true' &&[\s\S]*?needs\.schedule\.outputs\.controls_ready == 'true'/,
);
const preAttestationJobOffset = schedulerWorkflow.indexOf("\n  pre_attestation:");
const providerJobOffset = schedulerWorkflow.indexOf("\n  provider:");
const archiveJobOffset = schedulerWorkflow.indexOf("\n  archive:");
assert.ok(preAttestationJobOffset > 0, "the pre-attestation job must be present");
assert.ok(providerJobOffset > preAttestationJobOffset, "the provider job must follow pre-attestation");
assert.ok(archiveJobOffset > providerJobOffset, "the archive job must follow provider execution");
const scheduleJobSource = schedulerWorkflow.slice(0, preAttestationJobOffset);
const preAttestationJobSource = schedulerWorkflow.slice(preAttestationJobOffset, providerJobOffset);
const providerJobSource = schedulerWorkflow.slice(providerJobOffset, archiveJobOffset);
const archiveJobSource = schedulerWorkflow.slice(archiveJobOffset);
assert.doesNotMatch(scheduleJobSource, /secrets\./);
assert.doesNotMatch(scheduleJobSource, /environment:\s*seo-health-production/);
assert.match(scheduleJobSource, /actions:\s*read/);
assert.match(scheduleJobSource, /issues:\s*read/);
assert.match(scheduleJobSource, /GITHUB_TOKEN:\s*\$\{\{ github\.token \}\}/);
assert.match(preAttestationJobSource, /environment:\s*seo-health-production/);
assert.match(preAttestationJobSource, /deployments:\s*read/);
assert.match(preAttestationJobSource, /SEO_HEALTH_ATTESTATION_SECRET/);
assert.match(preAttestationJobSource, /SEO_HEALTH_VERCEL_CONTROL_TOKEN/);
assert.doesNotMatch(preAttestationJobSource, /SEO_HEALTH_(?:TURSO|GHL)_/);
assert.doesNotMatch(preAttestationJobSource, /issues:\s*write/);
assert.match(providerJobSource, /environment:\s*seo-health-production/);
assert.match(providerJobSource, /SEO_HEALTH_TURSO_AUTH_TOKEN/);
assert.match(providerJobSource, /SEO_HEALTH_GHL_READ_TOKEN/);
assert.doesNotMatch(providerJobSource, /SEO_HEALTH_ATTESTATION_SECRET/);
assert.doesNotMatch(providerJobSource, /SEO_HEALTH_VERCEL_CONTROL_TOKEN/);
assert.doesNotMatch(providerJobSource, /GITHUB_TOKEN/);
assert.doesNotMatch(providerJobSource, /issues:\s*write|deployments:\s*read/);
assert.match(archiveJobSource, /environment:\s*seo-health-production/);
assert.match(archiveJobSource, /issues:\s*write/);
assert.match(archiveJobSource, /deployments:\s*read/);
assert.match(archiveJobSource, /SEO_HEALTH_ATTESTATION_SECRET/);
assert.match(archiveJobSource, /SEO_HEALTH_VERCEL_CONTROL_TOKEN/);
assert.match(archiveJobSource, /SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY/);
assert.match(archiveJobSource, /SEO_HEALTH_PRE_ATTESTATION_RESULT/);
assert.match(archiveJobSource, /SEO_HEALTH_PROVIDER_RESULT/);
assert.match(
  archiveJobSource,
  /if:\s*>-[\s\S]*always\(\) &&[\s\S]*needs\.schedule\.result == 'success' &&[\s\S]*needs\.schedule\.outputs\.due == 'true'/,
);
assert.doesNotMatch(archiveJobSource, /SEO_HEALTH_(?:TURSO|GHL)_/);
assert.match(schedulerWorkflow, /npm run checkpoint:seo-operational-health:pre-attestation/);
assert.match(schedulerWorkflow, /npm run checkpoint:seo-operational-health:provider/);
assert.match(schedulerWorkflow, /npm run checkpoint:seo-operational-health:archive/);
assert.match(providerJobSource, /npm ci --ignore-scripts --omit=dev --workspaces=false/);
assert.doesNotMatch(schedulerWorkflow, /npm ci --workspaces=false/);
assert.doesNotMatch(schedulerWorkflow, /^\s*(?:TURSO_AUTH_TOKEN|GHL_PRIVATE_INTEGRATION_TOKEN):/m);
assert.doesNotMatch(schedulerWorkflow, /secrets\.(?:TURSO_AUTH_TOKEN|GHL_PRIVATE_INTEGRATION_TOKEN)\b/);
assert.equal(packageJson.scripts["checkpoint:health"], undefined);
assert.equal(packageJson.scripts["checkpoint:health:production"], undefined);
assert.equal(packageJson.scripts["checkpoint:health:vercel"], undefined);
assert.equal(packageJson.scripts["diagnostic:seo-operations"], "node scripts/check-seo-operations.mjs");
assert.match(
  packageJson.scripts["checkpoint:seo-operational-health:gate"],
  /resolve-seo-operational-health-schedule\.mjs/,
);
assert.match(packageJson.scripts["checkpoint:seo-operational-health:pre-attestation"], /preflight-seo-operational-health-attestation\.mjs/);
assert.match(packageJson.scripts["checkpoint:seo-operational-health:verify-canary-receipt"], /check-seo-operational-health-canary-receipt\.mjs/);
assert.equal(
  packageJson.scripts["verify:seo-operational-health:configured-receipt"],
  "node scripts/check-seo-operational-health-canary-receipt.mjs",
);
assert.match(packageJson.scripts["checkpoint:seo-operational-health:provider"], /run-seo-operational-health-provider\.mjs/);
assert.match(packageJson.scripts["checkpoint:seo-operational-health:archive"], /archive-seo-operational-health\.mjs/);
assert.match(packageJson.scripts["verify:seo-operational-health:source-digest"], /verify-seo-operational-health-source-digest\.mjs/);
assert.match(packageJson.scripts["verify:seo-operational-health"], /verify:seo-operational-health:source-digest/);
assert.equal(packageJson.scripts["checkpoint:seo-operational-health:isolated"], undefined);
assert.match(
  scheduleResolverSource,
  /assertStrictWorkflowContext\(config, process\.env, match\)/,
);
assert.ok(
  scheduleResolverSource.indexOf("assertStrictWorkflowContext(config, process.env, match)")
    < scheduleResolverSource.indexOf("GITHUB_OUTPUT"),
  "the secretless resolver must reject an invalid event before writing due output",
);
assert.match(preAttestationSource, /assertStrictWorkflowContext\(config, process\.env, match\)/);
assert.ok(
  preAttestationSource.indexOf("assertStrictWorkflowContext(config, process.env, match)")
    < preAttestationSource.indexOf("fetchAndValidateCanonicalAttestation("),
  "workflow identity must be checked before the attestation request",
);
assert.ok(
  preAttestationSource.indexOf("await assertStrictCheckout(github)")
    < preAttestationSource.indexOf("fetchAndValidateCanonicalAttestation("),
  "the exact clean checkout must be checked before the attestation request",
);
assert.doesNotMatch(providerProcessSource, /^import .*seo-operational-health\.ts/m);
assert.match(providerProcessSource, /import\("\.\.\/src\/lib\/seo-operational-health\.ts"\)/);
assert.match(providerProcessSource, /computeSeoHealthSourceDigest/);
assert.ok(
  providerProcessSource.indexOf("computeSeoHealthSourceDigest()")
    < providerProcessSource.indexOf('import("../src/lib/seo-operational-health.ts")'),
  "the provider must bind its canonical source before loading provider dependencies",
);
assert.match(archiveProcessSource, /fetchAndValidateCanonicalAttestation/);
assert.match(archiveProcessSource, /fetchAndValidateUniqueAttestation/);
assert.match(archiveProcessSource, /fetchAndValidateGithubVercelProductionProvenance/);
assert.match(archiveProcessSource, /fetchAndValidateVercelControlPlaneProvenance/);
assert.match(archiveProcessSource, /buildSignedArchiveComment/);
assert.match(archiveProcessSource, /recordSignedIncident/);
assert.match(archiveProcessSource, /SEO_HEALTH_ARCHIVE_SOURCE_MISMATCH/);
assert.ok(
  archiveProcessSource.indexOf("computeSeoHealthSourceDigest()")
    < archiveProcessSource.indexOf("fetchAndValidateCanonicalAttestation("),
  "archive source-equivalence must fail before any attestation credential is transmitted",
);
assert.match(receiptVerifierSource, /\$\{baseRunUrl\}\/attempts\/\$\{evidence\.githubRunAttempt\}/);
assert.match(receiptVerifierSource, /Authorization:\s*`Bearer \$\{token\}`/);
assert.match(receiptVerifierSource, /verifyCheckpointHistory/);
assert.match(receiptVerifierSource, /archiveRecoveryWindowMs = 24 \* 60 \* 60 \* 1000/);
assert.match(evidenceArchiveSource, /isoDateInTimeZone\(startedAtMs, expectations\.timezone\)/);
assert.match(evidenceArchiveSource, /buildSignedIncidentComment/);
assert.match(productionGateSource, /VERCEL_PROJECT_ID/);
assert.match(productionGateSource, /VERCEL_GIT_REPO_ID/);
assert.match(productionGateSource, /VERCEL_GIT_COMMIT_SHA/);
assert.match(productionGateSource, /VERCEL_DEPLOYMENT_ID/);
assert.match(productionGateSource, /VERCEL_PROJECT_PRODUCTION_URL/);
assert.match(crmSource, /data\.seoQaExcluded === true \? "true" : "false"/);
assert.match(operationsContract, /Git-backed canary and rollback sequence/);
assert.match(operationsContract, /ops\/vercel\.cron-off\.json/);
assert.match(operationsContract, /issues\/47/);
assert.match(operationsContract, /12:17 UTC/);
assert.match(operationsContract, /60 days without repository activity/);
assert.match(operationsContract, /external GitHub App watchdog/);
assert.match(operationsContract, /immutable Actions attempt endpoint/);
assert.match(operationsContract, /main-pr-only/);
assert.match(operationsContract, /CI \/ configured-receipt/);
assert.match(operationsContract, /CI \/ verify/);
assert.match(operationsContract, /No personal access token, fine-grained personal token, Vercel runtime GitHub token/);
assert.match(operationsContract, /remove `SEO_HEALTH_GITHUB_READ_TOKEN` from Production, Preview, Development/);
assert.match(operationsContract, /no more than 24 hours after `finishedAt`/);
assert.match(operationsContract, /America\/New_York/);
assert.match(operationsContract, /new scheduled canary/);
assert.match(codeownersSource, /^\/\.github\/CODEOWNERS @willrapuano$/m);
assert.match(codeownersSource, /^\/\.github\/workflows\/ @willrapuano$/m);
assert.match(codeownersSource, /^\/config\/seo-operational-health\.json @willrapuano$/m);
assert.match(codeownersSource, /^\/scripts\/verify-production-env\.mjs @willrapuano$/m);
assert.match(codeownersSource, /^\/scripts\/lib\/seo-health-\*\.mjs @willrapuano$/m);
assert.match(codeownersSource, /^\/src\/app\/api\/ops\/seo-health-attestation\/ @willrapuano$/m);
for (const source of [preAttestationSource, archiveProcessSource]) {
  assert.ok(
    source.indexOf("fetchAndValidateVercelControlPlaneProvenance({")
      < source.indexOf("fetchAndValidateGithubVercelProductionProvenance({"),
    "the independent Vercel control-plane proof must precede GitHub deployment provenance",
  );
  assert.ok(
    source.indexOf("fetchAndValidateGithubVercelProductionProvenance({")
      < source.indexOf("fetchAndValidateUniqueAttestation({"),
    "GitHub deployment provenance must precede the unique-host attestation",
  );
  assert.ok(
    source.indexOf("fetchAndValidateUniqueAttestation({")
      < source.indexOf("fetchAndValidateCanonicalAttestation({"),
    "the unique deployment attestation must precede the canonical-alias attestation",
  );
}

const rolloutControls = evaluateSeoHealthRolloutControls(config, { now: new Date() });
const pendingRolloutControls = config.rolloutPhase === "disabled" ? [] : [
  [
    "archive signing public key",
    /^[a-f0-9]{64}$/.test(config.archiveSignature.keyId)
      && typeof config.archiveSignature.publicKeySpkiBase64 === "string"
      && config.archiveSignature.publicKeySpkiBase64.length > 0,
  ],
  ["dedicated Vercel control token", /^[a-f0-9]{64}$/.test(config.deploymentBinding.fingerprints.vercelControlTokenSha256)],
  ["dedicated Vercel integration configuration", /^icfg_[A-Za-z0-9]{16,}$/.test(config.deploymentBinding.vercelControlPlane.integrationConfigurationId)],
  ["dedicated Vercel integration", /^oac_[A-Za-z0-9]{16,}$/.test(config.deploymentBinding.vercelControlPlane.integrationId)],
  ["dedicated Vercel integration slug", /^dmvtitleguy-seo-health-[a-z0-9-]{3,64}$/.test(config.deploymentBinding.vercelControlPlane.integrationSlug)],
  ["dedicated Turso credential", /^[a-f0-9]{64}$/.test(config.fingerprints.databaseTokenSha256)],
  ["dedicated GHL read credential", /^[a-f0-9]{64}$/.test(config.fingerprints.ghlReadTokenSha256)],
  ["GHL field target", /^[a-f0-9]{64}$/.test(config.fingerprints.ghlTargetSha256)],
  [
    "fresh signed independent scheduler watchdog receipt and complete elapsed history",
    rolloutControls.ready,
  ],
].filter(([, ready]) => !ready);
if (pendingRolloutControls.length > 0) {
  throw new Error(
    `SEO operational health release remains blocked pending controls: ${pendingRolloutControls.map(([name]) => name).join(", ")}`,
  );
}

console.log("SEO operational health verification passed: auth, date gates, least privilege, completeness, privacy, and cron recovery are locked");
