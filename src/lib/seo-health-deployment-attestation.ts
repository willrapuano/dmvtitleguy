import { timingSafeEqual } from "node:crypto";
import type { SeoOperationalHealthConfig } from "./seo-operational-health-config.ts";
import {
  SEO_OPERATIONAL_HEALTH_SCOPE,
  fixedDigestEqual,
  isSha256,
  isVercelDeploymentHostname,
  sha256,
  stableJsonDigest,
} from "./seo-operational-health-contract.ts";

const DEPLOYMENT_ID = /^dpl_[A-Za-z0-9]{16,}$/;
const GIT_COMMIT = /^[a-f0-9]{40}$/;

export const SEO_HEALTH_ATTESTATION_CONTRACT = "seo-health-deployment-attestation-v1";

const ENVIRONMENT_KEYS = [
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
] as const;

export type SeoHealthAttestedEnvironment = Record<(typeof ENVIRONMENT_KEYS)[number], string>;

function safeSecretEqual(provided: string, expected: string) {
  const providedBytes = Buffer.from(provided, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  return providedBytes.length === expectedBytes.length
    && timingSafeEqual(providedBytes, expectedBytes);
}

export function isAuthorizedAttestationRequest(
  authorization: string | null,
  secret: string | undefined,
) {
  if (!secret || secret.length < 32 || !authorization?.startsWith("Bearer ")) return false;
  return safeSecretEqual(authorization.slice("Bearer ".length), secret);
}

export function deploymentFingerprintFromAttestationEnvironment(
  environment: SeoHealthAttestedEnvironment,
) {
  return stableJsonDigest({
    contract: "vercel-deployment-v1",
    projectId: environment.VERCEL_PROJECT_ID,
    deploymentId: environment.VERCEL_DEPLOYMENT_ID,
    deploymentUrl: environment.VERCEL_URL,
    gitProvider: environment.VERCEL_GIT_PROVIDER,
    gitRepoId: environment.VERCEL_GIT_REPO_ID,
    gitRepoOwner: environment.VERCEL_GIT_REPO_OWNER,
    gitRepoSlug: environment.VERCEL_GIT_REPO_SLUG,
    gitCommitRef: environment.VERCEL_GIT_COMMIT_REF,
    gitCommitSha: environment.VERCEL_GIT_COMMIT_SHA,
    productionHostname: environment.VERCEL_PROJECT_PRODUCTION_URL,
  });
}

export function createSeoHealthDeploymentAttestation(
  env: NodeJS.ProcessEnv,
  config: SeoOperationalHealthConfig,
) {
  const environment = Object.fromEntries(
    ENVIRONMENT_KEYS.map((key) => [key, env[key] || ""]),
  ) as SeoHealthAttestedEnvironment;
  const bindings = {
    vercelSystem: environment.VERCEL === "1",
    production: environment.VERCEL_ENV === "production",
    targetProduction: environment.VERCEL_TARGET_ENV === "production",
    projectFingerprint: fixedDigestEqual(
      sha256(environment.VERCEL_PROJECT_ID),
      config.deploymentBinding.fingerprints.projectIdSha256,
    ),
    gitSource: environment.VERCEL_GIT_PROVIDER === config.deploymentBinding.gitProvider
      && fixedDigestEqual(
        sha256(environment.VERCEL_GIT_REPO_ID),
        config.deploymentBinding.fingerprints.gitRepoIdSha256,
      )
      && fixedDigestEqual(
        sha256(environment.VERCEL_GIT_REPO_OWNER),
        config.deploymentBinding.fingerprints.gitRepoOwnerSha256,
      )
      && fixedDigestEqual(
        sha256(environment.VERCEL_GIT_REPO_SLUG),
        config.deploymentBinding.fingerprints.gitRepoSlugSha256,
      )
      && environment.VERCEL_GIT_COMMIT_REF === config.deploymentBinding.productionBranch,
    gitCommit: GIT_COMMIT.test(environment.VERCEL_GIT_COMMIT_SHA),
    deployment: DEPLOYMENT_ID.test(environment.VERCEL_DEPLOYMENT_ID)
      && isVercelDeploymentHostname(environment.VERCEL_URL),
    productionHostname: fixedDigestEqual(
      sha256(environment.VERCEL_PROJECT_PRODUCTION_URL),
      config.deploymentBinding.fingerprints.productionHostnameSha256,
    ),
    origin: (() => {
      try {
        return new URL(config.origin).protocol === "https:"
          && new URL(config.origin).hostname === environment.VERCEL_PROJECT_PRODUCTION_URL;
      } catch {
        return false;
      }
    })(),
  };
  const complete = Object.values(environment).every(Boolean)
    && Object.values(bindings).every(Boolean);
  const deploymentFingerprint = complete
    ? deploymentFingerprintFromAttestationEnvironment(environment)
    : null;
  return {
    schemaVersion: config.schemaVersion,
    contractVersion: SEO_HEALTH_ATTESTATION_CONTRACT,
    scope: SEO_OPERATIONAL_HEALTH_SCOPE,
    healthy: complete && isSha256(deploymentFingerprint),
    complete,
    environment: complete ? environment : null,
    deploymentFingerprint,
    bindings,
  };
}
