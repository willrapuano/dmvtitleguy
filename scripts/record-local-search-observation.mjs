import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { access, chmod, copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { evidenceManifestSha256, normalizeLocalObservation } from "./lib/local-search-measurement.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const privateRoot = resolve(repoRoot, "private-seo", "local-search");
const evidenceRoot = resolve(privateRoot, "evidence");
const observationRoot = resolve(repoRoot, "docs", "local-search-checkpoints", "observations");
const allowedFlags = new Set(["--input", "--evidence"]);
const args = { evidence: [] };

for (let index = 2; index < process.argv.length; index += 1) {
  const name = process.argv[index];
  assert.ok(allowedFlags.has(name), `unknown argument: ${name}`);
  const value = process.argv[index + 1];
  assert.ok(value && !value.startsWith("--"), `value required for ${name}`);
  if (name === "--evidence") args.evidence.push(value);
  else args.input = value;
  index += 1;
}

assert.ok(args.input, "--input <private observation JSON> is required");
assert.ok(args.evidence.length, "at least one --evidence <private screenshot> is required");

function isWithin(path, root) {
  return path === root || path.startsWith(`${root}${sep}`);
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const inputPath = resolve(repoRoot, args.input);
assert.ok(isWithin(inputPath, privateRoot), "input must be under private-seo/local-search/");
const config = JSON.parse(await readFile(resolve(repoRoot, "config", "local-search-measurement.json"), "utf8"));
const input = JSON.parse(await readFile(inputPath, "utf8"));
assert.match(input.observationId || "", /^[a-z0-9][a-z0-9._-]{2,159}$/i, "observationId must be a safe filename token");

const outputPath = resolve(observationRoot, `${input.observationId}.json`);
const evidenceDirectory = resolve(evidenceRoot, input.observationId);
assert.ok(!(await exists(outputPath)), "observation already exists; corrections require a new observationId");
assert.ok(!(await exists(evidenceDirectory)), "evidence directory already exists; corrections require a new observationId");

const sourcePaths = args.evidence.map((item) => resolve(repoRoot, item));
for (const sourcePath of sourcePaths) {
  assert.ok(isWithin(sourcePath, privateRoot), "evidence must be under private-seo/local-search/");
  assert.ok(await exists(sourcePath), `evidence does not exist: ${relative(repoRoot, sourcePath)}`);
  assert.ok(new Set([".jpg", ".jpeg", ".png", ".webp"]).has(extname(sourcePath).toLowerCase()), "evidence must be a JPG, PNG, or WebP screenshot");
}

await mkdir(evidenceDirectory, { recursive: false, mode: 0o700 });
await chmod(evidenceDirectory, 0o700);
const files = [];
try {
  for (let index = 0; index < sourcePaths.length; index += 1) {
    const sourcePath = sourcePaths[index];
    const bytes = await readFile(sourcePath);
    const hash = createHash("sha256").update(bytes).digest("hex");
    const extension = extname(sourcePath).toLowerCase();
    const destination = resolve(evidenceDirectory, `${String(index + 1).padStart(2, "0")}-${hash.slice(0, 16)}${extension}`);
    await copyFile(sourcePath, destination, constants.COPYFILE_EXCL);
    await chmod(destination, 0o600);
    files.push({
      privatePath: relative(repoRoot, destination),
      sha256: hash,
      bytes: bytes.byteLength,
      widthPx: input.evidence?.files?.[index]?.widthPx ?? null,
      heightPx: input.evidence?.files?.[index]?.heightPx ?? null,
    });
  }

  input.evidence = {
    sourceType: input.evidence?.sourceType || "screenshot-bundle",
    files,
    manifestSha256: evidenceManifestSha256(files),
    verifiedAtRecordTime: true,
    recorderVersion: "record-local-search-observation-v1",
  };
  const normalized = normalizeLocalObservation(input, config);
  const temporaryOutput = resolve(observationRoot, `.${input.observationId}.${process.pid}.tmp`);
  await mkdir(observationRoot, { recursive: true });
  await writeFile(temporaryOutput, `${JSON.stringify(normalized, null, 2)}\n`, { flag: "wx", mode: 0o600 });
  await rename(temporaryOutput, outputPath);

  console.log(JSON.stringify({
    outputPath: relative(repoRoot, outputPath),
    protocolValid: normalized.protocolValidity.protocolValid,
    comparisonKey: normalized.protocolValidity.comparisonKey,
    exclusionReasons: normalized.protocolValidity.exclusionReasons,
    evidenceFiles: files.length,
  }, null, 2));
} catch (error) {
  console.error(`Recorder failed after reserving ${relative(repoRoot, evidenceDirectory)}; do not reuse the observationId until the incomplete private directory is reviewed.`);
  throw error;
}
