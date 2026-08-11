import { createClient } from '@sanity/client';
import { appendFileSync, createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, renameSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// CJS interop: dedup-check.cjs exports its similarity checks so publishing can gate on
// the same thresholds the CLI uses instead of on slug equality alone.
import dedupCheck from './dedup-check.cjs';

const { checkSimilarity } = dedupCheck;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ROOT = path.resolve(__dirname, '..');
const QUEUE_DIR = path.join(CLIENT_ROOT, 'blog-queue');
const PUBLISHED_DIR = path.join(QUEUE_DIR, 'published');
const IMAGES_DIR = path.join(QUEUE_DIR, 'images');
const PUBLISH_LOG = path.join(CLIENT_ROOT, 'logs', 'publish-log.md');
const MIN_BODY_WORDS = 300;
const API_VERSION = '2024-01-01';

const envPath = path.join(__dirname, '.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath, override: true, quiet: true });
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

function requireSanityEnv() {
  const missing = [];
  if (!projectId) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!dataset) missing.push('NEXT_PUBLIC_SANITY_DATASET');
  if (!token) missing.push('SANITY_API_TOKEN');
  if (missing.length > 0) {
    throw new Error(`${missing.join(', ')} must be present in site/.env.local`);
  }
}

let client;

function getClient() {
  requireSanityEnv();
  if (!client) {
    client = createClient({
      projectId,
      dataset,
      token,
      apiVersion: API_VERSION,
      useCdn: false,
    });
  }
  return client;
}

function genKey() {
  return randomBytes(8).toString('hex');
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const parsed = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!parsed) continue;
    let value = parsed[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[parsed[1]] = value;
  }

  return { meta, body: match[2] };
}

export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/^\/?blog\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripInlineMarkdown(text) {
  return String(text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

function wordCount(body) {
  return stripInlineMarkdown(body).trim().split(/\s+/).filter(Boolean).length;
}

function truncate(text, max) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1).trim();
}

function firstParagraph(body) {
  return body
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith('#') && !part.startsWith('---')) || '';
}

function normalizeCategory(meta = {}) {
  const value = String(meta.category || meta.category_name || meta.content_pillar || '').toLowerCase();
  if (value.includes('closing')) return 'Closing Costs';
  if (value.includes('market')) return 'Market Updates';
  if (value.includes('agent') || value.includes('realtor')) return 'For Agents';
  if (value.includes('lender') || value.includes('mortgage')) return 'For Lenders';
  if (value.includes('education') || value.includes('guide')) return 'Education';
  if (value.includes('title')) return 'Title Insurance';
  return 'Title Insurance';
}

function parseInlineContent(text) {
  const children = [];
  const markDefs = [];
  const tokenRe = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  function pushText(value, marks = []) {
    if (!value) return;
    children.push({ _type: 'span', _key: genKey(), text: value, marks });
  }

  while ((match = tokenRe.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));
    if (match[2] && match[3]) {
      const key = genKey();
      markDefs.push({ _key: key, _type: 'link', href: match[3] });
      pushText(match[2], [key]);
    } else if (match[4]) {
      pushText(match[4], ['strong']);
    } else if (match[5]) {
      pushText(match[5], ['em']);
    } else if (match[6]) {
      pushText(match[6], ['code']);
    }
    lastIndex = tokenRe.lastIndex;
  }

  pushText(text.slice(lastIndex));

  return {
    children: children.length > 0 ? children : [{ _type: 'span', _key: genKey(), text, marks: [] }],
    markDefs,
  };
}

function makeBlock(style, text, extra = {}) {
  const inline = parseInlineContent(text);
  return {
    _type: 'block',
    _key: genKey(),
    style,
    markDefs: inline.markDefs,
    children: inline.children,
    ...extra,
  };
}

function parseTable(lines) {
  const rows = [];
  for (const line of lines) {
    if (/^\|[\s\-:|]+\|$/.test(line)) {
      if (rows.length > 0) rows[rows.length - 1].isHeader = true;
      continue;
    }
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => stripInlineMarkdown(cell.trim()));
    rows.push({ _key: genKey(), _type: 'tableRow', isHeader: false, cells });
  }
  return { _type: 'table', _key: genKey(), rows };
}

