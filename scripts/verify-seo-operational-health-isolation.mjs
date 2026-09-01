import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  SEO_HEALTH_ATTESTATION_CONTRACT,
  deploymentFingerprintFromAttestationEnvironment,
} from "../src/lib/seo-health-deployment-attestation.ts";
import {
  SEO_CHANGE_AUTHORIZATION,
  sha256,
  stableJsonDigest,
} from "../src/lib/seo-operational-health-contract.ts";
import {
  SeoHealthIsolatedRunnerError,
  assertMatchingAttestations,
  createIsolatedRunnerEnvironment,
  pinnedIsolatedScheduleFromEnvironment,
  resolveIsolatedSchedule,
  safeRunnerFailure,
  terminalEventFromProjection,
  validateRemoteAttestation,
} from "./lib/seo-health-isolated-runner.mjs";
import {
  assertStrictProductionOrigin,
  assertStrictWorkflowContext,
  createSanitizedGitEnvironment,
  createPreAttestationBundle,
  createProviderTerminalBundle,
  fetchAndValidateCanonicalAttestation,
  fetchAndValidateUniqueAttestation,
  fetchAndValidateVercelControlPlaneProvenance,
  githubHeaders,
  validateGithubVercelProductionProvenance,
  validateVercelControlPlaneProvenance,
  validatePreAttestationBundle,
  validateProviderTerminalBundle,
  vercelControlHeaders,
} from "./lib/seo-health-process-boundaries.mjs";

const root = new URL("../", import.meta.url);
const config = JSON.parse(await readFile(new URL("config/seo-operational-health.json", root), "utf8"));
const environment = {
  VERCEL: "1",
  VERCEL_ENV: "production",
  VERCEL_TARGET_ENV: "production",
  VERCEL_PROJECT_ID: "prj_fixture",
  VERCEL_DEPLOYMENT_ID: "dpl_1234567890abcdef",
  VERCEL_URL: "dmvtitleguy-fixture.vercel.app",
  VERCEL_GIT_PROVIDER: "github",
  VERCEL_GIT_REPO_ID: "1181092661",
  VERCEL_GIT_REPO_OWNER: "willrapuano",
  VERCEL_GIT_REPO_SLUG: "dmvtitleguy",
  VERCEL_GIT_COMMIT_REF: "main",
  VERCEL_GIT_COMMIT_SHA: "a".repeat(40),
  VERCEL_PROJECT_PRODUCTION_URL: "dmvtitleguy.io",
};
const fixtureConfig = structuredClone(config);
fixtureConfig.deploymentBinding.vercelControlPlane = {
  canonicalAlias: "dmvtitleguy.io",
  teamId: "team_fixturecontrol1234567890",
  integrationConfigurationId: "icfg_fixturecontrol1234567890",
  integrationId: "oac_fixturecontrol1234567890",
  integrationSlug: "dmvtitleguy-seo-health-control-proof",
  projectSelection: "selected",
  requiredResourceScopes: [
    "read:deployment",
    "read:domain",
    "read:integration-configuration",
    "read:project",
  ],
};
fixtureConfig.deploymentBinding.fingerprints = {
  projectIdSha256: sha256(environment.VERCEL_PROJECT_ID),
  gitRepoIdSha256: sha256(environment.VERCEL_GIT_REPO_ID),
  gitRepoOwnerSha256: sha256(environment.VERCEL_GIT_REPO_OWNER),
  gitRepoSlugSha256: sha256(environment.VERCEL_GIT_REPO_SLUG),
  productionHostnameSha256: sha256(environment.VERCEL_PROJECT_PRODUCTION_URL),
  vercelControlTokenSha256: sha256("fixture-vercel-control-token"),
};
const bindings = {
  vercelSystem: true,
  production: true,
  targetProduction: true,
  projectFingerprint: true,
  gitSource: true,
  gitCommit: true,
  deployment: true,
  productionHostname: true,
  origin: true,
};
const attestation = {
  schemaVersion: fixtureConfig.schemaVersion,
  contractVersion: SEO_HEALTH_ATTESTATION_CONTRACT,
  scope: "live-operational-health-only",
  healthy: true,
  complete: true,
  environment,
  deploymentFingerprint: deploymentFingerprintFromAttestationEnvironment(environment),
  bindings,
};
const github = {
  actions: "true",
  repository: "willrapuano/dmvtitleguy",
  refName: "main",
  sha: environment.VERCEL_GIT_COMMIT_SHA,
};

function expectCode(code, callback) {
  assert.throws(callback, (error) => error instanceof SeoHealthIsolatedRunnerError && error.code === code);
}

