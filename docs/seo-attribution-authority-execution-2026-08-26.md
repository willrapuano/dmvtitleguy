# SEO attribution and authority execution — 2026-08-26

## Goal and decision rule

Make organic-search work measurable as qualified transaction opportunities while building authority without implying control of Pruitt Title, manufacturing a local entity, or sending unapproved outreach. A form submission is not a title order. The primary SEO outcome is a transaction-intent, qualified lead that progresses in GoHighLevel (GHL); traffic, rankings, and raw form counts are diagnostic measures.

## Independent adversarial review result

Three independent reviewers evaluated the plan from technical delivery, SEO measurement, and entity/authority perspectives. Their combined release order is:

1. Protect durable lead intake and prevent duplicate delivery.
2. Capture privacy-minimized, path-only attribution and preserve first touch as write-once.
3. Correct the public relationship among Will Rapuano, DMV Title Guy, and Pruitt Title before authority outreach.
4. Prove the production GHL mapping with a controlled, communication-suppressed test before promotion.
5. Pursue broken-link reclamation and Will-controlled profiles before speculative local directories or new content.

## Execution status

| Control | Status | Evidence / next action |
|---|---|---|
| Durable lead-rate and idempotency tables | Complete | Production Turso contains `LeadRateLimitBucket` and `LeadSubmission`; the migration and verification scripts are in `scripts/`. |
| Unique production protection secret | Complete | A new sensitive Production-only `LEAD_PROTECTION_SECRET` is configured in Vercel. |
| Path-only, 90-day attribution | Complete in candidate | Client and server discard URL queries and fragments; legacy v1 storage is removed; first touch expires after 90 days. |
| First touch + last non-direct context | Complete in candidate | All six public forms send sanitized first-touch, conversion-path, and last-non-direct fields. |
| Ambiguous-delivery idempotency | Complete in candidate | Once a webhook request is attempted, a timeout/non-2xx result does not reopen that submission ID for retry. |
| Relationship and routing disclosure | Complete in candidate | Public copy no longer implies automatic Pruitt acceptance or “independent” guidance; each form has a purpose-specific near-submit notice. |
| Production GHL webhook | **Blocking** | `GHL_WEBHOOK_URL` exists only for Preview. Obtain the authoritative URL from the controlled production GHL workflow; do not copy Preview blindly. |
| GHL custom fields and workflow mapping | **Blocking** | Requires access to the intended GHL sub-account/workflow and confirmation of write-once behavior. |
| Communication-suppressed synthetic test | **Blocking** | Requires a controlled QA contact, do-not-disturb/suppression rules, and CRM-owner confirmation. No test lead has been sent. |
| External authority changes/outreach | Prepared, unsent | The safe queue and draft below require control confirmation or send approval. |

The Production build now fails closed if the production webhook, protection secret, or durable database configuration is missing. Because the production GHL URL is not yet authoritative, the candidate must not be promoted to Production.

## GHL data contract

Create/map these as separate concerns. Do not overwrite the contact’s original acquisition source every time the person converts.

### Contact-level, write-once acquisition fields

| GHL field | Incoming property |
|---|---|
| `seo_first_landing_path` | `firstLandingPage` |
| `seo_first_referrer_host` | `firstReferrerHost` |
| `seo_first_touch_at` | `firstTouchAt` |
| `seo_first_utm_source` | `utmSource` |
| `seo_first_utm_medium` | `utmMedium` |
| `seo_first_utm_campaign` | `utmCampaign` |
| `seo_first_utm_term` | `utmTerm` |
| `seo_first_utm_content` | `utmContent` |
| `seo_first_channel` | `firstChannel` |
| `seo_attribution_version` | `attributionVersion` |

Workflow rule: populate these only when `seo_first_touch_at` is empty. Never replace a known first touch with a later direct visit.

### Submission/opportunity conversion fields

