# DMV Title Guy SEO checkpoint operating contract

## Purpose and control state

This contract governs measurement after the August 26, 2026 release. Discretionary SEO publishing, title/meta/H1 changes, canonical changes, redirects, URL changes, authority outreach, directory edits, and profile changes remain frozen except for factual, legal, security, entity-truth, or broken-path corrections.

Will Rapuano operates `dmvtitleguy.io`. The public site is separate from Pruitt Title LLC's corporate website and does not bind Pruitt. The label `DMV Title Guy, LLC` in a GoHighLevel sub-account is operational metadata, not proof of the site's legal operator, DBA, data controller, or merchant of record. No public LLC claim or authority work may proceed until the owner confirms the legal name, DBA status, domain ownership, data controller, and permitted use of Pruitt references.

## Checkpoint calendar

| Date | Checkpoint | Permitted decision |
|---|---|---|
| September 2, 2026 | Technical | Inspect five priority URLs, sitemap state, Google/user canonical agreement, crawl/indexing state, public route health, and attribution operations. No SEO performance edits. |
| September 9, 2026 | Technical | Repeat technical inspection and reconcile any non-QA delivery or GHL incident. No SEO performance edits. |
| September 23, 2026 | Preliminary | Descriptive GSC and GHL readout only. Do not infer a completed post period. |
| September 26, 2026 or later | Final-data pull | Pull the August 27–September 23 post window with `dataState=final`. |
| September 30, 2026 | First eligible 28-day decision | Evaluate the fixed pre/post experiment if sample, position, and technical gates pass. |
| October 25, 2026 | Day 60 | Review path × cluster outcomes and only begin cannibalization analysis when 56 final days exist. |
| November 24, 2026 | Day 90 | Expand clusters that gained qualified visibility or business outcomes; do not expand from impressions alone. |
| February 22, 2027 or later | Earliest 180-day attribution review | Earliest date a clean-attribution long-horizon claim can be evaluated. This is not a promised win date. |

## GSC experiment and privacy contract

- Exclude August 26 as a washout day.
- Pre window: July 29–August 25, 2026.
- Post window: August 27–September 23, 2026.
- GSC source dates use `America/Los_Angeles`. Do not claim an Eastern-time daily join.
- Join only at period or week × normalized landing path × fixed cluster. Never join a person or GHL contact to a search query.
- Report total property metrics separately from visible-query coverage. Within visible queries, report owned brand, partner brand, competitor brand, visible known non-brand, and residual/unclassified. Anonymous-query totals make an exact non-brand property total impossible.
- Freeze brand dictionary `v1-2026-08-26`: owned = DMV Title Guy, dmvtitleguy, Will Rapuano, William Rapuano and normalized variants; partner = Pruitt Title variants; competitor = Federal Title and FederalTitle variants.
- Raw query exports stay in ignored `private-seo/`. Committed artifacts contain aggregates plus hashes and request manifests, not query text.

The first title/meta CTR decision requires complete 28-day pre and post windows, at least 4,500 impressions in each window (or a documented page-specific power analysis), at least 20 clicks in each window, average position stable within 2 positions, and all technical gates green. Otherwise report the result as underpowered and make no CTR-driven edit.

## SpyFu competitive contract

- Preserve the August 26 v1 scorecard. Normalized monthly captures use `docs/seo-scorecards/monthly/YYYY-MM.json` and reject duplicate data months unless a documented capture defect requires `--force`.
- Compare identical US requests for both domains. The chosen endpoints do not expose a device parameter, so no device claim is allowed.
- Keep full-domain scale separate from the fixed v1 universe.
- Full-domain test: DMV Title Guy must lead Federal Title's estimated monthly organic clicks by at least 10%.
- Fixed-universe tests: weighted reciprocal rank, weighted top-three share, weighted page-one share, unweighted keyword wins, and leadership in at least three of five fixed clusters.
- “Surpassed” requires every current test to pass for three consecutive distinct SpyFu data months, plus green release/attribution gates and non-declining trailing-90-day GSC and qualified-opportunity outcomes. Report exact gaps until then.
- National SpyFu and GSC data are not a true local rank grid. Treat jurisdiction pages, jurisdiction-modified queries, and jurisdiction-tagged qualified opportunities as hyperlocal proxies unless a separately approved local-grid system is established.