assert.deepEqual(
  resolveIsolatedSchedule(fixtureConfig, new Date("2026-09-01T12:17:00.000Z")),
  {
    due: false,
    effectiveDate: "2026-09-01",
    checkpointId: null,
    runKind: "off-date",
  },
);
const canarySchedule = {
  ...structuredClone(fixtureConfig),
  rolloutPhase: "canary",
  checkpointDates: {},
  canaryDates: ["2026-09-01"],
};
assert.deepEqual(
  resolveIsolatedSchedule(canarySchedule, new Date("2026-09-01T12:17:00.000Z")),
  {
    due: true,
    effectiveDate: "2026-09-01",
    checkpointId: "production-canary-2026-09-01",
    runKind: "canary",
  },
);
expectCode("ISOLATED_ROLLOUT_PHASE_MISMATCH", () => resolveIsolatedSchedule(
  { ...canarySchedule, rolloutPhase: "disabled" },
  new Date("2026-09-01T12:17:00.000Z"),
));
expectCode("ISOLATED_SCHEDULER_MISMATCH", () => resolveIsolatedSchedule(
  { ...fixtureConfig, scheduler: "vercel" },
  new Date("2026-09-01T12:17:00.000Z"),
));

const permanentSchedule = {
  ...structuredClone(fixtureConfig),
  rolloutPhase: "permanent",
  checkpointDates: structuredClone(fixtureConfig.checkpointCalendar),
};
const pinnedCheckpointEnvironment = {
  SEO_HEALTH_SCHEDULE_DUE: "true",
  SEO_HEALTH_SCHEDULE_EFFECTIVE_DATE: "2026-09-02",
  SEO_HEALTH_SCHEDULE_CHECKPOINT_ID: "technical-2026-09-02",
  SEO_HEALTH_SCHEDULE_RUN_KIND: "checkpoint",
};
assert.deepEqual(
  pinnedIsolatedScheduleFromEnvironment(permanentSchedule, pinnedCheckpointEnvironment),
  {
    due: true,
    effectiveDate: "2026-09-02",
    checkpointId: "technical-2026-09-02",
    runKind: "checkpoint",
  },
  "downstream jobs must consume the schedule job's pinned identity without consulting wall-clock time",
);
assert.deepEqual(
  pinnedIsolatedScheduleFromEnvironment(canarySchedule, {
    ...pinnedCheckpointEnvironment,
    SEO_HEALTH_SCHEDULE_EFFECTIVE_DATE: "2026-09-01",
    SEO_HEALTH_SCHEDULE_CHECKPOINT_ID: "production-canary-2026-09-01",
    SEO_HEALTH_SCHEDULE_RUN_KIND: "canary",
  }),
  {
    due: true,
    effectiveDate: "2026-09-01",
    checkpointId: "production-canary-2026-09-01",
    runKind: "canary",
  },
);
for (const invalidEnvironment of [
  { ...pinnedCheckpointEnvironment, SEO_HEALTH_SCHEDULE_DUE: "false" },
  { ...pinnedCheckpointEnvironment, SEO_HEALTH_SCHEDULE_EFFECTIVE_DATE: "2026-99-99" },
  { ...pinnedCheckpointEnvironment, SEO_HEALTH_SCHEDULE_RUN_KIND: "off-date" },
]) {
  expectCode("ISOLATED_PINNED_SCHEDULE_INVALID", () => (
    pinnedIsolatedScheduleFromEnvironment(permanentSchedule, invalidEnvironment)
  ));
}
for (const mismatchedEnvironment of [
  { ...pinnedCheckpointEnvironment, SEO_HEALTH_SCHEDULE_CHECKPOINT_ID: "technical-attacker" },
  { ...pinnedCheckpointEnvironment, SEO_HEALTH_SCHEDULE_EFFECTIVE_DATE: "2026-09-09" },
]) {
  expectCode("ISOLATED_PINNED_SCHEDULE_MISMATCH", () => (
    pinnedIsolatedScheduleFromEnvironment(permanentSchedule, mismatchedEnvironment)
  ));
}

const validated = validateRemoteAttestation(attestation, fixtureConfig, github);
assert.equal(validated.deploymentFingerprint, attestation.deploymentFingerprint);
assert.deepEqual(validated.environment, environment);
assert.doesNotThrow(() => assertMatchingAttestations(attestation, structuredClone(attestation)));
expectCode("ISOLATED_ATTESTATION_HOST_MISMATCH", () => assertMatchingAttestations(
  attestation,
  { ...attestation, deploymentFingerprint: "b".repeat(64) },
));
expectCode("ISOLATED_GITHUB_DEPLOYMENT_MISMATCH", () => validateRemoteAttestation(
  attestation,
  fixtureConfig,
  { ...github, sha: "b".repeat(40) },
));
expectCode("ISOLATED_ATTESTATION_SHAPE_INVALID", () => validateRemoteAttestation(
  { ...attestation, debugSecret: "do-not-reflect" },
  fixtureConfig,
  github,
));
expectCode("ISOLATED_ATTESTATION_BINDINGS_INVALID", () => validateRemoteAttestation(
  { ...attestation, bindings: { ...bindings, unexpected: true } },
  fixtureConfig,
  github,
));

