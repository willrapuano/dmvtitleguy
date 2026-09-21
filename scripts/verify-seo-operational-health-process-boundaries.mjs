import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const scripts = {
  gate: new URL("resolve-seo-operational-health-schedule.mjs", import.meta.url),
  "pre-attestation": new URL("preflight-seo-operational-health-attestation.mjs", import.meta.url),
  provider: new URL("run-seo-operational-health-provider.mjs", import.meta.url),
  archive: new URL("archive-seo-operational-health.mjs", import.meta.url),
};
const secrets = {
  attestation: "fixture-attestation-secret-that-must-never-be-logged",
  vercelControl: "fixture-vercel-control-token-that-must-never-be-logged",
  github: "fixture-github-token-that-must-never-be-logged",
  turso: "fixture-turso-token-that-must-never-be-logged",
  ghl: "fixture-ghl-token-that-must-never-be-logged",
  archiveSigning: "fixture-archive-signing-private-key-that-must-never-be-logged",
  write: "fixture-write-token-that-must-never-be-logged",
};

function run(role, env) {
  return spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    fileURLToPath(scripts[role]),
  ], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    encoding: "utf8",
    timeout: 10_000,
    env,
  });
}

function assertRejected(role, env, code) {
  const result = run(role, env);
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  assert.notEqual(result.status, 0, `${role} unexpectedly accepted a forbidden credential class`);
  assert.match(output, new RegExp(code));
  for (const value of Object.values(secrets)) assert.equal(output.includes(value), false);
}

assertRejected("gate", {
  SEO_HEALTH_ATTESTATION_SECRET: secrets.attestation,
}, "SEO_HEALTH_GATE_FORBIDDEN_ENVIRONMENT");

assertRejected("gate", {
  SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY: secrets.archiveSigning,
}, "SEO_HEALTH_GATE_FORBIDDEN_ENVIRONMENT");

assertRejected("gate", {
  SEO_HEALTH_VERCEL_CONTROL_TOKEN: secrets.vercelControl,
}, "SEO_HEALTH_GATE_FORBIDDEN_ENVIRONMENT");

assertRejected("pre-attestation", {
  SEO_HEALTH_ATTESTATION_SECRET: secrets.attestation,
  SEO_HEALTH_VERCEL_CONTROL_TOKEN: secrets.vercelControl,
  GITHUB_TOKEN: secrets.github,
  SEO_HEALTH_TURSO_AUTH_TOKEN: secrets.turso,
}, "SEO_HEALTH_PRE_ATTESTATION_FORBIDDEN_ENVIRONMENT");

assertRejected("pre-attestation", {
  SEO_HEALTH_ATTESTATION_SECRET: secrets.attestation,
  SEO_HEALTH_VERCEL_CONTROL_TOKEN: secrets.vercelControl,
  GITHUB_TOKEN: secrets.github,
  SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY: secrets.archiveSigning,
}, "SEO_HEALTH_PRE_ATTESTATION_FORBIDDEN_ENVIRONMENT");

assertRejected("provider", {
  SEO_HEALTH_ATTESTATION_BUNDLE: "fixture-bundle",
  SEO_HEALTH_TURSO_DATABASE_URL: "libsql://fixture.turso.io",
  SEO_HEALTH_TURSO_AUTH_TOKEN: secrets.turso,
  SEO_HEALTH_GHL_READ_TOKEN: secrets.ghl,
  GHL_LOCATION_ID: "fixture-location",
  GHL_WEBSITE_PIPELINE_ID: "fixture-pipeline",
  GHL_WEBSITE_SUBMITTED_STAGE_ID: "fixture-stage",
  SEO_HEALTH_VERCEL_CONTROL_TOKEN: secrets.vercelControl,
}, "SEO_HEALTH_PROVIDER_FORBIDDEN_ENVIRONMENT");