function isFaqHeading(text) {
  return /^(frequently asked questions|faq|common questions)$/i.test(text.trim());
}

export function markdownToPortableText(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let inFaq = false;
  let faqItems = [];
  let currentQuestion = null;
  let currentAnswer = [];
  let table = [];

  function flushTable() {
    if (table.length > 0) {
      blocks.push(parseTable(table));
      table = [];
    }
  }

  function flushFaqItem() {
    if (currentQuestion && currentAnswer.length > 0) {
      faqItems.push({
        _key: genKey(),
        question: stripInlineMarkdown(currentQuestion),
        answer: stripInlineMarkdown(currentAnswer.join(' ').trim()),
      });
    }
    currentQuestion = null;
    currentAnswer = [];
  }

  function flushFaq() {
    flushFaqItem();
    if (faqItems.length > 0) {
      blocks.push({ _type: 'accordion', _key: genKey(), items: faqItems });
      faqItems = [];
    }
    inFaq = false;
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      table.push(trimmed);
      continue;
    }
    flushTable();

    if (!trimmed || trimmed === '---') continue;

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();

      if (level === 2 && isFaqHeading(text)) {
        if (inFaq) flushFaq();
        inFaq = true;
        continue;
      }

      if (inFaq) {
        if (level === 2 && text.endsWith('?')) {
          flushFaqItem();
          currentQuestion = text;
          continue;
        }
        flushFaq();
      }

      blocks.push(makeBlock(level === 3 ? 'h3' : 'h2', text));
      continue;
    }

    if (inFaq && currentQuestion) {
      currentAnswer.push(trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      blocks.push(makeBlock('normal', bullet[1], { listItem: 'bullet', level: 1 }));
      continue;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      blocks.push(makeBlock('normal', numbered[1], { listItem: 'number', level: 1 }));
      continue;
    }

    const quote = trimmed.match(/^>\s+(.+)$/);
    if (quote) {
      blocks.push(makeBlock('blockquote', quote[1]));
      continue;
    }

    blocks.push(makeBlock('normal', trimmed));
  }

  flushTable();
  if (inFaq) flushFaq();
  return blocks;
}