const providerEnvironment = {
  SEO_HEALTH_TURSO_DATABASE_URL: "libsql://fixture.turso.io",
  SEO_HEALTH_TURSO_AUTH_TOKEN: "read-turso-token",
  SEO_HEALTH_GHL_READ_TOKEN: "read-ghl-token",
  GHL_LOCATION_ID: "location",
  GHL_WEBSITE_PIPELINE_ID: "pipeline",
  GHL_WEBSITE_SUBMITTED_STAGE_ID: "stage",
  GITHUB_TOKEN: "must-not-enter-runner",
  SEO_HEALTH_ATTESTATION_SECRET: "must-not-enter-runner",
};
const runnerEnvironment = createIsolatedRunnerEnvironment(environment, providerEnvironment);
assert.equal(runnerEnvironment.SEO_HEALTH_TURSO_AUTH_TOKEN, "read-turso-token");
assert.equal("TURSO_AUTH_TOKEN" in runnerEnvironment, false);
assert.equal("GHL_PRIVATE_INTEGRATION_TOKEN" in runnerEnvironment, false);
assert.equal("GITHUB_TOKEN" in runnerEnvironment, false);
assert.equal("SEO_HEALTH_ATTESTATION_SECRET" in runnerEnvironment, false);
expectCode("ISOLATED_WRITE_CREDENTIAL_PRESENT", () => createIsolatedRunnerEnvironment(
  environment,
  { ...providerEnvironment, TURSO_AUTH_TOKEN: "write-token" },
));
expectCode("ISOLATED_PROVIDER_ENVIRONMENT_INCOMPLETE", () => createIsolatedRunnerEnvironment(
  environment,
  { ...providerEnvironment, SEO_HEALTH_GHL_READ_TOKEN: "" },
));

const sanitizedGitEnvironment = createSanitizedGitEnvironment({
  ...process.env,
  GITHUB_TOKEN: "must-not-enter-git",
  SEO_HEALTH_ATTESTATION_SECRET: "must-not-enter-git",
  SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY: "must-not-enter-git",
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "credential.helper",
  GIT_CONFIG_VALUE_0: "malicious-helper",
  GIT_DIR: "/tmp/attacker-git-dir",
  GIT_WORK_TREE: "/tmp/attacker-work-tree",
});
assert.deepEqual(sanitizedGitEnvironment, {
  LANG: "C",
  LC_ALL: "C",
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_TERMINAL_PROMPT: "0",
});
for (const forbidden of [
  "GITHUB_TOKEN",
  "SEO_HEALTH_ATTESTATION_SECRET",
  "SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY",
  "GIT_CONFIG_COUNT",
  "GIT_CONFIG_KEY_0",
  "GIT_CONFIG_VALUE_0",
  "GIT_DIR",
  "GIT_WORK_TREE",
]) assert.equal(forbidden in sanitizedGitEnvironment, false);

const projection = {
  schemaVersion: 1,
  contractVersion: "seo-operational-health-v1",
  scope: "live-operational-health-only",
  checkpoint: {
    id: "production-canary-2026-09-01",
    scheduledDate: "2026-09-01",
    runKind: "canary",
    scheduleDateMatched: true,
  },
  observation: {
    startedAt: "2026-09-01T12:17:00.000Z",
    finishedAt: "2026-09-01T12:17:01.000Z",
    durationMs: 1000,
    deploymentFingerprint: attestation.deploymentFingerprint,
    evidenceDigest: "b".repeat(64),
  },
  bindings: {
    runtimeCredentialIsolation: true,
  },
  completeness: { complete: true },
  incidents: [],
  requests: { public: 9, ghl: 7 },
  healthy: true,
  seoChangeAuthorization: SEO_CHANGE_AUTHORIZATION,
};
const terminalGithub = {
  runId: "123456789",
  runAttempt: "1",
  sha: environment.VERCEL_GIT_COMMIT_SHA,
};
const terminal = terminalEventFromProjection(projection, terminalGithub, "f".repeat(64));
assert.equal(terminal.event, "seo-operational-health.finish");
assert.equal(terminal.seoChangeAuthorized, false);
assert.equal(terminal.runKind, "canary");
assert.equal("debugSecret" in terminal, false);
expectCode("ISOLATED_TERMINAL_PROJECTION_INVALID", () => terminalEventFromProjection({
  ...projection,
  seoChangeAuthorization: { authorized: true, reason: "forged" },
}, terminalGithub, "f".repeat(64)));
expectCode("ISOLATED_TERMINAL_PROJECTION_INVALID", () => terminalEventFromProjection(
  projection,
  terminalGithub,
  "not-a-digest",
));

