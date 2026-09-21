import { readFile } from "node:fs/promises";
import { pinnedIsolatedScheduleFromEnvironment } from "./lib/seo-health-isolated-runner.mjs";
import { assertStrictWorkflowContext } from "./lib/seo-health-process-boundaries.mjs";
import {
  assertIncidentCredentialIsolation,
  recordSignedIncident,
} from "./lib/seo-health-incident-recorder.mjs";

const ALLOWED_RESULTS = new Set(["success", "failure", "cancelled", "skipped"]);
const SAFE_FAILURE_CODES = new Set([
  "SEO_HEALTH_CHECKPOINT_HISTORY_INCOMPLETE",
  "SEO_HEALTH_CHECKPOINT_HISTORY_INVALID",
  "SEO_HEALTH_ROLLOUT_CONFIG_INVALID",
  "SEO_HEALTH_WATCHDOG_CONFIG_INVALID",
  "SEO_HEALTH_WATCHDOG_SIGNATURE_CONFIG_INVALID",
  "SEO_HEALTH_WATCHDOG_RECEIPT_INVALID",
  "SEO_HEALTH_WATCHDOG_RECEIPT_SIGNATURE_INVALID",
  "SEO_HEALTH_WATCHDOG_RECEIPT_STALE",
]);

assertIncidentCredentialIsolation();
const config = JSON.parse(await readFile(
  new URL("../config/seo-operational-health.json", import.meta.url),
  "utf8",
));
const match = pinnedIsolatedScheduleFromEnvironment(config);
const github = assertStrictWorkflowContext(config, process.env, match);
if (match.runKind !== "checkpoint") throw new Error("SEO_HEALTH_FALLBACK_NOT_DUE");

const results = {
  pre: process.env.SEO_HEALTH_PRE_ATTESTATION_RESULT,
  provider: process.env.SEO_HEALTH_PROVIDER_RESULT,
  archive: process.env.SEO_HEALTH_ARCHIVE_RESULT,
};
if (Object.values(results).some((value) => !ALLOWED_RESULTS.has(value))) {
  throw new Error("SEO_HEALTH_FALLBACK_RESULT_INVALID");
}

let reasonCode;
if (process.env.SEO_HEALTH_CONTROLS_READY !== "true") {
  reasonCode = process.env.SEO_HEALTH_CONTROLS_FAILURE_CODE;
  if (!SAFE_FAILURE_CODES.has(reasonCode)) throw new Error("SEO_HEALTH_FALLBACK_REASON_INVALID");
} else if (results.pre !== "success") {
  reasonCode = "SEO_HEALTH_PRE_ATTESTATION_FAILED";
} else if (results.provider !== "success") {
  reasonCode = "SEO_HEALTH_PROVIDER_EXECUTION_FAILED";
} else if (results.archive !== "success") {
  reasonCode = "SEO_HEALTH_ARCHIVE_FAILED";
} else {
  throw new Error("SEO_HEALTH_FALLBACK_WITHOUT_FAILURE");
}

const incident = Object.freeze({
  schemaVersion: 1,
  event: "seo-operational-health.incident",
  status: "missed",
  checkpointId: match.checkpointId,
  scheduledDate: match.effectiveDate,
  runKind: "checkpoint",
  detectedAt: new Date().toISOString(),
  reasonCode,
  githubRunId: github.runId,
  githubRunAttempt: github.runAttempt,
  githubSha: github.sha,
  seoChangeAuthorized: false,
});
const recorded = await recordSignedIncident(config, incident, {
  githubToken: process.env.GITHUB_TOKEN,
  privateKeyPkcs8Base64: process.env.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY,
});
console.error(JSON.stringify({
  schemaVersion: 1,
  event: "seo-operational-health.incident-fallback",
  recorded: true,
  created: recorded.created,
  reasonCode,
  commentUrl: recorded.url,
  seoChangeAuthorized: false,
}));
// Keep the immutable Actions attempt non-successful. Historical validation
// then proves the incident belongs to an actual failed/cancelled checkpoint.
process.exitCode = 1;
