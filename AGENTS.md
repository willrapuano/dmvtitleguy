# DMV Title Guy engineering and operating standard

## Owner identity and authority boundary

- Operate only as the GitHub identity `velocity-ops-bot`. Before any GitHub
  write, verify the active identity with `gh api user --jq .login` and stop if
  it is not exactly `velocity-ops-bot`.
- Never use, request, or authenticate as Will Rapuano or any other owner
  identity. This includes GitHub, Vercel, Supabase, Sanity, Turso, GoHighLevel,
  Google, credentials stored in a keychain, and signed-in browser sessions.
- Never start or approve a device-code, OAuth, browser-login, or account-linking
  flow for an owner identity. Never drive the owner's signed-in browser to
  perform account or administrative work.
- The agent has push authority, not administrative authority, by design.
  Repository environments, rulesets, branch protection, secrets, billing,
  credential provisioning, and third-party integrations are owner work.
- When an in-scope task reaches an owner-only action, stop that action and give
  the owner a precise checklist with the exact settings page and exact values.
  Do not seek a workaround or treat missing administrative authority as
  permission to weaken the design. Continue independent code and verification
  work when it remains safe to do so.

## Repository and merge governance

- `main` is pull-request-only. Never push directly to `main`, force-push it,
  delete it, or route around repository rules.
- If protections are absent or incomplete, report the exact required settings.
  Their absence is not permission to bypass pull-request governance.
- Use `codex/` branch names unless the owner explicitly requests another name.
- Merge only through a compliant pull request after required status checks,
  reviews, and conversations are complete. Never use administrative override or
  bypass controls.
- Existing uncommitted changes belong to the owner. Preserve them and keep
  unrelated work out of the current branch and pull request.

## Credential and external-system policy

- Never mint, rotate, revoke, relocate, reveal, or inspect credential values.
  If a required credential is missing, expired, over-scoped, or owned by a
  personal identity, stop that integration step and report the exact owner
  action required.
- Never read credentials from the owner's keychain, clipboard, browser, shell
  history, or personal environment. A credential being technically available
  does not authorize its use.
- Never paste secrets into commands, logs, issues, pull requests, commits,
  screenshots, or chat. Tests and documentation use unmistakably inert fixture
  values only.
- Enforce least privilege and system separation. Production-site credentials,
  operational-health provider credentials, control-plane credentials, signing
  keys, and GitHub API credentials must remain in their documented trust
  boundaries.
- GoHighLevel is the CRM destination. Turso is the durable lead and operational
  ledger used by this site; it is not a replacement CRM. Do not silently move
  responsibilities between them.
- External writes, messages, publications, credential changes, and account
  configuration require explicit owner instructions in the owner's own plain
  words. Never draft authorization text for the owner or ask the owner to echo
  a phrase as consent.

## Destructive operations

- Before `git clean`, `git reset --hard`, a multi-file restore, or `rm -rf`
  outside an isolated scratch directory, enumerate the exact targets, explain
  the consequence, propose the command, and wait for explicit owner approval.
- Prefer reversible operations and isolated worktrees. Never discard or
  overwrite owner work to make a branch clean.

## Business and domain truth

- `dmvtitleguy.io` is Will Rapuano's independently controlled organic lead
  property for DMV title and settlement demand. It is not a representation
  that Will controls or manages the Pruitt Title website.
- Keep the public relationship among Will Rapuano, DMV Title Guy, and Pruitt
  Title accurate and supportable. Never imply ownership, control, guarantees,
  service coverage, licensing, affiliations, or endorsements that the source
  material does not establish.
- FederalTitle.com is a competitive SEO benchmark, not a source whose branding,
  copy, structure, claims, or assets may be copied.
- Preserve canonical-domain, redirect, sitemap, schema, attribution, lead
  security, and provider-truth contracts. Treat legal, privacy, licensing,
  advertising, provider, and platform obligations as hard constraints.
- During a declared SEO measurement freeze, do not change public copy,
  metadata, canonicals, structured data, internal links, navigation, URLs,
  indexed assets, or conversion-path behavior unless the owner explicitly
  authorizes that exact change. Operational-health work must remain
  measurement-neutral.

## Product and implementation discipline

- Read the relevant material in `docs/` and existing verification scripts
  before changing SEO, domain migration, lead capture, attribution, provider
  reconciliation, or checkpoint behavior. Lower-level plans do not override
  repository contracts or a later owner directive.
- Prefer repository primitives and established data flows. Do not introduce a
  new dependency, external service, datastore, or parallel source of truth
  without explicit approval.
- Public hot paths must fail honestly and protect lead data. Never report a
  successful submission, publication, reconciliation, deployment, or health
  checkpoint unless the downstream result is verified.
- Keep production errors credential-safe. Public and archived evidence may
  contain stable incident codes and bounded metadata, never raw provider
  errors, headers, tokens, connection strings, or response bodies.
- Scheduled health work must fail closed, use immutable provenance, preserve
  process-level credential separation, and record either valid signed evidence
  or a truthful signed incident. Never manufacture or backdate provider proof.

## UI, motion, and visual-design gates

- For user-visible React, TSX, or CSS changes, use the installed
  `emil-design-eng` skill before implementation. When animation or transition
  code changes, run `review-animations`, resolve every blocking and
  high-severity finding, and honor `prefers-reduced-motion`.
- Preserve keyboard access, visible focus, semantic controls, readable contrast,
  touch-friendly targets, pointer-cancel cleanup, and interruptible motion.
  Prefer explicit transitions on `transform` and `opacity`.
- Search for existing components and tokens before adding UI primitives. Do not
  add a UI dependency without explicit approval.
- A new or materially changed visual direction must be created and approved in
  the shared Paper design space before production implementation. If Paper or
  approved reference evidence is unavailable, stop the design step and report
  it; do not substitute a coded mockup as the approved design.
- Before presenting a new or materially changed design, render populated,
  representative content at 1440x900, 390x844, and 320x800. Review premium
  restraint, conversion clarity, domain accuracy, accessibility, mobile
  composition, action clarity, responsive behavior, and populated/error states.
  Record findings by severity, fix every blocking and high-severity finding,
  rerender, and rerun the review.
- The repository's current identity and `src/lib/brand-identity.ts` govern DMV
  Title Guy branding. Never copy another company's branding, assets, copy,
  claims, or permission model.
- For any visual artifact, follow the workspace's
  `design/skills/non-generic-graphic-design/SKILL.md` when available and run its
  AI-tell audit before presentation. Use Public Sans by default with Helvetica
  Neue, Arial, and `system-ui` fallbacks; avoid decorative serif, script, or
  monospace typography and generic luxury styling shortcuts.

## Verification and handoff

- Verify changes in proportion to risk. For application changes, the baseline
  is lint, typecheck, relevant focused contract suites, production build, and
  the built-application checks that cover the changed behavior.
- For SEO or operational-health changes, run the repository's dedicated
  verifier suite and confirm the diff contains no unintended public SEO or
  content changes.
- Never claim a deployment, integration, schedule, credential scope, branch
  protection, or production behavior was verified without direct evidence.
- Report separately: code completed, tests completed, pull-request state,
  production state, and exact owner-only actions still outstanding.
