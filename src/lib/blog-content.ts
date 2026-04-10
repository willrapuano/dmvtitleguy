import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Strip YAML frontmatter (between --- delimiters) from markdown.
 */
function stripFrontmatter(content: string): string {
  if (content.startsWith("---")) {
    const end = content.indexOf("\n---", 3);
    if (end !== -1) {
      return content.slice(end + 4).trimStart();
    }
  }
  return content;
}

/**
 * Load blog post markdown content by slug.
 * Returns null if no content file exists (graceful fallback to placeholder).
 */
export function getBlogContent(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return stripFrontmatter(raw);
  } catch {
    return null;
  }
}

export function getMarkdownBlogSlugs(): string[] {
  try {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

/**
 * Split markdown into body content (before FAQ section) and FAQ pairs.
 * FAQ section is identified by a ## FAQ heading or ## headings that end with ?
 */
export function splitBodyAndFAQ(markdown: string): {
  body: string;
  faqs: { question: string; answer: string }[];
} {
  const lines = markdown.split("\n");
  const bodyLines: string[] = [];
  const faqs: { question: string; answer: string }[] = [];

  let faqMode = false;
  let currentQuestion = "";
  let currentAnswer: string[] = [];

  for (const line of lines) {
    // Detect FAQ section header (## FAQ: ...) — switch to FAQ mode but don't add to body
    if (/^##\s+(FAQ|Frequently Asked)/i.test(line)) {
      faqMode = true;
      continue;
    }

    // Detect question headings (## ending with ?)
    const questionMatch = line.match(/^##\s+(.+\?)\s*$/);
    if (questionMatch) {
      // Save previous FAQ if exists
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      currentQuestion = questionMatch[1];
      currentAnswer = [];
      faqMode = true;
      continue;
    }

    if (faqMode) {
      // Non-question ## heading while in FAQ mode — end FAQ section
      if (/^##\s+/.test(line) && !line.match(/\?$/)) {
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer.join(" ").trim(),
          });
          currentQuestion = "";
          currentAnswer = [];
        }
        faqMode = false;
        bodyLines.push(line);
        continue;
      }
      // Collect answer text
      if (currentQuestion && line.trim() && !line.startsWith("#")) {
        const clean = line
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
          .trim();
        if (clean) currentAnswer.push(clean);
      }
    } else {
      bodyLines.push(line);
    }
  }

  // Capture last FAQ
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({
      question: currentQuestion,
      answer: currentAnswer.join(" ").trim(),
    });
  }

  return {
    body: bodyLines.join("\n").trimEnd(),
    faqs,
  };
}

/**
 * Extract FAQ pairs from markdown content.
 * Legacy function — kept for backward compat with schema extraction.
 */
export function extractFAQs(markdown: string): { question: string; answer: string }[] {
  return splitBodyAndFAQ(markdown).faqs;
}
