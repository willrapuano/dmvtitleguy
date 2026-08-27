import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { buildLocalBatchReport, normalizeLocalObservation, persistLocalBatchReport } from "./lib/local-search-measurement.mjs";

const allowedValueFlags = new Set(["--batch"]);
const allowedBooleanFlags = new Set(["--write"]);
const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const name = process.argv[index];
  assert.ok(allowedValueFlags.has(name) || allowedBooleanFlags.has(name), `unknown argument: ${name}`);
  if (allowedBooleanFlags.has(name)) {
    assert.ok(!args.has(name), `duplicate argument: ${name}`);
    args.set(name, true);
    continue;
  }
  const value = process.argv[index + 1];
  assert.ok(value && !value.startsWith("--"), `value required for ${name}`);
  assert.ok(!args.has(name), `duplicate argument: ${name}`);
  args.set(name, value);
  index += 1;
}

const batchId = args.get("--batch");
assert.match(batchId || "", /^\d{4}-W\d{2}$/, "--batch must use ISO week form YYYY-Www");

const config = JSON.parse(await readFile("config/local-search-measurement.json", "utf8"));
const observationDirectory = resolve("docs/local-search-checkpoints/observations");
const observationFiles = (await readdir(observationDirectory)).filter((file) => file.endsWith(".json"));
const observations = await Promise.all(observationFiles.map(async (file) => {
  const observation = JSON.parse(await readFile(resolve(observationDirectory, file), "utf8"));
  assert.equal(observation.measurementVersion, config.measurementVersion, `${file} uses a stale measurement version`);
  assert.deepEqual(observation, normalizeLocalObservation(observation, config), `${file} is noncanonical or has stale protocol/integrity fields`);
  return observation;
}));

const batchDirectory = resolve("docs/local-search-checkpoints/batches");
let previousReports = [];
try {
  const reportFiles = (await readdir(batchDirectory)).filter((file) => file.endsWith(".json"));
  previousReports = await Promise.all(reportFiles.map(async (file) => {
    assert.match(file, /^\d{4}-W\d{2}\.json$/, `${file} is not a canonical batch-report filename`);
    const report = JSON.parse(await readFile(resolve(batchDirectory, file), "utf8"));
    assert.equal(file, `${report.batchId}.json`, `${file} does not match its report batchId`);
    return report;
  }));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const report = buildLocalBatchReport(observations, config, batchId, previousReports);
console.log(JSON.stringify(report, null, 2));
if (args.get("--write")) {
  const outputPath = await persistLocalBatchReport(report, batchDirectory);
  console.error(`Wrote immutable local-search checkpoint: ${outputPath}`);
} else if (!report.completeness.complete) {
  process.exitCode = 2;
}