assertRejected("provider", {
  SEO_HEALTH_ATTESTATION_BUNDLE: "fixture-bundle",
  SEO_HEALTH_TURSO_DATABASE_URL: "libsql://fixture.turso.io",
  SEO_HEALTH_TURSO_AUTH_TOKEN: secrets.turso,
  SEO_HEALTH_GHL_READ_TOKEN: secrets.ghl,
  GHL_LOCATION_ID: "fixture-location",
  GHL_WEBSITE_PIPELINE_ID: "fixture-pipeline",
  GHL_WEBSITE_SUBMITTED_STAGE_ID: "fixture-stage",
  SEO_HEALTH_ATTESTATION_SECRET: secrets.attestation,
  CRON_SECRET: secrets.write,
}, "SEO_HEALTH_PROVIDER_FORBIDDEN_ENVIRONMENT");

assertRejected("provider", {
  SEO_HEALTH_ATTESTATION_BUNDLE: "fixture-bundle",
  SEO_HEALTH_TURSO_DATABASE_URL: "libsql://fixture.turso.io",
  SEO_HEALTH_TURSO_AUTH_TOKEN: secrets.turso,
  SEO_HEALTH_GHL_READ_TOKEN: secrets.ghl,
  GHL_LOCATION_ID: "fixture-location",
  GHL_WEBSITE_PIPELINE_ID: "fixture-pipeline",
  GHL_WEBSITE_SUBMITTED_STAGE_ID: "fixture-stage",
  SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY: secrets.archiveSigning,
}, "SEO_HEALTH_PROVIDER_FORBIDDEN_ENVIRONMENT");

assertRejected("archive", {
  SEO_HEALTH_ATTESTATION_SECRET: secrets.attestation,
  SEO_HEALTH_VERCEL_CONTROL_TOKEN: secrets.vercelControl,
  GITHUB_TOKEN: secrets.github,
  SEO_HEALTH_ATTESTATION_BUNDLE: "fixture-attestation-bundle",
  SEO_HEALTH_TERMINAL_BUNDLE: "fixture-terminal-bundle",
}, "SEO_HEALTH_ARCHIVE_ENVIRONMENT_INCOMPLETE");

assertRejected("archive", {
  SEO_HEALTH_ATTESTATION_SECRET: secrets.attestation,
  SEO_HEALTH_VERCEL_CONTROL_TOKEN: secrets.vercelControl,
  SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY: secrets.archiveSigning,
  GITHUB_TOKEN: secrets.github,
  SEO_HEALTH_ATTESTATION_BUNDLE: "fixture-attestation-bundle",
  SEO_HEALTH_TERMINAL_BUNDLE: "fixture-terminal-bundle",
  GHL_PRIVATE_INTEGRATION_TOKEN: secrets.write,
}, "SEO_HEALTH_ARCHIVE_FORBIDDEN_ENVIRONMENT");

