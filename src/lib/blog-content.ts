import fs from "fs";
import path from "path";
import { normalizeIndependentProviderVoice } from "./provider-voice.ts";

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
    return normalizeIndependentProviderVoice(stripFrontmatter(raw));
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
 * Supports both `## Question?` and `## ## Question?` formats
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

    // Detect question headings - supports both `## Question?` and `## ## Question?` formats
    const questionMatch = line.match(/^##\s+(?:##\s+)?(.+\?)\s*$/);
    if (questionMatch && faqMode) {
      // Save previous FAQ if exists
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join("\n").trim(),
        });
      }
      currentQuestion = questionMatch[1];
      currentAnswer = [];
      continue;
    }

    // One legacy article uses bold question paragraphs inside its explicit FAQ
    // region rather than heading syntax.
    const boldQuestionMatch = line.match(/^\*\*(.+\?)\*\*\s*$/);
    if (boldQuestionMatch && faqMode) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join("\n").trim(),
        });
      }
      currentQuestion = boldQuestionMatch[1];
      currentAnswer = [];
      continue;
    }

    // Also detect question headings outside of explicit FAQ mode (for backwards compat)
    const standaloneQuestionMatch = line.match(/^##\s+(?:##\s+)?(.+\?)\s*$/);
    if (standaloneQuestionMatch && !faqMode) {
      // Check if this looks like a FAQ question (short, starts with capital, has question word)
      const qText = standaloneQuestionMatch[1];
      const isLikelyFAQ = qText.length < 150 && 
                         /^[A-Z]/.test(qText) &&
                         /\b(What|How|Why|When|Where|Who|Which|Is|Are|Do|Does|Can|Should)\b/.test(qText);
      
      if (isLikelyFAQ || lines.some(l => /^##\s+(FAQ|Frequently Asked)/i.test(l))) {
        faqMode = true;
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer.join("\n").trim(),
          });
        }
        currentQuestion = qText;
        currentAnswer = [];
        continue;
      }
    }

    if (faqMode) {
      // A thematic break closes a terminal FAQ region. Preserve everything
      // after it (for example, an author bio) as ordinary article content.
      if (/^\s*---\s*$/.test(line)) {
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer.join("\n").trim(),
          });
          currentQuestion = "";
          currentAnswer = [];
        }
        faqMode = false;
        bodyLines.push(line);
        continue;
      }
      // Non-question ## heading while in FAQ mode — end FAQ section
      if (/^##\s+/.test(line) && !line.match(/\?$/)) {
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer.join("\n").trim(),
          });
          currentQuestion = "";
          currentAnswer = [];
        }
        faqMode = false;
        bodyLines.push(line);
        continue;
      }
      // Collect answer text - PRESERVE markdown formatting (don't strip ** or *)
      if (currentQuestion && !line.startsWith("#")) {
        const trimmed = line.trim();
        if (trimmed) currentAnswer.push(line); // Keep original line with markdown
      }
    } else {
      bodyLines.push(line);
    }
  }

  // Capture last FAQ
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({
      question: currentQuestion,
      answer: currentAnswer.join("\n").trim(),
    });
  }

  return {
    body: bodyLines.join("\n").trimEnd(),
    faqs,
  };
}

/** The page shell owns the document h1; a Markdown body may not add another. */
export function normalizeMarkdownBlogBody(markdown: string, postTitle: string): string {
  const match = markdown.match(/^\s*#\s+([^\n]+)\n+/);
  if (!match) return markdown;
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalize(match[1]) === normalize(postTitle)
    ? markdown.slice(match[0].length).trimStart()
    : markdown;
}

/**
 * Extract FAQ pairs from markdown content.
 * Legacy function — kept for backward compat with schema extraction.
 */
export function extractFAQs(markdown: string): { question: string; answer: string }[] {
  return splitBodyAndFAQ(markdown).faqs;
}
