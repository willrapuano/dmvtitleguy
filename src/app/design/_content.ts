/**
 * Shared copy for the three design directions under /design.
 *
 * All three mockups render this same content so the comparison isolates design
 * decisions — typeface, palette, composition, iconography — instead of wording.
 * Copy is lifted from the live homepage; nothing here is invented.
 */

export const BRAND = {
  name: "DMV Title Guy",
  legal: "Pruitt Title LLC",
  operator: "Will Rapuano",
  phone: "(703) 859-1467",
  phoneHref: "tel:+17038591467",
  email: "wrapuano@pruitt-title.com",
  address: "1900 Gallows Rd Suite 230, Vienna, VA 22182",
};

export const HERO = {
  eyebrow: "Pruitt Title LLC · DMV Title Guy",
  // Shortened from the live 16-word H1, which needed five lines on a phone.
  headline: "Title & settlement services across Virginia, Maryland, and DC",
  standfirst:
    "Fast closings. Local expertise. No surprises. Independent title and escrow support for residential, refinance, and builder transactions.",
  primaryCta: { label: "Get a title quote", href: "/calculators/title-quote" },
  secondaryCta: { label: "Open title", href: "/request-title-review" },
};

/**
 * "17+ years" and the three jurisdictions come from the live site's own copy.
 * The third slot is a layout placeholder — swap in a real figure before any of
 * this ships, since none of these mockups should invent business claims.
 */
export const PROOF = [
  { value: "17+", label: "Years serving Fairfax County" },
  { value: "3", label: "Jurisdictions: DC, MD, VA" },
  { value: "—", label: "[placeholder stat — your number here]" },
];

/**
 * Placeholder, NOT a real quote. Direction C's layout needs a first-person line
 * to show how a testimonial sits in it; putting invented words under a real
 * person's name is not something to leave lying around, so it is labelled.
 */
export const PLACEHOLDER_QUOTE =
  "[Placeholder pull-quote — one line in your own words about how you work with clients.]";

/** `icon` names map to lucide-react exports, replacing the emoji on the live site. */
export const AUDIENCES = [
  {
    icon: "Home",
    title: "Buyers & sellers",
    body: "Clear title work, responsive communication, and smoother purchase, sale, and refinance closings across the DMV.",
    href: "/title-insurance",
  },
  {
    icon: "Handshake",
    title: "Realtors",
    body: "Faster communication, fewer closing surprises, and a better client experience from contract to settlement.",
    href: "/title-company-for-realtors",
  },
  {
    icon: "Landmark",
    title: "Lenders",
    body: "Reliable coordination, cleaner files, and dependable settlement support for your active pipeline.",
    href: "/title-company-for-lenders",
  },
  {
    icon: "Hammer",
    title: "Builders",
    body: "Repeatable closing support for new construction, buyer coordination, and pipeline-ready settlement execution.",
    href: "/title-company-for-builders",
  },
  {
    icon: "Building2",
    title: "Banks & credit unions",
    body: "Institutional-grade title and escrow support with the reliability and responsiveness your teams expect.",
    href: "/title-company-for-credit-unions",
  },
];

export const DIFFERENTIATORS = [
  {
    icon: "Clock",
    title: "Title & escrow that doesn't slow you down",
    body: "Fast, reliable title work and settlement coordination for purchase, refinance, resale, and builder transactions across DC, Maryland, and Virginia.",
  },
  {
    icon: "MessageSquare",
    title: "Responsive communication from contract to closing",
    body: "Buyers, agents, lenders, and builders get proactive updates, cleaner coordination, and fewer last-minute surprises at settlement.",
  },
  {
    icon: "MapPin",
    title: "Local DMV expertise for complex closings",
    body: "From Montgomery County and Bethesda to Washington DC and Northern Virginia, the team understands local taxes, title issues, and settlement workflows.",
  },
];

export const NAV = [
  { label: "Services", href: "/title-insurance" },
  { label: "Calculators", href: "/calculators" },
  { label: "Classes", href: "/my-classes" },
  { label: "Blog", href: "/blog" },
];

export const CLOSING_CTA = {
  headline: "Need to start a closing or get numbers fast?",
  body: "Start with a title quote, open title for an active transaction, or contact the team for purchase, refinance, and builder closings across the DMV.",
};

export const DIRECTIONS = [
  {
    slug: "a",
    name: "Editorial Authority",
    typeface: "Fraunces + Inter",
    idea:
      "Reads like an established firm rather than a startup. Serif display, hairline rules, asymmetric two-column composition, ink-on-paper restraint.",
  },
  {
    slug: "b",
    name: "Modern Product",
    typeface: "Space Grotesk + Inter",
    idea:
      "Borrows from software marketing: tight geometric headlines, bordered surfaces, a dark hero, and data presented as product UI.",
  },
  {
    slug: "c",
    name: "Warm Local",
    typeface: "Plus Jakarta Sans",
    idea:
      "Approachable and human. Warm sand palette, soft radii, generous scale, a single friendly voice instead of corporate distance.",
  },
];