const repositoryRoot = new URL("../", import.meta.url);
const workflow = await readFile(
  new URL(".github/workflows/seo-operational-health.yml", repositoryRoot),
  "utf8",
);
const providerSource = await readFile(
  new URL("scripts/run-seo-operational-health-provider.mjs", repositoryRoot),
  "utf8",
);
const preSource = await readFile(
  new URL("scripts/preflight-seo-operational-health-attestation.mjs", repositoryRoot),
  "utf8",
);
const archiveSource = await readFile(
  new URL("scripts/archive-seo-operational-health.mjs", repositoryRoot),
  "utf8",
);
const preOffset = workflow.indexOf("\n  pre_attestation:");
const providerOffset = workflow.indexOf("\n  provider:");
const archiveOffset = workflow.indexOf("\n  archive:");
assert.ok(preOffset > 0 && providerOffset > preOffset && archiveOffset > providerOffset);
const gateJob = workflow.slice(0, preOffset);
const preJob = workflow.slice(preOffset, providerOffset);
const providerJob = workflow.slice(providerOffset, archiveOffset);
const archiveJob = workflow.slice(archiveOffset);
assert.doesNotMatch(gateJob, /secrets\.|environment:\s*seo-health-production/);
assert.doesNotMatch(gateJob, /SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY/);
assert.match(preJob, /deployments:\s*read/);
assert.match(preJob, /SEO_HEALTH_ATTESTATION_SECRET/);
assert.match(preJob, /SEO_HEALTH_VERCEL_CONTROL_TOKEN/);
assert.doesNotMatch(preJob, /SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY/);
assert.doesNotMatch(preJob, /SEO_HEALTH_(?:TURSO|GHL)_/);
assert.match(providerJob, /npm ci --ignore-scripts --omit=dev --workspaces=false/);
assert.doesNotMatch(providerJob, /SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY/);
assert.doesNotMatch(
  providerJob,
  /SEO_HEALTH_ATTESTATION_SECRET|SEO_HEALTH_VERCEL_CONTROL_TOKEN|GITHUB_TOKEN|issues:\s*write|deployments:\s*read/,
);
assert.match(archiveJob, /issues:\s*write/);
assert.match(archiveJob, /deployments:\s*read/);
assert.match(
  archiveJob,
  /SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY:\s*\$\{\{ secrets\.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY \}\}/,
);
assert.match(
  archiveJob,
  /SEO_HEALTH_VERCEL_CONTROL_TOKEN:\s*\$\{\{ secrets\.SEO_HEALTH_VERCEL_CONTROL_TOKEN \}\}/,
);
assert.doesNotMatch(archiveJob, /SEO_HEALTH_(?:TURSO|GHL)_/);
assert.equal((workflow.match(/secrets\.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY/g) || []).length, 2);
assert.equal((workflow.match(/SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY/g) || []).length, 4);
assert.equal((workflow.match(/secrets\.SEO_HEALTH_VERCEL_CONTROL_TOKEN/g) || []).length, 2);
assert.equal((workflow.match(/SEO_HEALTH_VERCEL_CONTROL_TOKEN/g) || []).length, 4);
assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v\d+/);
assert.equal((workflow.match(/persist-credentials:\s*false/g) || []).length, 5);
assert.equal((workflow.match(/actions\/checkout@11d5960a326750d5838078e36cf38b85af677262/g) || []).length, 5);
assert.equal((workflow.match(/actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/g) || []).length, 5);
assert.doesNotMatch(providerSource, /^import .*seo-operational-health\.ts/m);
assert.ok(
  providerSource.indexOf("validatePreAttestationBundle(")
    < providerSource.indexOf('import("../src/lib/seo-operational-health.ts")'),
  "@libsql must remain behind every provider-process gate",
);
for (const [name, source] of [["pre-attestation", preSource], ["archive", archiveSource]]) {
  const controlOffset = source.indexOf("fetchAndValidateVercelControlPlaneProvenance({");
  const githubOffset = source.indexOf("fetchAndValidateGithubVercelProductionProvenance({");
  const uniqueOffset = source.indexOf("fetchAndValidateUniqueAttestation({");
  const canonicalOffset = source.indexOf("fetchAndValidateCanonicalAttestation({");
  assert.ok(
    [controlOffset, githubOffset, uniqueOffset, canonicalOffset].every((offset) => offset >= 0),
    `${name} must retain every required provenance and attestation stage`,
  );
  assert.ok(
    controlOffset < githubOffset,
    `${name} must derive the exact deployment from the independent Vercel control plane first`,
  );
  assert.ok(
    githubOffset < uniqueOffset,
    `${name} must bind GitHub production deployment provenance before transmitting the attestation bearer`,
  );
  assert.ok(
    uniqueOffset < canonicalOffset,
    `${name} must attest the verified unique deployment before sending the bearer to the canonical alias`,
  );
}

console.log("SEO operational-health OS-process credential-boundary verification passed");