function findInternalLinks(body) {
  return [...body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/') || href.includes('dmvtitleguy.com'));
}

function hasCta(body) {
  return /(contact|schedule|request|get (a|your)|call|start|order|quote|consultation|title review)/i.test(body);
}

function hasWillApproval(meta) {
  return /^(true|yes|approved)$/i.test(String(meta.will_approved || meta.willApproved || ''))
    || /will/i.test(String(meta.approved_by || meta.approvedBy || ''));
}

function findBlockedBrands(meta, body) {
  if (hasWillApproval(meta)) return [];
  const terms = [
    'ekum',
    'williamsburg settlement',
    'qualia',
    'trackyourclosing',
    'zillow',
    'redfin',
    'realtor.com',
    'rocket mortgage',
    'first american',
    'stewart title',
    'fidelity national',
    'old republic',
    'westcor',
    'ratitlegroup',
    'kvs title',
  ];
  const haystack = `${JSON.stringify(meta)}\n${body}`.toLowerCase();
  return terms.filter((term) => haystack.includes(term));
}

function faqFormatErrors(body) {
  const lines = body.split('\n');
  const faqIndex = lines.findIndex((line) => /^##\s+(frequently asked questions|faq|common questions)\s*$/i.test(line.trim()));
  if (faqIndex === -1) return [];

  const errors = [];
  let questionCount = 0;
  for (let i = faqIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^##\s+/.test(trimmed)) {
      if (!trimmed.endsWith('?')) errors.push(`FAQ heading must be a question: line ${i + 1}`);
      else questionCount += 1;
    }
    if (/^\*\*Q:|^Q:/i.test(trimmed)) {
      errors.push(`FAQ item must use "## Question?" format: line ${i + 1}`);
    }
  }
  if (questionCount === 0) errors.push('FAQ section has no ## Question? items');
  return errors;
}

export function validatePostShape(filePath, meta, body) {
  const errors = [];
  const title = String(meta.title || '').trim();
  const rawSlug = String(meta.slug || '').trim();
  const slug = slugify(rawSlug || title || path.basename(filePath, '.md'));
  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const internalLinks = findInternalLinks(body);
  const blockedBrands = findBlockedBrands(meta, body);

  if (!title || title.length < 10) errors.push('missing or too-short title');
  if (!rawSlug) errors.push('missing slug');
  if (rawSlug.startsWith('/blog/') || rawSlug.startsWith('blog/')) errors.push('slug must be slug-only, not /blog/path');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push('invalid slug');
  if (wordCount(body) < MIN_BODY_WORDS) errors.push(`body word count must be at least ${MIN_BODY_WORDS}`);
  if (String(meta.status || '').toLowerCase() !== 'approved') errors.push('status must be approved');
  if (!meta.target_keyword) errors.push('missing target_keyword');
  if (!h1) errors.push('missing H1');
  if (h1 && stripInlineMarkdown(h1).toLowerCase() !== title.toLowerCase()) errors.push('H1 must match title');
  if (internalLinks.length < 2) errors.push('at least 2 internal links required');
  if (!hasCta(body)) errors.push('CTA required');
  if (/todo|fixme|xxx|\[notes?\]/i.test(body)) errors.push('unresolved notes or TODOs present');
  if (/^(true|yes)$/i.test(String(meta.noindex || meta.no_index || ''))) errors.push('noindex must not be true');
  if (meta.canonical && !String(meta.canonical).includes('dmvtitleguy.com') && !String(meta.canonical).startsWith('/')) {
    errors.push('canonical must be internal');
  }
  if ((meta.meta_title || meta.title_tag) && !/Pruitt Title/i.test(String(meta.meta_title || meta.title_tag))) {
    errors.push('title tag must include Pruitt Title');
  }
  if (blockedBrands.length > 0) errors.push(`blocked competitor/tool brand mention: ${blockedBrands.join(', ')}`);
  errors.push(...faqFormatErrors(body));

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  return { slug, title, internalLinks: internalLinks.length };
}

export function resolveQueueFile(file) {
  if (path.isAbsolute(file)) return file;
  const cwdRelative = path.resolve(process.cwd(), file);
  if (existsSync(cwdRelative)) return cwdRelative;
  return path.join(QUEUE_DIR, file);
}

export function sortableDate(filePath) {
  try {
    const { meta } = parseFrontmatter(readFileSync(filePath, 'utf-8'));
    const date = meta.date || meta.publish_date || meta.date_drafted || meta.created_at;
    if (date) return String(date).slice(0, 10);
  } catch {
    // Fall through to filename.
  }
  return path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || '9999-12-31';
}

export function discoverQueueFiles() {
  return readdirSync(QUEUE_DIR)
    .filter((file) => {
      if (!file.endsWith('.md')) return false;
      if (/^readme\.md$/i.test(file)) return false;
      if (file.startsWith('.')) return false;
      // Prefer dated draft filenames used by the writer cron
      if (!/^\d{4}-\d{2}-\d{2}-.+\.md$/i.test(file)) return false;
      return true;
    })
    .map((file) => path.join(QUEUE_DIR, file))
    .sort((a, b) => sortableDate(a).localeCompare(sortableDate(b)) || path.basename(a).localeCompare(path.basename(b)));
}

function safeStamp(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, '-');
}

function appendPublishLog(result) {
  mkdirSync(path.dirname(PUBLISH_LOG), { recursive: true });
  const lines = [
    `## ${new Date().toISOString()}`,
    `**Result:** ${result.status}`,
    `**Title:** ${result.title || 'n/a'}`,
    `**Slug:** ${result.slug || 'n/a'}`,
    `**File:** ${result.filePath || 'n/a'}`,
    result.archivedTo ? `**Archived To:** ${result.archivedTo}` : null,
    result.reason ? `**Reason:** ${result.reason}` : null,
    result.error ? `**Error:** ${result.error}` : null,
    `**Sanity Project:** ${projectId}`,
    `**Dataset:** ${dataset}`,
    '',
  ].filter(Boolean).join('\n');
  appendFileSync(PUBLISH_LOG, lines);
}

