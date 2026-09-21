# Independent adversarial SEO review — August 26, 2026

## Panel mandates

Three read-only reviewers independently challenged the implementation and roadmap:

- Technical SEO and release reliability.
- SpyFu opportunity economics, intent, and cannibalization.
- Entity clarity, E-E-A-T, compliance truth, and lead conversion.

## Findings accepted

### Blocking or high severity

1. Sanity-backed pages and the dynamic sitemap must preserve the last successful render during a CMS outage instead of silently turning into 404s or a partial sitemap.
2. Production promotion must be gated by the complete migration, sitemap, rendering, schema, brand, social, lead-security, and competitive-content suites.
3. The live FIRPTA page understated the buyer's statutory responsibility and overstated what Pruitt Title necessarily handles. It required correction before promotion.
4. The Terms page was placeholder copy, and the Privacy Policy did not clearly describe Will, DMV Title Guy, Pruitt Title, GoHighLevel, or third-party tools.
5. Unsupported claims such as "top 5%," "every type of closing," and a SERP promise of reviews required removal or qualification.
6. The seller net-sheet page leaked high-intent visitors to PalmAgent rather than performing the advertised calculation on DMV Title Guy.
7. Generic blog quote forms needed topic-specific context and secure-data warnings for FIRPTA visitors.
8. Existing overlapping fee, title-policy, net-sheet, and closing-cost URLs must not be consolidated until a GSC query-by-page export identifies current winners.

## Changes implemented

- Added one-hour ISR and fail-loud Sanity behavior so failed revalidation keeps the last known-good content.
- Expanded the canonical-domain source scan across runtime and Markdown content.
- Added a single release verifier that builds and exercises all mandatory runtime gates.
- Replaced placeholder Terms and clarified the privacy/data-routing relationship.
- Removed or qualified unsupported Pruitt and Will claims.
- Linked article authorship to the About Will entity page and exact verified job title.
- Rewrote the existing FIRPTA URL using current IRS primary sources, buyer-liability language, certification limitations, form timing, and sensitive-data warnings.
- Built the seller net-sheet calculation directly on DMV Title Guy with result, print/save, quote path, and analytics events.
- Added topic-specific FIRPTA and survey intake context plus form start/success/failure measurement.

## Deferred until data is captured

- Redirecting or canonicalizing overlapping Sanity articles.
- Expanding DC tax-benefit content.
- Creating any new FIRPTA, fee-definition, policy-comparison, or generic closing-cost URL.
- Pruning templated location pages without GSC and conversion evidence.
