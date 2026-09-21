# DMV Title Guy local-search measurement — 2026-08-27

## Current lane status

| Lane | State | What that means |
|---|---|---|
| August 27 discovery evidence | Active, protocol-invalid | The private screenshot and canonical metadata are preserved, but the missing query, geo, session, timestamp, and stable profile ID mean it is not a controlled rank. |
| Controlled Local Pack | Configured, no baseline | Six hypothesis-v1 queries, three frozen geo anchors, 12 required weekly pack samples, surface-specific rules, a resolved public Place ID, and a checkpoint reporter exist. The first complete controlled batch has not been collected. |
| Local Finder | Configured, conditional | A 20-result Finder observation is run only when the target is absent from the three-result Local Pack. Finder ordinals never mix with pack positions. |
| GBP Performance | Blocked | OAuth returned `invalid_grant`, the project last had zero quota, and no account/location ID is known. API automation remains off. |
| Native GA4 ↔ GBP link | Prepared, not linked | Requires explicit data-sharing authorization plus GA4 Editor/Admin and GBP Owner/Manager access. Linked-profile limits make it supplemental rather than the profile-specific source of truth. |
| GBP website UTM | Production-active classifier; profile URL not applied | Deployment `dpl_DbUekSDJARApNk6WXH6e6CqDYCUJ` and communication-suppressed browser QA `b10aab80-e44b-4063-b155-abe60be30d2b` proved the exact tuple through first-touch storage, server classification, Turso, and GHL. Profile-edit authority is still required before changing the public listing URL. |
| Answered calls and SMS | Not attributed | A GBP call click is not an answered call. Message availability is profile/product-dependent. Actual outcomes require an authorized phone/SMS/CRM source. |

Local search therefore has three separate measurement layers:

1. **Controlled visibility:** human observations under the frozen Local Pack or Local Finder protocol.
2. **Profile interactions:** authorized Google-managed Search/Maps impression and action diagnostics.
3. **Business outcomes:** UTM-attributed website sessions and qualified GHL opportunities.

GBP impressions, website-button clicks, call-button clicks, and direction requests stay separate from GSC CTR. Never add them to GSC clicks or impressions and never calculate a combined CTR.

## August 27 discovery evidence

The user-supplied mobile screenshot is preserved on the originating measurement host at `private-seo/local-search/evidence/2026-08-27-user-mobile-screenshot.jpg`. The committed record contains observable facts, a recorder-verified manifest, a canonical metadata hash, and explicit interpretation limits.

What it supports: **“Will Rapuano, Pruitt Title” was the third listing visible in the captured sequence and appeared immediately above “Pruitt Title LLC.”**

What it does not support: a controlled rank, a market-wide rank, an exact-query rank, an ownership/control claim, or a week-over-week comparison. The screenshot was received on August 27 and displays 18:19, but it does not establish the capture date, time zone, query, searcher location, browser session, locale, applied-filter state, or scan start. Its after-hours context is also confounded: the target displays “Open 24 hours” while other visible listings display “Closed.”

`Pruitt Title LLC` is recorded as an employer/company-related profile, not treated as an ordinary competitor.

## Controlled observation protocol

The primary series runs Wednesdays from 9:00–11:00 a.m. America/New_York during business hours. The config freezes:

- six hypothesis-v1 nonbrand local-commercial queries;
- three U.S. Census Geocoder address anchors at Tysons, the Vienna Community Center, and Fairfax City Hall, each with a ±0.001-degree tolerance;
- one Chrome mobile profile at 390×844;
- a query × eligible-cell matrix containing 12 required Local Pack observations;
- Local Pack depth 3 and separate Local Finder depth 20 contracts.

Every protocol-valid observation must:

1. Match the target's frozen Google Place ID `ChIJlS-QUdNLtokRYYLhJ7JGdyc`. Name/address alone is not sufficient.
2. Use a fresh private Chrome session, signed out of Google, for each query.
3. Pin the configured coordinate, capture proof that location emulation was active, and record the exact rounded coordinate.
4. Use the exact query ID/text, device profile, locale, business-hours daypart, surface, and scan depth.
5. Confirm no filters were applied and the scan began at the first result. Record sponsored rows separately.
6. Record the target's open/closed state. After-hours evidence is context-only and protocol-invalid until a separately versioned diagnostic contract exists.
7. Capture the full three-result pack sequence. If the target is absent, optionally capture all 20 Finder entries with a multi-image evidence bundle.
8. Preserve every evidence file under the ignored private directory. The recorder uses content-addressed filenames, mode `0600` files, mode `0700` directories, a manifest hash, and exclusive writes. Corrections require a new observation ID.

The recorder accepts only a private input and one or more private screenshots:

```bash
npm run record:local-search -- \
  --input private-seo/local-search/next-observation.json \
  --evidence private-seo/local-search/inbox/pack.png
```

Repeat `--evidence` for a Finder bundle. The recorder performs no Google scraping and no profile mutation. It reports `protocolValid` and a comparison key; “protocol-valid” means the row passed collection rules, not that an improvement exists. Compare only records with identical keys.

Generate a checkpoint preview with:

```bash
npm run report:local-search -- --batch 2026-W36
```

After all 12 samples pass the preview, persist the canonical checkpoint exactly once with:

