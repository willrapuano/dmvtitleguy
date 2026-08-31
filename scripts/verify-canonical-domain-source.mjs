import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalOrigin = "https://dmvtitleguy.io";
const forbiddenComPattern = /(?:https?:)?\/\/(?:www\.)?dmvtitleguy\.com\b/gi;
const forbiddenWwwIoPattern = /\bwww\.dmvtitleguy\.io\b/gi;
const extensions = new Set([".js", ".mjs", ".ts", ".tsx", ".md", ".json"]);
const scanTargets = ["src", "config", "next.config.mjs", "publish-blog-posts.mjs"];

async function sourceFiles(target) {
  const absolute = path.join(projectRoot, target);
  const statEntries = await readdir(absolute, { withFileTypes: true }).catch(() => null);
  if (!statEntries) return [absolute];

  const nested = await Promise.all(
    statEntries.map((entry) => sourceFiles(path.join(target, entry.name)))
  );
  return nested.flat();
}

const files = (await Promise.all(scanTargets.map(sourceFiles)))
  .flat()
  .filter((file) => extensions.has(path.extname(file)));

const violations = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  const relativeFile = path.relative(projectRoot, file);
  const matches = [
    ...(source.match(forbiddenComPattern) ?? []),
    ...(relativeFile === "config/domain-redirects.mjs"
      ? []
      : (source.match(forbiddenWwwIoPattern) ?? [])),
  ];
  if (matches.length > 0) {
    violations.push(`${relativeFile}: ${Array.from(new Set(matches)).join(", ")}`);
  }
}

assert.deepEqual(
  violations,
  [],
  `runtime or content source references a non-canonical DMV Title Guy host:\n${violations.join("\n")}`
);

const domainConfig = await readFile(path.join(projectRoot, "config/domain-redirects.mjs"), "utf8");
assert.ok(domainConfig.includes(`canonicalOrigin = "${canonicalOrigin}"`), "canonical origin is not .io");
assert.ok(domainConfig.includes('"www.dmvtitleguy.io"'), "www .io redirect host is missing");

console.log(`Canonical-domain source passed: ${files.length} runtime and content files are apex-.io-only`);
