export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  excerpt: string;
  category: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "using-zillow-traffic-data-to-close-more-deals",
    title: "Using Zillow Traffic Data to Close More Deals: A Strategic Guide for DMV Agents",
    date: "November 14, 2025",
    dateISO: "2025-11-14",
    excerpt: "Zillow doesn't just list homes — it generates massive data about buyer behavior in your market. Learn how smart DMV agents are using Zillow traffic data to identify hot neighborhoods and close more deals.",
    category: "Marketing",
    readTime: "6 min read",
  },
  {
    slug: "how-to-choose-right-title-company-dmv",
    title: "How to Choose the Right Title Company in the DMV",
    date: "November 12, 2025",
    dateISO: "2025-11-12",
    excerpt: "Not all title companies are the same. Here's what DC, Maryland, and Virginia real estate agents and buyers should look for when selecting a title and settlement company.",
    category: "Title Insurance",
    readTime: "5 min read",
  },
  {
    slug: "closing-costs-dmv-buyers-sellers",
    title: "Closing Costs in the DMV: What Buyers and Sellers Need to Know",
    date: "October 28, 2025",
    dateISO: "2025-10-28",
    excerpt: "Closing costs in DC, Maryland, and Virginia can vary significantly. This guide breaks down what buyers and sellers should expect to pay at the settlement table in the DMV.",
    category: "Closing Costs",
    readTime: "7 min read",
  },
  {
    slug: "title-insurance-requirements-dc-md-va",
    title: "Title Insurance Requirements in DC, Maryland, and Virginia: A Comparison",
    date: "October 15, 2025",
    dateISO: "2025-10-15",
    excerpt: "Title insurance requirements differ across DC, Maryland, and Virginia. Here's a jurisdiction-by-jurisdiction comparison to help agents, lenders, and buyers understand their obligations.",
    category: "Title Insurance",
    readTime: "6 min read",
  },
  {
    slug: "title-companies-new-construction",
    title: "The Role of Title Companies in New Construction Transactions",
    date: "September 10, 2025",
    dateISO: "2025-09-10",
    excerpt: "New construction closings are more complex than resales. Learn how title companies protect buyers, builders, and lenders in new construction transactions across the DMV.",
    category: "New Construction",
    readTime: "5 min read",
  },
  {
    slug: "title-insurance-real-estate-lenders-dmv",
    title: "Why Title Insurance Matters for Real Estate Lenders in the DMV",
    date: "August 14, 2025",
    dateISO: "2025-08-14",
    excerpt: "For mortgage lenders, title insurance isn't optional — it's essential protection. Here's why lender's title insurance matters and what DMV lenders should know about title requirements.",
    category: "Lenders",
    readTime: "5 min read",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
