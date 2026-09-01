import assert from "node:assert/strict";
import { createHash, generateKeyPairSync } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  WATCHDOG_PERMISSIONS,
  WATCHDOG_PROVIDER,
  WATCHDOG_RECEIPT_CONTRACT,
  WATCHDOG_WORKFLOW_PATH,
  buildSignedWatchdogReceipt,
  verifyWatchdogReceipt,
} from "./lib/seo-health-watchdog-receipt.mjs";
import {
  evaluateSeoHealthRolloutControls,
  requiredCheckpointHistoryDates,
  validateMissedCheckpointRecoveryInput,
} from "./lib/seo-health-rollout-controls.mjs";
import {
  assertIncidentCredentialIsolation,
  assertRecoveryWorkflowContext,
  recordSignedIncident,
  verifyProtectedMainRecoveryRun,
} from "./lib/seo-health-incident-recorder.mjs";
import { buildSignedIncidentComment } from "./lib/seo-health-evidence-archive.mjs";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const watchdogPair = generateKeyPairSync("ed25519");
const watchdogPublic = watchdogPair.publicKey.export({ format: "der", type: "spki" });
const watchdogPrivate = watchdogPair.privateKey.export({ format: "der", type: "pkcs8" });
const archivePair = generateKeyPairSync("ed25519");
const archivePublic = archivePair.publicKey.export({ format: "der", type: "spki" });
const archivePrivate = archivePair.privateKey.export({ format: "der", type: "pkcs8" });
const repositoryIdSha256 = "a".repeat(64);
const observedAt = "2026-09-04T12:00:00.000Z";
const watchdogPins = {
  monitorIdSha256: "b".repeat(64),
  githubAppIdSha256: "c".repeat(64),
  installationIdSha256: "d".repeat(64),
  workflowPathSha256: sha256(WATCHDOG_WORKFLOW_PATH),
};
const unsignedWatchdogReceipt = {
  schemaVersion: 1,
  contractVersion: WATCHDOG_RECEIPT_CONTRACT,
  provider: WATCHDOG_PROVIDER,
  ...watchdogPins,
  repository: "willrapuano/dmvtitleguy",
  repositoryIdSha256,
  workflowPath: WATCHDOG_WORKFLOW_PATH,
  permissions: structuredClone(WATCHDOG_PERMISSIONS),
  observedAt,
  workflowState: "active",
  drill: {
    disabledAt: "2026-09-04T11:00:00.000Z",
    detectedAt: "2026-09-04T11:30:00.000Z",
    reenabledAt: "2026-09-04T11:40:00.000Z",
    alertedAt: "2026-09-04T11:31:00.000Z",
    workflowReenabled: true,
    ownerAlertDelivered: true,
  },
};
const watchdogSignature = {
  algorithm: "Ed25519",
  keyId: sha256(watchdogPublic),
  publicKeySpkiBase64: watchdogPublic.toString("base64"),
};
const watchdogReceipt = buildSignedWatchdogReceipt(unsignedWatchdogReceipt, {
  keyId: watchdogSignature.keyId,
  privateKeyPkcs8Base64: watchdogPrivate.toString("base64"),
});
const archiveSignature = {
  algorithm: "Ed25519",
  keyId: sha256(archivePublic),
  publicKeySpkiBase64: archivePublic.toString("base64"),
};
const checkpointDate = "2026-09-02";
const checkpointId = "technical-2026-09-02";
const missedHistory = {
  status: "missed",
  checkpointId,
  scheduledDate: checkpointDate,
  detectedAt: "2026-09-04T12:01:00.000Z",
  reasonCode: "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  commentId: 1234,
  commentBodySha256: "e".repeat(64),
  githubSha: "f".repeat(40),
};
const activeConfig = {
  schemaVersion: 1,
  contractVersion: "seo-operational-health-v1-test",
  scope: "live-operational-health-only",
  timezone: "America/New_York",
  rolloutPhase: "permanent",
  checkpointCalendar: { [checkpointDate]: checkpointId },
  checkpointHistory: { [checkpointDate]: missedHistory },
  archiveSignature,
  deploymentBinding: { fingerprints: { gitRepoIdSha256: repositoryIdSha256 } },
  schedulerContinuity: {
    publicRepositoryInactivityDisableDays: 60,
    maximumDetectionMinutes: 60,
    maximumOwnerRecoveryHours: 24,
    maximumReceiptAgeHours: 168,
    maximumRecoveryDrillAgeDays: 30,
    independentWatchdog: {
      provider: WATCHDOG_PROVIDER,
      ...watchdogPins,
      requiredPermissions: structuredClone(WATCHDOG_PERMISSIONS),
      receiptSignature: watchdogSignature,
      receipt: watchdogReceipt,
    },
  },
};
const controlNow = new Date("2026-09-04T13:00:00.000Z");

