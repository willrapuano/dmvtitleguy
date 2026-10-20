// Page-two batch (2026-10-19): rewrites the opening and closing of the Virginia
// "who chooses the title company" post and corrects the Maryland title insurance
// cost post. Backups: ops/backups/page-two-batch.2026-10-19.json
//   node ops/posts/page-two-batch-2026-10-19.mjs --backup | --fixture <out.json> | --publish
import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const k = () => randomBytes(8).toString("hex");
function spans(text) {
  const markDefs = [], children = [];
  let last = 0;
  for (const m of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    if (m.index > last) children.push({ _key: k(), _type: "span", marks: [], text: text.slice(last, m.index) });
    const key = k();
    markDefs.push({ _key: key, _type: "link", href: m[2] });
    children.push({ _key: k(), _type: "span", marks: [key], text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) children.push({ _key: k(), _type: "span", marks: [], text: text.slice(last) });
  return { markDefs, children };
}
const block = (style, text, extra = {}) => ({ _key: k(), _type: "block", style, ...spans(text), ...extra });
const p = (t) => block("normal", t);
const h2 = (t) => block("h2", t);
const li = (t) => block("normal", t, { listItem: "bullet", level: 1 });
const textOf = (b) => (b?.children || []).map((c) => c.text || "").join("");

const env = readFileSync(new URL("../../../site/.env.local", import.meta.url), "utf8");
const token = env.match(/^SANITY_API_TOKEN=["']?([^"'\n]+)/m)[1];
const client = createClient({ projectId: "4s0dloxi", dataset: "production", token, useCdn: false, apiVersion: "2024-01-01" });

const VA_ID = "post-who-chooses-the-title-company-in-virginia";
const MD_ID = "post-title-insurance-cost-maryland";
const [va, md] = await Promise.all([client.getDocument(VA_ID), client.getDocument(MD_ID)]);

// ── Virginia: who chooses the title company ─────────────────────────────────
const vaIntro = [
  p("The buyer chooses. Virginia law gives the purchaser or borrower the right to select the settlement agent that handles escrow, closing and settlement, and a seller may not require a particular settlement agent as a condition of the sale (Va. Code § 55.1-1006). The purchase contract for a home of one to four units has to say so in bold type (Va. Code § 55.1-1007)."),
  p("Federal law adds a second protection. When the purchase is financed with a federally related mortgage loan, which covers nearly every home loan, the seller can't require the buyer to buy title insurance from a particular title company as a condition of the sale. A seller who does is liable to the buyer for three times the title insurance charges (RESPA section 9, 12 U.S.C. § 2608)."),
  h2("What a Virginia seller can and can't do"),
  li("Suggest a settlement company. The buyer is free to accept the suggestion or pick another."),
  li("Hire the seller's own Virginia attorney for deed preparation, fee negotiation, document review and legal advice about the closing (Va. Code § 55.1-1006)."),
  li("Negotiate in the contract who pays which costs, including the owner's title policy, which the buyer customarily pays in Virginia."),
  p("What the seller can't do is make its preferred company a condition of the sale. That stays true when the seller offers to pay for the owner's policy: the offer may be a good reason for a buyer to accept the seller's choice, but it isn't a way around the buyer's right to make it."),
  h2("How the lender fits in"),
  p("The lender doesn't choose the settlement agent either, but it sends its loan documents and closing instructions to the agent and requires a lender's title policy. Many lenders review a settlement agent before working with it, so tell the loan officer which company you've chosen as soon as the contract is ratified."),
  h2("How to choose a settlement agent in Virginia"),
  li("Compare full written quotes. The state doesn't fix title premiums: insurers set their own rates and can negotiate them (Va. Code § 38.2-4608), and settlement, search and exam fees vary too."),
  li("Ask which title insurers the agent writes for, and whether a reissue credit applies if the seller has an owner's policy."),
  li("Check responsiveness before you commit: who your contact is, how quickly questions get answered, and how wiring instructions are confirmed."),
  li("Decide at contract time. Name the settlement agent in the contract and tell your agent and lender the same day."),
  p("Will Rapuano and the Pruitt Title team handle title and settlement across Northern Virginia, Maryland and DC. To have them on your purchase, name Pruitt Title as the settlement agent when you sign the contract. Estimate your costs first with the [Virginia closing cost calculator](/virginia-closing-cost-calculator)."),
];
const vaAgents = [
  h2("For agents: guiding a buyer's choice"),
  li("Explain the buyer's right to choose at the first meeting, before a seller's preference comes up."),
  li("When the seller proposes a company, get its full fee quote and compare it line by line with the buyer's choice."),
  li("Tell the lender the chosen settlement agent as soon as the contract is ratified."),
  li("Name the settlement agent in the contract so there's no confusion at closing."),
];
const vaBody = va.body;
const iTitleIns = vaBody.findIndex((b) => b.style === "h2" && /^Title insurance in Virginia/.test(textOf(b)));
const iBottom = vaBody.findIndex((b) => /^The Bottom Line/.test(textOf(b)));
const iFaq = vaBody.findIndex((b) => /^Frequently Asked Questions$/.test(textOf(b)));
if (iTitleIns < 1 || iBottom <= iTitleIns || iFaq <= iBottom) throw new Error(`Virginia anchors not found: ${iTitleIns} ${iBottom} ${iFaq}`);
const vaPatch = {
  title: "Who Chooses the Title Company in Virginia? The Buyer, by Law",
  excerpt: "In Virginia the buyer chooses the settlement company, and a seller can't require one (Va. Code § 55.1-1006). How it works with lenders, title insurance and FSBO purchases.",
  body: [...vaIntro, ...vaBody.slice(iTitleIns, iBottom), ...vaAgents, ...vaBody.slice(iFaq)],
};

// ── Maryland: title insurance cost ──────────────────────────────────────────
function replaceText(body, match, text) {
  const i = body.findIndex((b) => b._type === "block" && match.test(textOf(b)));
  if (i < 0) throw new Error(`Maryland block not found: ${match}`);
  const copy = [...body];
  copy[i] = { ...block(body[i].style || "normal", text), ...(body[i].listItem ? { listItem: body[i].listItem, level: body[i].level } : {}) };
  return copy;
}
let mdBody = md.body;
mdBody = replaceText(mdBody, /^The short answer: title insurance in Maryland/,
  "The short answer: Maryland title premiums come from rates each insurer files with the Maryland Insurance Administration, driven mainly by your purchase price and loan amount. For a $400,000 to $800,000 purchase, Stewart's published schedule, before discounts, puts the owner's and lender's policies together at about $2,400 to $4,040, with the lender's policy at a $350 simultaneous-issue rate. Unlike most insurance, you pay it once at closing, not monthly.");
mdBody = replaceText(mdBody, /^Rates are filed by each underwriter/,
  "Rates are filed by each underwriter, so two Maryland title companies quoting the same transaction can differ on premium if they use different underwriters. Settlement fees and other service charges differ too, which is why an itemized quote matters more than a headline number.");
mdBody = replaceText(mdBody, /^Payment is set by contract and local custom/,
  "In Maryland the buyer customarily pays for both the lender's and owner's policies, though the contract can change that and seller concessions are common in slower markets. Transfer and recordation taxes are a separate conversation: Maryland law presumes the buyer and seller split them equally unless the contract says otherwise (Md. Code, Real Property § 14-104(b)). The [Maryland closing cost calculator](/maryland-closing-cost-calculator) shows those taxes by county.");
const mdPatch = { body: mdBody };

const plans = [
  { id: VA_ID, rev: va._rev, slug: "who-chooses-the-title-company-in-virginia", set: vaPatch },
  { id: MD_ID, rev: md._rev, slug: "title-insurance-cost-maryland", set: mdPatch },
];

const mode = process.argv[2];
if (mode === "--backup") {
  writeFileSync(new URL("../backups/page-two-batch.2026-10-19.json", import.meta.url), JSON.stringify([va, md], null, 2));
  console.log("backed up", va._id, va._rev, md._id, md._rev);
} else if (mode === "--fixture") {
  // Every published post, with the two patched ones swapped in, in the guard's shape.
  const all = await client.fetch('*[_type=="post" && !(_id in path("drafts.**"))]{_id,"slug":slug.current,title,excerpt,body}');
  const out = all.map((post) => {
    const plan = plans.find((x) => x.id === post._id);
    return plan ? { ...post, ...plan.set } : post;
  });
  writeFileSync(process.argv[3], JSON.stringify(out));
  console.log("fixture", out.length, "posts");
} else if (mode === "--publish") {
  const tx = client.transaction();
  for (const plan of plans) tx.patch(plan.id, (patch) => patch.ifRevisionId(plan.rev).set(plan.set));
  const res = await tx.commit();
  console.log("committed", res.transactionId);
} else {
  console.log(JSON.stringify(plans.map((x) => ({ id: x.id, rev: x.rev, keys: Object.keys(x.set), blocks: x.set.body?.length })), null, 2));
}
