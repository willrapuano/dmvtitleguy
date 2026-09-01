import { appendFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  isSha256,
  isVercelDeploymentHostname,
  sha256,
  stableJsonDigest,
} from "../../src/lib/seo-operational-health-contract.ts";
import {
  deploymentFingerprintFromAttestationEnvironment,
} from "../../src/lib/seo-health-deployment-attestation.ts";
import {
  SeoHealthIsolatedRunnerError,
  assertMatchingAttestations,
  validateRemoteAttestation,
} from "./seo-health-isolated-runner.mjs";

export const SEO_HEALTH_REPOSITORY = "willrapuano/dmvtitleguy";
export const SEO_HEALTH_WORKFLOW_PATH = ".github/workflows/seo-operational-health.yml";
export const SEO_HEALTH_PRE_ATTESTATION_CONTRACT = "seo-health-pre-attestation-bundle-v1";
export const SEO_HEALTH_PROVIDER_TERMINAL_CONTRACT = "seo-health-provider-terminal-bundle-v1";

const MANUAL_DISPATCH_OWNER = Object.freeze({
  id: "200251753",
  login: "willrapuano",
});

const VERCEL_BOT = Object.freeze({
  id: 35613825,
  login: "vercel[bot]",
  type: "Bot",
});
const VERCEL_CONTROL_SCOPES = Object.freeze([
  "read:deployment",
  "read:domain",
  "read:integration-configuration",
  "read:project",
]);
const ATTESTATION_PATH = "/api/ops/seo-health-attestation";
const MAX_ATTESTATION_BYTES = 64 * 1024;
const MAX_GITHUB_BYTES = 2 * 1024 * 1024;
const MAX_VERCEL_BYTES = 2 * 1024 * 1024;
const MAX_BUNDLE_BYTES = 128 * 1024;
const REQUEST_TIMEOUT_MS = 15_000;
const PREFLIGHT_DEADLINE_MS = 45_000;
const MAX_PREFLIGHT_AGE_MS = 60 * 60 * 1000;
const execFileAsync = promisify(execFile);
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

const ATTESTATION_CREDENTIALS = ["SEO_HEALTH_ATTESTATION_SECRET"];
const VERCEL_CONTROL_CREDENTIALS = ["SEO_HEALTH_VERCEL_CONTROL_TOKEN"];
const GITHUB_CREDENTIALS = ["GITHUB_TOKEN", "GH_TOKEN"];
const ARCHIVE_SIGNING_CREDENTIALS = ["SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY"];
const PROVIDER_CREDENTIALS = [
  "SEO_HEALTH_TURSO_DATABASE_URL",
  "SEO_HEALTH_TURSO_AUTH_TOKEN",
  "SEO_HEALTH_GHL_READ_TOKEN",
];
const PROVIDER_IDENTIFIERS = [
  "GHL_LOCATION_ID",
  "GHL_WEBSITE_PIPELINE_ID",
  "GHL_WEBSITE_SUBMITTED_STAGE_ID",
];
const APPLICATION_CREDENTIALS = [
  "ANTHROPIC_API_KEY",
  "CRON_SECRET",
  "DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "TURSO_DATABASE_URL",
  "GHL_PRIVATE_INTEGRATION_TOKEN",
  "GHL_WEBHOOK_URL",
  "GSC_SERVICE_ACCOUNT_PATH",
  "LEAD_PROTECTION_SECRET",
  "PAYPAL_CLIENT_SECRET",
  "RESEND_API_KEY",
  "SANITY_API_TOKEN",
  "SPYFU_BASE64_KEY",
];
const BUNDLE_KEYS = [
  "SEO_HEALTH_ATTESTATION_BUNDLE",
  "SEO_HEALTH_TERMINAL_BUNDLE",
];

function fail(code) {
  throw new SeoHealthIsolatedRunnerError(code);
}

