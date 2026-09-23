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

const bannedClaims = [
  // Md. Tax-Property § 13-203(a): the state transfer tax is 0.5%; there is no 1.0% rate.
  { pattern: /1\.0% (?:for non-primary|if not primary|if buyer won't)/i, why: "Maryland has no 1.0% state transfer tax (Tax-Prop. § 13-203)" },
  // Md. Tax-Property § 12-103(b): each county sets the recordation rate; there is no state base.
  { pattern: /state recordation tax base|\$2\.50 per \$500/i, why: "Maryland has no statewide recordation tax rate (Tax-Prop. § 12-103)" },
  { pattern: /Maryland[^.\n]{0,40}\bstate recordation tax|State Recordation Tax:<\/strong> \$6\.60/i, why: "Maryland has no state recordation tax (Tax-Prop. § 12-103); Virginia does, so this is Maryland-only" },
  // Md. Tax-Property §§ 12-103(a), 12-108(i); D.C. Code § 42-1103(a): recordation is on the deed's consideration.
  { pattern: /recordation tax \(based on loan amount\)/i, why: "MD/DC recordation tax is on the price, not the loan" },
  { pattern: /recordation tax is 0\.5% of the loan/i, why: "MD recordation tax is on the price, not the loan" },
  { pattern: /\$6\.60 per \$1,000|\$0\.005 per \$100|\$0\.0085 per \$100/, why: "not a Maryland or Montgomery County recordation rate" },
  // D.C. Code § 42-1103(e): first-time homebuyers get a reduced 0.725% rate, not an exemption.
  { pattern: /exempt from the recordation tax on properties up to|exempt buyers from recordation taxes/i, why: "DC first-time buyers get a reduced rate (§ 42-1103(e)), not an exemption" },
  // Prince George's County Code § 10-188(d)(1): purchase-money mortgages and deeds of trust are excluded.
  { pattern: /also applies to mortgages and deeds of trust|deed of trust transfer tax on the loan/i, why: "PG transfer tax excludes purchase-money deeds of trust (PG Code § 10-188(d))" },
  // Frederick County imposes no county transfer tax.
  { pattern: /Frederick County is lower at 1\.0%/i, why: "Frederick has no county transfer tax" },
  // Va. Code § 58.1-802: grantor's tax is $0.50 per $500 ($0.10 per $100).
  { pattern: /grantor'?s? tax[^.\n]{0,40}\$0\.(?:25|50) per \$100/i, why: "Virginia grantor's tax is $0.10 per $100 (§ 58.1-802)" },
  // § 58.1-802.2 (a single $0.15 congestion fee) was repealed in 2018; §§ 58.1-802.3 and 802.4 are $0.10 each.
  { pattern: /congestion[^.\n]{0,40}\$0\.15|\$0\.15[^.\n]{0,40}congestion/i, why: "the $0.15 congestion fee was repealed; two $0.10 fees apply (§§ 58.1-802.3, 802.4)" },
  // §§ 58.1-814, 58.1-3800: Fairfax, Arlington, Loudoun, Prince William and Alexandria levy the local third.
  { pattern: /(?:does not add|no additional) (?:a )?local recordation tax/i, why: "NoVA localities levy the § 58.1-3800 local recordation tax" },
  // D.C. Code §§ 42-1103(a-4), 47-903(a-4): residential rates top out at 1.45% each.
  { pattern: /can exceed 2\.9%/i, why: "DC residential recordation + transfer tax is at most 2.9% combined" },
];

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
    for (const { pattern, why } of bannedClaims) {
      if (pattern.test(line)) failures.push(`${path.relative(root, file)}:${index + 1}: ${why}\n    ${line.trim().slice(0, 160)}`);
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
for (const county of ["Fairfax County", "Arlington County", "Loudoun County", "Prince William County", "City of Alexandria"]) {
  expectMatch(rateData, new RegExp(`"${county}": 0\\.00083`), `${county} local recordation (§ 58.1-3800) must be listed`);
}
if (/DeedOfTrustTransferTax/.test(calculator)) failures.push("rate drift: a purchase-money deed of trust is not subject to PG County transfer tax (§ 10-188(d))");
// D.C. Code §§ 42-1103(a-4), 47-903(a-4): 1.45% each at $400,000 or more, 1.1% each below.
expectMatch(calculator, /price >= 400000 \? 0\.029 : 0\.022/, "DC combined rate must be 2.9% at $400,000 or more, 2.2% below");

if (failures.length) {
  console.error(`Tax facts check failed (${failures.length}):\n${failures.join("\n")}`);
  process.exit(1);
}
assert.ok(true);
console.log(`Tax facts verified: ${bannedClaims.length} banned claims absent from src/, calculator rates match MD, DC and VA statutes`);
