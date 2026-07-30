import { createClient } from '@sanity/client';
import { requireSanityToken } from './sanity-token.mjs';

// See push-posts.mjs — same reason: accept the project-specific token names, not just
// the bare SANITY_API_TOKEN the README tells you to leave free.
const client = createClient({
  projectId: '4s0dloxi',
  dataset: 'production',
  token: requireSanityToken('4s0dloxi'),
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Helper functions
function p(text) {
  return { _type: 'block', _key: Math.random().toString(36).slice(2), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }] };
}
function h2(text) {
  return { _type: 'block', _key: Math.random().toString(36).slice(2), style: 'h2', markDefs: [], children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }] };
}
function h3(text) {
  return { _type: 'block', _key: Math.random().toString(36).slice(2), style: 'h3', markDefs: [], children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }] };
}
function li(text) {
  return { _type: 'block', _key: Math.random().toString(36).slice(2), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }] };
}
function liBold(boldText, rest) {
  return { _type: 'block', _key: Math.random().toString(36).slice(2), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: boldText, marks: ['strong'] }, { _type: 'span', _key: Math.random().toString(36).slice(2), text: rest, marks: [] }] };
}

// Convert markdown to Portable Text blocks
function markdownToBlocks(md) {
  const blocks = [];
  const lines = md.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (line.startsWith('## ')) {
      blocks.push(h2(line.slice(3)));
      i++;
    } else if (line.startsWith('### ')) {
      blocks.push(h3(line.slice(4)));
      i++;
    } else if (line.startsWith('*   **')) {
      // Bold list item
      const match = line.match(/^\*\s+\*\*([^*]+)\*\*(.*)$/);
      if (match) {
        blocks.push(liBold(match[1], match[2]));
      } else {
        blocks.push(li(line.slice(2).trim()));
      }
      i++;
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      blocks.push(li(line.slice(2).trim()));
      i++;
    } else if (line === '') {
      i++;
    } else {
      // Regular paragraph - collect consecutive lines
      let para = line;
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('#') && !lines[i].trim().startsWith('*') && !lines[i].trim().startsWith('-')) {
        para += ' ' + lines[i].trim();
        i++;
      }
      blocks.push(p(para));
    }
  }
  
  return blocks;
}

const postsToFix = [
  { id: 'DBmeQAqrrqsRmgjLpZV0BF', slug: 'title-search-refinance' },
  { id: 'DBmeQAqrrqsRmgjLpZV0GR', slug: 'alexandria-va-housing-market-april-2026' }
];

for (const post of postsToFix) {
  console.log(`Fixing ${post.slug}...`);
  
  // Fetch the post
  const doc = await client.fetch(`*[_type == "post" && _id == $id][0]{body}`, { id: post.id });
  
  if (typeof doc.body === 'string') {
    const blocks = markdownToBlocks(doc.body);
    console.log(`  Converted to ${blocks.length} blocks`);
    
    await client.patch(post.id).set({ body: blocks }).commit();
    console.log(`  ✓ Updated`);
  } else {
    console.log(`  Already an array, skipping`);
  }
}

console.log('Done!');