assert.deepEqual(verifyWatchdogReceipt(activeConfig, { now: controlNow }), {
  provider: WATCHDOG_PROVIDER,
  observedAt,
  workflowState: "active",
  keyId: watchdogSignature.keyId,
});
assert.deepEqual(requiredCheckpointHistoryDates(activeConfig, controlNow), [checkpointDate]);
assert.deepEqual(evaluateSeoHealthRolloutControls(activeConfig, { now: controlNow }), {
  ready: true,
  code: "SEO_HEALTH_CONTROLS_READY",
});
assert.deepEqual(
  evaluateSeoHealthRolloutControls({ ...activeConfig, checkpointHistory: {} }, { now: controlNow }),
  { ready: false, code: "SEO_HEALTH_CHECKPOINT_HISTORY_INCOMPLETE" },
);
const tamperedReceipt = structuredClone(activeConfig);
tamperedReceipt.schedulerContinuity.independentWatchdog.receipt.workflowState = "disabled";
assert.equal(
  evaluateSeoHealthRolloutControls(tamperedReceipt, { now: controlNow }).ready,
  false,
  "a tampered signed watchdog receipt must fail closed",
);
assert.equal(
  evaluateSeoHealthRolloutControls(activeConfig, { now: new Date("2026-09-20T13:00:00.000Z") }).code,
  "SEO_HEALTH_WATCHDOG_RECEIPT_STALE",
);
for (const drill of [
  {
    ...unsignedWatchdogReceipt.drill,
    alertedAt: "2026-09-04T12:01:00.000Z",
    reenabledAt: "2026-09-04T12:02:00.000Z",
  },
  {
    ...unsignedWatchdogReceipt.drill,
    detectedAt: "2026-09-04T11:30:00.000Z",
    alertedAt: "2026-09-04T11:29:00.000Z",
  },
]) {
  const invalidTimingReceipt = buildSignedWatchdogReceipt({
    ...unsignedWatchdogReceipt,
    observedAt: "2026-09-04T12:03:00.000Z",
    drill,
  }, {
    keyId: watchdogSignature.keyId,
    privateKeyPkcs8Base64: watchdogPrivate.toString("base64"),
  });
  const invalidTimingConfig = structuredClone(activeConfig);
  invalidTimingConfig.schedulerContinuity.independentWatchdog.receipt = invalidTimingReceipt;
  assert.equal(
    evaluateSeoHealthRolloutControls(invalidTimingConfig, { now: controlNow }).code,
    "SEO_HEALTH_WATCHDOG_RECEIPT_STALE",
    "a signed receipt must prove alert delivery within the detection window and after detection",
  );
}
const disabledConfig = structuredClone(activeConfig);
disabledConfig.rolloutPhase = "disabled";
disabledConfig.schedulerContinuity.independentWatchdog = {
  provider: "",
  monitorIdSha256: "",
  githubAppIdSha256: "",
  installationIdSha256: "",
  workflowPathSha256: sha256(WATCHDOG_WORKFLOW_PATH),
  requiredPermissions: structuredClone(WATCHDOG_PERMISSIONS),
  receiptSignature: { algorithm: "Ed25519", keyId: "", publicKeySpkiBase64: "" },
  receipt: null,
};
assert.deepEqual(evaluateSeoHealthRolloutControls(disabledConfig, { now: controlNow }), {
  ready: false,
  code: "SEO_HEALTH_ROLLOUT_DISABLED",
});

assert.deepEqual(validateMissedCheckpointRecoveryInput({
  ...disabledConfig,
  checkpointHistory: {},
}, {
  checkpointDate,
  checkpointId,
  reasonCode: "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  now: controlNow,
}), {
  checkpointDate,
  checkpointId,
  reasonCode: "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
});
for (const rolloutPhase of ["disabled", "canary", "permanent"]) {
  for (const reasonCode of [
    "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
    "SEO_HEALTH_ROLLOUT_CANARY_CHECKPOINT_MISSED",
    "SEO_HEALTH_ROLLOUT_PERMANENT_CHECKPOINT_MISSED",
  ]) {
    assert.deepEqual(validateMissedCheckpointRecoveryInput({
      ...disabledConfig,
      rolloutPhase,
      checkpointHistory: {},
    }, {
      checkpointDate,
      checkpointId,
      reasonCode,
      now: controlNow,
    }), { checkpointDate, checkpointId, reasonCode });
  }
}
assert.throws(() => validateMissedCheckpointRecoveryInput({ ...disabledConfig, checkpointHistory: {} }, {
  checkpointDate,
  checkpointId,
  reasonCode: "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  now: new Date("2026-09-03T23:59:59.000-04:00"),
}), /SEO_HEALTH_MISSED_RECOVERY_INPUT_INVALID/);
assert.throws(() => validateMissedCheckpointRecoveryInput({ ...disabledConfig, checkpointHistory: {} }, {
  checkpointDate,
  checkpointId: "wrong",
  reasonCode: "SEO_HEALTH_ROLLOUT_DISABLED_CHECKPOINT_MISSED",
  now: controlNow,
}), /SEO_HEALTH_MISSED_RECOVERY_INPUT_INVALID/);

