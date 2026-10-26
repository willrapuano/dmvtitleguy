import type { Metadata } from "next";
import Link from "next/link";
import { LocalTitleCompanyPage, type LocalTitleCompanyContent } from "@/components/LocalTitleCompanyPage";
import { DEFAULT_OG_IMAGE } from "@/lib/site-metadata";

const title = "Vienna VA Title Company & Title Insurance | Pruitt Title";
const description =
  "Buying or selling in Vienna, VA? Will Rapuano and Pruitt Title handle title insurance and settlement from their Vienna office. See costs and get a quote.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/title-company/vienna-va" },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title,
    description,
    url: "https://dmvtitleguy.io/title-company/vienna-va",
    type: "website",
  },
};

const content: LocalTitleCompanyContent = {
  town: "Vienna",
  slug: "title-company/vienna-va",
  county: "Fairfax County",
  schemaDescription:
    "Title insurance and settlement for Vienna, VA buyers and sellers with Will Rapuano and Pruitt Title, including costs, taxes and how a Vienna closing works.",
  intro: (
    <>
      <p>
        Will Rapuano and the Pruitt Title team handle title insurance and settlement for Vienna home purchases, sales
        and refinances. Will&apos;s office is in Vienna, at 1900 Gallows Road.
      </p>
    </>
  ),
  localNotes: [
    {
      heading: "Will's office is in Vienna",
      body: (
        <p>
          Will Rapuano, Pruitt Title, 1900 Gallows Rd Ste 230, Vienna, VA 22182. Call (703) 859-1467 to set up a closing or ask a title question.
        </p>
      ),
    },
    {
      heading: "Vienna is a town inside Fairfax County",
      body: (
        <>
          <p>
            A Vienna purchase uses Fairfax County&apos;s recording rates, and the deed records with the Fairfax Circuit
            Court Clerk at the county courthouse in Fairfax. The town doesn&apos;t add a recordation or transfer tax.
          </p>
          <p>
            Vienna homeowners pay real estate tax twice: to the Town of Vienna (19 cents per $100 of assessed value in
            2026) and to Fairfax County ($1.12 per $100). The settlement statement prorates both bills between buyer and
            seller, so expect two tax lines instead of one.
          </p>
        </>
      ),
    },
    {
      heading: "Investor or pre-purchase title search",
      body: (
        <p>
          Buying at auction, off-market or as an investor, and want the title searched before you commit? See the{" "}
          <Link href="/title-search-vienna-va" className="text-brand-blue-deep hover:underline">Vienna title search guide</Link>.
        </p>
      ),
    },
  ],
  faqs: [
    {
      question: "How much is title insurance in Vienna, VA?",
      answer:
        "It depends on the price, the loan and the insurer. At Pruitt Title's rates (a First American Eagle owner's policy, before discounts), the owner's policy on a $600,000 home is $2,968 and the lender's policy issued with it is $200. Virginia insurers can negotiate their rates, so compare quotes.",
    },
    {
      question: "Do I need owner's title insurance in Vienna?",
      answer:
        "Your lender requires a lender's policy, which protects only the loan. The owner's policy is optional. It protects you and your heirs for as long as you own the home, for a one-time premium at closing.",
    },
    {
      question: "Who pays for title insurance in Vienna, VA?",
      answer:
        "The buyer customarily pays for both the owner's and the lender's policies in Virginia. The seller pays the grantor tax and the Northern Virginia transportation fees. The contract can divide costs differently.",
    },
    {
      question: "Can I use a different title company than the one the seller suggests?",
      answer:
        "Yes. In Virginia the buyer chooses the settlement agent, and a seller can't require a particular company as a condition of the sale (Va. Code § 55.1-1006).",
    },
    {
      question: "Where can I sign for a Vienna closing?",
      answer:
        "Signing options depend on the lender, the documents and the transaction. Ask Will which office, evening, weekend, mobile or remote options work for your closing.",
    },
  ],
  related: [
    { href: "/closing-costs-fairfax-va", label: "Fairfax County closing cost calculator" },
    { href: "/title-insurance", label: "What title insurance covers" },
    { href: "/blog/who-chooses-the-title-company-in-virginia", label: "Who chooses the title company in Virginia" },
    { href: "/title-company/fairfax-va", label: "Title company in Fairfax" },
    { href: "/title-company-tysons-va", label: "Title company in Tysons" },
    { href: "/title-search-vienna-va", label: "Vienna title search for investors" },
  ],
};

export default function ViennaTitleCompanyPage() {
  return <LocalTitleCompanyPage content={content} />;
}
