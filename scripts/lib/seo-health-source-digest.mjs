import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const SEO_HEALTH_SOURCE_DIGEST_VERSION = "seo-health-source-v1";

// This is deliberately an allowlist, not a glob. A canary proves the exact
// executable health implementation that permanent rollout will use. Adding,
// removing, or changing any listed source requires another scheduled canary.
export const SEO_HEALTH_SOURCE_PATHS = Object.freeze([
  ".github/workflows/ci.yml",
  ".github/workflows/seo-operational-health-recovery.yml",
  ".github/workflows/seo-operational-health.yml",
  "config/domain-redirects.mjs",
  "config/seo-operational-health.json",
  "next.config.mjs",
  "package-lock.json",
  "package.json",
  "scripts/archive-seo-operational-health.mjs",
  "scripts/check-seo-operational-health-canary-receipt.mjs",
  "scripts/lib/seo-health-canary-receipt.mjs",
  "scripts/lib/seo-health-evidence-archive.mjs",
  "scripts/lib/seo-health-incident-recorder.mjs",
  "scripts/lib/seo-health-isolated-runner.mjs",
  "scripts/lib/seo-health-process-boundaries.mjs",
  "scripts/lib/seo-health-rollout-controls.mjs",
  "scripts/lib/seo-health-source-digest.mjs",
  "scripts/lib/seo-health-watchdog-receipt.mjs",
  "scripts/preflight-seo-operational-health-attestation.mjs",
  "scripts/record-seo-operational-health-incident-fallback.mjs",
  "scripts/record-seo-operational-health-missed-recovery.mjs",
  "scripts/resolve-seo-operational-health-schedule.mjs",
  "scripts/run-seo-operational-health-provider.mjs",
  "scripts/verify-production-env.mjs",
  "scripts/verify-seo-operational-health.mjs",
  "src/app/api/ops/seo-health-attestation/route.ts",
  "src/lib/seo-health-deployment-attestation.ts",
  "src/lib/seo-operational-health-config.ts",
  "src/lib/seo-operational-health-contract.ts",
  "src/lib/seo-operational-health-handler.ts",
  "src/lib/seo-operational-health.ts",
  "tsconfig.json",
  "vercel.json",
]);

const ROLLOUT_ONLY_CONFIG_KEYS = Object.freeze([
  "rolloutPhase",
  "checkpointDates",
  "canaryDates",
  "canaryReceipt",
  "checkpointHistory",
]);

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

export function normalizedHealthConfigSource(source) {
  const parsed = JSON.parse(source);
  for (const key of ROLLOUT_ONLY_CONFIG_KEYS) delete parsed[key];
  if (parsed.schedulerContinuity?.independentWatchdog) {
    parsed.schedulerContinuity.independentWatchdog.receipt = "__ROLLOUT_METADATA__";
  }
  return `${JSON.stringify(stableValue(parsed))}\n`;
}

function frame(value) {
  return `${Buffer.byteLength(value, "utf8")}:${value}`;
}

export async function computeSeoHealthSourceDigest({
  repositoryRoot = new URL("../../", import.meta.url),
  readFileImpl = readFile,
} = {}) {
  const entries = [];
  for (const relativePath of SEO_HEALTH_SOURCE_PATHS) {
    const absolute = new URL(relativePath, repositoryRoot);
    let source;
    try {
      source = await readFileImpl(fileURLToPath(absolute), "utf8");
    } catch {
      throw new Error("SEO_HEALTH_SOURCE_READ_FAILED");
    }
    if (relativePath === "config/seo-operational-health.json") {
      try {
        source = normalizedHealthConfigSource(source);
      } catch {
        throw new Error("SEO_HEALTH_SOURCE_CONFIG_INVALID");
      }
    }
    entries.push(`${frame(relativePath)}|${frame(source)}`);
  }
  const canonical = `${frame(SEO_HEALTH_SOURCE_DIGEST_VERSION)}|${entries.join("|")}`;
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}
