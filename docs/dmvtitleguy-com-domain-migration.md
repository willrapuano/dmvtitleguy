# DMVTitleGuy.com domain migration

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

Required GoDaddy records:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `76.76.21.21` |
| `A` | `www` | `76.76.21.21` |

Do not change nameservers. Preserve any unrelated TXT, CAA, MX, or verification
records. At preflight, the domain had no MX, TXT, or CAA records.

## Safe release order

1. Validate the migration deployment on its Vercel preview URL.
2. Change `.com` DNS to Vercel while the existing production deployment still
   redirects `.com` to `.io`.
3. Wait until public DNS resolves both `.com` hosts to Vercel.
4. Promote the validated migration deployment to production.
5. Verify `.com` pages, canonicals, sitemap, robots, analytics, conversion
   routes, and the path-preserving `.io` redirects.
6. Submit the `.com` sitemap and Change of Address in Search Console.

## Rollback

If the production promotion fails, roll back the Vercel production alias to
the preceding deployment. This restores `.com` to `.io` redirects without
requiring an immediate DNS rollback.

If DNS itself must be rolled back, restore the prior WordPress apex records
`192.0.78.24` and `192.0.78.25`, and restore `www` as a CNAME to the apex.