const workflowGithub = {
  ...github,
  ref: "refs/heads/main",
  workflowRef: "willrapuano/dmvtitleguy/.github/workflows/seo-operational-health.yml@refs/heads/main",
  runId: terminalGithub.runId,
  runAttempt: terminalGithub.runAttempt,
};
const workflowEnvironment = {
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: "willrapuano/dmvtitleguy",
  GITHUB_REF: "refs/heads/main",
  GITHUB_REF_NAME: "main",
  GITHUB_WORKFLOW_REF: workflowGithub.workflowRef,
  GITHUB_EVENT_NAME: "schedule",
  GITHUB_SHA: workflowGithub.sha,
  GITHUB_RUN_ID: workflowGithub.runId,
  GITHUB_RUN_ATTEMPT: workflowGithub.runAttempt,
};
assert.deepEqual(assertStrictWorkflowContext(fixtureConfig, workflowEnvironment), {
  actions: "true",
  repository: "willrapuano/dmvtitleguy",
  ref: "refs/heads/main",
  refName: "main",
  sha: workflowGithub.sha,
  workflowRef: workflowGithub.workflowRef,
  eventName: "schedule",
  runId: workflowGithub.runId,
  runAttempt: workflowGithub.runAttempt,
});
const canaryMatch = resolveIsolatedSchedule(canarySchedule, new Date("2026-09-01T12:17:00.000Z"));
expectCode("SEO_HEALTH_WORKFLOW_IDENTITY_MISMATCH", () => assertStrictWorkflowContext(
  canarySchedule,
  { ...workflowEnvironment, GITHUB_EVENT_NAME: "workflow_dispatch" },
  canaryMatch,
));
const workflowPermanentSchedule = {
  ...structuredClone(fixtureConfig),
  rolloutPhase: "permanent",
  checkpointDates: { "2026-09-01": "seven-day" },
  canaryDates: [],
};
const checkpointMatch = resolveIsolatedSchedule(
  workflowPermanentSchedule,
  new Date("2026-09-01T12:17:00.000Z"),
);
assert.equal(assertStrictWorkflowContext(
  workflowPermanentSchedule,
  {
    ...workflowEnvironment,
    GITHUB_EVENT_NAME: "workflow_dispatch",
    GITHUB_ACTOR: "willrapuano",
    GITHUB_ACTOR_ID: "200251753",
  },
  checkpointMatch,
).eventName, "workflow_dispatch");
for (const manualIdentity of [
  { GITHUB_ACTOR: "attacker", GITHUB_ACTOR_ID: "200251753" },
  { GITHUB_ACTOR: "willrapuano", GITHUB_ACTOR_ID: "1" },
]) {
  expectCode("SEO_HEALTH_WORKFLOW_IDENTITY_MISMATCH", () => assertStrictWorkflowContext(
    workflowPermanentSchedule,
    { ...workflowEnvironment, GITHUB_EVENT_NAME: "workflow_dispatch", ...manualIdentity },
    checkpointMatch,
  ));
}
expectCode("SEO_HEALTH_WORKFLOW_IDENTITY_MISMATCH", () => assertStrictWorkflowContext(
  workflowPermanentSchedule,
  {
    ...workflowEnvironment,
    GITHUB_EVENT_NAME: "workflow_dispatch",
    GITHUB_ACTOR: "willrapuano",
    GITHUB_ACTOR_ID: "200251753",
  },
  { ...checkpointMatch, runKind: "canary" },
));
assert.equal(assertStrictProductionOrigin(fixtureConfig), "https://dmvtitleguy.io");
expectCode("SEO_HEALTH_WORKFLOW_IDENTITY_MISMATCH", () => assertStrictWorkflowContext(
  fixtureConfig,
  { ...workflowEnvironment, GITHUB_REF: "refs/heads/feature" },
));
expectCode("SEO_HEALTH_ORIGIN_MISMATCH", () => assertStrictProductionOrigin({
  ...fixtureConfig,
  origin: "https://attacker.example",
}));
assert.equal(githubHeaders("fixture-github-token-1234567890").Authorization.startsWith("Bearer "), true);
expectCode("SEO_HEALTH_GITHUB_TOKEN_INVALID", () => githubHeaders("short"));
expectCode("SEO_HEALTH_GITHUB_TOKEN_INVALID", () => githubHeaders(
  "fixture-github-token\r\nX-Attacker: injected",
));
assert.equal(
  vercelControlHeaders("fixture-vercel-control-token").Authorization.startsWith("Bearer "),
  true,
);
expectCode("SEO_HEALTH_VERCEL_CONTROL_CREDENTIAL_INVALID", () => vercelControlHeaders("short"));
expectCode("SEO_HEALTH_VERCEL_CONTROL_CREDENTIAL_INVALID", () => vercelControlHeaders(
  "fixture-vercel-control-token\nX-Attacker: injected",
));
const bot = { id: 35613825, login: "vercel[bot]", type: "Bot" };
const deployment = {
  id: 101,
  sha: environment.VERCEL_GIT_COMMIT_SHA,
  ref: environment.VERCEL_GIT_COMMIT_SHA,
  environment: "Production",
  creator: bot,
};
const statusesByDeployment = new Map([[
  deployment.id,
  [
    {
      id: 202,
      state: "success",
      environment: "Production",
      environment_url: `https://${environment.VERCEL_URL}`,
      created_at: "2026-09-01T12:17:30Z",
      creator: bot,
    },
    {
      id: 201,
      state: "success",
      environment: "Production",
      environment_url: "https://older-fixture.vercel.app",
      created_at: "2026-09-01T12:16:30Z",
      creator: bot,
    },
  ],
]]);
const controlTargetForGithub = {
  deploymentUrl: environment.VERCEL_URL,
};
const provenance = validateGithubVercelProductionProvenance({
  deployments: [deployment],
  statusesByDeployment,
  config: fixtureConfig,
  github: workflowGithub,
  vercelControlPlane: controlTargetForGithub,
});
assert.equal(provenance.statusId, 202);
expectCode("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID", () => (
  validateGithubVercelProductionProvenance({
    deployments: [{ ...deployment, creator: { ...bot, id: 1 } }],
    statusesByDeployment,
    config: fixtureConfig,
    github: workflowGithub,
    vercelControlPlane: controlTargetForGithub,
  })
));
expectCode("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID", () => (
  validateGithubVercelProductionProvenance({
    deployments: [{ ...deployment, sha: "b".repeat(40), ref: "b".repeat(40) }],
    statusesByDeployment,
    config: fixtureConfig,
    github: workflowGithub,
    vercelControlPlane: controlTargetForGithub,
  })
));
expectCode("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID", () => (
  validateGithubVercelProductionProvenance({
    deployments: [{ ...deployment, environment: "Preview" }],
    statusesByDeployment,
    config: fixtureConfig,
    github: workflowGithub,
    vercelControlPlane: controlTargetForGithub,
  })
));
expectCode("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID", () => (
  validateGithubVercelProductionProvenance({
    deployments: [deployment],
    statusesByDeployment: new Map([[
      deployment.id,
      [{
        ...statusesByDeployment.get(deployment.id)[0],
        environment_url: "https://wrong-fixture.vercel.app",
      }],
    ]]),
    config: fixtureConfig,
    github: workflowGithub,
    vercelControlPlane: controlTargetForGithub,
  })
));
for (const state of ["failure", "error", "inactive"]) {
  expectCode("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID", () => (
    validateGithubVercelProductionProvenance({
      deployments: [deployment],
      statusesByDeployment: new Map([[
        deployment.id,
        [
          ...statusesByDeployment.get(deployment.id),
          {
            id: 203,
            state,
            environment: "Production",
            environment_url: `https://${environment.VERCEL_URL}`,
            created_at: "2026-09-01T12:18:30.000Z",
            creator: bot,
          },
        ],
      ]]),
      config: fixtureConfig,
      github: workflowGithub,
      vercelControlPlane: controlTargetForGithub,
    })
  ));
}
const laterDeployment = { ...deployment, id: 102 };
expectCode("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID", () => (
  validateGithubVercelProductionProvenance({
    deployments: [deployment, laterDeployment],
    statusesByDeployment: new Map([
      ...statusesByDeployment,
      [laterDeployment.id, [{
        id: 204,
        state: "failure",
        environment: "Production",
        environment_url: `https://${environment.VERCEL_URL}`,
        created_at: "2026-09-01T12:19:30.000Z",
        creator: bot,
      }]],
    ]),
    config: fixtureConfig,
    github: workflowGithub,
    vercelControlPlane: controlTargetForGithub,
  })
));

