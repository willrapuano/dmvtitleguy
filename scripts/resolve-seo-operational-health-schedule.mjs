import { appendFile, readFile } from "node:fs/promises";
import { resolveIsolatedSchedule } from "./lib/seo-health-isolated-runner.mjs";
import {
  assertStrictWorkflowContext,
  validateProcessBoundary,
} from "./lib/seo-health-process-boundaries.mjs";
import { evaluateSeoHealthRolloutControls } from "./lib/seo-health-rollout-controls.mjs";

validateProcessBoundary("gate");

const config = JSON.parse(await readFile(
  new URL("../config/seo-operational-health.json", import.meta.url),
  "utf8",
));
const match = resolveIsolatedSchedule(config, new Date());
assertStrictWorkflowContext(config, process.env, match);
const controls = evaluateSeoHealthRolloutControls(config, { now: new Date() });

if (process.env.GITHUB_ACTIONS === "true") {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (typeof outputPath !== "string" || !outputPath) {
    throw new Error("SEO health schedule gate requires the GitHub output channel");
  }
  await appendFile(outputPath, [
    `due=${match.due ? "true" : "false"}`,
    `effective_date=${match.effectiveDate}`,
    `checkpoint_id=${match.checkpointId || ""}`,
    `run_kind=${match.runKind}`,
    `controls_ready=${controls.ready ? "true" : "false"}`,
    `controls_failure_code=${controls.code}`,
    "",
  ].join("\n"), "utf8");
}

console.log(JSON.stringify({
  schemaVersion: config.schemaVersion,
  event: "seo-operational-health.schedule",
  rolloutPhase: config.rolloutPhase,
  effectiveDate: match.effectiveDate,
  due: match.due,
  runKind: match.runKind,
  controlsReady: controls.ready,
  controlsFailureCode: controls.code,
  externalCalls: 0,
  providerCredentialsLoaded: false,
}));
