import { readFile } from "node:fs/promises";
import {
  SeoHealthIsolatedRunnerError,
  createIsolatedRunnerEnvironment,
  pinnedIsolatedScheduleFromEnvironment,
  safeRunnerFailure,
  terminalEventFromProjection,
} from "./lib/seo-health-isolated-runner.mjs";
import {
  assertStrictProductionOrigin,
  assertStrictCheckout,
  assertStrictWorkflowContext,
  createProviderTerminalBundle,
  validatePreAttestationBundle,
  validateProcessBoundary,
  writeGithubOutput,
} from "./lib/seo-health-process-boundaries.mjs";
import { computeSeoHealthSourceDigest } from "./lib/seo-health-source-digest.mjs";

function fail(code) {
  throw new SeoHealthIsolatedRunnerError(code);
}

let checkpointContext = {};
try {
  validateProcessBoundary("provider");
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
  const github = assertStrictWorkflowContext(config, process.env, match);
  assertStrictProductionOrigin(config);
  await assertStrictCheckout(github);
  const preAttestation = validatePreAttestationBundle(
    process.env.SEO_HEALTH_ATTESTATION_BUNDLE,
    { match, github, config, now },
  );
  const runnerEnvironment = createIsolatedRunnerEnvironment(
    preAttestation.payload.attestation.environment,
    process.env,
  );
  const healthSourceDigest = await computeSeoHealthSourceDigest();

  // The health implementation statically imports @libsql/client. Keep the
  // import below every identity, replay, and credential-boundary gate.
  const [{ evaluateSeoOperationalHealthEvidence }, { runSeoOperationalHealth }] = await Promise.all([
    import("../src/lib/seo-operational-health-handler.ts"),
    import("../src/lib/seo-operational-health.ts"),
  ]);

  console.log(JSON.stringify({
    schemaVersion: config.schemaVersion,
    event: "seo-operational-health.start",
    checkpointId: match.checkpointId,
    scheduledDate: match.effectiveDate,
    runKind: match.runKind,
  }));
  const report = await runSeoOperationalHealth({
    now,
    effectiveDate: match.effectiveDate,
    checkpointId: match.checkpointId,
    runKind: match.runKind,
  }, {
    env: runnerEnvironment,
    config,
  });
  const evaluation = evaluateSeoOperationalHealthEvidence(report, {
    evidence: {
      schemaVersion: config.schemaVersion,
      contractVersion: config.contractVersion,
      scope: config.scope,
    },
    maxDurationMs: config.bounds.internalDeadlineMs,
    deploymentFingerprint: preAttestation.payload.attestation.deploymentFingerprint,
    checkpoint: {
      id: match.checkpointId,
      scheduledDate: match.effectiveDate,
      timezone: config.timezone,
      runKind: match.runKind,
    },
    publicSite: {
      priorityPaths: config.priorityPaths,
      aliasTypes: ["www", "http"],
    },
  });
  if (!evaluation.accepted) fail("SEO_HEALTH_PROVIDER_TERMINAL_EVIDENCE_INVALID");
  const terminal = terminalEventFromProjection(evaluation.projection, github, healthSourceDigest);
  const terminalBundle = createProviderTerminalBundle({ preAttestation, terminal });
  await writeGithubOutput("terminal_bundle", terminalBundle);
  console.log(JSON.stringify(terminal));
} catch (error) {
  const code = error instanceof SeoHealthIsolatedRunnerError
    ? error.code
    : "SEO_HEALTH_PROVIDER_EXECUTION_FAILED";
  console.error(JSON.stringify(safeRunnerFailure(code, checkpointContext)));
  process.exitCode = 1;
}