function record(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function exactKeys(value, keys) {
  const item = record(value);
  if (!item) return false;
  const actual = Object.keys(item).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

function present(env, key) {
  return Object.hasOwn(env, key);
}

function requirePresent(env, keys, code) {
  if (keys.some((key) => typeof env[key] !== "string" || !env[key])) fail(code);
}

function rejectPresent(env, keys, code) {
  if (keys.some((key) => present(env, key))) fail(code);
}

export function validateProcessBoundary(role, env = process.env) {
  if (role === "gate") {
    rejectPresent(env, [
      ...ATTESTATION_CREDENTIALS,
      ...VERCEL_CONTROL_CREDENTIALS,
      ...GITHUB_CREDENTIALS,
      ...ARCHIVE_SIGNING_CREDENTIALS,
      ...PROVIDER_CREDENTIALS,
      ...PROVIDER_IDENTIFIERS,
      ...APPLICATION_CREDENTIALS,
      ...BUNDLE_KEYS,
    ], "SEO_HEALTH_GATE_FORBIDDEN_ENVIRONMENT");
    return;
  }
  if (role === "pre-attestation") {
    requirePresent(env, [
      "SEO_HEALTH_ATTESTATION_SECRET",
      "SEO_HEALTH_VERCEL_CONTROL_TOKEN",
      "GITHUB_TOKEN",
    ], "SEO_HEALTH_PRE_ATTESTATION_ENVIRONMENT_INCOMPLETE");
    if (env.SEO_HEALTH_ATTESTATION_SECRET.length < 32) fail("SEO_HEALTH_PRE_ATTESTATION_SECRET_INVALID");
    rejectPresent(env, [
      "GH_TOKEN",
      ...ARCHIVE_SIGNING_CREDENTIALS,
      ...PROVIDER_CREDENTIALS,
      ...PROVIDER_IDENTIFIERS,
      ...APPLICATION_CREDENTIALS,
      ...BUNDLE_KEYS,
    ], "SEO_HEALTH_PRE_ATTESTATION_FORBIDDEN_ENVIRONMENT");
    return;
  }
  if (role === "provider") {
    requirePresent(env, [
      ...PROVIDER_CREDENTIALS,
      ...PROVIDER_IDENTIFIERS,
      "SEO_HEALTH_ATTESTATION_BUNDLE",
    ], "SEO_HEALTH_PROVIDER_ENVIRONMENT_INCOMPLETE");
    rejectPresent(env, [
      ...ATTESTATION_CREDENTIALS,
      ...VERCEL_CONTROL_CREDENTIALS,
      ...GITHUB_CREDENTIALS,
      ...ARCHIVE_SIGNING_CREDENTIALS,
      ...APPLICATION_CREDENTIALS,
      "SEO_HEALTH_TERMINAL_BUNDLE",
    ], "SEO_HEALTH_PROVIDER_FORBIDDEN_ENVIRONMENT");
    return;
  }
  if (role === "archive") {
    requirePresent(env, [
      "SEO_HEALTH_ATTESTATION_SECRET",
      "SEO_HEALTH_VERCEL_CONTROL_TOKEN",
      ...ARCHIVE_SIGNING_CREDENTIALS,
      "GITHUB_TOKEN",
    ], "SEO_HEALTH_ARCHIVE_ENVIRONMENT_INCOMPLETE");
    if (env.SEO_HEALTH_ATTESTATION_SECRET.length < 32) fail("SEO_HEALTH_ARCHIVE_ATTESTATION_SECRET_INVALID");
    rejectPresent(env, [
      "GH_TOKEN",
      ...PROVIDER_CREDENTIALS,
      ...PROVIDER_IDENTIFIERS,
      ...APPLICATION_CREDENTIALS,
    ], "SEO_HEALTH_ARCHIVE_FORBIDDEN_ENVIRONMENT");
    return;
  }
  fail("SEO_HEALTH_PROCESS_ROLE_INVALID");
}

export function assertStrictWorkflowContext(config, env = process.env, match) {
  const branch = config?.deploymentBinding?.productionBranch;
  const expectedRef = `refs/heads/${branch}`;
  const expectedWorkflowRef = `${SEO_HEALTH_REPOSITORY}/${SEO_HEALTH_WORKFLOW_PATH}@${expectedRef}`;
  if (
    branch !== "main"
    || config?.deploymentBinding?.gitProvider !== "github"
    || env.GITHUB_ACTIONS !== "true"
    || env.GITHUB_REPOSITORY !== SEO_HEALTH_REPOSITORY
    || env.GITHUB_REF !== expectedRef
    || env.GITHUB_REF_NAME !== branch
    || env.GITHUB_WORKFLOW_REF !== expectedWorkflowRef
    || (
      env.GITHUB_EVENT_NAME !== "schedule"
      && !(
        env.GITHUB_EVENT_NAME === "workflow_dispatch"
        && env.GITHUB_ACTOR === MANUAL_DISPATCH_OWNER.login
        && env.GITHUB_ACTOR_ID === MANUAL_DISPATCH_OWNER.id
        && config?.rolloutPhase === "permanent"
        && match?.runKind === "checkpoint"
      )
    )
    || !/^[a-f0-9]{40}$/.test(env.GITHUB_SHA || "")
    || !/^[1-9]\d{0,19}$/.test(env.GITHUB_RUN_ID || "")
    || !/^[1-9]\d{0,19}$/.test(env.GITHUB_RUN_ATTEMPT || "")
  ) {
    fail("SEO_HEALTH_WORKFLOW_IDENTITY_MISMATCH");
  }
  return {
    actions: env.GITHUB_ACTIONS,
    repository: env.GITHUB_REPOSITORY,
    ref: env.GITHUB_REF,
    refName: env.GITHUB_REF_NAME,
    sha: env.GITHUB_SHA,
    workflowRef: env.GITHUB_WORKFLOW_REF,
    eventName: env.GITHUB_EVENT_NAME,
    runId: env.GITHUB_RUN_ID,
    runAttempt: env.GITHUB_RUN_ATTEMPT,
  };
}

export function assertStrictProductionOrigin(config) {
  if (config?.origin !== "https://dmvtitleguy.io") fail("SEO_HEALTH_ORIGIN_MISMATCH");
  let origin;
  try {
    origin = new URL(config.origin);
  } catch {
    fail("SEO_HEALTH_ORIGIN_MISMATCH");
  }
  if (
    origin.protocol !== "https:"
    || origin.origin !== config.origin
    || origin.hostname !== "dmvtitleguy.io"
    || origin.port !== ""
    || origin.username !== ""
    || origin.password !== ""
    || origin.pathname !== "/"
    || origin.search !== ""
    || origin.hash !== ""
    || sha256(origin.hostname) !== config?.deploymentBinding?.fingerprints?.productionHostnameSha256
  ) {
    fail("SEO_HEALTH_ORIGIN_MISMATCH");
  }
  return origin.origin;
}

export function createSanitizedGitEnvironment() {
  return {
    LANG: "C",
    LC_ALL: "C",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0",
  };
}

async function gitOutput(args) {
  try {
    const { stdout } = await execFileAsync("/usr/bin/git", args, {
      encoding: "utf8",
      timeout: 5_000,
      maxBuffer: 64 * 1024,
      windowsHide: true,
      // Never relay the archive signing key, attestation bearer, provider
      // credentials, or GitHub token into a child process. These local reads
      // need no ambient environment or credential helpers.
      env: createSanitizedGitEnvironment(),
    });
    return stdout.trim();
  } catch {
    fail("SEO_HEALTH_CHECKOUT_IDENTITY_MISMATCH");
  }
}

export async function assertStrictCheckout(github) {
  const [head, origin, status, objectType] = await Promise.all([
    gitOutput(["rev-parse", "HEAD"]),
    gitOutput(["remote", "get-url", "origin"]),
    gitOutput(["status", "--porcelain=v1", "--untracked-files=all"]),
    gitOutput(["cat-file", "-t", github.sha]),
  ]);
  if (
    head !== github.sha
    || ![
      `https://github.com/${SEO_HEALTH_REPOSITORY}`,
      `https://github.com/${SEO_HEALTH_REPOSITORY}.git`,
    ].includes(origin)
    || status !== ""
    || objectType !== "commit"
  ) {
    fail("SEO_HEALTH_CHECKOUT_IDENTITY_MISMATCH");
  }
}

async function boundedText(response, maxBytes, code) {
  const rawLength = response.headers.get("content-length");
  if (rawLength && (!/^\d+$/.test(rawLength) || Number(rawLength) > maxBytes)) fail(code);
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) fail(code);
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } catch (error) {
    if (error instanceof SeoHealthIsolatedRunnerError) throw error;
    fail(code);
  } finally {
    try {
      await reader.cancel();
    } catch {
      // Cancellation is best-effort after a bounded read.
    }
  }
}

