import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const EXPECTED_PROJECT = {
  projectId: "prj_tN9c6AlMivRM2bsLRBOnlYDwq1OT",
  orgId: "team_0uqBDI4YSqqqiWK6WhlHAU1D",
  projectName: "dmvtitleguy",
  scope: "will-rapuanos-projects",
};

function fail(code) {
  console.error(JSON.stringify({ schemaVersion: 1, healthy: false, error: { code } }));
  process.exit(1);
}

let linkedProject;
try {
  linkedProject = JSON.parse(readFileSync(resolve(".vercel", "project.json"), "utf8"));
  assert.equal(linkedProject.projectId, EXPECTED_PROJECT.projectId);
  assert.equal(linkedProject.orgId, EXPECTED_PROJECT.orgId);
  assert.equal(linkedProject.projectName, EXPECTED_PROJECT.projectName);
} catch {
  fail("VERCEL_PROJECT_IDENTITY_MISMATCH");
}

const result = spawnSync("vercel", [
  "env",
  "run",
  "-e",
  "production",
  "--project",
  EXPECTED_PROJECT.projectId,
  "--scope",
  EXPECTED_PROJECT.scope,
  "--",
  process.execPath,
  "scripts/run-seo-health-with-env.mjs",
], {
  cwd: process.cwd(),
  encoding: "utf8",
  maxBuffer: 5 * 1024 * 1024,
  env: process.env,
});

if (result.error) fail("VERCEL_ENV_RUN_SPAWN_FAILED");

const safeErrorCodes = new Set([
  "CHECKPOINT_ENV_MISSING",
  "CHECKPOINT_HEALTH_EXECUTION_FAILED",
  "CHECKPOINT_HEALTH_SIGNAL",
  "CHECKPOINT_HEALTH_SPAWN_FAILED",
]);
const safeEnvironmentNames = new Set([
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "GHL_PRIVATE_INTEGRATION_TOKEN",
  "GHL_LOCATION_ID",
  "GHL_WEBSITE_PIPELINE_ID",
]);

function isSanitizedReport(candidate) {
  if (!candidate || typeof candidate !== "object" || typeof candidate.healthy !== "boolean") return false;
  if (!candidate.error) return Array.isArray(candidate.incidents) && Array.isArray(candidate.priorityPages);
  if (!safeErrorCodes.has(candidate.error.code)) return false;
  return (candidate.error.variables || []).every((name) => safeEnvironmentNames.has(name));
}

let report = null;
const candidateLines = `${String(result.stdout || "")}\n${String(result.stderr || "")}`.trim().split("\n").toReversed();
for (const line of candidateLines) {
  try {
    const candidate = JSON.parse(line);
    if (isSanitizedReport(candidate)) {
      report = candidate;
      break;
    }
  } catch {
    // Vercel may emit non-JSON progress lines. They are never forwarded.
  }
}

if (!report) fail("VERCEL_ENV_RUN_NO_SANITIZED_REPORT");
console.log(JSON.stringify(report, null, 2));
process.exit(result.status === 0 && report.healthy ? 0 : 1);
