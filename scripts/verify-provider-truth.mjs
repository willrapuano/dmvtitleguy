import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

// Node's own walk instead of `rg --files`: the Linux release machine has no ripgrep.
const files = (
  await Promise.all(
    ["src/app", "src/content", "src/data"].map((dir) => readdir(dir, { recursive: true }).then((names) => names.map((name) => `${dir}/${name}`)))
  )
)
  .flat()
  .filter((file) => /\.(tsx?|md)$/.test(file));

const forbidden = [
  /all transaction types/i,
  /serves every city and community/i,
  /top 5% national recognition/i,
  /when you work with DMV Title Guy/i,
  /competitive referral bonuses/i,
  /earn bonuses for every closed transaction/i,
  /founder of Pruitt Title LLC\s*\/\s*DMV Title Guy/i,
  /independent guidance from Will Rapuano/i,
  /independently managed (?:education|website|site)/i,
  /services discussed or requested through this site are provided by Pruitt Title LLC/i,
  /Pruitt Title LLC provides any title insurance, escrow, (?:or|and) settlement services requested through/i,
  /\bwe (?:issue|handle|provide|serve|coordinate|conduct|review|open|begin|deliver|turn|ensure|support|close|hold|disburse|prepare|record|clear|process|order|verify|explain|work with|make sure)\b/i,
  /\bour (?:team|settlement team|closing team|title team) (?:issues|handles|provides|serves|coordinates|conducts|reviews|opens|begins|delivers|turns|ensures|supports|closes|holds|disburses|prepares|records|clears|processes|orders|verifies|explains)\b/i,
  /\bopen your (?:title )?order\b/i,
  /\brespond within (?:one|1) business (?:day|hour)\b/i,
  /\bturn(?:around|ed around)? in (?:24|48)[- ]?hours\b/i,
];

const violations = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(text)) violations.push(`${file}: ${pattern}`);
  }
}

assert.deepEqual(violations, [], `Unsupported provider claims found:\n${violations.join("\n")}`);
console.log(`Provider-truth gate passed across ${files.length} source files`);