export async function fetchJsonBounded(url, options, { maxBytes, code, deadline }) {
  const remaining = Math.max(0, deadline - Date.now());
  if (remaining === 0) fail(code);
  let response;
  try {
    response = await fetch(url, {
      ...options,
      redirect: "error",
      signal: AbortSignal.timeout(Math.min(REQUEST_TIMEOUT_MS, remaining)),
    });
  } catch {
    fail(code);
  }
  if (!response.ok) fail(code);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) fail(code);
  try {
    return JSON.parse(await boundedText(response, maxBytes, code));
  } catch (error) {
    if (error instanceof SeoHealthIsolatedRunnerError) throw error;
    fail(code);
  }
}

function attestationHeaders(secret) {
  return {
    Authorization: `Bearer ${secret}`,
    Accept: "application/json",
    "Cache-Control": "no-store",
    "User-Agent": "dmvtitleguy-seo-health/1.0",
  };
}

async function fetchAttestation(origin, secret, deadline) {
  return fetchJsonBounded(`${origin}${ATTESTATION_PATH}`, {
    headers: attestationHeaders(secret),
  }, {
    maxBytes: MAX_ATTESTATION_BYTES,
    code: "SEO_HEALTH_ATTESTATION_REQUEST_FAILED",
    deadline,
  });
}

function assertAttestationMatchesControlPlane(attested, vercelControlPlane) {
  const environment = attested?.environment;
  if (
    !environment
    || environment.VERCEL_DEPLOYMENT_ID !== vercelControlPlane?.deploymentId
    || environment.VERCEL_URL !== vercelControlPlane?.deploymentUrl
    || sha256(environment.VERCEL_PROJECT_ID) !== vercelControlPlane?.projectIdSha256
  ) {
    fail("SEO_HEALTH_ATTESTATION_CONTROL_PLANE_MISMATCH");
  }
}

export async function fetchAndValidateUniqueAttestation({
  config,
  github,
  secret,
  vercelControlPlane,
}) {
  const deadline = Date.now() + PREFLIGHT_DEADLINE_MS;
  if (!isVercelDeploymentHostname(vercelControlPlane?.deploymentUrl)) {
    fail("SEO_HEALTH_ATTESTATION_CONTROL_PLANE_MISMATCH");
  }
  const unique = await fetchAttestation(
    `https://${vercelControlPlane.deploymentUrl}`,
    secret,
    deadline,
  );
  const attested = validateRemoteAttestation(unique, config, github);
  assertAttestationMatchesControlPlane(attested, vercelControlPlane);
  return { unique, attested };
}

export async function fetchAndValidateCanonicalAttestation({
  config,
  github,
  secret,
  unique,
  attested,
  vercelControlPlane,
}) {
  const deadline = Date.now() + PREFLIGHT_DEADLINE_MS;
  assertAttestationMatchesControlPlane(attested, vercelControlPlane);
  const canonical = await fetchAttestation(config.origin, secret, deadline);
  const canonicalAttested = validateRemoteAttestation(canonical, config, github);
  assertAttestationMatchesControlPlane(canonicalAttested, vercelControlPlane);
  assertMatchingAttestations(unique, canonical);
  return canonical;
}

export function githubHeaders(token) {
  if (typeof token !== "string" || token.length < 20 || /[\r\n]/.test(token)) {
    fail("SEO_HEALTH_GITHUB_TOKEN_INVALID");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "dmvtitleguy-seo-health/1.0",
  };
}

function exactVercelBot(value) {
  return value?.id === VERCEL_BOT.id
    && value?.login === VERCEL_BOT.login
    && value?.type === VERCEL_BOT.type;
}

function exactEnvironmentUrl(value, hostname) {
  if (value !== `https://${hostname}`) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:"
      && parsed.hostname === hostname
      && parsed.port === ""
      && parsed.username === ""
      && parsed.password === ""
      && parsed.pathname === "/"
      && parsed.search === ""
      && parsed.hash === "";
  } catch {
    return false;
  }
}

function timestamp(value) {
  if (typeof value !== "string") return Number.NaN;
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) return Number.NaN;
  const canonical = new Date(milliseconds).toISOString();
  return value === canonical || value === canonical.replace(/\.000Z$/, "Z")
    ? milliseconds
    : Number.NaN;
}

