# Production and dependency security baseline

Updated: 2026-09-02

## Deployment provenance

- `main` in `willrapuano/dmvtitleguy` is the canonical production source.
- Vercel's Git integration builds pull requests as previews and deploys merges to `main` to production.
- Production must not be deployed from the untracked OpenClaw workspace copy. Emergency CLI deployments must be followed immediately by an equivalent reviewed commit and a Git-backed production deployment.

## Required checks

Pull requests and pushes to `main` run:

1. reproducible installation with `npm ci`;
2. ESLint;
3. TypeScript without emitting files;
4. the complete Next.js production build; and
5. a production-dependency audit that fails on high or critical findings.

Dependabot checks npm dependencies weekly. Main-branch protection must require the literal status-check contexts `configured-receipt` and `verify` from GitHub Actions, plus `Vercel` from Vercel, exactly as specified by the owner-only checklist in `docs/seo-checkpoint-operations-2026-08-26.md` after each check has successfully run once. The `CI /` workflow label shown in grouped check displays is not part of either GitHub Actions context stored by the ruleset.

## Rollback

If a production deployment fails functional verification, use Vercel to promote the last known-good Git-backed production deployment, revert the responsible commit on `main`, and let the Git integration deploy the revert. Do not repair production only in an untracked directory.

## Accepted baseline debt

### September 2 dependency security correction

- Pin the existing fast-uri v3 dependency line to `3.1.7`, including the [September 2 security fixes](https://github.com/fastify/fast-uri/releases/tag/v3.1.7).
- Override only Prisma's transitive mysql2 dependency to `3.24.3`. This remains on mysql2 v3 and includes the fixes for [cleartext authentication downgrade](https://github.com/advisories/GHSA-3f6p-5ww8-9rcr) and [unbounded compressed-packet inflation](https://github.com/advisories/GHSA-rgwj-5xj2-c3m3). Prisma itself stays at the existing locked `7.9.1`; do not use a forced audit fix that downgrades Prisma to v6.
- The dependency verifier checks all locked and installed fast-uri/mysql2 copies, malformed IPv6 rejection, normal relative-URI resolution, and Prisma's resolved mysql2 formatting API without connecting to a database. The existing high/critical production audit gate remains unchanged.
- A fresh lockfile audit and clean-install production audit on September 2 both reported zero vulnerabilities. This is a dated registry result, not a guarantee about future advisories.
- Dependency manifests participate in the SEO health source digest. Rollout remains disabled; this dependency change must be included in any future scheduled canary, not treated as equivalent to prior source-digest evidence.

### Historical baseline notes

- ESLint currently reports legacy warnings, mainly unused imports and historical inline suppressions. Errors fail CI; warnings are visible and should be reduced in ordinary maintenance.
- The Sanity image URL helper emits a deprecation warning during build. Migrate to `createImageUrlBuilder` separately; it does not block this security upgrade.
- The 2026-07-31 upgrade eliminated all high and critical npm audit findings. Ten moderate findings remain in upstream Sanity telemetry/CLI paths and the Anthropic SDK; Dependabot and the high-severity CI gate keep them visible while avoiding an unsafe framework downgrade.
