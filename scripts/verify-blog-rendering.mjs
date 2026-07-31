import { createClient } from "@sanity/client";

const origin = (process.env.TARGET_ORIGIN || "http://127.0.0.1:3000").replace(/\/$/, "");
const concurrency = Number(process.env.VERIFY_CONCURRENCY || 8);

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function decodeJsonScript(source) {
  const values = [];
  const failures = [];
  for (const match of source.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      values.push(JSON.parse(match[1]));
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { values, failures };
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

const sitemap = await fetchText(`${origin}/sitemap.xml`);
const sitemapRoutes = [...sitemap.matchAll(/<loc>[^<]+(\/blog\/[^<]+)<\/loc>/g)]
  .map((match) => match[1].replace(/\/$/, ""))
  .filter((route, index, all) => all.indexOf(route) === index);

const sanity = createClient({
  projectId: (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4s0dloxi").trim(),
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
const sanitySlugs = await sanity.fetch(
  `*[_type in ["post", "blogPost"] && !(_id in path("drafts.**")) && publishedAt <= now()].slug.current`,
);
const routes = [...new Set([
  ...sitemapRoutes,
  ...sanitySlugs.filter(Boolean).map((slug) => `/blog/${slug}`),
])];

if (routes.length < 100) {
  throw new Error(`Expected at least 100 blog routes in sitemap; found ${routes.length}`);
}

const expectations = new Map([
  ["/blog/what-does-a-title-company-do", { faq: true, inlineAccordions: 0 }],
  ["/blog/title-search-refinance", { faq: true, inlineAccordions: 0 }],
  ["/blog/how-to-read-a-title-commitment", { faq: true, inlineAccordions: 0 }],
  ["/blog/enhanced-title-insurance-vs-standard", { faq: true, inlineAccordions: 0 }],
  ["/blog/lenders-title-insurance-vs-owners-title-insurance", { faq: true, inlineAccordions: 0 }],
  ["/blog/closing-costs-maryland-2026", { faq: false, inlineAccordions: 1 }],
  ["/blog/how-much-does-title-insurance-cost", { faq: true, inlineAccordions: 1 }],
  ["/blog/title-companies-in-northern-virginia", { faq: true, inlineAccordions: 1 }],
  ["/blog/1031-exchange-guide-investors", { faq: false, inlineAccordions: 0 }],
]);

const failures = [];
let nextIndex = 0;
let faqRoutes = 0;

async function worker() {
  while (nextIndex < routes.length) {
    const route = routes[nextIndex++];
    try {
      const html = await fetchText(`${origin}${route}`);
      const decodedJsonLd = decodeJsonScript(html);
      const faqSchemas = decodedJsonLd.values.filter((item) => item?.["@type"] === "FAQPage");
      const articleSchemas = decodedJsonLd.values.filter((item) => item?.["@type"] === "BlogPosting");
      const breadcrumbSchemas = decodedJsonLd.values.filter((item) => item?.["@type"] === "BreadcrumbList");
      // Next.js repeats server-rendered markup inside its RSC transport scripts.
      // Audit the visible document only, while reading JSON-LD from the source.
      const visibleHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
      const h1Count = count(visibleHtml, /<h1\b/gi);
      const heroCount = count(visibleHtml, /data-blog-hero(?=[\s=>])/gi);
      const articleBodyCount = count(visibleHtml, /data-blog-article-body(?:="")?/gi);
      const faqSectionCount = count(visibleHtml, /data-blog-faq-section(?:="")?/gi);
      const faqItemCount = count(visibleHtml, /data-blog-faq-item(?:="")?/gi);
      const inlineAccordionCount = count(visibleHtml, /data-blog-inline-accordion(?:="")?/gi);
      const questionKeys = [...visibleHtml.matchAll(/data-blog-question-key="([^"]+)"/g)].map((match) => match[1]);
      const schemaItemCount = faqSchemas[0]?.mainEntity?.length ?? 0;

      if (h1Count !== 1) failures.push(`${route}: expected one h1, found ${h1Count}`);
      if (heroCount !== 1) failures.push(`${route}: expected one hero image, found ${heroCount}`);
      if (visibleHtml.indexOf("data-blog-hero") > visibleHtml.indexOf("<h1")) {
        failures.push(`${route}: hero image must render before the article h1`);
      }
      if (articleBodyCount !== 1) failures.push(`${route}: expected one article body, found ${articleBodyCount}`);
      if (decodedJsonLd.failures.length) failures.push(`${route}: malformed JSON-LD (${decodedJsonLd.failures.length})`);
      if (articleSchemas.length !== 1) failures.push(`${route}: expected one BlogPosting schema, found ${articleSchemas.length}`);
      if (breadcrumbSchemas.length !== 1) failures.push(`${route}: expected one BreadcrumbList schema, found ${breadcrumbSchemas.length}`);
      if (faqSectionCount > 1) failures.push(`${route}: duplicate FAQ sections (${faqSectionCount})`);
      if (faqSchemas.length > 1) failures.push(`${route}: duplicate FAQ schemas (${faqSchemas.length})`);
      if (faqItemCount !== schemaItemCount) {
        failures.push(`${route}: visible FAQ items (${faqItemCount}) != schema items (${schemaItemCount})`);
      }
      if ((faqItemCount > 0) !== (faqSectionCount === 1)) {
        failures.push(`${route}: FAQ section/item mismatch`);
      }
      if (new Set(questionKeys).size !== questionKeys.length) {
        failures.push(`${route}: duplicate questions across inline and footer accordions`);
      }
      if (faqItemCount > 0) faqRoutes += 1;

      const expectation = expectations.get(route);
      if (expectation && (faqItemCount > 0) !== expectation.faq) {
        failures.push(`${route}: representative FAQ expectation failed`);
      }
      if (expectation && inlineAccordionCount !== expectation.inlineAccordions) {
        failures.push(`${route}: expected ${expectation.inlineAccordions} inline accordions, found ${inlineAccordionCount}`);
      }
      if (route === "/blog/enhanced-title-insurance-vs-standard") {
        if (!visibleHtml.includes("enhanced-title-insurance-vs-standard-v2.jpg")) {
          failures.push(`${route}: expected the topic-specific comparison hero`);
        }
        if (!visibleHtml.includes("baseline and expanded layers of title insurance protection")) {
          failures.push(`${route}: expected meaningful comparison-image alt text`);
        }
        if (!html.includes('<meta property="og:image:width" content="1672"')) {
          failures.push(`${route}: expected accurate Open Graph image width`);
        }
        if (!html.includes('<meta property="og:image:height" content="941"')) {
          failures.push(`${route}: expected accurate Open Graph image height`);
        }
      }

      const ids = [...visibleHtml.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
      const idCounts = new Map(ids.map((id) => [id, ids.filter((candidate) => candidate === id).length]));
      const duplicateIds = [...idCounts.entries()].filter(([, total]) => total > 1);
      if (duplicateIds.length) {
        failures.push(`${route}: duplicate ids (${duplicateIds.map(([id]) => id).join(", ")})`);
      }
      const tocTargets = [...visibleHtml.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
      for (const id of tocTargets) {
        if ((idCounts.get(id) ?? 0) !== 1) failures.push(`${route}: TOC target #${id} does not resolve exactly once`);
      }
    } catch (error) {
      failures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Blog rendering passed: ${routes.length} routes, ${faqRoutes} with sourced FAQs`);
