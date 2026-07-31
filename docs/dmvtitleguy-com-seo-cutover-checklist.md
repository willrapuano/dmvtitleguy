# DMVTitleGuy.com SEO cutover checklist

This checklist is the operational companion to `dmvtitleguy-com-domain-migration.md`.
It prepares the move without making Search Console, analytics, DNS, or production changes early.

## Before DNS access is restored

- [x] Use `https://dmvtitleguy.com` in canonical tags, structured data, robots, sitemap, and share URLs.
- [x] Preserve paths and query strings from `.io` to `.com`.
- [x] Map the substantive WordPress page `/looking-to-grow-your-business/` to `/title-company-for-realtors`.
- [x] Leave placeholder WordPress pages as honest 404s rather than redirecting them to unrelated content.
- [x] Consolidate site navigation and article breadcrumbs on `/blog` rather than `/my-blog`.
- [x] Verify the migration build on a Vercel preview.
- [ ] Confirm access to both the `.io` and `.com` Google Search Console properties.
- [ ] Export the `.io` Performance report for the last 3 and 12 months: queries, pages, countries, and devices.
- [ ] Record the current indexed-page count, top 20 landing pages, clicks, impressions, CTR, and average position.
- [ ] Record the production deployment ID immediately before promotion for one-click rollback.

## Cutover sequence

1. Replace only the `.com` web records at GoDaddy with the Vercel values in the migration runbook.
2. Confirm public DNS for apex and `www` reaches Vercel from at least two resolvers.
3. Confirm the existing production release still sends `.com` visitors safely to `.io` during propagation.
4. Promote the verified migration deployment.
5. Run `CHECK_LEGACY_REDIRECTS=1 npm run verify:migration`.
6. Manually test the homepage, blog, one article, quote calculator, contact page, realtor page, phone link, and a real form submission.
7. Verify analytics records page views on `.com` and does not create a new duplicate property unless intentionally configured.

## Search Console actions after verification

- [ ] Verify ownership of the `.com` Domain property.
- [ ] Submit `https://dmvtitleguy.com/sitemap.xml`.
- [ ] Inspect the `.com` homepage, `/blog`, and the five highest-click `.io` pages; request indexing only after each returns the correct canonical.
- [ ] Use Change of Address in the `.io` property and select `.com`.
- [ ] Keep the `.io` property and sitemap history available for monitoring; do not remove the old property.
- [ ] Annotate the migration date and deployment ID in the analytics/SEO log.

## Monitoring cadence

| Window | Checks | Escalation threshold |
| --- | --- | --- |
| First hour | DNS, TLS, homepage/blog/article status, forms, phone links, redirects | Any 5xx, redirect loop, wrong canonical, or failed lead delivery |
| First 72 hours | Search Console indexing, crawl errors, sitemap processing, analytics traffic | More than 5% of sampled old URLs fail to reach their matching `.com` path |
| Weeks 1–2 | Clicks, impressions, indexed pages, top landing pages, Core Web Vitals | More than 25% organic-click decline for 7 consecutive days without a seasonal explanation |
| Weeks 3–6 | Query/page recovery, excluded URLs, `.io` crawl activity | High-value `.io` URLs still indexed without redirects or `.com` canonicals rejected |

## Rollback triggers

Rollback the Vercel release immediately for redirect loops, widespread 5xx errors, missing pages, broken lead delivery, or incorrect canonicals. DNS can remain on Vercel while the prior production release restores the safe `.com` to `.io` behavior.

Do not roll back solely for normal DNS propagation variance or short-lived ranking volatility. Preserve redirects for at least one year and preferably indefinitely.
