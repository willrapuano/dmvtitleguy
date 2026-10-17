export type Tier = 1 | 2;
export type StateCode = "VA" | "MD" | "DC";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Location {
  city: string;
  slug: string;
  state: StateCode;
  county: string;
  tier: Tier;
  /** Parent market page for neighborhood/sub-area pages */
  parentSlug?: string;
  /** Tier 3 communities to mention as "also serving" */
  alsoServing?: string[];
  /** FAQ content for SEO keyword expansion (Phase 4) */
  faqs?: FaqItem[];
}

export interface County {
  name: string;
  slug: string;
  state: StateCode;
  fullName: string;
}

// ─── Tier 1 — Primary Markets ─────────────────────────────────────────────────
export const TIER1_LOCATIONS: Location[] = [
  { city: "Washington DC",    slug: "title-company-washington-dc",    state: "DC", county: "—",                              tier: 1, faqs: [
      { question: "Where are deeds recorded in Washington, DC?", answer: "Deeds are recorded by the DC Recorder of Deeds, part of the Office of Tax and Revenue. DC has no county layer, so the District sets every deed tax." },
      { question: "What are the DC recordation and transfer tax rates?", answer: "Each tax is 1.1% of the price below $400,000 and 1.45% at $400,000 or more (D.C. Code \u00a7\u00a7 42-1103 and 47-903). The seller owes the transfer tax by law, and the buyer customarily pays the recordation tax." },
      { question: "Is there a DC first-time homebuyer break on recordation tax?", answer: "Yes. Qualifying first-time DC homebuyers pay a reduced recordation tax rate of 0.725% instead of 1.1% or 1.45% (D.C. Code \u00a7 42-1103(e)). It is a reduced rate, not a full exemption." },
      { question: "Do I need an attorney to close on a house in DC?", answer: "A notary or a title company's settlement agent can conduct the closing. Preparing the deed and other documents that affect title is the practice of law in DC (D.C. Court of Appeals Rule 49), so DC title companies work with a DC-licensed attorney for that part." },
      { question: "Who pays for owner's title insurance in DC?", answer: "The buyer customarily pays for both the owner's and lender's title insurance policies in DC, though the contract can change that." },
    ] },
  { city: "Arlington",        slug: "title-company-arlington-va",     state: "VA", county: "Arlington County",               tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in Arlington?", answer: "Deeds are recorded by the Land Records Division of the Arlington County Circuit Court, at 1425 N. Courthouse Road. The same office records deeds for the City of Falls Church, which has recorded there since 1988." },
      { question: "What taxes does a seller pay when selling a home in Arlington?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Arlington?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Arlington County adds its local recordation tax of $0.0833 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
      { question: "Who pays for owner's title insurance in Arlington?", answer: "The buyer customarily pays for both the owner's and lender's title insurance policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "Alexandria",       slug: "title-company-alexandria-va",    state: "VA", county: "Alexandria (independent city)",  tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in Alexandria?", answer: "Alexandria is an independent city, so deeds are recorded by the Clerk of the Alexandria Circuit Court, not by a county." },
      { question: "What taxes does a seller pay when selling a home in Alexandria?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Alexandria?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. The City of Alexandria adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
      { question: "Who pays for owner's title insurance in Alexandria?", answer: "The buyer customarily pays for both the owner's and lender's title insurance policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "Fairfax",          slug: "title-search-fairfax-va",       state: "VA", county: "Fairfax County",                 tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in Fairfax County?", answer: "Deeds are recorded by the Clerk of the Fairfax County Circuit Court in Fairfax, which records land records for Fairfax County and the City of Fairfax." },
      { question: "What taxes does a seller pay when selling a home in Fairfax County?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Fairfax County?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Fairfax County adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
      { question: "Who pays for owner's title insurance in Fairfax County?", answer: "The buyer customarily pays for both the owner's and lender's title insurance policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "McLean",           slug: "title-company-mclean-va",        state: "VA", county: "Fairfax County",                 tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in McLean?", answer: "McLean is an unincorporated community in Fairfax County. Deeds are recorded by the Clerk of the Fairfax County Circuit Court in Fairfax, which records land records for Fairfax County and the City of Fairfax." },
      { question: "What taxes does a seller pay when selling a home in McLean?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in McLean?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Fairfax County adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
    ] },
  { city: "Vienna",           slug: "title-search-vienna-va",        state: "VA", county: "Fairfax County",                 tier: 1, alsoServing: ["Oakton"], faqs: [
      { question: "What does a title company do in Vienna, VA?", answer: "A title company in Vienna performs the title search, issues title insurance, manages escrow funds, and conducts the closing settlement — ensuring the property transfers cleanly from seller to buyer." },
      { question: "How long does the closing process take in Northern Virginia?", answer: "Most closings in Northern Virginia take 30–45 days from contract to settlement. The timeline depends on your lender's underwriting speed, any title issues discovered during the search, and the closing date set in your purchase contract." },
      { question: "Do I need owner's title insurance in Virginia?", answer: "Owner's title insurance is optional but strongly recommended. It protects you against hidden title defects, forged documents, unpaid liens, and errors in public records — for a one-time premium paid at closing." },
      { question: "Where are Vienna deeds recorded?", answer: "Vienna is a town inside Fairfax County, so deeds are recorded by the Clerk of the Fairfax County Circuit Court." },
      { question: "Do Vienna homeowners pay town and county real estate taxes?", answer: "Yes. Homes in the Town of Vienna pay the Town of Vienna real estate tax in addition to the Fairfax County real estate tax, and the settlement statement prorates both." },
      { question: "Who pays for owner's title insurance in Vienna, VA?", answer: "The buyer customarily pays for both the owner's and lender's policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "Reston",           slug: "title-company-reston-va",        state: "VA", county: "Fairfax County",                 tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in Reston?", answer: "Reston is an unincorporated community in Fairfax County. Deeds are recorded by the Clerk of the Fairfax County Circuit Court in Fairfax, which records land records for Fairfax County and the City of Fairfax." },
      { question: "What taxes does a seller pay when selling a home in Reston?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Reston?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Fairfax County adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
      { question: "Who pays for owner's title insurance in Reston?", answer: "The buyer customarily pays for both the owner's and lender's title insurance policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "Ashburn",          slug: "title-company-ashburn-va",       state: "VA", county: "Loudoun County",                 tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in Ashburn?", answer: "Ashburn is an unincorporated community in Loudoun County. Deeds are recorded by the Clerk of the Loudoun County Circuit Court in Leesburg." },
      { question: "What taxes does a seller pay when selling a home in Ashburn?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Ashburn?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Loudoun County adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
    ] },
  { city: "Leesburg",         slug: "title-company-leesburg-va",      state: "VA", county: "Loudoun County",                 tier: 1, faqs: [
      { question: "Where are deeds recorded for a home in Leesburg?", answer: "Leesburg is the Loudoun County seat. Deeds are recorded by the Clerk of the Loudoun County Circuit Court in Leesburg." },
      { question: "What taxes does a seller pay when selling a home in Leesburg?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Leesburg?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Loudoun County adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
    ] },
  { city: "Woodbridge",       slug: "title-company-woodbridge-va",    state: "VA", county: "Prince William County",          tier: 1, alsoServing: ["Dale City", "Lake Ridge", "Dumfries", "Occoquan"], faqs: [
      { question: "Where are deeds recorded for a home in Woodbridge?", answer: "Woodbridge is in Prince William County. Deeds are recorded by the Clerk of the Prince William County Circuit Court at the Judicial Center, 9311 Lee Avenue in Manassas." },
      { question: "What taxes does a seller pay when selling a home in Woodbridge?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Woodbridge?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Prince William County adds its local recordation tax of about $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
      { question: "Who pays for owner's title insurance in Woodbridge?", answer: "The buyer customarily pays for both the owner's and lender's title insurance policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "Fredericksburg",   slug: "title-company-fredericksburg-va",state: "VA", county: "Fredericksburg (independent city)", tier: 1 },
  { city: "Bethesda",         slug: "title-company-bethesda-md",      state: "MD", county: "Montgomery County",              tier: 1, alsoServing: ["Chevy Chase"], faqs: [
      { question: "How does a title search work in Maryland?", answer: "In Maryland, a title company examines public records going back at least 50 years to verify clear ownership, identify any liens or encumbrances, and ensure no outstanding claims on the property before issuing title insurance." },
      { question: "What's the difference between a title company and a settlement company in Maryland?", answer: "In Maryland, the terms are often used interchangeably. A title company focuses on title insurance, while a settlement company conducts the closing. Many firms, including DMV Title Guy, handle both roles." },
      { question: "What are typical closing costs for a buyer in Bethesda, MD?", answer: "Bethesda buyer closing costs vary with lender fees, title insurance, recording charges, taxes, property value, and the transaction. Use the closing cost calculator for an estimate. Your lender's fees and Pruitt Title's quote set the actual figures, and your Closing Disclosure governs." },
    ] },
  { city: "Rockville",        slug: "title-company-rockville-md",     state: "MD", county: "Montgomery County",              tier: 1 },
  { city: "Silver Spring",    slug: "title-company-silver-spring-md", state: "MD", county: "Montgomery County",              tier: 1, alsoServing: ["Kensington", "Takoma Park", "Wheaton"] },
  { city: "Bowie",            slug: "title-company-bowie-md",         state: "MD", county: "Prince George's County",         tier: 1, alsoServing: ["Fort Washington", "Clinton"] },
];

// ─── Tier 2 — Secondary Markets ───────────────────────────────────────────────
export const TIER2_LOCATIONS: Location[] = [
  { city: "Ballston",             slug: "title-company-ballston-va",             state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Clarendon", "Virginia Square", "Courthouse"] },
  { city: "Clarendon",            slug: "title-company-clarendon-va",            state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Ballston", "Courthouse", "Rosslyn"] },
  { city: "Rosslyn",              slug: "title-company-rosslyn-va",              state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Courthouse", "Clarendon", "Ballston"] },
  { city: "Crystal City",         slug: "title-company-crystal-city-va",         state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Pentagon City", "Rosslyn", "Shirlington"] },
  { city: "Pentagon City",        slug: "title-company-pentagon-city-va",        state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Crystal City", "Rosslyn", "Shirlington"] },
  { city: "Courthouse",           slug: "title-company-courthouse-va",           state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Clarendon", "Rosslyn", "Virginia Square"] },
  { city: "Shirlington",          slug: "title-company-shirlington-va",          state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Crystal City", "Pentagon City", "Alexandria"] },
  { city: "Virginia Square",      slug: "title-company-virginia-square-va",      state: "VA", county: "Arlington County",              tier: 2, parentSlug: "title-company-arlington-va", alsoServing: ["Ballston", "Clarendon", "Courthouse"] },
  { city: "Old Town",         slug: "title-company-old-town-alexandria-va",  state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Del Ray", "Carlyle", "Eisenhower"] },
  { city: "Del Ray",          slug: "title-company-del-ray-alexandria-va",   state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Old Town", "Carlyle", "Eisenhower"] },
  { city: "Carlyle",          slug: "title-company-carlyle-alexandria-va",   state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Old Town", "Eisenhower", "Del Ray"] },
  { city: "Eisenhower",       slug: "title-company-eisenhower-alexandria-va",state: "VA", county: "Alexandria (independent city)", tier: 2, parentSlug: "title-company-alexandria-va", alsoServing: ["Carlyle", "Old Town", "Del Ray"] },
  { city: "Tysons",           slug: "title-company-tysons-va",           state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Merrifield", "Dunn Loring"] },
  { city: "Herndon",          slug: "title-company-herndon-va",          state: "VA", county: "Fairfax County",          tier: 2, faqs: [
      { question: "How much does title insurance cost in Herndon, VA?", answer: "In Stewart Title's published Virginia schedule, a standard owner's policy on a $700,000 Herndon home is $2,847.50 before discounts, and the lender's policy issued with it is $200. Virginia insurers file their own rates and can negotiate them, so compare quotes." },
      { question: "How long does a title search take in Fairfax County?", answer: "Many Fairfax County title searches can be completed in a few business days when the record chain is clean. Older properties, estates, trusts, foreclosures, unreleased liens, or complex HOA and condo matters may take longer." },
      { question: "Is a title company required for closings in Virginia?", answer: "Virginia settlement services must be handled by an appropriately licensed or authorized provider. The right provider and requirements depend on the transaction, lender, and requested services." },
      { question: "Can DMV Title Guy help with a Herndon closing?", answer: "Yes. Will and the Pruitt Title team handle title and settlement for Herndon closings. Send Will the contract or property details and he confirms next steps with you." },
      { question: "Can I order a Herndon title search online?", answer: "Yes. Send Will the property details online. Sending the request doesn't open an order; Will confirms the quote, timing and next steps with you." },
      { question: "What makes Herndon title closings different?", answer: "Herndon transactions often involve Fairfax County land records, HOA or condominium communities, older subdivisions, investor resales, new construction, and Dulles corridor employment or relocation timelines. Local title review helps surface those issues early." },
    ] },
  { city: "Great Falls",      slug: "title-company-great-falls-va",      state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Centreville",      slug: "title-company-centreville-va",      state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Chantilly",        slug: "title-company-chantilly-va",        state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Burke",            slug: "title-company-burke-va",            state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Lorton"] },
  { city: "Springfield",      slug: "title-company-springfield-va",      state: "VA", county: "Fairfax County",          tier: 2, alsoServing: ["Lorton"], faqs: [
      { question: "What should I expect at closing in Springfield, VA?", answer: "In Springfield, VA, a typical closing takes 45–90 minutes. You'll sign the deed, deed of trust, closing disclosure, and other loan documents. The settlement attorney reviews everything, then coordinates funding and recording with Fairfax County." },
      { question: "Can I estimate title and closing costs online?", answer: "Yes. DMV Title Guy offers closing-cost calculators. The results are estimates, not a quote. Pruitt Title's actual quote, Closing Disclosure and settlement statement govern." },
      { question: "Does title insurance cover boundary disputes in Virginia?", answer: "Standard title insurance in Virginia may cover some boundary and survey issues, but it depends on the policy. An enhanced owner's policy offers broader coverage than a standard policy." },
    ] },
  { city: "Annandale",        slug: "title-company-annandale-va",        state: "VA", county: "Fairfax County",          tier: 2 },
  { city: "Falls Church",     slug: "title-company-falls-church-va",     state: "VA", county: "Falls Church / Fairfax",  tier: 2, faqs: [
      { question: "Do you serve both the City of Falls Church and nearby Fairfax County?", answer: "Yes. DMV Title Guy supports purchase, refinance, and other real estate closings for properties in the independent City of Falls Church and nearby communities with Falls Church mailing addresses in Fairfax County. The title search and recording details are matched to the property's actual jurisdiction." },
      { question: "Can I get a Falls Church closing cost estimate online?", answer: "Yes. Use the free quote calculator on this page for an initial estimate. The title team can then confirm the property, transaction type, lender requirements, and jurisdiction before you rely on the final figures." },
      { question: "What does DMV Title Guy handle for a Falls Church closing?", answer: "The team coordinates the title search, title insurance, escrow, settlement documents, signing, funding, recording, and post-closing policy work for purchases and refinances." },
    ] },
  { city: "Sterling",         slug: "title-company-sterling-va",         state: "VA", county: "Loudoun County",          tier: 2, faqs: [
      { question: "Where are deeds recorded for a home in Sterling?", answer: "Sterling is an unincorporated community in Loudoun County. Deeds are recorded by the Clerk of the Loudoun County Circuit Court in Leesburg." },
      { question: "What taxes does a seller pay when selling a home in Sterling?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4). On a $700,000 sale that is $700 in grantor tax and $1,400 in regional fees." },
      { question: "What recordation tax does a buyer pay in Sterling?", answer: "Virginia's state recordation tax is $0.25 per $100 (Va. Code \u00a7 58.1-801), charged on the price for the deed and on the loan amount for the deed of trust. Loudoun County adds its local recordation tax of $0.083 per $100, one-third of the state rate (\u00a7\u00a7 58.1-814 and 58.1-3800). The buyer customarily pays both." },
    ] },
  { city: "South Riding",     slug: "title-company-south-riding-va",     state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "Brambleton",       slug: "title-company-brambleton-va",       state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "Purcellville",     slug: "title-company-purcellville-va",     state: "VA", county: "Loudoun County",          tier: 2 },
  { city: "Middleburg",       slug: "title-company-middleburg-va",       state: "VA", county: "Loudoun County",          tier: 2, alsoServing: ["Aldie"] },
  { city: "Gainesville",      slug: "title-company-gainesville-va",      state: "VA", county: "Prince William County",   tier: 2 },
  { city: "Haymarket",        slug: "title-company-haymarket-va",        state: "VA", county: "Prince William County",   tier: 2 },
  { city: "Bristow",          slug: "title-company-bristow-va",          state: "VA", county: "Prince William County",   tier: 2 },
  { city: "Manassas",         slug: "title-company-manassas-va",         state: "VA", county: "Manassas (independent city)", tier: 2, faqs: [
      { question: "Where are Manassas deeds recorded?", answer: "The Clerk of the Prince William County Circuit Court records deeds for Prince William County and for the independent cities of Manassas and Manassas Park. The land records office is in the Judicial Center at 9311 Lee Avenue in Manassas." },
      { question: "Is Manassas part of Prince William County for closing costs?", answer: "Manassas is an independent city, so it sets its own real estate tax separately from Prince William County. Deeds are still recorded at the Prince William County Circuit Court, and the Northern Virginia regional fees apply to Manassas sales." },
      { question: "What taxes does a seller pay when selling a home in Manassas?", answer: "The seller customarily pays Virginia's grantor tax of $1 per $1,000 of the price (Va. Code \u00a7 58.1-802) plus two Northern Virginia regional fees of $0.10 per $100 each (\u00a7\u00a7 58.1-802.3 and 58.1-802.4), which apply in the City of Manassas." },
      { question: "How much is title insurance on a Manassas home?", answer: "It depends on the price and the underwriter. In Stewart Title's published Virginia schedule, a standard owner's policy on a $450,000 home is $1,893.50 before discounts, and the lender's policy issued with it is $200. Virginia rates can be negotiated, so compare quotes." },
      { question: "Who pays for owner's title insurance in Manassas?", answer: "The buyer customarily pays for both the owner's and lender's policies in Virginia, though the contract can shift the owner's policy to the seller." },
    ] },
  { city: "Manassas Park",    slug: "title-company-manassas-park-va",    state: "VA", county: "Manassas Park (independent city)", tier: 2 },
  { city: "Stafford",         slug: "title-company-stafford-va",         state: "VA", county: "Stafford County",         tier: 2, alsoServing: ["Aquia Harbour"] },
  { city: "Spotsylvania",     slug: "title-company-spotsylvania-va",     state: "VA", county: "Spotsylvania County",     tier: 2 },
  { city: "Gaithersburg",     slug: "title-company-gaithersburg-md",     state: "MD", county: "Montgomery County",       tier: 2, alsoServing: ["Olney", "Damascus"] },
  { city: "Germantown",       slug: "title-company-germantown-md",       state: "MD", county: "Montgomery County",       tier: 2, alsoServing: ["Clarksburg"] },
  { city: "Potomac",          slug: "title-company-potomac-md",          state: "MD", county: "Montgomery County",       tier: 2, alsoServing: ["North Potomac"] },
  { city: "Hyattsville",      slug: "title-company-hyattsville-md",      state: "MD", county: "Prince George's County",  tier: 2, alsoServing: ["Greenbelt"] },
  { city: "College Park",     slug: "title-company-college-park-md",     state: "MD", county: "Prince George's County",  tier: 2, alsoServing: ["Greenbelt"] },
  { city: "Upper Marlboro",   slug: "title-company-upper-marlboro-md",   state: "MD", county: "Prince George's County",  tier: 2 },
  { city: "Laurel",           slug: "title-company-laurel-md",           state: "MD", county: "Prince George's / Howard County", tier: 2 },
];

export const ALL_LOCATIONS: Location[] = [...TIER1_LOCATIONS, ...TIER2_LOCATIONS];

/** Display a city/state label without duplicating District of Columbia. */
export function formatLocationName(city: string, state: StateCode): string {
  if (state === "DC") {
    return city.toLowerCase().includes("dc") ? city : `${city} DC`;
  }

  return `${city}, ${state}`;
}

export function getLocationDisplayName(location: Location): string {
  return formatLocationName(location.city, location.state);
}

// ─── County Pages ──────────────────────────────────────────────────────────────
export const COUNTIES: County[] = [
  { name: "Fairfax County",          slug: "title-company-fairfax-county-va",          state: "VA", fullName: "Fairfax County, Virginia" },
  { name: "Loudoun County",          slug: "title-company-loudoun-county-va",          state: "VA", fullName: "Loudoun County, Virginia" },
  { name: "Prince William County",   slug: "title-company-prince-william-county-va",   state: "VA", fullName: "Prince William County, Virginia" },
  { name: "Montgomery County",       slug: "title-company-montgomery-county-md",       state: "MD", fullName: "Montgomery County, Maryland" },
  { name: "Prince George's County",  slug: "title-company-prince-georges-county-md",   state: "MD", fullName: "Prince George's County, Maryland" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Get locations within a given county (by name) */
export function getLocationsInCounty(countyName: string): Location[] {
  return ALL_LOCATIONS.filter((l) => l.county.startsWith(countyName.split(" County")[0]));
}

/** Get nearby cities for a given location (same county, different city, max 3) */
export function getNearbyCities(location: Location, max = 3): Location[] {
  return ALL_LOCATIONS
    .filter((l) => l.slug !== location.slug && l.county === location.county)
    .slice(0, max);
}

/** State → calculator slug */
export const CALCULATOR_SLUGS: Record<StateCode, string> = {
  VA: "virginia-closing-cost-calculator",
  MD: "maryland-closing-cost-calculator",
  DC: "dc-closing-cost-calculator",
};

/** Get county page for a given location */
export function getCountyPage(location: Location): County | undefined {
  return COUNTIES.find((c) =>
    location.county.toLowerCase().includes(c.name.split(" County")[0].toLowerCase())
  );
}

/** All location slugs (for generateStaticParams) */
export function getAllLocationSlugs(): string[] {
  return ALL_LOCATIONS.map((l) => l.slug.replace("title-company-", ""));
}

/** All county slugs */
export function getAllCountySlugs(): string[] {
  return COUNTIES.map((c) => c.slug.replace("title-company-", ""));
}

/** Find a location or county by full slug */
export function findBySlug(fullSlug: string): { type: "location"; data: Location } | { type: "county"; data: County } | null {
  const loc = ALL_LOCATIONS.find((l) => l.slug === fullSlug);
  if (loc) return { type: "location", data: loc };
  const county = COUNTIES.find((c) => c.slug === fullSlug);
  if (county) return { type: "county", data: county };
  return null;
}