export function validateGithubVercelProductionProvenance({
  deployments,
  statusesByDeployment,
  config,
  github,
  vercelControlPlane,
}) {
  const deploymentConfig = config?.deploymentBinding?.githubDeployment;
  if (
    deploymentConfig?.environment !== "Production"
    || deploymentConfig?.creatorId !== VERCEL_BOT.id
    || deploymentConfig?.creatorLogin !== VERCEL_BOT.login
    || deploymentConfig?.creatorType !== VERCEL_BOT.type
    || !Array.isArray(deployments)
    || !isVercelDeploymentHostname(vercelControlPlane?.deploymentUrl)
  ) {
    fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
  }
  const candidates = deployments.filter((deployment) => (
    Number.isSafeInteger(deployment?.id)
    && deployment.id > 0
    && deployment.sha === github.sha
    && deployment.ref === github.sha
    && deployment.environment === deploymentConfig.environment
    && exactVercelBot(deployment.creator)
  ));
  if (candidates.length === 0 || candidates.length > 5) {
    fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
  }
  const currentDeploymentStatuses = [];
  for (const deployment of candidates) {
    const statuses = statusesByDeployment instanceof Map
      ? statusesByDeployment.get(deployment.id)
      : statusesByDeployment?.[deployment.id];
    if (!Array.isArray(statuses) || statuses.length === 0) {
      fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
    }
    const observedStatuses = statuses.map((status) => {
      const createdAt = timestamp(status?.created_at);
      if (!Number.isSafeInteger(status?.id) || status.id <= 0 || !Number.isFinite(createdAt)) {
        fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
      }
      return { status, createdAt };
    });
    observedStatuses.sort((left, right) => (
      right.createdAt - left.createdAt || right.status.id - left.status.id
    ));
    const latest = observedStatuses[0];
    const everBoundToCurrentDeployment = observedStatuses.some(({ status }) => (
      exactEnvironmentUrl(status.environment_url, vercelControlPlane.deploymentUrl)
    ));
    if (everBoundToCurrentDeployment) {
      currentDeploymentStatuses.push({ deployment, status: latest.status, createdAt: latest.createdAt });
    }
  }
  currentDeploymentStatuses.sort((left, right) => (
    right.createdAt - left.createdAt || right.status.id - left.status.id
  ));
  const latest = currentDeploymentStatuses[0];
  if (
    !latest
    || latest.status.state !== "success"
    || latest.status.environment !== deploymentConfig.environment
    || !exactVercelBot(latest.status.creator)
    || !exactEnvironmentUrl(latest.status.environment_url, vercelControlPlane.deploymentUrl)
  ) {
    fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
  }
  return {
    deploymentId: latest.deployment.id,
    statusId: latest.status.id,
    environment: deploymentConfig.environment,
    environmentUrl: latest.status.environment_url,
    statusCreatedAt: latest.status.created_at,
    creator: { ...VERCEL_BOT },
  };
}

export async function fetchAndValidateGithubVercelProductionProvenance({
  token,
  config,
  github,
  vercelControlPlane,
}) {
  const maxDeployments = config?.deploymentBinding?.githubDeployment?.maxDeployments;
  if (!Number.isSafeInteger(maxDeployments) || maxDeployments < 1 || maxDeployments > 100) {
    fail("SEO_HEALTH_GITHUB_DEPLOYMENT_CONFIG_INVALID");
  }
  const deadline = Date.now() + PREFLIGHT_DEADLINE_MS;
  const query = new URL(`https://api.github.com/repos/${SEO_HEALTH_REPOSITORY}/deployments`);
  query.searchParams.set("sha", github.sha);
  query.searchParams.set("environment", "Production");
  query.searchParams.set("per_page", String(maxDeployments));
  const deployments = await fetchJsonBounded(query.toString(), {
    headers: githubHeaders(token),
  }, {
    maxBytes: MAX_GITHUB_BYTES,
    code: "SEO_HEALTH_GITHUB_DEPLOYMENTS_REQUEST_FAILED",
    deadline,
  });
  if (!Array.isArray(deployments)) fail("SEO_HEALTH_GITHUB_DEPLOYMENTS_RESPONSE_INVALID");
  const candidates = deployments.filter((deployment) => (
    deployment?.sha === github.sha
    && deployment?.environment === "Production"
    && exactVercelBot(deployment?.creator)
  ));
  if (candidates.length === 0 || candidates.length > 5) {
    fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
  }
  const statusesByDeployment = new Map();
  for (const deployment of candidates) {
    if (!Number.isSafeInteger(deployment?.id) || deployment.id <= 0) {
      fail("SEO_HEALTH_GITHUB_DEPLOYMENT_PROVENANCE_INVALID");
    }
    const statuses = await fetchJsonBounded(
      `https://api.github.com/repos/${SEO_HEALTH_REPOSITORY}/deployments/${deployment.id}/statuses?per_page=100`,
      { headers: githubHeaders(token) },
      {
        maxBytes: MAX_GITHUB_BYTES,
        code: "SEO_HEALTH_GITHUB_DEPLOYMENT_STATUS_REQUEST_FAILED",
        deadline,
      },
    );
    statusesByDeployment.set(deployment.id, statuses);
  }
  return validateGithubVercelProductionProvenance({
    deployments,
    statusesByDeployment,
    config,
    github,
    vercelControlPlane,
  });
}

function exactStringSet(value, expected) {
  return Array.isArray(value)
    && value.length === expected.length
    && value.every((item) => typeof item === "string")
    && new Set(value).size === value.length
    && [...value].sort().every((item, index) => item === [...expected].sort()[index]);
}

