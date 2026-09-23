# Lead intake: pending-response correction

## Scope and authorization

The owner authorized the proposed pending-versus-success reporting fix on September 14. This change is limited to the six public form response handlers, a shared response classifier/pending notice, regression tests, and running that suite in the existing CI job. No attribution collection fields, indexed copy, canonicals, phone routing, GHL configuration, provider worker, credentials, database schema, or production settings change.

## Behavior

- HTTP 202 or an explicit pending flag produces a pending notice, never a success conversion.
- The pending notice receives keyboard focus, uses a polite status region, and directs the visitor not to resubmit. Existing contact phone is retained.
- HTTP errors, invalid JSON, malformed result fields and network failures do not count as conversions.
- A duplicate acknowledgment displays the existing acknowledgment state without another conversion event.
- Existing request IDs are retained for manual retries; no automatic webhook retries or new submission IDs are introduced.
- A normal successful intake response is still an intake acknowledgment, not proof of a qualified lead, GHL opportunity, accepted contract, or completed transaction. Provider reconciliation remains a separate required measurement.

## Verification

Passed locally:

- 90 regression cases executing the six actual transpiled React form handlers with isolated hooks and fetch fixtures, plus pending notice focus/status checks.
- Existing lead-attribution suite; CI now runs it after typecheck.
- ESLint (after correcting a test-harness variable naming issue).
- TypeScript typecheck.
- Standard optimized application build: 289 generated pages. Vercel Production environment validation correctly skipped for this non-Vercel local build; no production credentials were loaded.
- Built local application lead-security gate: eight checks, including honeypot no-delivery and disabled uploads/payments.
- Canonical-domain and provider-truth source checks.
- Git diff whitespace check.

The fresh dependency install initially failed against an inaccessible preexisting npm cache. A fresh temporary cache completed installation without changing cache ownership or dependency versions.

Not verified:

- Built-page browser interaction and viewport rendering. Playwright Chromium failed before page creation with macOS MachPortRendezvousServer permission denial. No owner browser or permission workaround was used.
- Current production delivery to GHL, outbox backlog, or workflow execution.
- Remote CI and preview until their exact-commit results are available.

Keep the PR draft until browser validation is completed in an authorized isolated runner. Run the built application with provider credentials absent, intercept all six local intake endpoints with 202/pending fixtures, and verify no conversion events, no resubmit form, focused notice, and no overflow at 1440x900, 390x844, and 320x800. Then verify ordinary success, HTTP failures, malformed JSON, and duplicate acknowledgment. Never submit these fixtures to production.

## Code review: existing visual language retained

| Before | After | Why |
| --- | --- | --- |
| Ambiguous delivery showed success and emitted a conversion | Separate pending status, no conversion | Honest result contract |
| Duplicate acknowledgments emitted another conversion | Existing acknowledgment without another event | Avoid counting replays as new leads |
| Six divergent result checks | Shared strictly typed response classifier | Consistent HTTP and body handling |
| No pending status focus target | Focused polite status region and existing phone link | Keyboard and assistive-technology continuity |

No animation, transition, visual direction, or UI dependencies were added. This is a code-level accessibility/React review, not completed visual approval. No candidate screenshots are being presented as review-ready.

## Owner-only work remains separate

### CI follow-up

The first PR run passed the form regression suite and the Vercel preview, but failed an existing production-gate fixture with `invalid canary failed without the expected safe error`. That fixture used an August 30 signed watchdog receipt and empty checkpoint history while its subprocess evaluated the current wall clock. After the checkpoint date passed, the production history gate correctly rejected the fixture before its intended canary assertion.

The test helper now freezes time only in its isolated temporary subprocess using a test-only preload; production code and production clock handling are unchanged. An additional 2030 fixture explicitly verifies that missing historical evidence still fails closed. The entire `verify:seo-operational-health` suite now passes locally, including rollout, attestation, isolation, process boundaries, recovery, source digest, archive, and receipt checks. This does not activate the disabled monitor or substitute for live provider evidence.

The independent SEO/provider health monitor remains disabled. Follow the exact integration, environment, signing, attestation, and watchdog checklist in [SEO checkpoint operations](seo-checkpoint-operations-2026-08-26.md). The key starting settings are:

1. DMV Title Guy GHL sub-account → Settings → Private Integrations: dedicated `DMVTitleGuy SEO Health Read-only`, with `locations.readonly`, `opportunities.readonly`, and `locations/customFields.readonly` scopes.
2. Repository Settings → Environments: `seo-health-production`, selected branch `main` only, no tags, no reviewers, zero wait, administrator bypass off. Store the dedicated reader as `SEO_HEALTH_GHL_READ_TOKEN`, not as a site production variable.
3. Complete the other separately scoped prerequisites in the operations checklist before canary activation. A GHL token by itself is not the complete monitor. Do not paste secrets into chat or duplicate/rotate an existing integration blindly.

This PR does not connect cell calls to GHL, change either displayed phone number, modify Pruitt-controlled properties, request Google indexing, or alter FIRPTA content. Those remain separately bounded work.
