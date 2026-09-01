import { readFile } from "node:fs/promises";
import {
  buildSignedArchiveComment,
  resolveExistingArchive,
  validateTerminalEvidence,
} from "./lib/seo-health-evidence-archive.mjs";
import { resolveReusableArchiveComments } from "./lib/seo-health-canary-receipt.mjs";
import { recordSignedIncident } from "./lib/seo-health-incident-recorder.mjs";
import {
  SeoHealthIsolatedRunnerError,
  pinnedIsolatedScheduleFromEnvironment,
  safeRunnerFailure,
} from "./lib/seo-health-isolated-runner.mjs";
import {
  SEO_HEALTH_REPOSITORY,
  assertStrictProductionOrigin,
  assertStrictCheckout,
  assertStrictWorkflowContext,
  fetchAndValidateCanonicalAttestation,
  fetchAndValidateUniqueAttestation,
  fetchAndValidateGithubVercelProductionProvenance,
  fetchAndValidateVercelControlPlaneProvenance,
  fetchJsonBounded,
  githubHeaders,
  validatePreAttestationBundle,
  validateProcessBoundary,
  validateProviderTerminalBundle,
} from "./lib/seo-health-process-boundaries.mjs";
import { computeSeoHealthSourceDigest } from "./lib/seo-health-source-digest.mjs";
import { stableJsonDigest } from "../src/lib/seo-operational-health-contract.ts";

const ARCHIVE_ISSUE = "47";
const MAX_GITHUB_BYTES = 2 * 1024 * 1024;
const ARCHIVE_DEADLINE_MS = 45_000;

function fail(code) {
  throw new SeoHealthIsolatedRunnerError(code);
}

async function listArchiveComments(token, deadline) {
  const comments = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = `https://api.github.com/repos/${SEO_HEALTH_REPOSITORY}/issues/${ARCHIVE_ISSUE}/comments?per_page=100&page=${page}`;
    const result = await fetchJsonBounded(url, {
      headers: githubHeaders(token),
    }, {
      maxBytes: MAX_GITHUB_BYTES,
      code: "SEO_HEALTH_ARCHIVE_LOOKUP_FAILED",
      deadline,
    });
    if (!Array.isArray(result)) fail("SEO_HEALTH_ARCHIVE_LOOKUP_INVALID");
    comments.push(...result.map((comment) => ({
      id: comment?.id,
      url: comment?.url,
      body: comment?.body,
      html_url: comment?.html_url,
      issue_url: comment?.issue_url,
      user: comment?.user,
      created_at: comment?.created_at,
      updated_at: comment?.updated_at,
    })));
    if (result.length < 100) return comments;
  }
  fail("SEO_HEALTH_ARCHIVE_PAGINATION_EXCEEDED");
}

