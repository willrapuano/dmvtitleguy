import { readFile } from "node:fs/promises";
import {
  assertIncidentCredentialIsolation,
  assertRecoveryWorkflowContext,
  recordSignedIncident,
  verifyProtectedMainRecoveryRun,
} from "./lib/seo-health-incident-recorder.mjs";
import { validateMissedCheckpointRecoveryInput } from "./lib/seo-health-rollout-controls.mjs";

assertIncidentCredentialIsolation();
const config = JSON.parse(await readFile(
  new URL("../config/seo-operational-health.json", import.meta.url),
  "utf8",
));
const github = assertRecoveryWorkflowContext();
const now = new Date();
const requested = validateMissedCheckpointRecoveryInput(config, {
  checkpointDate: process.env.SEO_HEALTH_RECOVERY_CHECKPOINT_DATE,
  checkpointId: process.env.SEO_HEALTH_RECOVERY_CHECKPOINT_ID,
  reasonCode: process.env.SEO_HEALTH_RECOVERY_REASON_CODE,
  now,
});
await verifyProtectedMainRecoveryRun(github, process.env.GITHUB_TOKEN);

const incident = Object.freeze({
  schemaVersion: 1,
  event: "seo-operational-health.incident",
  status: "missed",
  checkpointId: requested.checkpointId,
  scheduledDate: requested.checkpointDate,
  runKind: "checkpoint",
  detectedAt: now.toISOString(),
  reasonCode: requested.reasonCode,
  githubRunId: github.runId,
  githubRunAttempt: github.runAttempt,
  githubSha: github.sha,
  seoChangeAuthorized: false,
});
const recorded = await recordSignedIncident(config, incident, {
  githubToken: process.env.GITHUB_TOKEN,
  privateKeyPkcs8Base64: process.env.SEO_HEALTH_ARCHIVE_SIGNING_PRIVATE_KEY,
});

console.log(JSON.stringify({
  schemaVersion: 1,
  event: "seo-operational-health.missed-checkpoint-recovery",
  created: recorded.created,
  checkpointHistory: { [requested.checkpointDate]: recorded.history },
  commentUrl: recorded.url,
  providerReplay: false,
  timestampBackdated: false,
  seoChangeAuthorized: false,
}));