const controlConfig = fixtureConfig.deploymentBinding.vercelControlPlane;
const integrationConfiguration = {
  id: controlConfig.integrationConfigurationId,
  integrationId: controlConfig.integrationId,
  slug: controlConfig.integrationSlug,
  teamId: controlConfig.teamId,
  ownerId: "user_fixtureinstaller1234567890",
  status: "ready",
  deletedAt: null,
  disabledAt: null,
  deleteRequestedAt: null,
  customerDeleteRequestedAt: null,
  projectSelection: "selected",
  projects: [environment.VERCEL_PROJECT_ID],
  scopes: [...controlConfig.requiredResourceScopes],
};
const controlAlias = {
  alias: controlConfig.canonicalAlias,
  deploymentId: environment.VERCEL_DEPLOYMENT_ID,
  projectId: environment.VERCEL_PROJECT_ID,
  redirect: null,
  deletedAt: null,
  deployment: {
    id: environment.VERCEL_DEPLOYMENT_ID,
    url: environment.VERCEL_URL,
  },
};
const controlDeployment = {
  id: environment.VERCEL_DEPLOYMENT_ID,
  url: environment.VERCEL_URL,
  projectId: environment.VERCEL_PROJECT_ID,
  ownerId: controlConfig.teamId,
  target: "production",
  readyState: "READY",
  aliasAssigned: true,
  aliasError: null,
  alias: [controlConfig.canonicalAlias],
  meta: {
    gitDirty: "0",
    githubCommitSha: environment.VERCEL_GIT_COMMIT_SHA,
    githubCommitRef: environment.VERCEL_GIT_COMMIT_REF,
    githubRepoId: environment.VERCEL_GIT_REPO_ID,
    githubOrg: environment.VERCEL_GIT_REPO_OWNER,
    githubRepo: environment.VERCEL_GIT_REPO_SLUG,
  },
};
const controlDeploymentAliases = {
  aliases: [{ alias: controlConfig.canonicalAlias, redirect: null }],
};
const controlProjectDomain = {
  name: controlConfig.canonicalAlias,
  projectId: environment.VERCEL_PROJECT_ID,
  verified: true,
  redirect: null,
  gitBranch: null,
};
function validateControl(overrides = {}) {
  return validateVercelControlPlaneProvenance({
    authenticatedConfigurations: overrides.authenticatedConfigurations
      ?? [structuredClone(integrationConfiguration)],
    integrationConfiguration: overrides.integrationConfiguration
      ?? structuredClone(integrationConfiguration),
    alias: overrides.alias ?? structuredClone(controlAlias),
    deployment: overrides.deployment ?? structuredClone(controlDeployment),
    deploymentAliases: overrides.deploymentAliases
      ?? structuredClone(controlDeploymentAliases),
    projectDomain: overrides.projectDomain ?? structuredClone(controlProjectDomain),
    config: fixtureConfig,
    github: workflowGithub,
  });
}
const vercelControlPlane = validateControl();
assert.equal(vercelControlPlane.deploymentId, environment.VERCEL_DEPLOYMENT_ID);
assert.equal(vercelControlPlane.canonicalAlias, "dmvtitleguy.io");
const typedIntegrationConfiguration = {
  ...structuredClone(integrationConfiguration),
  type: "integration-configuration",
};
assert.equal(validateControl({
  authenticatedConfigurations: [structuredClone(typedIntegrationConfiguration)],
  integrationConfiguration: typedIntegrationConfiguration,
}).deploymentId, environment.VERCEL_DEPLOYMENT_ID);

