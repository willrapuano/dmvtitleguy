export interface BlogFAQItem {
  question: string;
  answer: string;
}

export interface BlogTOCItem {
  id: string;
  label: string;
}

// Sanity's article body contains standard Portable Text blocks plus a few
// project-specific objects. Keep this boundary permissive, then normalize it
// before the renderer sees it.
export type PortableBlock = Record<string, unknown> & {
  _key?: string;
  _type: string;
  style?: string;
  listItem?: string;
  children?: unknown[];
  items?: unknown[];
};

function childText(child: unknown): string {
  if (!child || typeof child !== "object") return "";
  const value = child as Record<string, unknown>;
  return typeof value.text === "string" ? value.text : "";
}

export function portableBlockText(block: unknown): string {
  if (!block || typeof block !== "object") return "";
  const value = block as PortableBlock;
  if (!Array.isArray(value.children)) return "";
  return value.children.map(childText).join("").trim();
}

export function slugifyBlogHeading(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function normalizeComparable(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cleanQuestion(input: string): string {
  return input
    .replace(/^#{1,4}\s+/, "")
    .replace(/^Q:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function blogFAQQuestionKey(input: string): string {
  return normalizeComparable(cleanQuestion(input));
}

function markdownSpan(span: unknown): string {
  if (!span || typeof span !== "object") return "";
  const value = span as Record<string, unknown>;
  let text = typeof value.text === "string" ? value.text : "";
  const marks = Array.isArray(value.marks) ? value.marks : [];
  if (marks.includes("strong")) text = `**${text}**`;
  if (marks.includes("em")) text = `*${text}*`;
  return text;
}

function markdownFromPortable(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (!item || typeof item !== "object") return "";
      const record = item as Record<string, unknown>;
      if (Array.isArray(record.children)) return record.children.map(markdownSpan).join("").trim();
      return typeof record.text === "string" ? record.text.trim() : "";
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function parseCombinedFAQ(text: string): BlogFAQItem | null {
  const normalized = text.trim();
  const labeled = normalized.match(/^Q:\s*(.+\?)\s*A:\s*([\s\S]+)$/i);
  if (labeled) {
    return { question: cleanQuestion(labeled[1]), answer: labeled[2].trim() };
  }

  const questionEnd = normalized.indexOf("?");
  if (questionEnd < 0) return null;
  const question = cleanQuestion(normalized.slice(0, questionEnd + 1));
  const answer = normalized.slice(questionEnd + 1).trim();
  if (!question || !answer) return null;
  return { question, answer };
}

function isQuestionOnly(text: string): boolean {
  const cleaned = cleanQuestion(text);
  return cleaned.endsWith("?") && cleaned.length <= 180;
}

function isFAQHeading(block: PortableBlock): boolean {
  return /^(faq|frequently asked questions?)\s*:?​?$/i.test(portableBlockText(block));
}

function isTextBlock(block: PortableBlock): boolean {
  return block._type === "block";
}

function flattenLegacyLists(blocks: PortableBlock[]): PortableBlock[] {
  return blocks.flatMap((block) => {
    if (block._type !== "list") return [block];
    const listChildren = Array.isArray(block.children) ? block.children : [];
    return listChildren.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const childBlocks = Array.isArray((item as PortableBlock).children)
        ? ((item as PortableBlock).children as PortableBlock[])
        : [];
      return childBlocks.map((childBlock) => ({
        ...childBlock,
        _type: "block",
        listItem: block.listItem,
      }));
    });
  });
}

function accordionFAQs(block: PortableBlock): BlogFAQItem[] {
  if (block._type !== "accordion" || !Array.isArray(block.items)) return [];
  return block.items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const value = item as Record<string, unknown>;
    const question = cleanQuestion(typeof value.question === "string" ? value.question : "");
    const answer = markdownFromPortable(value.answer);
    return question && answer ? [{ question, answer }] : [];
  });
}

function extractableFAQAccordion(
  block: PortableBlock,
  index: number,
  total: number,
  supplementalFAQs: BlogFAQItem[],
): boolean {
  if (block._type !== "accordion" || !Array.isArray(block.items) || block.items.length < 2) {
    return false;
  }
  const questions = block.items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const value = item as Record<string, unknown>;
    return typeof value.question === "string" ? [cleanQuestion(value.question)] : [];
  });
  if (questions.length !== block.items.length || !questions.every((question) => question.endsWith("?"))) {
    return false;
  }

  const supplementalKeys = new Set(
    supplementalFAQs.map((faq) => blogFAQQuestionKey(faq.question)),
  );
  const duplicatedBySupplement = questions.every((question) =>
    supplementalKeys.has(blogFAQQuestionKey(question)),
  );
  const inTerminalHalf = index >= Math.floor(total * 0.5);
  return duplicatedBySupplement || inTerminalHalf;
}

