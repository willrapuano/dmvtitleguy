# DMV Title Guy conversion-path audit — 2026-07-31

## Scope

Homepage, blog index, representative article, contact page, title-quote calculator, realtor landing page, newsletter subscription, listing advertising form, phone links, and the external Pruitt Title quote destination.

## Verified and corrected

| Path | Result |
| --- | --- |
| Global **Get a Quote** | Resolves to `/calculators/title-quote` with HTTP 200 |
| Contact-page form | Now posts through `/api/leads`; success appears only after confirmed webhook delivery |
| Blog sidebar quote form | Uses the same verified server route and retains article-level source attribution |
| Realtor landing-page form | Uses the verified server route through the shared form component |
| Newsletter form | Moved from a public client-side webhook to `/api/leads` |
| Advertising form | Moved from a public client-side webhook to `/api/leads` |
| External title quote | `https://pruitt-title.titlecapture.com/title-quote` returns HTTP 200 |
| Blog navigation | Points directly to `/blog`, eliminating the `/my-blog` alias hop |
| Article construction-finance link | Broken `/construction-loan-title-insurance` destination mapped to `/title-company-for-builders` |

The selected-page crawl checked 94 internal destinations. The only failure was the construction-finance link above; it is corrected in this branch. A post-fix crawl checked 93 unique internal destinations with zero failures.

## Delivery safeguards added

- Webhook delivery now accepts only the server-side `GHL_WEBHOOK_URL`; the legacy public fallback was removed and must be rotated if it ever contained a real URL.
- Public lead endpoints require same-origin JSON, enforce bounded request bodies, derive landing-page attribution server-side, apply durable IP and IP-plus-email rate limits, and use leased durable submission IDs to prevent duplicate delivery.
- Successful submissions emit a GA `generate_lead` event without including personal information.
- Missing webhook configuration now produces an honest error instead of a simulated success.
- API payloads are allow-listed, trimmed, length-limited, and validated for form type, name, email, and listing requirements.
- Quote, newsletter, and advertising forms include a honeypot field and accessible error messaging.
- Shared quote forms use location-derived field IDs, preventing duplicate IDs when a page renders more than one form.
- Public funnel document uploads are disabled for this release. Intake forms no longer accept document URLs and instead arrange secure staff follow-up; re-enabling uploads requires private storage and authenticated retrieval.

## Pre-production requirement

Rotate the prior webhook if necessary, configure `GHL_WEBHOOK_URL` and `LEAD_PROTECTION_SECRET` for Preview and Production, and apply the lead-protection Prisma migration. Then make one owner-approved test submission in each environment and confirm the lead appears in GoHighLevel with the correct server-derived source and landing page. Do not promote if the UI reports success but the lead cannot be found downstream.

## Owner decision still required

Two phone destinations remain in source:

- `(703) 859-1467` on 27 primary contact and funnel links.
- `(571) 474-4000` on 8 city/county landing-page CTA links.

Pruitt Title's official site lists its main office as `(703) 462-9931`, but does not establish which direct DMV Title Guy number should be canonical. No phone numbers were rewritten without owner confirmation.