const mismatchedAlias = structuredClone(controlAlias);
mismatchedAlias.deploymentId = "dpl_attacker1234567890";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  alias: mismatchedAlias,
}));
const relayedAlias = structuredClone(controlAlias);
relayedAlias.deployment.id = "dpl_relayed1234567890";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  alias: relayedAlias,
}));
const relayedAliasUrl = structuredClone(controlAlias);
relayedAliasUrl.deployment.url = "relay-fixture.vercel.app";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  alias: relayedAliasUrl,
}));
const mismatchedDeployment = structuredClone(controlDeployment);
mismatchedDeployment.projectId = "prj_attacker";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  deployment: mismatchedDeployment,
}));
const mismatchedCommit = structuredClone(controlDeployment);
mismatchedCommit.meta.githubCommitSha = "b".repeat(40);
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  deployment: mismatchedCommit,
}));
for (const gitDirty of [undefined, "1", "clean", 0, false]) {
  const unprovenCleanDeployment = structuredClone(controlDeployment);
  if (gitDirty === undefined) {
    delete unprovenCleanDeployment.meta.gitDirty;
  } else {
    unprovenCleanDeployment.meta.gitDirty = gitDirty;
  }
  expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
    deployment: unprovenCleanDeployment,
  }));
}
const mismatchedTeam = structuredClone(controlDeployment);
mismatchedTeam.ownerId = "team_attacker1234567890";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  deployment: mismatchedTeam,
}));
const missingDeploymentAlias = structuredClone(controlDeploymentAliases);
missingDeploymentAlias.aliases = [];
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  deploymentAliases: missingDeploymentAlias,
}));
const redirectedDomain = structuredClone(controlProjectDomain);
redirectedDomain.redirect = "www.dmvtitleguy.io";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  projectDomain: redirectedDomain,
}));
const unverifiedDomain = structuredClone(controlProjectDomain);
unverifiedDomain.verified = false;
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  projectDomain: unverifiedDomain,
}));
const multiProjectInstallation = structuredClone(integrationConfiguration);
multiProjectInstallation.projects.push("prj_attacker");
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  integrationConfiguration: multiProjectInstallation,
}));
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  authenticatedConfigurations: [
    structuredClone(integrationConfiguration),
    structuredClone(integrationConfiguration),
  ],
}));
const relayedAuthenticatedConfiguration = structuredClone(integrationConfiguration);
relayedAuthenticatedConfiguration.id = "icfg_relayed1234567890";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  authenticatedConfigurations: [relayedAuthenticatedConfiguration],
}));
const mismatchedInstallationOwner = structuredClone(integrationConfiguration);
mismatchedInstallationOwner.ownerId = "user_attacker1234567890";
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  integrationConfiguration: mismatchedInstallationOwner,
}));
for (const deletionField of ["deleteRequestedAt", "customerDeleteRequestedAt"]) {
  const pendingDeletion = structuredClone(integrationConfiguration);
  pendingDeletion[deletionField] = "2026-09-01T12:17:00.000Z";
  expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
    integrationConfiguration: pendingDeletion,
  }));
  expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
    authenticatedConfigurations: [pendingDeletion],
  }));
}
const expandedControlScopes = structuredClone(integrationConfiguration);
expandedControlScopes.scopes.push("read:project-env-vars");
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  integrationConfiguration: expandedControlScopes,
}));
const writeCapableControlScopes = structuredClone(integrationConfiguration);
writeCapableControlScopes.scopes = writeCapableControlScopes.scopes.map((scope) => (
  scope === "read:domain" ? "read-write:domain" : scope
));
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  integrationConfiguration: writeCapableControlScopes,
}));
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  authenticatedConfigurations: [writeCapableControlScopes],
}));
const missingControlScope = structuredClone(integrationConfiguration);
missingControlScope.scopes.pop();
expectCode("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID", () => validateControl({
  integrationConfiguration: missingControlScope,
}));