const recoveryEnvironment = {
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: "willrapuano/dmvtitleguy",
  GITHUB_REF: "refs/heads/main",
  GITHUB_REF_NAME: "main",
  GITHUB_WORKFLOW_REF: "willrapuano/dmvtitleguy/.github/workflows/seo-operational-health-recovery.yml@refs/heads/main",
  GITHUB_WORKFLOW: "SEO operational health missed-checkpoint recovery",
  GITHUB_EVENT_NAME: "workflow_dispatch",
  GITHUB_ACTOR: "willrapuano",
  GITHUB_ACTOR_ID: "200251753",
  GITHUB_SHA: "f".repeat(40),
  GITHUB_RUN_ID: "123456789",
  GITHUB_RUN_ATTEMPT: "2",
};
assert.deepEqual(assertRecoveryWorkflowContext(recoveryEnvironment), {
  sha: recoveryEnvironment.GITHUB_SHA,
  runId: recoveryEnvironment.GITHUB_RUN_ID,
  runAttempt: recoveryEnvironment.GITHUB_RUN_ATTEMPT,
});
assert.throws(
  () => assertRecoveryWorkflowContext({ ...recoveryEnvironment, GITHUB_ACTOR_ID: "1" }),
  /SEO_HEALTH_RECOVERY_WORKFLOW_IDENTITY_INVALID/,
);
assert.doesNotThrow(() => assertIncidentCredentialIsolation({}));
assert.throws(
  () => assertIncidentCredentialIsolation({ SEO_HEALTH_ATTESTATION_SECRET: "present" }),
  /SEO_HEALTH_INCIDENT_FORBIDDEN_CREDENTIAL_PRESENT/,
);

function jsonResponse(url, value) {
  const bytes = Buffer.from(JSON.stringify(value));
  return {
    ok: true,
    status: 200,
    url,
    headers: { get: (name) => name.toLowerCase() === "content-type" ? "application/json" : null },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }),
  };
}
const apiRoot = "https://api.github.com/repos/willrapuano/dmvtitleguy";
function recoveryProvenanceResponse(url) {
  if (url.includes("/actions/runs/")) return jsonResponse(url, {
    id: 123456789,
    run_attempt: 2,
    name: "SEO operational health missed-checkpoint recovery",
    path: ".github/workflows/seo-operational-health-recovery.yml",
    event: "workflow_dispatch",
    status: "in_progress",
    conclusion: null,
    head_branch: "main",
    head_sha: recoveryEnvironment.GITHUB_SHA,
    url: `${apiRoot}/actions/runs/123456789`,
    html_url: "https://github.com/willrapuano/dmvtitleguy/actions/runs/123456789",
    repository: { full_name: "willrapuano/dmvtitleguy" },
    head_repository: { full_name: "willrapuano/dmvtitleguy" },
    head_commit: { id: recoveryEnvironment.GITHUB_SHA },
    actor: { login: "willrapuano", id: 200251753 },
    triggering_actor: { login: "willrapuano", id: 200251753 },
  });
  if (url.endsWith("/branches/main")) return jsonResponse(url, {
    name: "main", protected: true, commit: { sha: recoveryEnvironment.GITHUB_SHA },
  });
  return jsonResponse(url, {
    full_name: "willrapuano/dmvtitleguy", default_branch: "main", private: false,
  });
}
function completedRecoveryRun(evidence, conclusion = "success") {
  return {
    id: Number(evidence.githubRunId),
    run_attempt: Number(evidence.githubRunAttempt),
    name: "SEO operational health missed-checkpoint recovery",
    path: ".github/workflows/seo-operational-health-recovery.yml",
    event: "workflow_dispatch",
    status: "completed",
    conclusion,
    head_branch: "main",
    head_sha: evidence.githubSha,
    url: `${apiRoot}/actions/runs/${evidence.githubRunId}`,
    html_url: `https://github.com/willrapuano/dmvtitleguy/actions/runs/${evidence.githubRunId}`,
    repository: { full_name: "willrapuano/dmvtitleguy", private: false },
    head_repository: { full_name: "willrapuano/dmvtitleguy" },
    head_commit: { id: evidence.githubSha },
    actor: { login: "willrapuano", id: 200251753 },
    triggering_actor: { login: "willrapuano", id: 200251753 },
    created_at: "2026-09-04T11:59:00Z",
    run_started_at: "2026-09-04T12:00:00Z",
    updated_at: "2026-09-04T12:02:00Z",
  };
}
await verifyProtectedMainRecoveryRun({
  sha: recoveryEnvironment.GITHUB_SHA,
  runId: recoveryEnvironment.GITHUB_RUN_ID,
  runAttempt: recoveryEnvironment.GITHUB_RUN_ATTEMPT,
}, "ghs_fixture_token_1234567890", {
  fetchImpl: async (url) => recoveryProvenanceResponse(url),
});
await assert.rejects(
  () => verifyProtectedMainRecoveryRun({
    sha: recoveryEnvironment.GITHUB_SHA,
    runId: recoveryEnvironment.GITHUB_RUN_ID,
    runAttempt: recoveryEnvironment.GITHUB_RUN_ATTEMPT,
  }, "ghs_fixture_token_1234567890", {
    fetchImpl: async (url) => url.endsWith("/branches/main")
      ? jsonResponse(url, { oversized: "x".repeat(2_097_200) })
      : recoveryProvenanceResponse(url),
  }),
  /SEO_HEALTH_RECOVERY_BRANCH_INVALID/,
  "chunked GitHub responses without Content-Length must still be bounded before parsing",
);

