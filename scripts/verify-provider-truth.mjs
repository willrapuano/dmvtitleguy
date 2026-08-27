import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const files = execFileSync("rg", ["--files", "src/app", "src/content", "src/data"], { encoding: "utf8" })
  .trim()
  .split("\n")
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
  /\bwe (?:issue|handle|provide|serve|coordinate|conduct|review|open|begin|deliver|turn|ensure|support)\b/i,
  /Pruitt Title(?: LLC)? (?:provides|handles|supports|offers|serves|coordinates|performs|issues|can provide|will provide)\b/i,
  /Pruitt Title(?: LLC)? is (?:the|your)\b/i,
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
