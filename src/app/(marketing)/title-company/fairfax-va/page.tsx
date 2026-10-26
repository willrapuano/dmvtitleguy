import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCostCalculator } from "@/components/ClosingCostCalculator";
import { LocalTitleCompanyPage, type LocalTitleCompanyContent } from "@/components/LocalTitleCompanyPage";
import { regionalTransportationFeeRate, vaLocalRecordationRate } from "@/data/closingCostData";
import { DEFAULT_OG_IMAGE } from "@/lib/site-metadata";

const title = "Fairfax VA Title Company & Title Insurance | Pruitt Title";
const description =
  "Buying or selling in Fairfax, VA? Will Rapuano and Pruitt Title handle title insurance and settlement in Fairfax County and the City of Fairfax. Get a quote.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/title-company/fairfax-va" },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title,
    description,
    url: "https://dmvtitleguy.io/title-company/fairfax-va",
    type: "website",
  },
};

const content: LocalTitleCompanyContent = {
  town: "Fairfax",
  slug: "title-company/fairfax-va",
  county: "Fairfax County",
  schemaDescription:
    "Title insurance and settlement for Fairfax, VA buyers and sellers with Will Rapuano and Pruitt Title, including costs, taxes and how a Fairfax closing works.",
  intro: (
    <p>
      Will Rapuano and the Pruitt Title team handle title insurance and settlement for home purchases, sales and
      refinances in Fairfax County and the City of Fairfax. Will&apos;s office is nearby in Vienna.
    </p>
  ),
  localNotes: [
    {
      heading: "Fairfax County and the City of Fairfax are separate",
      body: (
        <>
          <p>
            A Fairfax mailing address can mean Fairfax County or the City of Fairfax, an independent city surrounded by
            the county. The deed records at the same place either way: the Fairfax Circuit Court&apos;s Land Records
            Division, at the county courthouse on Chain Bridge Road, takes documents for both.
          </p>
          <p>
            The taxes differ. City of Fairfax homeowners pay City of Fairfax real estate tax instead of the county&apos;s,
            and the settlement statement prorates whichever bill applies. The cost example above uses Fairfax County
            rates. For a City of Fairfax property, the city can add a local recordation tax of
            one-third of the state tax only if it levies one, so ask Will or the Circuit Court Clerk to confirm.
          </p>
        </>
      ),
    },
    {
      heading: "Investor or pre-purchase title search",
      body: (
        <p>
          Buying at auction, off-market or as an investor, and want the title searched before you commit? See the{" "}
          <Link href="/title-search-fairfax-va" className="text-brand-blue-deep hover:underline">Fairfax title search guide</Link>.
        </p>
      ),
    },
  ],
  faqs: [
    {
      question: "How much is title insurance in Fairfax, VA?",
      answer:
        "It depends on the price, the loan and the insurer. In Stewart's published Virginia schedule, before discounts, a standard owner's policy on a $600,000 home is $2,472.50 and the lender's policy issued with it is $200. Virginia insurers can negotiate their rates, so compare quotes.",
    },
    {
      question: "Who pays transfer taxes in Fairfax?",
      answer:
        "By custom the seller pays the Virginia grantor tax ($0.50 per $500 of the price) and the Northern Virginia transportation fees ($0.20 per $100). The buyer pays the state and local recordation taxes on the deed and the loan. The contract can change that.",
    },
    {
      question: "Do I need owner's title insurance in Fairfax?",
      answer:
        "Your lender requires a lender's policy, which protects only the loan. The owner's policy is optional. It protects you and your heirs for as long as you own the home, for a one-time premium at closing.",
    },
    {
      question: "Can I use a different title company than the one the seller suggests?",
      answer:
        "Yes. In Virginia the buyer chooses the settlement agent, and a seller can't require a particular company as a condition of the sale (Va. Code § 55.1-1006).",
    },
    {
      question: "Can I schedule a weekend closing in Fairfax?",
      answer:
        "Signing options depend on the lender, the documents and the transaction. Ask Will which office, evening, weekend, mobile or remote options work for your closing.",
    },
  ],
  related: [
    { href: "/closing-costs-fairfax-va", label: "Fairfax County closing cost calculator" },
    { href: "/title-insurance", label: "What title insurance covers" },
    { href: "/blog/who-chooses-the-title-company-in-virginia", label: "Who chooses the title company in Virginia" },
    { href: "/title-company/vienna-va", label: "Title company in Vienna" },
    { href: "/title-company-mclean-va", label: "Title company in McLean" },
    { href: "/title-company/arlington-va", label: "Title company in Arlington" },
    { href: "/title-search-fairfax-va", label: "Fairfax title search for investors" },
  ],
  calculator: (
    <ClosingCostCalculator
      state="VA"
      cityOverrides={{
        localRecordationTaxRate: vaLocalRecordationRate("Fairfax County"),
        regionalTransportationFeeRate: regionalTransportationFeeRate("Fairfax County"),
      }}
    />
  ),
};

export default function FairfaxTitlePage() {
  return <LocalTitleCompanyPage content={content} />;
}
