# Production and dependency security baseline

Updated: 2026-07-31

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

Dependabot checks npm dependencies weekly. Main-branch protection should require the `CI / verify` and Vercel deployment checks after this workflow has successfully run on `main` once.

## Rollback

If a production deployment fails functional verification, use Vercel to promote the last known-good Git-backed production deployment, revert the responsible commit on `main`, and let the Git integration deploy the revert. Do not repair production only in an untracked directory.

## Accepted baseline debt

- ESLint currently reports legacy warnings, mainly unused imports and historical inline suppressions. Errors fail CI; warnings are visible and should be reduced in ordinary maintenance.
- The Sanity image URL helper emits a deprecation warning during build. Migrate to `createImageUrlBuilder` separately; it does not block this security upgrade.
- The 2026-07-31 upgrade eliminated all high and critical npm audit findings. Ten moderate findings remain in upstream Sanity telemetry/CLI paths and the Anthropic SDK; Dependabot and the high-severity CI gate keep them visible while avoiding an unsafe framework downgrade.