function archivePublishedFile(filePath) {
  mkdirSync(PUBLISHED_DIR, { recursive: true });
  const target = path.join(PUBLISHED_DIR, `${safeStamp()}--${path.basename(filePath)}`);
  renameSync(filePath, target);
  return target;
}

async function uploadImage(slug, title) {
  const imagePath = ['png', 'jpg', 'jpeg', 'webp']
    .map((ext) => path.join(IMAGES_DIR, `${slug}.${ext}`))
    .find((candidate) => existsSync(candidate));
  if (!imagePath) return undefined;

  const asset = await getClient().assets.upload('image', createReadStream(imagePath), {
    filename: path.basename(imagePath),
  });

  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: title,
  };
}

export async function checkExistingPost(slug) {
  return getClient().fetch(`*[_type == "post" && slug.current == $slug][0]._id`, { slug });
}

/**
 * Slug equality is not a duplicate check.
 *
 * checkExistingPost only asks "is this exact slug taken". Two posts got published with
 * identical titles and ~97% identical bodies under slugs that differed only by a
 * "-dmv" suffix, because each was a new slug and nothing compared the titles. The
 * repo already had the right logic in dedup-check.cjs — its header even calls itself
 * "MANDATORY before publishing ANY post" — but nothing invoked it, and importing it
 * used to exit the process.
 *
 * This runs those same thresholds against every published title before a write.
 * Returns the blocking matches; an empty array means clear to publish.
 */
export async function findDuplicateTitles(title, keyword) {
  const existing = await getClient().fetch(
    `*[_type == "post" && !(_id in path("drafts.**"))]{"slug":slug.current, title}`
  );
  const blocking = [];
  for (const post of existing) {
    if (!post?.title) continue;
    const issues = checkSimilarity(title, keyword || '', post.title);
    const fatal = issues.filter((i) => i.level === 'DUPLICATE');
    if (fatal.length) blocking.push({ slug: post.slug, title: post.title, reasons: fatal.map((f) => f.reason) });
  }
  return blocking;
}