function absentOrNull(value) {
  return value === undefined || value === null;
}

function vercelControlConfig(config) {
  const control = config?.deploymentBinding?.vercelControlPlane;
  if (
    control?.canonicalAlias !== "dmvtitleguy.io"
    || control?.projectSelection !== "selected"
    || !/^team_[A-Za-z0-9]{16,}$/.test(control?.teamId || "")
    || !/^icfg_[A-Za-z0-9]{16,}$/.test(control?.integrationConfigurationId || "")
    || !/^oac_[A-Za-z0-9]{16,}$/.test(control?.integrationId || "")
    || !/^dmvtitleguy-seo-health-[a-z0-9-]{3,64}$/.test(control?.integrationSlug || "")
    || !exactStringSet(control?.requiredResourceScopes, VERCEL_CONTROL_SCOPES)
    || !isSha256(config?.deploymentBinding?.fingerprints?.vercelControlTokenSha256)
  ) {
    fail("SEO_HEALTH_VERCEL_CONTROL_CONFIG_INVALID");
  }
  return control;
}

export function vercelControlHeaders(token) {
  if (
    typeof token !== "string"
    || token.length < 20
    || token.length > 512
    || /[^\x21-\x7e]/.test(token)
  ) {
    fail("SEO_HEALTH_VERCEL_CONTROL_CREDENTIAL_INVALID");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Cache-Control": "no-store",
    "User-Agent": "dmvtitleguy-seo-health/1.0",
  };
}

function integrationConfigurationTypeValid(value) {
  return value === undefined || value === "integration-configuration";
}

function integrationConfigurationActive(value) {
  return [undefined, "ready", "resumed"].includes(value?.status)
    && absentOrNull(value?.deletedAt)
    && absentOrNull(value?.disabledAt)
    && absentOrNull(value?.deleteRequestedAt)
    && absentOrNull(value?.customerDeleteRequestedAt);
}

function deriveVercelControlTarget({
  authenticatedConfigurations,
  integrationConfiguration,
  alias,
  config,
}) {
  const control = vercelControlConfig(config);
  const authenticatedConfigurationList = Array.isArray(authenticatedConfigurations)
    ? authenticatedConfigurations
    : null;
  const tokenConfiguration = authenticatedConfigurationList?.length === 1
    ? record(authenticatedConfigurationList[0])
    : null;
  const configuration = record(integrationConfiguration);
  const aliasRecord = record(alias);
  const aliasDeployment = record(aliasRecord?.deployment);
  const projectId = aliasRecord?.projectId;
  const deploymentId = aliasRecord?.deploymentId;
  const deploymentUrl = aliasDeployment?.url;
  const ownerId = configuration?.ownerId;
  if (
    !configuration
    || !tokenConfiguration
    || !aliasRecord
    || !aliasDeployment
    || !integrationConfigurationTypeValid(tokenConfiguration.type)
    || !integrationConfigurationTypeValid(configuration.type)
    || tokenConfiguration.id !== control.integrationConfigurationId
    || configuration.id !== control.integrationConfigurationId
    || tokenConfiguration.integrationId !== control.integrationId
    || configuration.integrationId !== control.integrationId
    || tokenConfiguration.slug !== control.integrationSlug
    || configuration.slug !== control.integrationSlug
    || tokenConfiguration.teamId !== control.teamId
    || configuration.teamId !== control.teamId
    // An installation may be owned by the installing user while belonging to
    // the configured team. Bind the two API representations to that same
    // provider-issued owner instead of incorrectly equating ownerId to teamId.
    || typeof ownerId !== "string"
    || ownerId.length < 8
    || tokenConfiguration.ownerId !== ownerId
    || !integrationConfigurationActive(tokenConfiguration)
    || !integrationConfigurationActive(configuration)
    || configuration.projectSelection !== "selected"
    || !exactStringSet(tokenConfiguration.projects, [projectId])
    || !exactStringSet(configuration.projects, [projectId])
    || !exactStringSet(tokenConfiguration.scopes, VERCEL_CONTROL_SCOPES)
    || !exactStringSet(configuration.scopes, VERCEL_CONTROL_SCOPES)
    || aliasRecord.alias !== control.canonicalAlias
    || typeof projectId !== "string"
    || !projectId
    || sha256(projectId) !== config?.deploymentBinding?.fingerprints?.projectIdSha256
    || typeof deploymentId !== "string"
    || !/^dpl_[A-Za-z0-9]{16,}$/.test(deploymentId)
    || aliasDeployment.id !== deploymentId
    || !isVercelDeploymentHostname(deploymentUrl)
    || !absentOrNull(aliasRecord.redirect)
    || !absentOrNull(aliasRecord.deletedAt)
  ) {
    fail("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID");
  }
  return { control, projectId, deploymentId, deploymentUrl };
}

