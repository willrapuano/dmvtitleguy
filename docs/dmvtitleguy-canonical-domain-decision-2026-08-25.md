# DMV Title Guy canonical-domain decision — 2026-08-25

## Decision

`https://dmvtitleguy.io` is the sole canonical production and ranking origin.

## Evidence

- `https://dmvtitleguy.io/` returned HTTP 200 from the current Vercel deployment.
- `https://www.dmvtitleguy.io/` permanently redirected to the `.io` apex.
- `https://dmvtitleguy.com/` redirected to `https://dmvtitleguy.wordpress.com/`, outside this deployment.
- SpyFu Domain Stats returned an established `.io` history, growing from one organic result in November 2025 to 128 organic results and 39 estimated monthly clicks in July 2026.
- SpyFu returned no domain-stat history for `dmvtitleguy.com`.
- The available Google Search Console property is `sc-domain:dmvtitleguy.io`.

## Implementation rule

Canonical tags, Open Graph URLs, JSON-LD identifiers, sitemap URLs, robots sitemap declarations, and internal absolute URLs must use `https://dmvtitleguy.io`. The `www.dmvtitleguy.io` host must redirect in one hop to the `.io` apex.

Do not add `.com` redirects or canonical references unless Will first obtains control of that domain and explicitly authorizes a new migration.