function explicitFAQRegion(
  blocks: PortableBlock[],
  headingIndex: number,
): { faqs: BlogFAQItem[]; consumed: Set<number> } {
  const faqs: BlogFAQItem[] = [];
  const consumed = new Set<number>([headingIndex]);

  for (let index = headingIndex + 1; index < blocks.length;) {
    const block = blocks[index];
    if (!isTextBlock(block)) break;
    const text = portableBlockText(block);
    if (!text) {
      consumed.add(index);
      index += 1;
      continue;
    }

    const combined = parseCombinedFAQ(text);
    if (combined) {
      faqs.push(combined);
      consumed.add(index);
      index += 1;
      continue;
    }

    if (isQuestionOnly(text)) {
      const next = blocks[index + 1];
      const nextText = next && isTextBlock(next) ? portableBlockText(next) : "";
      const nextIsHeading = Boolean(next?.style && next.style !== "normal");
      if (nextText && !isQuestionOnly(nextText) && !nextIsHeading) {
        faqs.push({ question: cleanQuestion(text), answer: nextText });
        consumed.add(index);
        consumed.add(index + 1);
        index += 2;
        continue;
      }
    }

    // A conclusion, CTA, or any other ordinary content ends the FAQ region and
    // remains in the article. An orphan FAQ heading is still removed.
    break;
  }

  return { faqs, consumed };
}

export function mergeBlogFAQs(...groups: BlogFAQItem[][]): BlogFAQItem[] {
  const seen = new Set<string>();
  const merged: BlogFAQItem[] = [];
  for (const group of groups) {
    for (const faq of group) {
      const question = cleanQuestion(faq.question);
      const answer = faq.answer.trim();
      const key = blogFAQQuestionKey(question);
      if (!question || !answer || !key || seen.has(key)) continue;
      seen.add(key);
      merged.push({ question, answer });
    }
  }
  return merged;
}

export function blogFAQSchemaText(answer: string): string {
  return answer
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePortableBlogContent(
  input: unknown[] | null,
  postTitle: string,
  supplementalFAQs: BlogFAQItem[] = [],
): {
  body: PortableBlock[];
  faqs: BlogFAQItem[];
  toc: BlogTOCItem[];
  inlineAccordionQuestions: string[];
} {
  const source = flattenLegacyLists(
    (Array.isArray(input) ? input : []).filter(
      (block): block is PortableBlock =>
        Boolean(
          block &&
          typeof block === "object" &&
          typeof (block as Record<string, unknown>)._type === "string",
        ),
    ),
  );

  if (source[0]?.style === "h1") source.shift();
  else if (
    source[0]?.style === "h2" &&
    normalizeComparable(portableBlockText(source[0])) === normalizeComparable(postTitle)
  ) {
    source.shift();
  }

  const consumed = new Set<number>();
  const sourcedFAQs: BlogFAQItem[] = [];

  source.forEach((block, index) => {
    if (extractableFAQAccordion(block, index, source.length, supplementalFAQs)) {
      consumed.add(index);
      sourcedFAQs.push(...accordionFAQs(block));
    }
  });

  source.forEach((block, index) => {
    if (consumed.has(index) || !isFAQHeading(block)) return;
    const region = explicitFAQRegion(source, index);
    region.consumed.forEach((item) => consumed.add(item));
    sourcedFAQs.push(...region.faqs);
  });

  const body = source.filter((_, index) => !consumed.has(index));
  const inlineAccordionQuestions = body.flatMap((block) => {
    if (block._type !== "accordion" || !Array.isArray(block.items)) return [];
    return block.items.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const question = (item as Record<string, unknown>).question;
      return typeof question === "string" ? [cleanQuestion(question)] : [];
    });
  });
  const usedIds = new Set<string>();
  const toc = body.flatMap((block) => {
    if (block._type !== "block" || block.style !== "h2") return [];
    const label = portableBlockText(block);
    if (!label) return [];
    const baseId = slugifyBlogHeading(label);
    if (!baseId) return [];
    if (usedIds.has(baseId)) return [];
    usedIds.add(baseId);
    return [{ id: baseId, label }];
  });

  return { body, faqs: mergeBlogFAQs(sourcedFAQs), toc, inlineAccordionQuestions };
}