## Qualification and outcome contract

A human must triage each non-QA transaction-intent opportunity within two business days. Use one primary reason:

- `qualified-dmv-transaction`
- `missing-property-or-jurisdiction`
- `insufficient-contact-information`
- `education-only-or-nontransaction`
- `newsletter-only`
- `advertising-only`
- `out-of-area`
- `duplicate`
- `spam`
- `test`

Report Submitted → Qualified → Referred → Accepted → Closed/Won. Exclude `SEO QA Excluded = true` and ledger `isQa = true` from every volume, rate, value, and loss calculation. Until a cohort has at least 20 non-QA opportunities, report counts without conversion-rate conclusions. Cohort outcomes are reviewed at day 30, 60, and 90; mutable outcomes never rewrite acquisition fields.

## Cannibalization decision rule

Do not consolidate before 56 final days. A candidate pair must share a manually reviewed intent, each have at least 200 visible impressions, the secondary URL must hold at least 20% of shared impressions, URL leadership must alternate in at least three weeks, both URLs must rank in the top 20, and their visible-query-set Jaccard similarity must be at least 0.40. Consolidate only when the winner has at least twice the visibility and the other URL has no distinct conversion or backlink value.

## Incident thresholds

Treat these as P0/P1 incidents, not SEO experiments:

- any non-QA webhook delivery in `unknown`;
- `sending` older than five minutes;
- delivered transaction-intent GHL sync pending over ten minutes or in error;
- a confirmed-delivered non-QA transaction missing its ledger-linked opportunity, a contact UUID mismatch, or a newest submission whose reused GHL card does not expose that exact submission ID;
- any priority URL returning non-200, `noindex`, a wrong canonical, or missing from the sitemap;
- sitemap errors or warnings;
- an unexpected `www` or HTTP alias response.

The recovery worker may retry only the idempotent GHL opportunity sync after confirmed webhook delivery. It must never replay an ambiguous webhook.

## Retention

- Encrypted GHL opportunity outbox: maximum 14 days; expiration creates an append-only manual-reconciliation event and deletes the encrypted payload.
- Pseudonymous acquisition ledger and append-only event hashes: 24 months, then retain aggregate reporting and remove row-level identifiers unless an active transaction, dispute, or legal hold requires longer.
- GHL contact/opportunity PII: review for deletion or anonymization 24 months after the last meaningful activity unless an active transaction, legal obligation, documented consent, or legal hold applies.
- Controlled QA: keep the single reserved DND QA contact and explicit QA tag/field; remove obsolete QA opportunities after 30 days once reconciliation evidence is preserved.
- Raw GSC query exports: private, access-limited, and retained 13 months for year-over-year analysis, then deleted. Committed aggregates and hashes may remain.

No destructive retention action is automated by this release. The owner must approve the first deletion run after confirming legal and operational retention requirements.

## Authority permission matrix

| Surface/action | Current permission state | Required evidence before action |
|---|---|---|
| DMV Title Guy website content | Will-controlled | Entity-truth and release gates green. |
| Will-controlled LinkedIn or social profile | Frozen | Owner confirms operator/DBA language and approves exact profile copy. |
| Pruitt website, GBP, directory, social, logo, testimonials, awards, volume or licensing claims | Blocked | Written authorization from the appropriate Pruitt owner plus source evidence. |
| Association, CE instructor, brokerage-resource, podcast, or partner outreach as DMV Title Guy | Frozen | Operator identity confirmed, exact sender identity approved, relationship basis documented, no compensation or reciprocal-link scheme. |
| Directory/GBP creation at a Pruitt address | Prohibited without authorization | Written location/brand authorization and compliance review; never infer permission from employment or a GHL label. |

No external outreach, profile edit, directory edit, or Pruitt-controlled change is authorized by this contract.
