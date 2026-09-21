# DMVTitleGuy Search Console reconciliation — 2026-07-31

> **Historical only.** On August 25, 2026, the proposed `.com` migration was cancelled. `dmvtitleguy.io` remains canonical and is the verified Search Console property. Do not use this note to switch canonical URLs to `.com`.

This is a read-only pre-cutover inventory. No Search Console property, sitemap, DNS record, deployment, or production setting was changed.

## Verified state

- Property access: `sc-domain:dmvtitleguy.io` as owner. No `dmvtitleguy.com` property is visible to the current service account.
- Reporting window: 2025-07-29 through 2026-07-28.
- Site totals: 120 clicks, 20,630 impressions, 0.58% CTR, and average position 21.80.
- Full page-dimension pull: 203 URL rows, normalized to 193 unique paths across protocol and `www` variants.
- Reconciliation result: 193 of 193 paths now resolve locally either directly to a final `200` page or through one permanent redirect to a final `200` page.
- Sitemap inventory in the verified build: 155 canonical `.com` URLs.

The one missing URL found by the full pull was `/blog/title-search-process-explained` (0 clicks, 14 impressions). It now maps to `/blog/what-does-a-title-company-do`, whose article explicitly covers the title search process.

## Top 20 Search Console page rows

Rows are retained separately where Search Console reported different host or protocol variants.

| Path | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `/` | 23 | 1,774 | 1.30% | 11.02 |
| `/` | 17 | 1,683 | 1.01% | 4.53 |
| `/maryland-closing-cost-calculator` | 16 | 2,989 | 0.54% | 39.17 |
| `/` | 8 | 251 | 3.19% | 7.27 |
| `/blog/title-insurance-cost-virginia` | 3 | 84 | 3.57% | 20.64 |
| `/blog/virginia-residential-sales-contract` | 3 | 49 | 6.12% | 8.31 |
| `/blog/who-chooses-the-title-company-in-virginia` | 3 | 163 | 1.84% | 5.79 |
| `/title-company-herndon-va` | 3 | 1,950 | 0.15% | 8.32 |
| `/blog/enhanced-title-insurance-vs-standard` | 2 | 30 | 6.67% | 10.30 |
| `/blog/how-to-read-a-title-commitment` | 2 | 5 | 40.00% | 12.80 |
| `/blog/title-insurance-cost-virginia-maryland` | 2 | 712 | 0.28% | 37.79 |
| `/calculators/title-quote` | 2 | 171 | 1.17% | 27.43 |
| `/closing-costs-ashburn-va` | 2 | 21 | 9.52% | 10.29 |
| `/contact` | 2 | 43 | 4.65% | 6.95 |
| `/title-company-germantown-md` | 2 | 33 | 6.06% | 22.67 |
| `/title-company-laurel-md` | 2 | 141 | 1.42% | 20.94 |
| `/title-company-silver-spring-md` | 2 | 553 | 0.36% | 23.18 |
| `/title-company-stafford-va` | 2 | 249 | 0.80% | 16.12 |
| `/privacy-policy` | 2 | 55 | 3.64% | 7.47 |
| `/my-blog` | 1 | 16 | 6.25% | 6.56 |

## Remaining cutover gates

- Create and verify the `.com` Domain property after domain control is available.
- Record the current indexed-page count from the Search Console UI; it is not returned by the Search Analytics API.
- Submit the `.com` sitemap and Change of Address only after the verified deployment is promoted and public redirects pass.