const incident = {
  schemaVersion: 1,
  event: "seo-operational-health.incident",
  status: "missed",
  checkpointId,
  scheduledDate: checkpointDate,
  runKind: "checkpoint",
  detectedAt: missedHistory.detectedAt,
  reasonCode: missedHistory.reasonCode,
  githubRunId: recoveryEnvironment.GITHUB_RUN_ID,
  githubRunAttempt: recoveryEnvironment.GITHUB_RUN_ATTEMPT,
  githubSha: recoveryEnvironment.GITHUB_SHA,
  seoChangeAuthorized: false,
};
const signing = {
  ...archiveSignature,
  repository: "willrapuano/dmvtitleguy",
  issueNumber: 47,
  checkpointId,
  scheduledDate: checkpointDate,
  timezone: "America/New_York",
  githubSha: recoveryEnvironment.GITHUB_SHA,
  privateKeyPkcs8Base64: archivePrivate.toString("base64"),
};
const incidentBody = buildSignedIncidentComment(incident, signing);
const trustedIncidentComment = {
  id: 4567,
  url: `${apiRoot}/issues/comments/4567`,
  html_url: "https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-4567",
  issue_url: `${apiRoot}/issues/47`,
  user: { login: "github-actions[bot]", id: 41898282, type: "Bot" },
  body: incidentBody,
  created_at: "2026-09-04T12:01:00Z",
  updated_at: "2026-09-04T12:01:00Z",
};
let postCalls = 0;
const idempotent = await recordSignedIncident(activeConfig, incident, {
  githubToken: "ghs_fixture_token_1234567890",
  privateKeyPkcs8Base64: archivePrivate.toString("base64"),
  fetchImpl: async (url, options) => {
    if (options.method === "POST") postCalls += 1;
    if (url.includes("/actions/runs/")) {
      return jsonResponse(url, completedRecoveryRun(incident));
    }
    return jsonResponse(url, [trustedIncidentComment]);
  },
});
assert.equal(idempotent.created, false);
assert.equal(idempotent.history.commentId, 4567);
assert.equal(postCalls, 0, "idempotent recovery must not create a second incident");