async function createArchiveComment(token, body, deadline) {
  const result = await fetchJsonBounded(
    `https://api.github.com/repos/${SEO_HEALTH_REPOSITORY}/issues/${ARCHIVE_ISSUE}/comments`,
    {
      method: "POST",
      headers: {
        ...githubHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    },
    {
      maxBytes: MAX_GITHUB_BYTES,
      code: "SEO_HEALTH_ARCHIVE_CREATE_FAILED",
      deadline,
    },
  );
  if (typeof result?.html_url !== "string" || !result.html_url.startsWith("https://github.com/")) {
    fail("SEO_HEALTH_ARCHIVE_CREATE_INVALID");
  }
  return {
    id: result.id,
    url: result.url,
    body: result.body,
    html_url: result.html_url,
    issue_url: result.issue_url,
    user: result.user,
    created_at: result.created_at,
    updated_at: result.updated_at,
  };
}

let checkpointContext = {};
let config = null;
let match = null;
let github = null;
try {
  validateProcessBoundary("archive");
  config = JSON.parse(await readFile(
    new URL("../config/seo-operational-health.json", import.meta.url),
    "utf8",
  ));
  const now = new Date();
  match = pinnedIsolatedScheduleFromEnvironment(config);
  checkpointContext = {
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
  };
  github = assertStrictWorkflowContext(config, process.env, match);
  assertStrictProductionOrigin(config);
  await assertStrictCheckout(github);
  const preAttestation = validatePreAttestationBundle(
    process.env.SEO_HEALTH_ATTESTATION_BUNDLE,
    { match, github, config, now },
  );
  const providerTerminal = validateProviderTerminalBundle(
    process.env.SEO_HEALTH_TERMINAL_BUNDLE,
    { preAttestation, match },
  );
  if (providerTerminal.payload.terminal?.healthSourceDigest !== await computeSeoHealthSourceDigest()) {
    fail("SEO_HEALTH_ARCHIVE_SOURCE_MISMATCH");
  }

  // Re-observe both hostnames and GitHub deployment status after all provider
  // calls, so a target switch during the checkpoint cannot be archived.
  const vercelControlPlane = await fetchAndValidateVercelControlPlaneProvenance({
    token: process.env.SEO_HEALTH_VERCEL_CONTROL_TOKEN,
    config,
    github,
  });
  if (
    stableJsonDigest(vercelControlPlane)
      !== stableJsonDigest(preAttestation.payload.vercelControlPlane)
  ) {
    fail("SEO_HEALTH_ARCHIVE_VERCEL_CONTROL_PROVENANCE_CHANGED");
  }
  const provenance = await fetchAndValidateGithubVercelProductionProvenance({
    token: process.env.GITHUB_TOKEN,
    config,
    github,
    vercelControlPlane,
  });
  if (stableJsonDigest(provenance) !== stableJsonDigest(preAttestation.payload.githubDeployment)) {
    fail("SEO_HEALTH_ARCHIVE_DEPLOYMENT_PROVENANCE_CHANGED");
  }
  const { unique, attested } = await fetchAndValidateUniqueAttestation({
    config,
    github,
    secret: process.env.SEO_HEALTH_ATTESTATION_SECRET,
    vercelControlPlane,
  });
  if (
    attested.deploymentFingerprint !== preAttestation.payload.attestation.deploymentFingerprint
    || stableJsonDigest(attested.environment)
      !== stableJsonDigest(preAttestation.payload.attestation.environment)
  ) {
    fail("SEO_HEALTH_ARCHIVE_ATTESTATION_CHANGED");
  }
  await fetchAndValidateCanonicalAttestation({
    config,
    github,
    secret: process.env.SEO_HEALTH_ATTESTATION_SECRET,
    unique,
    attested,
    vercelControlPlane,
  });

  const terminal = validateTerminalEvidence(providerTerminal.payload.terminal, {
    schemaVersion: config.schemaVersion,
    contractVersion: config.contractVersion,
    scope: config.scope,
    timezone: config.timezone,
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
    deploymentFingerprint: attested.deploymentFingerprint,
    maxDurationMs: config.bounds.internalDeadlineMs,
    githubRunId: github.runId,
    githubRunAttempt: github.runAttempt,
    githubSha: github.sha,
  });
  const archiveExpectations = {
    schemaVersion: config.schemaVersion,
    contractVersion: config.contractVersion,
    scope: config.scope,
    timezone: config.timezone,
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
    deploymentFingerprint: attested.deploymentFingerprint,
    maxDurationMs: config.bounds.internalDeadlineMs,
    githubSha: github.sha,
    repository: SEO_HEALTH_REPOSITORY,
    issueNumber: Number(ARCHIVE_ISSUE),
    archiveSignature: config.archiveSignature,
  };
  const commentBody = buildSignedArchiveComment(terminal, {
    ...config.archiveSignature,
    repository: SEO_HEALTH_REPOSITORY,
    issueNumber: Number(ARCHIVE_ISSUE),
    privateKeyPkcs8Base64: process.env.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY,
  });
  const deadline = Date.now() + ARCHIVE_DEADLINE_MS;
  const comments = await listArchiveComments(process.env.GITHUB_TOKEN, deadline);
  const existing = await resolveReusableArchiveComments(
    comments,
    archiveExpectations,
    process.env.GITHUB_TOKEN,
  );
  let archiveUrl = existing?.url || null;
  if (!archiveUrl) {
    const created = await createArchiveComment(process.env.GITHUB_TOKEN, commentBody, deadline);
    const verified = resolveExistingArchive([created], archiveExpectations);
    if (!verified) fail("SEO_HEALTH_ARCHIVE_CREATE_INVALID");
    archiveUrl = verified.url;
  }
  console.log(JSON.stringify({
    ...terminal,
    archiveRecorded: true,
  }));
  console.log(JSON.stringify({
    schemaVersion: 1,
    event: "seo-operational-health.archive",
    archived: true,
    reused: Boolean(existing),
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    archiveUrl,
  }));
} catch (error) {
  const code = error instanceof SeoHealthIsolatedRunnerError
    ? error.code
    : typeof error?.code === "string" && /^[A-Z0-9_]{3,96}$/.test(error.code)
      ? error.code
      : "SEO_HEALTH_ARCHIVE_FAILED";
  let incidentArchiveUrl = null;
  if (
    config
    && match?.due
    && match.checkpointId
    && match.runKind === "checkpoint"
    && github
    && typeof process.env.GITHUB_TOKEN === "string"
    && process.env.GITHUB_TOKEN
    && typeof process.env.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY === "string"
    && process.env.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY
  ) {
    try {
      const incident = {
        schemaVersion: 1,
        event: "seo-operational-health.incident",
        status: "missed",
        checkpointId: match.checkpointId,
        scheduledDate: match.effectiveDate,
        runKind: "checkpoint",
        detectedAt: new Date().toISOString(),
        reasonCode: code,
        githubRunId: github.runId,
        githubRunAttempt: github.runAttempt,
        githubSha: github.sha,
        seoChangeAuthorized: false,
      };
      const recorded = await recordSignedIncident(config, incident, {
        githubToken: process.env.GITHUB_TOKEN,
        privateKeyPkcs8Base64: process.env.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY,
      });
      incidentArchiveUrl = recorded.url;
    } catch {
      incidentArchiveUrl = null;
    }
  }
  console.error(JSON.stringify({
    ...safeRunnerFailure(code, checkpointContext),
    incidentArchiveRecorded: incidentArchiveUrl !== null,
    incidentArchiveUrl,
  }));
  process.exitCode = 1;
}
