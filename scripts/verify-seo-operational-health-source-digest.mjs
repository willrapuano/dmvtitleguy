import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path/posix";
import {
  SEO_HEALTH_SOURCE_PATHS,
  computeSeoHealthSourceDigest,
  normalizedHealthConfigSource,
} from "./lib/seo-health-source-digest.mjs";

const digest = await computeSeoHealthSourceDigest();
assert.match(digest, /^[a-f0-9]{64}$/);
assert.equal(new Set(SEO_HEALTH_SOURCE_PATHS).size, SEO_HEALTH_SOURCE_PATHS.length);
assert.deepEqual([...SEO_HEALTH_SOURCE_PATHS].sort(), [...SEO_HEALTH_SOURCE_PATHS]);
assert.ok(SEO_HEALTH_SOURCE_PATHS.includes(".github/workflows/ci.yml"));
assert.ok(SEO_HEALTH_SOURCE_PATHS.includes("scripts/verify-seo-operational-health.mjs"));

async function resolveLocalModule(importer, specifier) {
  const unresolved = specifier.startsWith("@/")
    ? `src/${specifier.slice(2)}`
    : normalize(join(dirname(importer), specifier));
  const candidates = extname(unresolved)
    ? [unresolved]
    : [
        `${unresolved}.ts`,
        `${unresolved}.mjs`,
        `${unresolved}.json`,
        `${unresolved}/index.ts`,
        `${unresolved}/index.mjs`,
      ];
  for (const candidate of candidates) {
    try {
      await readFile(new URL(`../${candidate}`, import.meta.url), "utf8");
      return candidate;
    } catch {
      // Try the next deterministic local-module form.
    }
  }
  throw new Error(`unresolved local health import: ${importer} -> ${specifier}`);
}

for (const importer of SEO_HEALTH_SOURCE_PATHS.filter((path) => /\.(?:mjs|ts)$/.test(path))) {
  const source = await readFile(new URL(`../${importer}`, import.meta.url), "utf8");
  const localSpecifiers = [
    ...source.matchAll(/\b(?:from|import\s*(?:\())\s*["']([^"']+)["']/g),
  ].map((match) => match[1]).filter((specifier) => (
    specifier.startsWith("./")
    || specifier.startsWith("../")
    || specifier.startsWith("@/")
  ));
  for (const specifier of localSpecifiers) {
    const resolved = await resolveLocalModule(importer, specifier);
    assert.ok(
      SEO_HEALTH_SOURCE_PATHS.includes(resolved),
      `local health dependency must be included in the canonical digest: ${importer} -> ${resolved}`,
    );
  }
}

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
for (const [name, command] of Object.entries(packageJson.scripts || {})) {
  if (!name.startsWith("checkpoint:seo-operational-health:")) continue;
  const runtimePaths = [...String(command).matchAll(/\b(scripts\/[a-z0-9.-]+\.mjs)\b/gi)]
    .map((match) => match[1]);
  assert.ok(runtimePaths.length > 0, `${name} must resolve to an explicit runtime module`);
  for (const runtimePath of runtimePaths) {
    assert.ok(
      SEO_HEALTH_SOURCE_PATHS.includes(runtimePath),
      `${name} runtime must be included in the canonical health-source digest: ${runtimePath}`,
    );
  }
}

const configText = await readFile(new URL("../config/seo-operational-health.json", import.meta.url), "utf8");
const original = JSON.parse(configText);
const rolloutOnlyChange = {
  ...original,
  rolloutPhase: "permanent",
  checkpointDates: structuredClone(original.checkpointCalendar),
  canaryDates: [],
  canaryReceipt: { fixture: true },
  checkpointHistory: { fixture: { status: "missed" } },
};
assert.equal(
  normalizedHealthConfigSource(configText),
  normalizedHealthConfigSource(JSON.stringify(rolloutOnlyChange)),
  "rollout-only state must not change the health-source digest",
);
assert.notEqual(
  normalizedHealthConfigSource(configText),
  normalizedHealthConfigSource(JSON.stringify({ ...original, origin: "https://example.invalid" })),
  "an executable health-contract change must require a new canary",
);
const drillMetadataOnly = structuredClone(original);
drillMetadataOnly.schedulerContinuity.independentWatchdog.receipt = { signedFixture: true };
assert.equal(
  normalizedHealthConfigSource(configText),
  normalizedHealthConfigSource(JSON.stringify(drillMetadataOnly)),
  "watchdog drill evidence is rollout metadata and must not invalidate an otherwise identical canary",
);
const watchdogCapabilityChange = structuredClone(original);
watchdogCapabilityChange.schedulerContinuity.independentWatchdog.requiredPermissions.actions = "read";
assert.notEqual(
  normalizedHealthConfigSource(configText),
  normalizedHealthConfigSource(JSON.stringify(watchdogCapabilityChange)),
  "watchdog capability changes must require a new canary",
);

const synthetic = Object.fromEntries(
  await Promise.all(SEO_HEALTH_SOURCE_PATHS.map(async (relativePath) => [
    relativePath,
    relativePath === "config/seo-operational-health.json"
      ? configText
      : await readFile(new URL(`../${relativePath}`, import.meta.url), "utf8"),
  ])),
);
const syntheticRead = async (absolutePath) => {
  const normalized = String(absolutePath).replaceAll("\\", "/");
  const relativePath = SEO_HEALTH_SOURCE_PATHS.find((candidate) => normalized.endsWith(`/${candidate}`));
  if (!relativePath) throw new Error("unexpected path");
  return synthetic[relativePath];
};
const baseline = await computeSeoHealthSourceDigest({ readFileImpl: syntheticRead });
for (const [changedPath, message] of [
  ["scripts/run-seo-operational-health-provider.mjs", "any executable health-source change must invalidate the canary digest"],
  ["scripts/verify-production-env.mjs", "a production live-gate change must invalidate the canary digest"],
  [".github/workflows/ci.yml", "a CI release-gate change must invalidate the canary digest"],
  ["scripts/verify-seo-operational-health.mjs", "a static release-verifier change must invalidate the canary digest"],
]) {
  synthetic[changedPath] += "\n// semantic change fixture\n";
  assert.notEqual(
    await computeSeoHealthSourceDigest({ readFileImpl: syntheticRead }),
    baseline,
    message,
  );
  synthetic[changedPath] = synthetic[changedPath].replace("\n// semantic change fixture\n", "");
}

console.log("SEO operational-health source digest verification passed");