```bash
npm run report:local-search -- --batch 2026-W36 --write
```

`--write` accepts only a complete batch, publishes it atomically at `docs/local-search-checkpoints/batches/2026-W36.json`, and rejects overwrites. Checkpoint files are immutable; correct a source observation with a new observation ID and a later batch rather than rewriting history. The next week's report consumes these canonical saved checkpoints when evaluating consecutive like-for-like history.

A complete primary batch requires all 12 pack samples. Missing, invalid, or duplicate samples block a decision. Two consecutive complete batches establish direction; four complete like-for-like batches are required before an optimization decision, except for disappearance, identity, eligibility, legal, security, or authorization incidents. The report exposes pack top-three inclusion and positions without combining Pack, Finder, Maps, GSC, or GBP metrics.

## GBP interaction measurement

Google's Performance API can expose Search/Maps impressions, website clicks, call clicks, direction requests, bookings, and profile-dependent actions. It does not expose local-pack rank, searcher coordinates, completed calls, answered calls, leads, or transaction outcomes. `CALL_CLICKS` means call-button clicks; `WEBSITE_CLICKS` means profile website-button clicks; direction requests are adjusted requests rather than office visits. The API schema still documents `BUSINESS_CONVERSATIONS`, and Google's GA4 link can report Messages, so availability must be probed after an authorized connection rather than declared universally present or absent.

Google limits GBP API-provided Content by both purpose and time. The default here is in-memory/no storage. A limited secure cache is allowed only to improve the API project's performance, never as a reporting warehouse, and must be deleted within 30 days. The Content may not be manipulated or aggregated. Consequently this implementation does not fetch GBP API Content, build a permanent GBP warehouse, or add API Content to committed scorecards. Google-managed GA4 reporting is the preferred route for any Google-managed aggregation.

Current access evidence:

- Existing OAuth attempts recorded `invalid_grant` on August 26; reauthorization is likely required, but that response alone does not prove whether the token was revoked or expired.
- The known Cloud project returned zero quota when last probed on July 7.
- The public target Place ID is resolved read-only. The private GBP account ID and location ID remain unknown.
- The working GSC service account is Search Console-only and cannot substitute for GBP OAuth.

Google's native **GA4 Admin → Product links → Google Business Profile links** flow requires a GA4 Editor/Administrator and a GBP Owner/Manager. It also requires explicit authority to share the Pruitt-associated profile's data. Google currently limits the link to six months of profile history; multiple linked profiles are summed; and the GBP data cannot be filtered, compared, or used in custom explorations. It is supplemental to the precise UTM → site → GHL outcome lane.

Official references: [GBP prerequisites](https://developers.google.com/my-business/content/prereqs), [Performance metrics](https://developers.google.com/my-business/reference/performance/rest/v1/DailyMetric), [Performance endpoint](https://developers.google.com/my-business/reference/performance/rest/v1/locations/fetchMultiDailyMetricsTimeSeries), [GBP API policies](https://developers.google.com/my-business/content/policies), and [GA4 Business Profile linking](https://support.google.com/analytics/answer/16930347?hl=en).

## Eligibility and authority gate

The screenshot shows a profile named “Will Rapuano, Pruitt Title” beside “Pruitt Title LLC” at the same address, with the practitioner-style listing labeled open 24 hours. That is not proof of a policy violation, but it is a blocking review item before any optimization, URL edit, or data-sharing link.

Confirm and document separately:

- `profileReadAuthorized` — Will is an Owner/Manager and may read the profile's data;
- `dataSharingLinkAuthorized` — the appropriate business owner expressly permits the GA4 link;
- `profileEditAuthorized` — the appropriate business owner expressly permits the website/hours/name change;
- practitioner eligibility — Will is public-facing and directly contactable at the verified location during the stated hours;
- real-world name, location/signage eligibility, hours accuracy, and the lead-generation-agent prohibition.

Owner/Manager access alone does not satisfy the data-sharing or edit gates. Because the profile uses Pruitt's name and address, written Pruitt-owner authorization is required where applicable. See Google's [representation guidelines](https://support.google.com/business/answer/3038177) and [Business Profile eligibility](https://support.google.com/business/answer/13763036).

## Website and lead attribution

The prepared profile website destination is:

```text
https://dmvtitleguy.io/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=profile-website-button
```

The code accepts only the exact normalized tuple `google / organic / gbp / profile-website-button` as `google-business-profile`. Bing, Yahoo, DuckDuckGo, paid traffic, or a different content marker cannot enter that channel. The channel remains separate from ordinary `organic-search` in the existing ledger and GHL `Attribution Channel` field.

The classifier is production-active. On August 27, deployment `dpl_DbUekSDJARApNk6WXH6e6CqDYCUJ` passed a communication-suppressed 390×844 browser submission through first-touch capture → server classification → Turso → GHL as `google-business-profile`. The reserved contact remained globally DND and tagged no-contact; the QA-excluded opportunity was restored to Lost and the ledger row marked `test`. The public profile URL remains unchanged until the eligibility, Pruitt authorization, data-sharing, and edit gates are satisfied.

Actual answered calls and qualified leads must come from phone/CRM and GHL outcome records. An unattributed phone conversation must not be labeled organic or GBP merely because the caller says “Google.”
