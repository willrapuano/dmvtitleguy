import assert from "node:assert/strict";
import { normalizePortableBlogContent } from "../src/lib/blog-portable-content.ts";
import { normalizeMarkdownBlogBody, splitBodyAndFAQ } from "../src/lib/blog-content.ts";
import { serializeJsonLd } from "../src/lib/json-ld.ts";
import { normalizeIndependentProviderVoice } from "../src/lib/provider-voice.ts";

const block = (key, text, style = "normal") => ({
  _key: key,
  _type: "block",
  style,
  children: [{ _key: `${key}-span`, _type: "span", text, marks: [] }],
});

assert.equal(
  normalizeIndependentProviderVoice("At DMV Title Guy, we handle subject-to closings."),
  "A selected title provider may handle subject-to closings.",
);
assert.equal(
  normalizeIndependentProviderVoice("We ensure the math balances. Our team records the deed."),
  "A selected title provider may help ensure the math balances. A selected title provider may record the deed.",
);
assert.equal(
  normalizeIndependentProviderVoice("Pruitt Title LLC provides settlement services."),
  "Pruitt Title LLC provides settlement services.",
);

const fixtures = [
  {
    name: "structured accordion moves to the article footer",
    body: [
      block("intro", "Opening paragraph."),
      {
        _key: "accordion",
        _type: "accordion",
        items: [
          { question: "What is covered?", answer: "Existing policy defects." },
          { question: "How long does it last?", answer: "For the ownership period." },
        ],
      },
    ],
    expectedQuestions: ["What is covered?", "How long does it last?"],
    expectedBodyText: ["Opening paragraph."],
  },
  {
    name: "substantive nonterminal accordion stays in authored position",
    body: [
      {
        _key: "accordion",
        _type: "accordion",
        items: [
          { question: "What is this section?", answer: "Core article content." },
          { question: "Why is it here?", answer: "It supports the next section." },
        ],
      },
      block("next", "The next section", "h2"),
      block("body", "More article content."),
    ],
    expectedQuestions: [],
    expectedBodyText: ["", "The next section", "More article content."],
  },
  {
    name: "heading question plus answer",
    body: [
      block("faq", "Frequently Asked Questions", "h2"),
      block("q", "How long does it take?", "h2"),
      block("a", "Usually several business days."),
      block("conclusion", "Conclusion", "h2"),
    ],
    expectedQuestions: ["How long does it take?"],
    expectedBodyText: ["Conclusion"],
  },
  {
    name: "normal question plus answer",
    body: [
      block("faq", "FAQ", "h2"),
      block("q", "Who prepares the deed?"),
      block("a", "The settlement provider typically prepares it."),
    ],
    expectedQuestions: ["Who prepares the deed?"],
    expectedBodyText: [],
  },
  {
    name: "combined question and answer",
    body: [
      block("faq", "Frequently Asked Questions", "h2"),
      block("qa", "Can I close remotely?\nYes, when the file qualifies."),
    ],
    expectedQuestions: ["Can I close remotely?"],
    expectedBodyText: [],
  },
  {
    name: "labeled Q and A plus orphan heading cleanup",
    body: [
      block("faq", "Frequently Asked Questions", "h2"),
      block("qa", "Q: Who chooses the company? A: The buyer chooses in Virginia."),
    ],
    expectedQuestions: ["Who chooses the company?"],
    expectedBodyText: [],
  },
  {
    name: "orphan FAQ heading does not invent content",
    body: [block("faq", "Frequently Asked Questions", "h2"), block("cta", "Request a quote.")],
    expectedQuestions: [],
    expectedBodyText: ["Request a quote."],
  },
];

for (const fixture of fixtures) {
  const result = normalizePortableBlogContent(fixture.body, "Fixture title");
  assert.deepEqual(
    result.faqs.map((faq) => faq.question),
    fixture.expectedQuestions,
    fixture.name,
  );
  const bodyText = result.body.map((item) =>
    Array.isArray(item.children)
      ? item.children.map((child) => child?.text || "").join("")
      : "",
  );
  assert.deepEqual(bodyText, fixture.expectedBodyText, fixture.name);
}

console.log(`Blog normalizer fixtures passed: ${fixtures.length}`);

const boldMarkdown = `## Frequently Asked Questions

**Is this sourced?**
Yes, it is present in the article.

**Does the bio stay out of the answer?**
Yes.

---

*Author biography.*`;
const markdownResult = splitBodyAndFAQ(boldMarkdown);
assert.deepEqual(markdownResult.faqs, [
  { question: "Is this sourced?", answer: "Yes, it is present in the article." },
  { question: "Does the bio stay out of the answer?", answer: "Yes." },
]);
assert.match(markdownResult.body, /Author biography/);
console.log("Markdown FAQ fixture passed: bold-question legacy format");

const matchingH1 = "# Fixture Title\n\nOpening paragraph.";
assert.equal(normalizeMarkdownBlogBody(matchingH1, "Fixture Title"), "Opening paragraph.");
const distinctH1 = "# A meaningful section heading\n\nOpening paragraph.";
assert.equal(normalizeMarkdownBlogBody(distinctH1, "Fixture Title"), distinctH1);
console.log("Markdown h1 fixtures passed: matching title removed, distinct heading preserved");

const maliciousJsonLd = serializeJsonLd({ answer: "</script><script>alert(1)</script>" });
assert.doesNotMatch(maliciousJsonLd, /</);
assert.match(maliciousJsonLd, /\\u003c\/script>/);
assert.deepEqual(JSON.parse(maliciousJsonLd), { answer: "</script><script>alert(1)</script>" });
console.log("JSON-LD escaping fixture passed");