const originalFetch = globalThis.fetch;
const controlFetchPaths = [];
try {
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    controlFetchPaths.push(url.pathname);
    assert.equal(
      new Headers(init?.headers).get("Authorization"),
      "Bearer fixture-vercel-control-token",
    );
    let body;
    if (url.pathname === "/v1/integrations/configurations") {
      body = [integrationConfiguration];
    } else if (url.pathname.startsWith("/v1/integrations/configuration/")) {
      body = integrationConfiguration;
    } else if (url.pathname.startsWith("/v4/aliases/")) {
      body = controlAlias;
    } else if (url.pathname.startsWith("/v13/deployments/")) {
      body = controlDeployment;
    } else if (url.pathname.endsWith("/aliases")) {
      body = controlDeploymentAliases;
    } else if (url.pathname.includes("/domains/")) {
      body = controlProjectDomain;
    } else {
      throw new Error(`unexpected control-plane fixture URL: ${url}`);
    }
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  const fetchedControl = await fetchAndValidateVercelControlPlaneProvenance({
    token: "fixture-vercel-control-token",
    config: fixtureConfig,
    github: workflowGithub,
  });
  assert.equal(fetchedControl.deploymentId, environment.VERCEL_DEPLOYMENT_ID);
  assert.deepEqual(controlFetchPaths, [
    "/v1/integrations/configurations",
    `/v1/integrations/configuration/${controlConfig.integrationConfigurationId}`,
    `/v4/aliases/${controlConfig.canonicalAlias}`,
    `/v13/deployments/${environment.VERCEL_DEPLOYMENT_ID}`,
    `/v2/deployments/${environment.VERCEL_DEPLOYMENT_ID}/aliases`,
    `/v9/projects/${environment.VERCEL_PROJECT_ID}/domains/${controlConfig.canonicalAlias}`,
  ]);

  const relayedAliasProject = { ...controlAlias, projectId: "prj_relayed" };
  controlFetchPaths.length = 0;
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    controlFetchPaths.push(url.pathname);
    const body = url.pathname === "/v1/integrations/configurations"
      ? [integrationConfiguration]
      : url.pathname.startsWith("/v1/integrations/configuration/")
        ? integrationConfiguration
        : relayedAliasProject;
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  await assert.rejects(
    fetchAndValidateVercelControlPlaneProvenance({
      token: "fixture-vercel-control-token",
      config: fixtureConfig,
      github: workflowGithub,
    }),
    (error) => error instanceof SeoHealthIsolatedRunnerError
      && error.code === "SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID",
  );
  assert.equal(
    controlFetchPaths.length,
    3,
    "a relayed alias/project must fail before its derived identifiers are used in detail requests",
  );
} finally {
  globalThis.fetch = originalFetch;
}