| GHL field | Incoming property |
|---|---|
| `web_submission_id` | `submissionId` |
| `web_form_type` | `formType` or webhook `source` |
| `web_conversion_path` | `conversionPage` |
| `web_server_landing_path` | `serverLandingPage` |
| `web_last_non_direct_referrer_host` | `lastNonDirectReferrerHost` |
| `web_last_non_direct_touch_at` | `lastNonDirectTouchAt` |
| `web_last_utm_source` | `lastUtmSource` |
| `web_last_utm_medium` | `lastUtmMedium` |
| `web_last_utm_campaign` | `lastUtmCampaign` |
| `web_last_utm_term` | `lastUtmTerm` |
| `web_last_utm_content` | `lastUtmContent` |
| `web_attribution_complete` | `attributionComplete` |
| `web_attribution_confidence` | `attributionConfidence` |
| `web_deployment_environment` | `deploymentEnvironment` |
| `web_jurisdiction` | `jurisdiction` when present |
| `web_transaction_type` | `transactionType` when present |
| `web_contact_role` | `role` when present |

`web_submission_id` must be unique/idempotent in the workflow. Keep a submission or opportunity record per meaningful conversion rather than flattening conversion history into the contact’s first-touch fields.

Add outcome fields controlled by the sales process: qualified/unqualified reason, opportunity created date, pipeline stage, accepted transaction, closed transaction, revenue/commission value, and lost reason. Report the primary KPI as qualified transaction-intent leads by organic first-landing page. Report closed outcomes only after the GHL opportunity data exists.

Phone calls, direct emails, and third-party funnels remain a known attribution gap until their systems can carry a landing-page/session token or use dedicated tracking numbers. Do not merge unattributed calls into “organic” merely because a person mentions Google.

## Safe production test protocol

1. The GHL owner creates or identifies the production inbound-webhook workflow and maps the fields above.
2. Create a controlled QA contact/address. Use no real prospect data and no phone number.
3. Apply do-not-disturb and suppress email, SMS, dialer, assignment notifications, nurture, opportunity automation, and partner/referral actions for the QA identity.
4. Confirm the workflow deduplicates on `web_submission_id` and preserves existing contact first-touch values.
5. Add the authoritative webhook URL to Vercel Production as a sensitive value and create a new deployment.
6. Submit one transaction-form test from a marked test session. Do not click submit twice or mint a new ID after a timeout.
7. Reconcile exactly one browser submission ID, one server request, one GHL contact/update, one submission/opportunity event, and zero outbound communications.
8. Repeat the same submission ID once. It must not create a second CRM event. Then test a later conversion with a new submission ID and confirm the original contact first-touch fields remain unchanged.
9. Remove or permanently suppress the QA record and record the test timestamp, workflow version, screenshots/log references, and reviewer.

## Permission-safe authority queue