const replacementIncident = {
  ...incident,
  detectedAt: "2026-09-04T12:03:00.000Z",
  githubRunId: "987654321",
  githubRunAttempt: "1",
  githubSha: "9".repeat(40),
};
let replacementPosts = 0;
const replacement = await recordSignedIncident(activeConfig, replacementIncident, {
  githubToken: "ghs_fixture_token_1234567890",
  privateKeyPkcs8Base64: archivePrivate.toString("base64"),
  fetchImpl: async (url, options) => {
    if (url.includes("/actions/runs/")) {
      return jsonResponse(url, completedRecoveryRun(incident, "cancelled"));
    }
    if (options.method === "POST") {
      replacementPosts += 1;
      const { body } = JSON.parse(options.body);
      return jsonResponse(url, {
        id: 5678,
        url: `${apiRoot}/issues/comments/5678`,
        html_url: "https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-5678",
        issue_url: `${apiRoot}/issues/47`,
        user: { login: "github-actions[bot]", id: 41898282, type: "Bot" },
        body,
      });
    }
    return jsonResponse(url, [trustedIncidentComment]);
  },
});
assert.equal(replacement.created, true);
assert.equal(replacement.history.commentId, 5678);
assert.equal(replacement.history.githubSha, replacementIncident.githubSha);
assert.equal(replacementPosts, 1, "a canceled recovery reference must allow a later valid reference");

let replayReplacementPosts = 0;
const replayReplacement = await recordSignedIncident(activeConfig, replacementIncident, {
  githubToken: "ghs_fixture_token_1234567890",
  privateKeyPkcs8Base64: archivePrivate.toString("base64"),
  fetchImpl: async (url, options) => {
    if (url.includes("/actions/runs/")) {
      return jsonResponse(url, completedRecoveryRun(incident, "success"));
    }
    if (options.method === "POST") {
      replayReplacementPosts += 1;
      const { body } = JSON.parse(options.body);
      return jsonResponse(url, {
        id: 6789,
        url: `${apiRoot}/issues/comments/6789`,
        html_url: "https://github.com/willrapuano/dmvtitleguy/issues/47#issuecomment-6789",
        issue_url: `${apiRoot}/issues/47`,
        user: { login: "github-actions[bot]", id: 41898282, type: "Bot" },
        body,
      });
    }
    return jsonResponse(url, [{
      ...trustedIncidentComment,
      created_at: "2026-09-04T13:00:00Z",
      updated_at: "2026-09-04T13:00:00Z",
    }]);
  },
});
assert.equal(replayReplacement.created, true);
assert.equal(replayReplacement.history.commentId, 6789);
assert.equal(replayReplacementPosts, 1, "an out-of-window replay must allow a fresh incident");

const recoveryWorkflow = await readFile(new URL("../.github/workflows/seo-operational-health-recovery.yml", import.meta.url), "utf8");
const mainWorkflow = await readFile(new URL("../.github/workflows/seo-operational-health.yml", import.meta.url), "utf8");
const fallbackScript = await readFile(new URL("record-seo-operational-health-incident-fallback.mjs", import.meta.url), "utf8");
assert.match(recoveryWorkflow, /github\.actor_id == '200251753'/);
assert.match(recoveryWorkflow, /github\.ref == 'refs\/heads\/main'/);
assert.match(recoveryWorkflow, /environment: seo-health-production/);
assert.match(recoveryWorkflow, /SEO_HEALTH_ROLLOUT_PERMANENT_CHECKPOINT_MISSED/);
assert.doesNotMatch(recoveryWorkflow, /SEO_HEALTH_(?:ATTESTATION|VERCEL_CONTROL|TURSO|GHL_READ)/);
assert.match(mainWorkflow, /controls_ready: \$\{\{ steps\.schedule\.outputs\.controls_ready \}\}/);
assert.match(mainWorkflow, /effective_date: \$\{\{ steps\.schedule\.outputs\.effective_date \}\}/);
assert.match(mainWorkflow, /checkpoint_id: \$\{\{ steps\.schedule\.outputs\.checkpoint_id \}\}/);
assert.equal((mainWorkflow.match(/SEO_HEALTH_SCHEDULE_EFFECTIVE_DATE:/g) || []).length, 4);
assert.equal((mainWorkflow.match(/SEO_HEALTH_SCHEDULE_CHECKPOINT_ID:/g) || []).length, 4);
assert.equal(
  (mainWorkflow.match(/github\.actor == 'willrapuano' && github\.actor_id == '200251753'/g) || []).length,
  4,
  "every credential-bearing main-workflow job must reject non-owner manual dispatch",
);
assert.match(mainWorkflow, /incident_fallback:/);
assert.match(mainWorkflow, /needs\.schedule\.result == 'success'/);
assert.match(mainWorkflow, /needs\.schedule\.outputs\.controls_ready == 'true'/);
assert.match(mainWorkflow, /checkpoint:seo-operational-health:incident-fallback/);
assert.match(fallbackScript, /SEO_HEALTH_WATCHDOG_SIGNATURE_CONFIG_INVALID/);

console.log("SEO operational-health recovery and signed watchdog controls verification passed");