export async function publishPost(filePath, options = {}) {
  const resolved = resolveQueueFile(filePath);
  if (!existsSync(resolved)) throw new Error(`file not found: ${resolved}`);

  const content = readFileSync(resolved, 'utf-8');
  const { meta, body } = parseFrontmatter(content);
  const shape = validatePostShape(resolved, meta, body);
  const { slug, title } = shape;
  const existing = await checkExistingPost(slug);

  if (existing) {
    const result = {
      status: 'skipped-existing',
      slug,
      title,
      filePath: resolved,
      reason: `existing Sanity post ${existing}`,
    };
    if (!options.dryRun) {
      if (options.archive) result.archivedTo = archivePublishedFile(resolved);
      appendPublishLog(result);
    }
    return result;
  }

  // The slug is free, but the title may still duplicate a live post. Gate before any
  // write, and before spending an image upload on a post that should not exist.
  if (!options.allowDuplicateTitle && !hasWillApproval(meta)) {
    const clashes = await findDuplicateTitles(title, meta.keyword || meta.target_keyword);
    if (clashes.length) {
      const result = {
        status: 'skipped-duplicate-title',
        slug,
        title,
        filePath: resolved,
        reason: clashes
          .map((c) => `"${c.title}" (/${c.slug}) — ${c.reasons.join(', ')}`)
          .join(' | '),
      };
      if (!options.dryRun) appendPublishLog(result);
      return result;
    }
  }

  const blocks = markdownToPortableText(body);
  if (blocks.length < 5) throw new Error(`Portable Text conversion produced only ${blocks.length} blocks`);

  const excerpt = truncate(meta.excerpt || meta.meta_description || meta.description || firstParagraph(body), 290);
  const publishDate = String(meta.date || meta.publish_date || sortableDate(resolved)).slice(0, 10);
  const doc = {
    _id: `post-${slug}`,
    _type: 'post',
    title,
    slug: { _type: 'slug', current: slug },
    excerpt,
    category: normalizeCategory(meta),
    publishedAt: `${publishDate === '9999-12-31' ? new Date().toISOString().slice(0, 10) : publishDate}T12:00:00.000Z`,
    readTime: `${Math.max(1, Math.ceil(wordCount(body) / 200))} min read`,
    body: blocks,
  };

  // Image relevance gates (Will standing order 2026-07-31 + 2026-08-05)
  const fmPrompt = String(meta.image_prompt || meta.imagePrompt || '').trim();
  const fmAlt = String(meta.mainImageAlt || meta.image_alt || meta.imageAlt || '').trim();
  const promptPath = path.join('/Users/jarvis/.openclaw/workspace/taz/image-prompts', `${slug}.txt`);
  let filePrompt = '';
  if (existsSync(promptPath)) {
    filePrompt = readFileSync(promptPath, 'utf8').trim();
  }
  const imagePrompt = fmPrompt || filePrompt;
  if (!imagePrompt) {
    throw new Error(`BLOCK_PUBLISH_IMAGE_PROMPT_MISSING: slug "${slug}" needs image_prompt frontmatter or taz/image-prompts/${slug}.txt`);
  }
  const mainImageAlt = fmAlt || title;
  if (!mainImageAlt || /^(image|photo|picture|featured image|blog image|untitled|placeholder)$/i.test(mainImageAlt)) {
    throw new Error(`BLOCK_PUBLISH_IMAGE_ALT_WEAK: slug "${slug}" mainImageAlt missing/generic`);
  }

  const image = await uploadImage(slug, title, mainImageAlt);
  if (!image) {
    throw new Error(
      `BLOCK_PUBLISH_WITHOUT_IMAGE: missing required featured image for slug "${slug}" (expected blog-queue/images/${slug}.{png|jpg|jpeg|webp})`,
    );
  }
  doc.mainImage = image;

  if (options.dryRun) {
    return { status: 'dry-run', slug, title, filePath: resolved, blocks: blocks.length, category: doc.category };
  }

  await getClient().createOrReplace(doc);
  const verify = await getClient().fetch(`*[_id == $id][0]{"bodyLen": length(body), "title": title}`, { id: doc._id });
  if (!verify || verify.bodyLen < 5) {
    await getClient().delete(doc._id).catch(() => {});
    throw new Error('post-publish body verification failed');
  }

  const result = {
    status: 'published',
    slug,
    title,
    filePath: resolved,
    blocks: verify.bodyLen,
    category: doc.category,
    url: `https://dmvtitleguy.com/blog/${slug}`,
  };
  if (options.archive) result.archivedTo = archivePublishedFile(resolved);
  appendPublishLog(result);
  return result;
}

function parseArgs(argv) {
  const args = { all: false, dryRun: false, archive: true, files: [], allowDuplicateTitle: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') args.all = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--no-archive') args.archive = false;
    else if (arg === '--allowDuplicateTitle') args.allowDuplicateTitle = true;
    else if (arg === '--file') args.files.push(argv[++i]);
    else if (arg.startsWith('--')) throw new Error(`unknown option: ${arg}`);
    else args.files.push(arg);
  }
  if (!args.all && args.files.length === 0) throw new Error('pass files or --all');
  return args;
}

export async function publishQueue(options = {}) {
  const files = (options.files?.length ? options.files.map(resolveQueueFile) : discoverQueueFiles());
  const results = [];
  for (const file of files) {
    try {
      results.push(await publishPost(file, options));
    } catch (err) {
      const result = { status: 'error', filePath: file, error: err.message };
      results.push(result);
      if (!options.dryRun) appendPublishLog(result);
    }
  }
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const results = await publishQueue({
    files: args.all ? [] : args.files,
    dryRun: args.dryRun,
    archive: args.archive,
    allowDuplicateTitle: args.allowDuplicateTitle,
  });

  console.log(`DMVTitleGuy blog publisher (${args.dryRun ? 'dry-run' : 'publish'})`);
  for (const result of results) {
    const id = result.slug || path.basename(result.filePath || '');
    console.log(`${result.status}: ${id}${result.error ? ` - ${result.error}` : ''}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