| Priority | Opportunity | Evidence and target | Status / boundary |
|---:|---|---|---|
| 1 | Weekand/Hearst broken reference | Its [Types of Property Lines](https://www.weekand.com/home-garden/article/types-property-lines-18056172.php) article still references Federal’s dead legacy survey URL. Suggest the DMV-local [property survey guide](https://dmvtitleguy.io/blog/types-of-property-surveys-dc-md-va) as one possible replacement. | Ready for approval; unsent. Editorial decision only—no reciprocal link, payment, ranking claim, or demand to replace Federal. |
| 2 | Will’s LinkedIn profile | [Current profile](https://www.linkedin.com/in/will-rapuano-86914b130); exact Pruitt title is corroborated by [Pruitt’s team page](https://pruitt-title.com/meet-the-team/). | Confirm Will controls it, then update the bio/featured link. Do not edit Pruitt’s company page. |
| 3 | DMV Title Guy YouTube | [Channel](https://www.youtube.com/@dmvtitleguy). | Confirm control, then align the About link and disclosure. |
| 4 | DMV Title Guy Instagram and Facebook | [Instagram](https://www.instagram.com/dmvtitleguy) and [Facebook](https://www.facebook.com/profile.php?id=61556322698901). | Confirm control, then align bios/link destination. Do not add a Pruitt logo without written approval. |
| 5 | Eventbrite organizer | [Organizer page](https://www.eventbrite.com/o/46375500903) currently presents Will in a Pruitt context. | Control and Pruitt-communication boundary are unconfirmed; hold unless both are resolved. |

Rejected/held for now: a DMV Title Guy Google Business Profile at a Pruitt or virtual address; standalone Herndon/Vienna/chamber listings without location, membership, and entity eligibility; any Pruitt-controlled profile; paid, swapped, automated, or incentivized links. These create suspension, entity-confusion, or permission risk rather than durable authority.

### Unsent Weekand editorial note

Subject: Broken survey reference in “Types of Property Lines”

> Hello — your “Types of Property Lines” article currently links to Federal Title’s old `/understanding-4-types-of-property-surveys/` URL, which returns 404. I publish a DMV-focused guide covering boundary, location-drawing, improvement, and ALTA/NSPS survey distinctions at `https://dmvtitleguy.io/blog/types-of-property-surveys-dc-md-va`. If it meets your editorial standards, it may be a useful replacement or additional reference. I’m Will Rapuano, Marketing and Business Development Officer at Pruitt Title; DMV Title Guy is my separate personal educational and business-development website. No compensation or reciprocal link is requested.

This draft is prepared only. Sending it is an external communication and requires Will’s approval at action time.

### Suggested Will-controlled profile description

> Will Rapuano | DMV Title Guy. Practical DC, Maryland, and Virginia title and closing education. Marketing and Business Development Officer at Pruitt Title LLC. DMV Title Guy is my personal website, separate from Pruitt’s corporate site. Eligible transaction requests may be referred to Pruitt for its independent review.

Use only where Will confirms personal control. Do not describe DMV Title Guy as a title agency, settlement provider, Pruitt branch, or independent title adviser.

## Authority cadence after launch

- Week 1: align confirmed Will-controlled profiles and, with explicit approval, send the single broken-reference note.
- Weeks 2–4: document replies and acquired URLs; make no automated follow-ups. One concise follow-up is the maximum unless the editor engages.
- Monthly: identify at most five genuinely relevant resource pages, association/instructor pages, interviews, or partner education opportunities; verify eligibility and permission before drafting.
- Day 30/60/90: join acquired referring URLs and GSC landing-page performance to qualified GHL outcomes. Continue only sources and resources that produce relevant visibility or qualified conversations.

No authority outreach, public-profile edit, directory submission, or Pruitt-controlled change was performed during this execution.

## Verification record

- `npm run verify:release` passed on August 26, 2026: lint, TypeScript, dependency audit, build, lead-security checks, canonical/redirect checks, sitemap completeness, 137-route blog rendering, social metadata, entity identity, competitive content, internal-link crawl, and CMS resilience.
- Production Turso was reached directly and both lead-protection tables were verified after migration.
- The Production environment gate was exercised without `GHL_WEBHOOK_URL` and failed closed as designed.
- Candidate deployment `dpl_JByXSt8VXkCzUGA86ZZzq1ekefrR` is READY at `https://dmvtitleguy-f1pc7vhpf-will-rapuanos-projects.vercel.app`.
- The deployed candidate returned HTTP 200 with `x-robots-tag: noindex`; its homepage rendered the approved canonical relationship disclosure and `/contact` rendered the Pruitt acceptance boundary.
- No lead form was submitted and no production promotion occurred because the production GHL workflow remains unverified.

## Final access audit

The August 26 continuation audited the available integration surfaces without resolving or printing any credential values:

- OpenClaw’s active environment contains the SpyFu subscription variables used for competitive research.
- Its only named GHL API key/location pair is for an unrelated `CHAD` account; no DMV Title Guy or Pruitt GHL key, location ID, or webhook is configured.
- The macOS Keychain exposes no service/account label identifying a GHL, HighLevel, or DMV Title Guy credential.
- Vercel still exposes `GHL_WEBHOOK_URL` only as an opaque Preview secret. Sensitive values cannot be pulled, inspected, or safely copied to Production through the current access path.
- No callable Codex/OpenClaw connector is registered for GHL or HighLevel.

Accordingly, the remaining production mapping and test cannot be completed without one external-state change: provide the authoritative inbound-workflow URL for the intended GHL sub-account (or connect that sub-account through an available tool). The unrelated account and the unidentifiable Preview secret must not be used as substitutes.