export function validateVercelControlPlaneProvenance({
  authenticatedConfigurations,
  integrationConfiguration,
  alias,
  deployment,
  deploymentAliases,
  projectDomain,
  config,
  github,
}) {
  const {
    control,
    projectId,
    deploymentId,
    deploymentUrl,
  } = deriveVercelControlTarget({
    authenticatedConfigurations,
    integrationConfiguration,
    alias,
    config,
  });
  const deploymentRecord = record(deployment);
  const deploymentMeta = record(deploymentRecord?.meta);
  const domainRecord = record(projectDomain);
  const aliasList = Array.isArray(deploymentAliases?.aliases)
    ? deploymentAliases.aliases
    : null;
  const canonicalDeploymentAliases = aliasList?.filter((item) => (
    item?.alias === control.canonicalAlias
  ));
  if (
    !deploymentRecord
    || deploymentRecord.id !== deploymentId
    || deploymentRecord.url !== deploymentUrl
    || deploymentRecord.projectId !== projectId
    || deploymentRecord?.ownerId !== control.teamId
    || deploymentRecord?.target !== "production"
    || deploymentRecord?.readyState !== "READY"
    || deploymentRecord?.aliasAssigned !== true
    || !absentOrNull(deploymentRecord?.aliasError)
    || !Array.isArray(deploymentRecord?.alias)
    || deploymentRecord.alias.filter((item) => item === control.canonicalAlias).length !== 1
    || !deploymentMeta
    || deploymentMeta.gitDirty !== "0"
    || deploymentMeta.githubCommitSha !== github?.sha
    || deploymentMeta.githubCommitRef !== config?.deploymentBinding?.productionBranch
    || sha256(deploymentMeta.githubRepoId || "")
      !== config?.deploymentBinding?.fingerprints?.gitRepoIdSha256
    || sha256(deploymentMeta.githubOrg || "")
      !== config?.deploymentBinding?.fingerprints?.gitRepoOwnerSha256
    || sha256(deploymentMeta.githubRepo || "")
      !== config?.deploymentBinding?.fingerprints?.gitRepoSlugSha256
    || !aliasList
    || canonicalDeploymentAliases?.length !== 1
    || !absentOrNull(canonicalDeploymentAliases[0]?.redirect)
    || domainRecord?.name !== control.canonicalAlias
    || domainRecord?.projectId !== projectId
    || domainRecord?.verified !== true
    || !absentOrNull(domainRecord?.redirect)
    || !absentOrNull(domainRecord?.gitBranch)
  ) {
    fail("SEO_HEALTH_VERCEL_CONTROL_PROVENANCE_INVALID");
  }
  return {
    canonicalAlias: control.canonicalAlias,
    deploymentId,
    deploymentUrl,
    projectIdSha256: sha256(projectId),
    teamIdSha256: sha256(control.teamId),
    integrationConfigurationId: control.integrationConfigurationId,
    integrationId: control.integrationId,
    integrationSlug: control.integrationSlug,
    projectSelection: "selected",
    resourceScopes: [...VERCEL_CONTROL_SCOPES],
    providerPermissionLevelExposure: "read-prefixed-effective-scopes",
    tokenConfigurationBound: true,
    selectedProjectOnly: true,
  };
}

export async function fetchAndValidateVercelControlPlaneProvenance({
  token,
  config,
  github,
}) {
  const control = vercelControlConfig(config);
  if (
    typeof token !== "string"
    || !token
    || sha256(token) !== config.deploymentBinding.fingerprints.vercelControlTokenSha256
  ) {
    fail("SEO_HEALTH_VERCEL_CONTROL_CREDENTIAL_INVALID");
  }
  const deadline = Date.now() + PREFLIGHT_DEADLINE_MS;
  const headers = vercelControlHeaders(token);
  const teamQuery = new URLSearchParams({ teamId: control.teamId }).toString();
  const authenticatedConfigurationsUrl = new URL(
    "https://api.vercel.com/v1/integrations/configurations",
  );
  authenticatedConfigurationsUrl.searchParams.set("view", "account");
  authenticatedConfigurationsUrl.searchParams.set("installationType", "external");
  authenticatedConfigurationsUrl.searchParams.set("integrationIdOrSlug", control.integrationId);
  authenticatedConfigurationsUrl.searchParams.set("teamId", control.teamId);
  const aliasUrl = new URL(
    `https://api.vercel.com/v4/aliases/${encodeURIComponent(control.canonicalAlias)}`,
  );
  aliasUrl.searchParams.set("teamId", control.teamId);
  const [authenticatedConfigurations, integrationConfiguration, alias] = await Promise.all([
    fetchJsonBounded(authenticatedConfigurationsUrl.toString(), { headers }, {
      maxBytes: MAX_VERCEL_BYTES,
      code: "SEO_HEALTH_VERCEL_CONTROL_AUTHENTICATED_CONFIGURATIONS_REQUEST_FAILED",
      deadline,
    }),
    fetchJsonBounded(
      `https://api.vercel.com/v1/integrations/configuration/${encodeURIComponent(control.integrationConfigurationId)}?${teamQuery}`,
      { headers },
      {
        maxBytes: MAX_VERCEL_BYTES,
        code: "SEO_HEALTH_VERCEL_CONTROL_CONFIGURATION_REQUEST_FAILED",
        deadline,
      },
    ),
    fetchJsonBounded(aliasUrl.toString(), { headers }, {
      maxBytes: MAX_VERCEL_BYTES,
      code: "SEO_HEALTH_VERCEL_CONTROL_ALIAS_REQUEST_FAILED",
      deadline,
    }),
  ]);
  const target = deriveVercelControlTarget({
    authenticatedConfigurations,
    integrationConfiguration,
    alias,
    config,
  });
  const [deployment, deploymentAliases, projectDomain] = await Promise.all([
    fetchJsonBounded(
      `https://api.vercel.com/v13/deployments/${encodeURIComponent(target.deploymentId)}?${teamQuery}`,
      { headers },
      {
        maxBytes: MAX_VERCEL_BYTES,
        code: "SEO_HEALTH_VERCEL_CONTROL_DEPLOYMENT_REQUEST_FAILED",
        deadline,
      },
    ),
    fetchJsonBounded(
      `https://api.vercel.com/v2/deployments/${encodeURIComponent(target.deploymentId)}/aliases?${teamQuery}`,
      { headers },
      {
        maxBytes: MAX_VERCEL_BYTES,
        code: "SEO_HEALTH_VERCEL_CONTROL_DEPLOYMENT_ALIASES_REQUEST_FAILED",
        deadline,
      },
    ),
    fetchJsonBounded(
      `https://api.vercel.com/v9/projects/${encodeURIComponent(target.projectId)}/domains/${encodeURIComponent(control.canonicalAlias)}?${teamQuery}`,
      { headers },
      {
        maxBytes: MAX_VERCEL_BYTES,
        code: "SEO_HEALTH_VERCEL_CONTROL_PROJECT_DOMAIN_REQUEST_FAILED",
        deadline,
      },
    ),
  ]);
  return validateVercelControlPlaneProvenance({
    authenticatedConfigurations,
    integrationConfiguration,
    alias,
    deployment,
    deploymentAliases,
    projectDomain,
    config,
    github,
  });
}

