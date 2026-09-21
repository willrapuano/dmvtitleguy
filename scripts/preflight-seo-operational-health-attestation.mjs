import { readFile } from "node:fs/promises";
import {
  pinnedIsolatedScheduleFromEnvironment,
  safeRunnerFailure,
} from "./lib/seo-health-isolated-runner.mjs";
import {
  assertStrictProductionOrigin,
  assertStrictCheckout,
  assertStrictWorkflowContext,
  createPreAttestationBundle,
  fetchAndValidateCanonicalAttestation,
  fetchAndValidateUniqueAttestation,
  fetchAndValidateGithubVercelProductionProvenance,
  fetchAndValidateVercelControlPlaneProvenance,
  validateProcessBoundary,
  writeGithubOutput,
} from "./lib/seo-health-process-boundaries.mjs";

let checkpointContext = {};
try {
  validateProcessBoundary("pre-attestation");
  const config = JSON.parse(await readFile(
    new URL("../config/seo-operational-health.json", import.meta.url),
    "utf8",
  ));
  const now = new Date();
  const match = pinnedIsolatedScheduleFromEnvironment(config);
  checkpointContext = {
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
  };

  // These local, secretless checks intentionally precede the first use of the
  // attestation credential in an outbound request.
  const github = assertStrictWorkflowContext(config, process.env, match);
  assertStrictProductionOrigin(config);
  await assertStrictCheckout(github);

  // The independent control-plane credential derives and proves the exact
  // deployment before the attestation bearer can be sent to any hostname.
  const vercelControlPlane = await fetchAndValidateVercelControlPlaneProvenance({
    token: process.env.SEO_HEALTH_VERCEL_CONTROL_TOKEN,
    config,
    github,
  });
  const provenance = await fetchAndValidateGithubVercelProductionProvenance({
    token: process.env.GITHUB_TOKEN,
    config,
    github,
    vercelControlPlane,
  });
  const { unique, attested } = await fetchAndValidateUniqueAttestation({
    config,
    github,
    secret: process.env.SEO_HEALTH_ATTESTATION_SECRET,
    vercelControlPlane,
  });
  await fetchAndValidateCanonicalAttestation({
    config,
    github,
    secret: process.env.SEO_HEALTH_ATTESTATION_SECRET,
    unique,
    attested,
    vercelControlPlane,
  });
  const bundle = createPreAttestationBundle({
    match,
    github,
    attested,
    provenance,
    vercelControlPlane,
    now,
  });
  await writeGithubOutput("attestation_bundle", bundle);
  console.log(JSON.stringify({
    schemaVersion: config.schemaVersion,
    event: "seo-operational-health.pre-attestation",
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
    gitSha: github.sha,
    deploymentFingerprint: attested.deploymentFingerprint,
    githubDeploymentId: provenance.deploymentId,
    githubDeploymentStatusId: provenance.statusId,
    vercelAliasBound: vercelControlPlane.canonicalAlias,
    providerCredentialsLoaded: false,
  }));
} catch (error) {
  const code = typeof error?.code === "string"
    ? error.code
    : typeof error?.message === "string" && /^[A-Z0-9_]{3,96}$/.test(error.message)
      ? error.message
      : "SEO_HEALTH_PRE_ATTESTATION_FAILED";
  console.error(JSON.stringify(safeRunnerFailure(code, checkpointContext)));
  process.exitCode = 1;
}
