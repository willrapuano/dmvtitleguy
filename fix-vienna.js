const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: '4s0dloxi', dataset: 'production', apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

function block(text, key, style) {
  return { _type:'block', _key:key, style:style||'normal', children:[{_type:'span',_key:'s'+key,text}], markDefs:[] };
}

function ctaBlock(prefix, href, key) {
  const mk = 'cta'+key;
  return {
    _type:'block', _key:key, style:'normal',
    markDefs:[{_key:mk,_type:'link',href}],
    children:[
      {_type:'span',_key:'pre'+key,text:prefix+' ',marks:[]},
      {_type:'span',_key:'lnk'+key,text:'Get a free title quote \u2192',marks:[mk]},
    ]
  };
}

function addLink(body, anchor, href, slugKey) {
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (b._type !== 'block') continue;
    const fullText = (b.children||[]).map(c=>c.text||'').join('');
    if (fullText.includes(anchor) && !(b.markDefs||[]).some(m => m.href === href)) {
      const mk = 'lnk'+i+slugKey;
      const parts = fullText.split(anchor);
      body[i] = {
        ...b,
        markDefs: [...(b.markDefs||[]), {_key:mk,_type:'link',href}],
        children: [
          ...(parts[0] ? [{_type:'span',_key:'pre'+i+slugKey,text:parts[0],marks:[]}] : []),
          {_type:'span',_key:'anc'+i+slugKey,text:anchor,marks:[mk]},
          ...(parts[1] ? [{_type:'span',_key:'suf'+i+slugKey,text:parts[1],marks:[]}] : []),
        ]
      };
      return true;
    }
  }
  return false;
}

const CTA = 'https://pruitt-title.titlecapture.com/title-quote';

const PAGES = [
  {
    id: 'post-title-company-arlington-va',
    sk: 'arl',
    h1: 'Arlington Title & Settlement Services',
    ctaPrefix: 'Ready to get started on your Arlington closing?',
    seoTitle: 'Title Company in Arlington, VA | Pruitt Title & DMV Title Guy',
    seoDesc: 'Pruitt Title handles real estate closings in Arlington, VA \u2014 condos, single-family, refinances. Get a free title quote.',
    links: [
      { anchor:'closing costs in Virginia', href:'/closing-costs-in-virginia-2026' },
      { anchor:'title insurance', href:'/what-is-lenders-title-insurance' },
      { anchor:'title companies in Northern Virginia', href:'/title-companies-in-northern-virginia' },
      { anchor:'Fairfax County', href:'/title-company-fairfax-va' },
      { anchor:'Vienna', href:'/title-company-vienna-va' },
    ]
  },
  {
    id: 'post-title-company-fairfax-va',
    sk: 'fax',
    h1: 'Fairfax Title & Settlement Services',
    ctaPrefix: 'Ready to get started on your Fairfax County closing?',
    seoTitle: 'Title Company in Fairfax, VA | Pruitt Title & DMV Title Guy',
    seoDesc: 'Pruitt Title handles closings throughout Fairfax County \u2014 Burke, Chantilly, Great Falls, and everywhere in between. Get a free title quote.',
    links: [
      { anchor:'closing costs', href:'/closing-costs-in-virginia-2026' },
      { anchor:"lender's title insurance", href:'/what-is-lenders-title-insurance' },
      { anchor:'Arlington', href:'/title-company-arlington-va' },
      { anchor:'McLean', href:'/title-company-mclean-va' },
      { anchor:'Northern Virginia title companies', href:'/title-companies-in-northern-virginia' },
    ]
  },
  {
    id: 'post-title-company-mclean-va',
    sk: 'mcl',
    h1: 'McLean Title & Settlement Services',
    ctaPrefix: 'Ready to get started on your McLean closing?',
    seoTitle: 'Title Company in McLean, VA | Pruitt Title & DMV Title Guy',
    seoDesc: 'Pruitt Title handles complex closings in McLean \u2014 trusts, LLCs, estate sales, luxury transactions. Get a free title quote.',
    links: [
      { anchor:'closing costs', href:'/closing-costs-in-virginia-2026' },
      { anchor:'title insurance', href:'/what-is-lenders-title-insurance' },
      { anchor:'Arlington closings', href:'/title-company-arlington-va' },
      { anchor:'Fairfax County', href:'/title-company-fairfax-va' },
      { anchor:'Vienna and Tysons', href:'/title-company-vienna-va' },
    ]
  }
];

async function patchPage(page) {
  const post = await client.fetch('*[_id == $id][0]', { id: page.id });
  let body = [...(post.body || [])];

  // 1. Prepend H1
  body = [block(page.h1, 'h1'+page.sk, 'h1'), ...body];

  // 2. Insert CTA after first normal paragraph
  const introIdx = body.findIndex((b, i) => i > 0 && b._type === 'block' && b.style === 'normal');
  if (introIdx >= 0) {
    const cta1 = ctaBlock(page.ctaPrefix, CTA, 'c1'+page.sk);
    body = [...body.slice(0, introIdx+1), cta1, ...body.slice(introIdx+1)];
  }

  // 3. Append CTA at end
  body.push(ctaBlock(page.ctaPrefix, CTA, 'c2'+page.sk));

  // 4. Add internal links
  for (const link of page.links) {
    addLink(body, link.anchor, link.href, page.sk);
  }

  // 5. Patch Sanity
  await client.patch(page.id).set({
    body,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDesc,
  }).commit();

  console.log('✅ Patched:', page.id);
}

(async () => {
  for (const p of PAGES) await patchPage(p);
  console.log('All 3 pages done.');
})().catch(console.error);
