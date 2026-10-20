// Every phone number shown or dialed on the site must be Will's: (703) 859-1467.
// (571) 474-4000 sat on eight city CTAs for months; Will confirmed on 2026-10-19
// it is not his number. Form placeholders using the 555-01xx fiction range are allowed.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ALLOWED_DIGITS = new Set(["7038591467"]);
// Walk the tree rather than `git ls-files`: heavy-run verifies a copy without .git.
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "generated" ? [] : walk(path);
    return /\.(tsx?|mjs|js|md|mdx|json|txt)$/.test(entry.name) ? [path] : [];
  });
}
const files = ["src", "public"].flatMap(walk);

const failures = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const patterns = [/tel:\+?1?([0-9]{10})/g, /\((\d{3})\)\s?(\d{3})-(\d{4})/g];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const digits = match.slice(1).join("").replace(/^1(?=\d{10}$)/, "");
      if (ALLOWED_DIGITS.has(digits) || /^\d{3}55501\d{2}$/.test(digits)) continue;
      failures.push(`${file}: ${match[0]}`);
    }
  }
}

if (failures.length) {
  console.error("Phone numbers other than (703) 859-1467 found:\n" + failures.join("\n"));
  process.exit(1);
}
console.log(`Phone numbers verified: ${files.length} files, only (703) 859-1467`);
