export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "lenders-title-insurance-vs-owners-title-insurance",
    title: "Lender's vs Owner's Title Insurance: What's the Difference?",
    date: "March 17, 2026",
    dateISO: "2026-03-17",
    excerpt: "Lender's and owner's title insurance protect different parties in a real estate transaction. This guide explains how each policy works, what they cover, and why both matter when buying a home in DC, Maryland, or Virginia.",
    category: "Title Insurance",
    readTime: "6 min read",
    image: "/blog/lenders-title-insurance-vs-owners-title-insurance.png",
  },
  {
    slug: "what-is-a-title-settlement-fee",
    title: "What Is a Title Settlement Fee? A Complete Breakdown",
    date: "March 19, 2026",
    dateISO: "2026-03-19",
    excerpt: "Title settlement fees are one of the most common line items at closing — and one of the least understood. Here's what the fee covers, how it's calculated, and what DMV buyers and sellers should expect.",
    category: "Closing Costs",
    readTime: "5 min read",
    image: "/blog/what-is-a-title-settlement-fee.png",
  },
  {
    slug: "what-does-a-title-company-do",
    title: "What Does a Title Company Do? The Complete Guide",
    date: "March 20, 2026",
    dateISO: "2026-03-20",
    excerpt: "Title companies play a critical role in every real estate transaction — from conducting title searches to issuing insurance and coordinating closings. Here's exactly what a title company does and why it matters.",
    category: "Education",
    readTime: "7 min read",
    image: "/blog/what-does-a-title-company-do.png",
  },
  {
    slug: "standard-vs-enhanced-title-insurance",
    title: "Standard vs Enhanced Title Insurance: Which Policy Do You Need?",
    date: "March 20, 2026",
    dateISO: "2026-03-20",
    excerpt: "Standard and enhanced title insurance policies offer different levels of coverage. This guide compares the two, explains when enhanced coverage is worth it, and what DMV buyers should know before choosing a policy.",
    category: "Title Insurance",
    readTime: "6 min read",
    image: "/blog/standard-vs-enhanced-title-insurance.png",
  },
  {
    slug: "closing-costs-in-virginia-2026",
    title: "Closing Costs in Virginia (2026): What Buyers and Sellers Actually Pay",
    date: "March 14, 2026",
    dateISO: "2026-03-14",
    excerpt: "A detailed breakdown of closing costs in Virginia for 2026 — what buyers pay, what sellers pay, and how to estimate your total costs before settlement day.",
    category: "Closing Costs",
    readTime: "8 min read",
    image: "/blog/closing-costs-in-virginia-2026.png",
  },
  {
    slug: "title-companies-in-northern-virginia",
    title: "Title Companies in Northern Virginia: What to Look For",
    date: "March 12, 2026",
    dateISO: "2026-03-12",
    excerpt: "Choosing the right title company in Northern Virginia can make or break your closing experience. Here's what agents, buyers, and sellers should look for.",
    category: "Title Insurance",
    readTime: "6 min read",
    image: "/blog/title-companies-in-northern-virginia.png",
  },
  {
    slug: "title-companies-fredericksburg-va",
    title: "Title Companies in Fredericksburg, VA: A Local Guide",
    date: "March 10, 2026",
    dateISO: "2026-03-10",
    excerpt: "Looking for a title company in Fredericksburg, Virginia? Here's what to know about title and settlement services in the Fredericksburg area.",
    category: "Title Insurance",
    readTime: "5 min read",
    image: "/blog/title-companies-fredericksburg-va.png",
  },
];

const TODAY_ISO = new Date().toISOString().slice(0, 10);

export const PUBLISHED_BLOG_POSTS: BlogPost[] = BLOG_POSTS
  .filter((post) => post.dateISO <= TODAY_ISO)
  .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPublishedBlogPost(slug: string): BlogPost | undefined {
  return PUBLISHED_BLOG_POSTS.find((p) => p.slug === slug);
}