function checkpointIdentity(match) {
  return {
    id: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
  };
}

function wrapBundle(contract, payload) {
  const wrapper = {
    schemaVersion: 1,
    contract,
    payload,
    payloadDigest: stableJsonDigest(payload),
  };
  return Buffer.from(JSON.stringify(wrapper), "utf8").toString("base64url");
}

function unwrapBundle(encoded, contract) {
  if (typeof encoded !== "string" || !/^[A-Za-z0-9_-]+$/.test(encoded)) {
    fail("SEO_HEALTH_BUNDLE_ENCODING_INVALID");
  }
  let bytes;
  let value;
  try {
    bytes = Buffer.from(encoded, "base64url");
    if (bytes.length === 0 || bytes.length > MAX_BUNDLE_BYTES || bytes.toString("base64url") !== encoded) {
      fail("SEO_HEALTH_BUNDLE_ENCODING_INVALID");
    }
    value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof SeoHealthIsolatedRunnerError) throw error;
    fail("SEO_HEALTH_BUNDLE_ENCODING_INVALID");
  }
  if (
    !exactKeys(value, ["schemaVersion", "contract", "payload", "payloadDigest"])
    || value.schemaVersion !== 1
    || value.contract !== contract
    || !isSha256(value.payloadDigest)
    || value.payloadDigest !== stableJsonDigest(value.payload)
  ) {
    fail("SEO_HEALTH_BUNDLE_INTEGRITY_INVALID");
  }
  return value;
}

function assertCheckpoint(value, match) {
  if (
    !exactKeys(value, ["id", "scheduledDate", "runKind"])
    || value.id !== match.checkpointId
    || value.scheduledDate !== match.effectiveDate
    || value.runKind !== match.runKind
  ) {
    fail("SEO_HEALTH_BUNDLE_CHECKPOINT_MISMATCH");
  }
}

export function createPreAttestationBundle({
  match,
  github,
  attested,
  provenance,
  vercelControlPlane,
  now = new Date(),
}) {
  const payload = {
    repository: SEO_HEALTH_REPOSITORY,
    ref: github.ref,
    sha: github.sha,
    workflowRef: github.workflowRef,
    runId: github.runId,
    runAttempt: github.runAttempt,
    checkpoint: checkpointIdentity(match),
    attestedAt: now.toISOString(),
    attestation: {
      environment: attested.environment,
      deploymentFingerprint: attested.deploymentFingerprint,
    },
    githubDeployment: provenance,
    vercelControlPlane,
  };
  return wrapBundle(SEO_HEALTH_PRE_ATTESTATION_CONTRACT, payload);
}

