import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  SEO_HEALTH_ATTESTATION_CONTRACT,
  createSeoHealthDeploymentAttestation,
  deploymentFingerprintFromAttestationEnvironment,
  isAuthorizedAttestationRequest,
} from "../src/lib/seo-health-deployment-attestation.ts";
import { sha256 } from "../src/lib/seo-operational-health-contract.ts";

const root = new URL("../", import.meta.url);
const config = JSON.parse(await readFile(new URL("config/seo-operational-health.json", root), "utf8"));
const env = {
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
  TURSO_AUTH_TOKEN: "write-token-must-never-appear",
  GHL_PRIVATE_INTEGRATION_TOKEN: "write-token-must-never-appear",
};
const fixtureConfig = structuredClone(config);
fixtureConfig.deploymentBinding.fingerprints = {
  projectIdSha256: sha256(env.VERCEL_PROJECT_ID),
  gitRepoIdSha256: sha256(env.VERCEL_GIT_REPO_ID),
  gitRepoOwnerSha256: sha256(env.VERCEL_GIT_REPO_OWNER),
  gitRepoSlugSha256: sha256(env.VERCEL_GIT_REPO_SLUG),
  productionHostnameSha256: sha256(env.VERCEL_PROJECT_PRODUCTION_URL),
};

const secret = "s".repeat(32);
assert.equal(isAuthorizedAttestationRequest(null, secret), false);
assert.equal(isAuthorizedAttestationRequest(`Bearer ${secret}`, undefined), false);
assert.equal(isAuthorizedAttestationRequest(`Bearer ${"s".repeat(31)}`, secret), false);
assert.equal(isAuthorizedAttestationRequest(`Bearer ${secret}`, secret), true);

const attestation = createSeoHealthDeploymentAttestation(env, fixtureConfig);
assert.equal(attestation.healthy, true);
assert.equal(attestation.complete, true);
assert.equal(attestation.contractVersion, SEO_HEALTH_ATTESTATION_CONTRACT);
assert.equal(attestation.scope, "live-operational-health-only");
assert.equal(Object.values(attestation.bindings).every(Boolean), true);
assert.match(attestation.deploymentFingerprint, /^[a-f0-9]{64}$/);
assert.equal(
  attestation.deploymentFingerprint,
  deploymentFingerprintFromAttestationEnvironment(attestation.environment),
);
const serialized = JSON.stringify(attestation);
assert.equal(serialized.includes(env.TURSO_AUTH_TOKEN), false);
assert.equal(serialized.includes(env.GHL_PRIVATE_INTEGRATION_TOKEN), false);
assert.equal(serialized.includes("TURSO_AUTH_TOKEN"), false);
assert.equal(serialized.includes("GHL_PRIVATE_INTEGRATION_TOKEN"), false);

for (const [key, value] of [
  ["VERCEL_GIT_COMMIT_REF", "not-main"],
  ["VERCEL_GIT_REPO_ID", "wrong-repository"],
  ["VERCEL_DEPLOYMENT_ID", "invalid"],
  ["VERCEL_URL", "dmvtitleguy.io"],
  ["VERCEL_PROJECT_PRODUCTION_URL", "wrong.example"],
]) {
  const failed = createSeoHealthDeploymentAttestation({ ...env, [key]: value }, fixtureConfig);
  assert.equal(failed.healthy, false, `${key} mismatch must fail closed`);
  assert.equal(failed.complete, false);
  assert.equal(failed.environment, null);
  assert.equal(failed.deploymentFingerprint, null);
}

console.log("SEO health deployment-attestation verification passed");
