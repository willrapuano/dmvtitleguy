// Production dependency audit: fails on any high or critical advisory, except the
// reviewed exceptions below. An exception exists only when no patched version is
// published, the vulnerable code is not reached at runtime, and it carries an expiry
// date; past that date this check fails again so the exception is re-reviewed.
import { execFileSync } from "node:child_process";

const EXCEPTIONS = [
  {
    // braces <=3.0.3: stack exhaustion on deeply nested patterns. No patched release
    // exists (3.0.3 is the latest). It is reached only through Sanity's CLI tooling
    // (@sanity/codegen -> chokidar / globby -> micromatch), which globs local files at
    // build time; no request handler passes user input to it.
    advisory: "GHSA-vfj7-8cjw-p6xm",
    package: "braces",
    expires: "2026-11-03",
  },
];

let report;
try {
  report = execFileSync("npm", ["audit", "--omit=dev", "--workspaces=false", "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
} catch (error) {
  report = error.stdout; // npm audit exits non-zero whenever it finds anything
}
const { vulnerabilities = {} } = JSON.parse(report);
const today = new Date().toISOString().slice(0, 10);
const advisoryId = (via) => String(via.url || "").split("/").pop();

// A package fails if it is high/critical and any advisory behind it (directly, or via the
// packages it depends on) is not an active exception.
function unexcused(name, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);
  const entry = vulnerabilities[name];
  if (!entry) return [];
  return entry.via.flatMap((via) => {
    if (typeof via === "string") return unexcused(via, seen);
    if (via.severity !== "high" && via.severity !== "critical") return [];
    const exception = EXCEPTIONS.find((e) => e.advisory === advisoryId(via) && e.package === via.name);
    if (exception && exception.expires >= today) return [];
    return [`${via.name}: ${via.title} (${via.url})${exception ? ` — exception expired ${exception.expires}` : ""}`];
  });
}

const failures = new Set();
for (const [name, entry] of Object.entries(vulnerabilities)) {
  if (entry.severity !== "high" && entry.severity !== "critical") continue;
  for (const reason of unexcused(name)) failures.add(reason);
}

if (failures.size) {
  console.error(`Security audit failed (${failures.size} high/critical advisories):\n  ${[...failures].join("\n  ")}`);
  process.exit(1);
}
const active = EXCEPTIONS.filter((e) => e.expires >= today).map((e) => `${e.package} until ${e.expires}`);
console.log(`Security audit passed: no unexcused high/critical production advisories${active.length ? ` (reviewed exceptions: ${active.join(", ")})` : ""}`);