export function validatePreAttestationBundle(encoded, {
  match,
  github,
  config,
  now = new Date(),
}) {
  const wrapper = unwrapBundle(encoded, SEO_HEALTH_PRE_ATTESTATION_CONTRACT);
  const payload = wrapper.payload;
  if (!exactKeys(payload, [
    "repository",
    "ref",
    "sha",
    "workflowRef",
    "runId",
    "runAttempt",
    "checkpoint",
    "attestedAt",
    "attestation",
    "githubDeployment",
    "vercelControlPlane",
  ])) fail("SEO_HEALTH_PRE_ATTESTATION_BUNDLE_INVALID");
  assertCheckpoint(payload.checkpoint, match);
  const attestedAt = timestamp(payload.attestedAt);
  const age = now.getTime() - attestedAt;
  const environment = payload.attestation?.environment;
  const githubDeployment = payload.githubDeployment;
  const vercelControlPlane = payload.vercelControlPlane;
  const control = vercelControlConfig(config);
  if (
    payload.repository !== SEO_HEALTH_REPOSITORY
    || payload.ref !== github.ref
    || payload.sha !== github.sha
    || payload.workflowRef !== github.workflowRef
    || payload.runId !== github.runId
    || payload.runAttempt !== github.runAttempt
    || !Number.isFinite(attestedAt)
    || age < -60_000
    || age > MAX_PREFLIGHT_AGE_MS
    || !exactKeys(payload.attestation, ["environment", "deploymentFingerprint"])
    || !exactKeys(environment, ATTESTED_ENVIRONMENT_KEYS)
    || !isSha256(payload.attestation.deploymentFingerprint)
    || payload.attestation.deploymentFingerprint
      !== deploymentFingerprintFromAttestationEnvironment(environment)
    || environment.VERCEL !== "1"
    || environment.VERCEL_ENV !== "production"
    || environment.VERCEL_TARGET_ENV !== "production"
    || environment.VERCEL_GIT_PROVIDER !== "github"
    || environment.VERCEL_GIT_REPO_OWNER !== "willrapuano"
    || environment.VERCEL_GIT_REPO_SLUG !== "dmvtitleguy"
    || environment.VERCEL_GIT_COMMIT_REF !== "main"
    || environment.VERCEL_GIT_COMMIT_SHA !== github.sha
    || environment.VERCEL_PROJECT_PRODUCTION_URL !== "dmvtitleguy.io"
    || !/^dpl_[A-Za-z0-9]{16,}$/.test(environment.VERCEL_DEPLOYMENT_ID)
    || !isVercelDeploymentHostname(environment.VERCEL_URL)
    || sha256(environment.VERCEL_PROJECT_ID)
      !== config?.deploymentBinding?.fingerprints?.projectIdSha256
    || sha256(environment.VERCEL_GIT_REPO_ID)
      !== config?.deploymentBinding?.fingerprints?.gitRepoIdSha256
    || sha256(environment.VERCEL_GIT_REPO_OWNER)
      !== config?.deploymentBinding?.fingerprints?.gitRepoOwnerSha256
    || sha256(environment.VERCEL_GIT_REPO_SLUG)
      !== config?.deploymentBinding?.fingerprints?.gitRepoSlugSha256
    || sha256(environment.VERCEL_PROJECT_PRODUCTION_URL)
      !== config?.deploymentBinding?.fingerprints?.productionHostnameSha256
    || !exactKeys(githubDeployment, [
      "deploymentId",
      "statusId",
      "environment",
      "environmentUrl",
      "statusCreatedAt",
      "creator",
    ])
    || !Number.isSafeInteger(githubDeployment.deploymentId)
    || githubDeployment.deploymentId <= 0
    || !Number.isSafeInteger(githubDeployment.statusId)
    || githubDeployment.statusId <= 0
    || githubDeployment.environment !== "Production"
    || !exactEnvironmentUrl(githubDeployment.environmentUrl, environment.VERCEL_URL)
    || !Number.isFinite(timestamp(githubDeployment.statusCreatedAt))
    || !exactKeys(githubDeployment.creator, ["id", "login", "type"])
    || !exactVercelBot(githubDeployment.creator)
    || !exactKeys(vercelControlPlane, [
      "canonicalAlias",
      "deploymentId",
      "deploymentUrl",
      "projectIdSha256",
      "teamIdSha256",
      "integrationConfigurationId",
      "integrationId",
      "integrationSlug",
      "projectSelection",
      "resourceScopes",
      "providerPermissionLevelExposure",
      "tokenConfigurationBound",
      "selectedProjectOnly",
    ])
    || vercelControlPlane.canonicalAlias !== control.canonicalAlias
    || vercelControlPlane.deploymentId !== environment.VERCEL_DEPLOYMENT_ID
    || vercelControlPlane.deploymentUrl !== environment.VERCEL_URL
    || vercelControlPlane.projectIdSha256 !== sha256(environment.VERCEL_PROJECT_ID)
    || vercelControlPlane.teamIdSha256 !== sha256(control.teamId)
    || vercelControlPlane.integrationConfigurationId !== control.integrationConfigurationId
    || vercelControlPlane.integrationId !== control.integrationId
    || vercelControlPlane.integrationSlug !== control.integrationSlug
    || vercelControlPlane.projectSelection !== "selected"
    || !exactStringSet(vercelControlPlane.resourceScopes, VERCEL_CONTROL_SCOPES)
    || vercelControlPlane.providerPermissionLevelExposure !== "read-prefixed-effective-scopes"
    || vercelControlPlane.tokenConfigurationBound !== true
    || vercelControlPlane.selectedProjectOnly !== true
  ) {
    fail("SEO_HEALTH_PRE_ATTESTATION_BUNDLE_INVALID");
  }
  return { ...wrapper, payload };
}

export function createProviderTerminalBundle({ preAttestation, terminal }) {
  return wrapBundle(SEO_HEALTH_PROVIDER_TERMINAL_CONTRACT, {
    preAttestationDigest: preAttestation.payloadDigest,
    checkpoint: preAttestation.payload.checkpoint,
    terminal,
  });
}

export function validateProviderTerminalBundle(encoded, { preAttestation, match }) {
  const wrapper = unwrapBundle(encoded, SEO_HEALTH_PROVIDER_TERMINAL_CONTRACT);
  const payload = wrapper.payload;
  if (!exactKeys(payload, ["preAttestationDigest", "checkpoint", "terminal"])) {
    fail("SEO_HEALTH_PROVIDER_TERMINAL_BUNDLE_INVALID");
  }
  assertCheckpoint(payload.checkpoint, match);
  if (
    payload.preAttestationDigest !== preAttestation.payloadDigest
    || payload.terminal?.event !== "seo-operational-health.finish"
    || payload.terminal?.checkpointId !== match.checkpointId
    || payload.terminal?.scheduledDate !== match.effectiveDate
    || payload.terminal?.runKind !== match.runKind
    || payload.terminal?.deploymentFingerprint
      !== preAttestation.payload.attestation.deploymentFingerprint
  ) {
    fail("SEO_HEALTH_PROVIDER_TERMINAL_BUNDLE_INVALID");
  }
  return { ...wrapper, payload };
}

export async function writeGithubOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (
    process.env.GITHUB_ACTIONS !== "true"
    || typeof outputPath !== "string"
    || !outputPath
    || !/^[a-z][a-z0-9_]{0,63}$/.test(name)
    || typeof value !== "string"
    || value.includes("\n")
    || value.includes("\r")
  ) {
    fail("SEO_HEALTH_GITHUB_OUTPUT_INVALID");
  }
  await appendFile(outputPath, `${name}=${value}\n`, { encoding: "utf8", mode: 0o600 });
}
