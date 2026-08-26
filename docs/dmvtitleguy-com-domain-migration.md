# DMVTitleGuy.com domain migration

> **Cancelled August 25, 2026.** `dmvtitleguy.io` remains the canonical production domain. Live verification showed `dmvtitleguy.com` redirects to a separate WordPress property and SpyFu had no ranking history for `.com`. Do not execute this migration unless Will first obtains control of `.com` and explicitly reauthorizes a new cutover plan.

## Canonical host

- New canonical origin: `https://dmvtitleguy.com`
- Redirecting origins: `https://dmvtitleguy.io`, `https://www.dmvtitleguy.io`, and `https://www.dmvtitleguy.com`
- Redirect behavior: permanent, path preserving, and query-string preserving

## Legacy WordPress mapping

| WordPress URL | Destination | Treatment |
| --- | --- | --- |
| `/home/` | `/` | Permanent redirect |
| `/blog/` | `/blog` | Existing trailing-slash normalization |
| `/looking-to-grow-your-business/` | `/title-company-for-realtors` | Permanent redirect to the closest equivalent content |
| `/2023/02/21/hello-world/` | None | Return 404; placeholder content has no replacement |
| `/sample-page/` | None | Return 404; placeholder content has no replacement |

## DNS cutover

The domain remains registered with GoDaddy (`ns35.domaincontrol.com` and
`ns36.domaincontrol.com`). Vercel has already assigned both the apex and `www`
hosts to the `dmvtitleguy` project.

Before editing DNS, inspect the domain in the Vercel project dashboard or run
`vercel domains inspect dmvtitleguy.com`. Copy the exact apex and `www` values
assigned to this project; do not assume a generic record remains current.

Expected record shapes (the dashboard is authoritative):

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | Project-assigned Vercel apex value |
| `CNAME` | `www` | Project-assigned Vercel CNAME value |

Do not change nameservers. Preserve any unrelated TXT, CAA, MX, or verification
records. At preflight, the domain had no MX, TXT, or CAA records.

## Safe release order

1. Rotate any GHL webhook previously stored as `NEXT_PUBLIC_GHL_WEBHOOK_URL`.
   Store the replacement only as `GHL_WEBHOOK_URL`; add a random 32-byte
   `LEAD_PROTECTION_SECRET` in Preview and Production.
2. Apply `prisma/migrations/20260731153000_add_lead_protection/migration.sql`
   to the configured Turso database and validate the protected lead routes.
3. Inspect the `.com` domain in Vercel and record the exact assigned DNS values.
4. Validate the migration deployment on its Vercel preview URL.
5. Change `.com` DNS to Vercel while the existing production deployment still
   redirects `.com` to `.io`.
6. Wait until public DNS resolves both `.com` hosts to Vercel.
7. Promote the validated migration deployment to production.
8. Verify `.com` pages, canonicals, sitemap, robots, analytics, conversion
   routes, and the path-preserving `.io` redirects.
9. Submit the `.com` sitemap and Change of Address in Search Console.

## Document intake

Public contract and title-document uploads are intentionally disabled in this
release. The three intake forms collect validated contact/property details and
tell the customer that staff will provide secure transfer instructions. Do not
re-enable `/api/funnels/upload-url` until there is a private Blob store plus an
authenticated staff retrieval workflow, strict file type/size limits, retention
rules, and an audited deletion path. A public bearer URL is not an acceptable
substitute for that workflow.

## Rollback

If the production promotion fails, roll back the Vercel production alias to
the preceding deployment. This restores `.com` to `.io` redirects without
requiring an immediate DNS rollback.

If DNS itself must be rolled back, restore the prior WordPress apex records
`192.0.78.24` and `192.0.78.25`, and restore `www` as a CNAME to the apex.
