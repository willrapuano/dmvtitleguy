import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Load blog post markdown content by slug.
 * Returns null if no content file exists (graceful fallback to placeholder).
 */
export function getBlogContent(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Extract FAQ pairs from markdown content.
 * Looks for ## headings that end with ? (questions) followed by paragraph text (answers).
 * Returns array of { question, answer } for FAQPage schema.
 */
export function extractFAQs(markdown: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = markdown.split("\n");
  let currentQuestion = "";
  let currentAnswer: string[] = [];
  let inFAQ = false;

  for (const line of lines) {
    // Detect FAQ question headings (## that end with ?)
    const questionMatch = line.match(/^##\s+(.+\?)$/);
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
      inFAQ = true;
      continue;
    }

    // If we hit another ## heading that's NOT a question, close the FAQ section
    if (line.match(/^##\s+/) && !line.match(/\?$/)) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      currentQuestion = "";
      currentAnswer = [];
      inFAQ = false;
      continue;
    }

    // Collect answer text
    if (inFAQ && line.trim() && !line.startsWith("#")) {
      // Strip markdown bold/italic for schema text
      const clean = line.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
      if (clean) currentAnswer.push(clean);
    }
  }

  // Capture last FAQ
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({
      question: currentQuestion,
      answer: currentAnswer.join(" ").trim(),
    });
  }

  return faqs;
}
