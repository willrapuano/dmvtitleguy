// Guards the closing-tax facts the site states and the rates the calculator uses.
//
// Why: a 2026-09-23 audit found the same errors repeated across coded pages —
// Maryland and DC recordation tax described as a charge on the loan, a Maryland
// "state recordation tax" and a 1.0% state transfer tax that do not exist, and a
// DC first-time-buyer "exemption" that the statute makes a reduced rate. Each was
// checked against the primary source cited next to its pattern. A banned phrase
// failing this check means the statement is false, not merely out of style.
//
// Usage: node scripts/verify-tax-facts.mjs [root]   (root defaults to the repo)

import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));

import { bannedClaims } from "./lib/tax-claim-rules.mjs";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (entry === "node_modules" || entry === "generated") continue;
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|mjs)$/.test(entry)) out.push(full);
  }
  return out;
}

const failures = [];
for (const file of walk(path.join(root, "src"))) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    for (const { pattern, why, unless } of bannedClaims) {
      if (pattern.test(line) && !(unless && unless.test(line))) failures.push(`${path.relative(root, file)}:${index + 1}: ${why}\n    ${line.trim().slice(0, 160)}`);
    }
  });
}

const read = (relative) => readFileSync(path.join(root, relative), "utf8");
const rateData = read("src/data/closingCostData.ts");
const calculator = read("src/components/ClosingCostCalculator.tsx");

function expectMatch(source, pattern, why) {
  if (!pattern.test(source)) failures.push(`rate drift: ${why}`);
}

expectMatch(rateData, /MD_STATE_TRANSFER_TAX_RATE = 0\.005;/, "Maryland state transfer tax must be 0.5% (Tax-Prop. § 13-203(a))");
expectMatch(rateData, /MD_FIRST_TIME_TRANSFER_TAX_RATE = 0\.0025;/, "Maryland first-time rate must be 0.25% (Tax-Prop. § 13-203(b))");
// Montgomery County Bill 17-23 schedule, per $500, and the $100,000 principal-residence exemption.
for (const [limit, rate] of [["500000", "4.45"], ["600000", "6.75"], ["750000", "10.2"], ["1000000", "10.78"], ["Infinity", "11.35"]]) {
  expectMatch(calculator, new RegExp(`limit: ${limit}, ratePer500: ${rate.replace(".", "\\.")}\\b`), `Montgomery recordation tier ${limit} must be $${rate}/$500 (Bill 17-23)`);
}
expectMatch(calculator, /price - \(ownerOccupiedResidential \? 100000 : 0\)/, "Montgomery principal-residence exemption must be the first $100,000");
// Va. Code §§ 58.1-801, 58.1-802, 58.1-803: deed and purchase deed of trust at $0.25/$100; grantor at $0.10/$100.
expectMatch(calculator, /recordationTax: price \* 0\.0025,/, "Virginia deed recordation must be $0.25/$100 of price (§ 58.1-801)");
expectMatch(calculator, /deedOfTrustRecordationTax: loanAmount \* 0\.0025,/, "Virginia purchase deed of trust must be taxed at $0.25/$100 of the loan (§ 58.1-803)");
expectMatch(calculator, /grantorTax: price \* 0\.001,/, "Virginia grantor's tax must be $0.10/$100 (§ 58.1-802)");
// Fredericksburg City Code § 70-65 levies the same one-third.
for (const county of ["Fairfax County", "Arlington County", "Loudoun County", "Prince William County", "City of Alexandria", "City of Fredericksburg"]) {
  expectMatch(rateData, new RegExp(`"${county}": 0\\.00083`), `${county} local recordation (§ 58.1-3800) must be listed`);
}
if (/DeedOfTrustTransferTax/.test(calculator)) failures.push("rate drift: a purchase-money deed of trust is not subject to PG County transfer tax (§ 10-188(d))");
// D.C. Code §§ 42-1103(a-4), 47-903(a-4): 1.45% each at $400,000 or more, 1.1% each below.
expectMatch(calculator, /price >= 400000 \? 0\.0145 : 0\.011/, "DC recordation and transfer tax must each be 1.45% at $400,000 or more, 1.1% below");
// Md. Real Prop. § 14-104(b): recordation tax presumed shared equally.
expectMatch(calculator, /recordationTax: recordationTax \/ 2,[\s\S]*recordationTax: recordationTax \/ 2,/, "Maryland recordation tax must be split equally between buyer and seller (RP § 14-104(b))");

if (failures.length) {
  console.error(`Tax facts check failed (${failures.length}):\n${failures.join("\n")}`);
  process.exit(1);
}
assert.ok(true);
console.log(`Tax facts verified: ${bannedClaims.length} banned claims absent from src/, calculator rates match MD, DC and VA statutes`);