const attestationFetches = [];
try {
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    attestationFetches.push(url);
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer fixture-attestation-secret");
    return new Response(JSON.stringify(attestation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  const uniqueResult = await fetchAndValidateUniqueAttestation({
    config: fixtureConfig,
    github: workflowGithub,
    secret: "fixture-attestation-secret",
    vercelControlPlane,
  });
  await fetchAndValidateCanonicalAttestation({
    config: fixtureConfig,
    github: workflowGithub,
    secret: "fixture-attestation-secret",
    unique: uniqueResult.unique,
    attested: uniqueResult.attested,
    vercelControlPlane,
  });
  assert.deepEqual(attestationFetches, [
    `https://${environment.VERCEL_URL}/api/ops/seo-health-attestation`,
    "https://dmvtitleguy.io/api/ops/seo-health-attestation",
  ]);

  const relayedEnvironment = {
    ...environment,
    VERCEL_DEPLOYMENT_ID: "dpl_relayed1234567890",
  };
  const relayedAttestation = {
    ...attestation,
    environment: relayedEnvironment,
    deploymentFingerprint: deploymentFingerprintFromAttestationEnvironment(relayedEnvironment),
  };
  attestationFetches.length = 0;
  globalThis.fetch = async (input) => {
    attestationFetches.push(String(input));
    return new Response(JSON.stringify(relayedAttestation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  await assert.rejects(
    fetchAndValidateUniqueAttestation({
      config: fixtureConfig,
      github: workflowGithub,
      secret: "fixture-attestation-secret",
      vercelControlPlane,
    }),
    (error) => error instanceof SeoHealthIsolatedRunnerError
      && error.code === "SEO_HEALTH_ATTESTATION_CONTROL_PLANE_MISMATCH",
  );
  assert.deepEqual(attestationFetches, [
    `https://${environment.VERCEL_URL}/api/ops/seo-health-attestation`,
  ], "a relayed unique response must fail before the bearer can be sent to the canonical alias");
} finally {
  globalThis.fetch = originalFetch;
}

const fixedNow = new Date("2026-09-01T12:18:00.000Z");
const preAttestationEncoded = createPreAttestationBundle({
  match: resolveIsolatedSchedule(canarySchedule, fixedNow),
  github: workflowGithub,
  attested: validated,
  provenance,
  vercelControlPlane,
  now: fixedNow,
});
const preAttestation = validatePreAttestationBundle(preAttestationEncoded, {
  match: resolveIsolatedSchedule(canarySchedule, fixedNow),
  github: workflowGithub,
  config: fixtureConfig,
  now: fixedNow,
});
assert.equal(preAttestation.payload.sha, environment.VERCEL_GIT_COMMIT_SHA);
const forgedWrapper = JSON.parse(Buffer.from(preAttestationEncoded, "base64url").toString("utf8"));
forgedWrapper.payload.githubDeployment.creator.id = 1;
forgedWrapper.payloadDigest = stableJsonDigest(forgedWrapper.payload);
const forgedEncoded = Buffer.from(JSON.stringify(forgedWrapper), "utf8").toString("base64url");
expectCode("SEO_HEALTH_PRE_ATTESTATION_BUNDLE_INVALID", () => validatePreAttestationBundle(
  forgedEncoded,
  {
    match: resolveIsolatedSchedule(canarySchedule, fixedNow),
    github: workflowGithub,
    config: fixtureConfig,
    now: fixedNow,
  },
));
const forgedControlWrapper = JSON.parse(
  Buffer.from(preAttestationEncoded, "base64url").toString("utf8"),
);
forgedControlWrapper.payload.vercelControlPlane.deploymentId = "dpl_relayed1234567890";
forgedControlWrapper.payloadDigest = stableJsonDigest(forgedControlWrapper.payload);
const forgedControlEncoded = Buffer.from(
  JSON.stringify(forgedControlWrapper),
  "utf8",
).toString("base64url");
expectCode("SEO_HEALTH_PRE_ATTESTATION_BUNDLE_INVALID", () => validatePreAttestationBundle(
  forgedControlEncoded,
  {
    match: resolveIsolatedSchedule(canarySchedule, fixedNow),
    github: workflowGithub,
    config: fixtureConfig,
    now: fixedNow,
  },
));
const terminalEncoded = createProviderTerminalBundle({ preAttestation, terminal });
assert.equal(validateProviderTerminalBundle(terminalEncoded, {
  preAttestation,
  match: resolveIsolatedSchedule(canarySchedule, fixedNow),
}).payload.terminal.event, "seo-operational-health.finish");

assert.deepEqual(safeRunnerFailure("ISOLATED_TEST_FAILURE", {
  checkpointId: "fixture",
  scheduledDate: "2026-09-01",
  runKind: "canary",
  debugSecret: "must-not-reflect",
}), {
  schemaVersion: 1,
  event: "seo-operational-health.failure",
  healthy: false,
  complete: false,
  checkpointId: "fixture",
  scheduledDate: "2026-09-01",
  runKind: "canary",
  code: "ISOLATED_TEST_FAILURE",
  seoChangeAuthorized: false,
});

console.log("SEO operational-health isolated-runner verification passed");
