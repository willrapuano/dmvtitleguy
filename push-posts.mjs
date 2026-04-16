import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '4s0dloxi',
  dataset: 'production',
  token: 'sklGfROOV2NI8wOfagZwiVdikevZTrVXth3YyKW3pLvTLqpFlpDgQyBMU9L30MJKk72WX6cMYTUpOO4X4',
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Helper to create a normal paragraph block
function p(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  };
}

// Helper for heading
function h2(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'h2',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  };
}

function h3(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'h3',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  };
}

// Paragraph with bold lead-in
function pBold(boldText, rest) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: Math.random().toString(36).slice(2), text: boldText, marks: ['strong'] },
      { _type: 'span', _key: Math.random().toString(36).slice(2), text: rest, marks: [] },
    ],
  };
}

// Bullet list item
function li(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  };
}

function liBold(boldText, rest) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [
      { _type: 'span', _key: Math.random().toString(36).slice(2), text: boldText, marks: ['strong'] },
      { _type: 'span', _key: Math.random().toString(36).slice(2), text: rest, marks: [] },
    ],
  };
}

function blockquote(text) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'blockquote',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  };
}

// ─────────────────────────────────────────────────────────────
// POST 1: 1031 Exchange Guide for DMV Real Estate Investors
// ─────────────────────────────────────────────────────────────
const post1 = [
  p("If you've been sitting on an investment property in the DMV and thinking about selling, there's a good chance you're leaving serious money on the table if you don't know about the 1031 exchange."),
  p("This is one of the most powerful tools in a real estate investor's toolkit — and it's surprisingly underused, mostly because people assume it's too complicated or only for the big players. It's not."),
  p("Let me walk you through how it works, what to watch out for, and why it matters specifically in the DC-Maryland-Virginia market."),

  h2("What Is a 1031 Exchange?"),
  p("Named after Section 1031 of the IRS tax code, a 1031 exchange allows you to sell an investment property and defer capital gains taxes — as long as you reinvest the proceeds into a \"like-kind\" replacement property."),
  p("The key word there is defer, not eliminate. You're not off the hook forever. But delaying that tax bill can free up substantially more capital to put to work in your next deal. Over time, with multiple exchanges, investors can compound their wealth significantly."),
  pBold("The basic math: ", "If you sell a rental property for $800,000 with $300,000 in gains, you could owe anywhere from $45,000 to $90,000+ in capital gains taxes depending on your bracket and depreciation recapture. A 1031 exchange lets you roll all of that into a new property and keep growing."),

  h2("The Rules You Need to Know"),
  p("The IRS has strict timelines here, and missing them means the exchange fails. There's no flexibility, no extensions for \"I was busy.\""),
  h3("The 45-Day Identification Window"),
  p("From the day you close on the sale of your relinquished property, you have exactly 45 days to identify potential replacement properties. You can identify up to three properties without restriction, or more under certain rules."),
  p("In a competitive market like Northern Virginia or DC proper, 45 days can feel very short. You want to start identifying targets before you close on the sale."),
  h3("The 180-Day Closing Deadline"),
  p("You must close on the replacement property within 180 days of selling the original. Both timelines run concurrently — the 45-day identification window is the first 45 days of that 180-day window."),
  h3("Like-Kind Property"),
  p("\"Like-kind\" is broader than most people think. You can exchange a single-family rental for a commercial building, a duplex for raw land, or a condo for a shopping strip — as long as both are investment or business properties held in the US. Your primary residence doesn't qualify."),
  h3("The Qualified Intermediary Requirement"),
  p("You cannot touch the money. Seriously. The sale proceeds must go directly to a qualified intermediary (QI) — a third party who holds the funds and facilitates the exchange. If the money hits your bank account, the exchange is disqualified."),
  pBold("Pro tip: ", "Choose your QI before you list the property. Title companies (including ours) can help connect you with qualified intermediaries who handle this correctly."),

  h2("Why the DMV Market Makes 1031s Especially Valuable"),
  p("DC, Maryland, and Virginia have some of the highest property values in the country. Appreciation here over the last decade has been significant — which also means capital gains exposure is significant."),
  p("Here's where 1031 exchanges become a real planning tool in this market:"),
  li("Investors who bought in transitional neighborhoods in DC or close-in Maryland suburbs 10-15 years ago are sitting on enormous gains. A 1031 lets them upgrade to a larger asset class without a massive tax hit."),
  li("Investors looking to shift from active management (single-family rentals) to passive income (commercial or Delaware Statutory Trusts) can use 1031 to make that move tax-efficiently."),
  li("Out-of-state investors who own DMV properties and want to consolidate in other markets can use 1031 to exit without losing a chunk of their equity."),

  h2("Traps to Avoid"),
  pBold("Not having a replacement property lined up. ", "In the DMV, inventory moves fast. If you're selling in Falls Church and hoping to 1031 into a similar asset in Arlington, you better be actively shopping before you close."),
  pBold("Underestimating the boot. ", "\"Boot\" is any cash or non-like-kind property you receive in the exchange. Boot is taxable. If your replacement property is worth less than your relinquished property, the difference becomes taxable."),
  pBold("Skipping the QI step. ", "There's no workaround here. You need a qualified intermediary. Period."),
  pBold("Ignoring depreciation recapture. ", "Even with a 1031, depreciation recapture is something your CPA needs to factor into the long-term plan. It doesn't disappear — it carries forward."),

  h2("What About Delaware Statutory Trusts?"),
  p("DSTs have become increasingly popular as 1031 exchange vehicles, particularly for investors who want to exit active management. A DST is a fractional ownership structure in a larger commercial property — think multifamily complexes, medical office buildings, or industrial assets."),
  p("They qualify as like-kind replacement property, which means you can 1031 into a DST and immediately step into passive income without the headaches of landlording."),
  p("The tradeoff: DSTs typically have a 5-10 year hold period and limited liquidity. Not right for everyone, but worth understanding as an option."),

  blockquote("A 1031 exchange isn't just a tax strategy — it's a wealth-building strategy. The investors who use it consistently tend to accumulate substantially more over time than those who sell and pay taxes at each step."),

  h2("How Title Fits Into This"),
  p("At DMV Title Guy, we work with investors on 1031 exchanges regularly. The title and settlement process on both the relinquished property and the replacement property needs to be coordinated carefully to ensure the exchange is properly documented."),
  p("We make sure the timeline is tracked, the documentation is correct, and the QI handoff happens cleanly. If you're planning a 1031, bring us in early — not at the closing table."),

  h2("The Bottom Line"),
  p("If you're a DMV investor sitting on appreciated property, the 1031 exchange should be part of your conversation with your CPA, your attorney, and your title company before you list."),
  p("The tax savings aren't theoretical — they're real dollars that can go back into your next deal. The complexity is manageable with the right team around you."),
  p("Questions about how title works in a 1031? Reach out. We've been through this process enough times to know where it goes sideways — and how to keep it on track."),
];

// ─────────────────────────────────────────────────────────────
// POST 2: Marketing to Absentee Owners in the DMV
// ─────────────────────────────────────────────────────────────
const post2 = [
  p("Absentee owners are one of the most overlooked opportunities in real estate marketing — and in the DMV, there are a lot of them."),
  p("Between government employees on assignment overseas, military families who got relocated, and investors who picked up properties during the pandemic and never moved in, the DMV has a healthy supply of owners who aren't local and may be more open to selling than your average homeowner."),
  p("The challenge: they're harder to reach, they're often skeptical of unsolicited outreach, and they need a different pitch than your typical seller."),
  p("Here's how to approach them effectively."),

  h2("Who Are Absentee Owners in the DMV?"),
  p("Before you can market to them, you need to understand who you're talking to. In this region, absentee owners generally fall into a few buckets:"),
  liBold("Government and military families: ", "Someone who got stationed overseas or reassigned across the country. They may have kept their Virginia or Maryland property as a rental, or it may be sitting vacant while they figure out their next move."),
  liBold("Out-of-state investors: ", "People who bought in DC or Northern Virginia for appreciation and rental income but aren't local. They often respond to market data more than emotional appeals."),
  liBold("Inherited property owners: ", "Heirs who live elsewhere and inherited a DMV property. They often don't know local values, may be dealing with estate logistics, and are frequently motivated to sell cleanly."),
  liBold("Remote landlords who are tired: ", "Investors who bought a rental, dealt with tenants and maintenance from 500 miles away, and are done. The motivation here is often lifestyle, not just money."),

  h2("Finding Them: The Data Side"),
  pBold("Public records are your starting point. ", "Most counties in Virginia and Maryland publish property tax records that include the owner's mailing address. If the mailing address is different from the property address, you've found an absentee owner."),
  p("Tools like PropStream, ATTOM, and BatchLeads let you pull absentee owner lists at scale, filtered by county, equity level, time owned, and more. In the DMV, filtering for high-equity properties (owned 10+ years) in NOVA and close-in Maryland often produces the best lists."),
  pBold("Don't skip the manual check. ", "List quality matters more than list size. A well-scrubbed list of 200 high-equity absentee owners will outperform a dirty list of 2,000."),

  h2("Direct Mail Still Works — If You Do It Right"),
  p("Absentee owners aren't scrolling through Instagram looking for your ads. They're getting mail. Done well, direct mail remains one of the most effective channels for this audience."),
  h3("What Works"),
  liBold("Handwritten or handwritten-style mailers: ", "They get opened. A typed letter in a #10 envelope gets tossed. Something that looks personal gets read."),
  liBold("Market updates specific to their property: ", "\"Your property on [Street] in [City] — here's what similar homes are selling for right now.\" This is specific, relevant, and hard to ignore."),
  liBold("Simple, clean offers to help: ", "Not a hard sell. A soft introduction. \"If you ever consider selling, I'd love to give you a current valuation. No obligation.\""),
  h3("What Doesn't Work"),
  li("Generic postcards with stock photos of houses"),
  li("Aggressive \"I want to buy your house\" language"),
  li("Yellow letters that feel manipulative"),
  p("The goal with the first touch is to get a response, not close a deal. Don't try to do too much."),

  h2("Cold Calling and Text: A Different Approach"),
  p("Some agents work absentee owner lists with cold calls or text campaigns. It can work, but the bar is higher in the DMV because many of these owners are educated, professional, and skeptical."),
  pBold("If you're calling: ", "Lead with value, not pitch. \"I'm a local agent who works a lot in [area]. I noticed you own a property on [street] — I wanted to share what the market has been doing there in case it's helpful.\" Let the conversation develop naturally."),
  pBold("If you're texting: ", "Keep it short, be transparent about who you are, and don't use scripts that feel automated. Sophisticated owners can smell a drip campaign from a mile away."),
  pBold("Compliance matters: ", "Know the TCPA rules. If you're using a platform to send mass texts, you need consent. Get proper legal guidance before running any automated text campaign."),

  h2("Digital Targeting: Layering On Top"),
  p("Once you've identified absentee owners, you can layer digital touchpoints on top of your direct mail for a multi-channel approach."),
  p("Facebook and Instagram allow you to upload custom audiences and match them to their social profiles. If you have the owner's name and address, you can serve them ads specifically — even if they live in California."),
  p("This is particularly effective for inherited property owners who may be researching their options online. A combination of a mailer, a social ad, and a helpful blog post or video about selling inherited property can build recognition before they ever pick up the phone."),

  blockquote("The goal of absentee owner marketing isn't to trick anyone into selling. It's to be the resource they think of when they're ready. Timing matters — most of these owners aren't ready today. But when they are, you want to be the name they remember."),

  h2("The Pitch: What Absentee Owners Actually Care About"),
  p("This varies by owner type, but generally:"),
  liBold("Investors care about numbers: ", "Net proceeds, market timing, cap rate comparisons. Lead with data."),
  liBold("Tired landlords care about ease: ", "Can you make this simple? Can you handle the coordination? Can they avoid the hassle of staging and showings?"),
  liBold("Inherited property owners care about clarity: ", "What's the process? What do they owe? How do they navigate the estate aspects? Be a resource, not just an agent."),
  liBold("Military/government families care about timing and certainty: ", "They're often doing this from a distance. A reliable, communicative agent who can manage the process without constant hand-holding is worth a lot to them."),

  h2("How Title Fits Into This"),
  p("One thing that trips up absentee owner transactions: logistics. The owner isn't local, so getting documents signed, coordinating remote closings, and ensuring title is clean takes extra coordination."),
  p("At DMV Title Guy, we do remote closings regularly. Owners can sign via mail-away or digital notary, depending on state requirements. If you're working absentee owner listings, having a title company that's comfortable with the remote closing process is genuinely valuable — it removes a friction point that can otherwise slow or kill a deal."),

  h2("The Bottom Line"),
  p("Absentee owners are a real opportunity in the DMV market — but they require a more thoughtful approach than typical seller marketing. Know who you're talking to, lead with value, be consistent over time, and make the transaction easy when they're ready."),
  p("The agents who build a systematic approach to this niche tend to find it becomes a reliable pipeline over time. It's not instant — but neither is anything worth building."),
];

// ─────────────────────────────────────────────────────────────
// POST 3: AI Tools Every Real Estate Professional Should Know
// ─────────────────────────────────────────────────────────────
const post3 = [
  p("Let's be honest — there's a lot of noise right now about AI in real estate. Tools launching every week, breathless predictions about robots replacing agents, and enough buzzwords to fill a conference hall."),
  p("I'm going to skip the hype and talk about what's actually useful right now for real estate professionals working in the DMV."),
  p("Some of these tools will save you hours a week. Others are genuinely impressive but still require your judgment to get real value. And a few are mostly demo-ware. I'll tell you which is which."),

  h2("Content and Communication: Where AI Delivers Right Now"),
  p("This is where most agents will see immediate, practical time savings."),

  h3("ChatGPT and Claude for Writing"),
  pBold("The use case: ", "Listing descriptions, email drafts, social media captions, neighborhood summaries, buyer letters, CMA narratives. Anything that requires you to stare at a blank screen and produce professional prose."),
  p("Both ChatGPT (OpenAI) and Claude (Anthropic) are capable here. The key is learning how to prompt them well. Don't just type \"write a listing description for a 3/2 in Arlington.\" Give it specifics: the finishes, the neighborhood, the buyer profile you're targeting, the vibe. The output quality is directly proportional to the input quality."),
  pBold("What it won't replace: ", "Your knowledge of the specific property, the neighborhood nuance, and the relationship with your client. AI can write — but you still need to know what to say."),

  h3("Jasper and Copy.ai for Marketing"),
  p("These are purpose-built marketing writing tools with real estate templates built in. If you're producing high volume — multiple listings a month, regular social posts, email newsletters — Jasper in particular has workflows that can speed up the process significantly."),
  p("The trade-off is cost. These aren't free. But if you're spending hours a week on marketing copy, the ROI is straightforward."),

  h2("Visual Content: Getting More From Your Listings"),
  h3("Virtual Staging"),
  pBold("Tools like Décor Matters, BoxBrownie, and REimagineHome ", "can turn an empty room photo into a furnished, staged room in minutes. The quality has gotten genuinely good."),
  p("This matters for vacant properties, estate sales, and investor flips where physical staging isn't practical. In the DMV market, where buyers often preview online before committing to showings, professional-looking photos move listings faster."),
  p("Expect to pay $10-30 per photo depending on the service. Compare that to physical staging costs in this market and the math is obvious."),
  h3("AI Photo Enhancement"),
  p("Tools like Luminar AI and Topaz can enhance listing photos — sky replacement, HDR correction, object removal. These are now standard in professional real estate photography workflows, and many photographers are already using them."),
  p("If you're shooting your own photos (which, in this market, you probably shouldn't be), these tools can close some of the quality gap."),

  h2("Lead Generation and CRM: The Evolving Landscape"),
  pBold("Be skeptical here. ", "A lot of \"AI-powered\" lead gen tools are mostly marketing language layered on top of standard CRM functionality. The genuine AI applications in this space are still developing."),
  h3("What's Real"),
  liBold("Predictive analytics: ", "Tools like SmartZip and Offrs use data to predict which homeowners are likely to sell in the next 6-12 months. The methodology is regression modeling more than true AI, but the outputs can be genuinely useful for prospecting."),
  liBold("Conversation AI: ", "Tools like Structurely and Verse.ai use AI to handle initial lead conversations via text or chat — qualifying leads, scheduling appointments, keeping leads warm. These work well when implemented properly and can save significant time on lead follow-up."),
  h3("What to Watch"),
  p("Real estate-specific large language model tools are coming. We'll soon see AI that can analyze a full buyer profile, match it to active inventory, draft personalized outreach, and track response — all in one workflow. The pieces exist; the integration is still catching up."),

  h2("Transaction Management and Operations"),
  h3("Document Review and Extraction"),
  p("Some transaction management platforms are starting to build AI that can read contracts, flag missing fields, identify unusual clauses, and extract key dates automatically. This is genuinely useful for coordinators and agents managing high volume."),
  p("Dotloop, Skyslope, and similar platforms are integrating these features. If you're not already using a transaction management platform, this is a good moment to evaluate options — the AI layer is becoming a real differentiator."),
  h3("Scheduling and Follow-Up"),
  pBold("Calendly with AI scheduling, ", "automated showing feedback collection tools, and AI-powered CRM follow-up sequences can collectively save hours of administrative work per week. Not glamorous, but this is where AI is genuinely earning its keep for most agents."),

  h2("Market Analysis and Pricing"),
  p("This is where I'd urge caution with AI tools."),
  p("Automated valuation models (AVMs) — Zillow's Zestimate, Redfin's estimate, and similar tools — use machine learning to estimate property values. In dense, data-rich markets like DC and Arlington, they can be reasonably accurate. In more heterogeneous markets, or for properties with unusual characteristics, they're often significantly off."),
  pBold("The risk: ", "Clients are using these tools. They may come to you with a Zestimate that's 15% off and believe it completely. You need to understand how these tools work so you can explain their limitations clearly."),
  p("Real estate professionals who understand the mechanics of AVMs — data inputs, comp selection logic, when they work and when they don't — will be better positioned to demonstrate their value in a world where clients have access to AI pricing tools."),

  blockquote("AI doesn't replace expertise — it amplifies it. The agents who get the most out of these tools are the ones who bring real knowledge to the table. AI helps them produce faster and communicate better. It can't substitute for knowing your market."),

  h2("Getting Started: A Practical Approach"),
  p("If you're not yet using any AI tools, here's where I'd start:"),
  li("Set up a ChatGPT or Claude account (both have free tiers). Use it for listing descriptions and email drafts for two weeks. That alone will show you the time savings."),
  li("Try a virtual staging tool on your next vacant listing. Compare the engagement to previous vacant listings."),
  li("Look at your CRM and see if it has any AI features you haven't turned on yet. Most of the major platforms are adding them faster than agents are adopting them."),
  p("You don't need to transform your entire workflow overnight. Pick one area, use it consistently, and evaluate. That's how real adoption happens."),

  h2("The Bottom Line"),
  p("AI tools are genuinely useful right now for real estate professionals — not as replacements for expertise, but as tools that let you produce more, communicate better, and handle administrative work faster."),
  p("The DMV market is competitive. Agents who figure out how to use these tools effectively will have a real advantage over those who don't. The barrier to entry isn't technical knowledge — it's just willingness to try."),
  p("Start somewhere. The tools are only getting better."),
];

// ─────────────────────────────────────────────────────────────
// POST 4: Building Your Personal Brand as a Real Estate Agent
// ─────────────────────────────────────────────────────────────
const post4 = [
  p("There are over 100,000 licensed real estate agents in the DC, Maryland, and Virginia area. Think about that number for a second."),
  p("Every one of them can access the MLS. Every one of them can put a sign in a yard and show up to a closing. On paper, the product is identical."),
  p("So why does one agent consistently get referrals, command premium listings, and build a business on repeat clients — while another perpetually chases new leads?"),
  p("The answer, almost always, is brand. Specifically, personal brand."),

  h2("What Personal Brand Actually Means"),
  p("Before we get tactical, let's be clear about what we're talking about. Personal brand is not your headshot. It's not your brokerage logo. It's not even your tagline."),
  p("Personal brand is what people think of when they think of you — before they ever call you."),
  pBold("It's the answer to the question: ", "\"Why would I choose you over anyone else?\""),
  p("In a market this competitive, that question has to have a real answer. \"I'm hardworking and experienced\" doesn't cut it. Every agent says that. Your brand needs to be specific enough that it belongs to you and no one else."),

  h2("Start With Your Niche"),
  p("The biggest branding mistake agents make is trying to be everything to everyone. In a large market like the DMV, that approach produces mediocrity at scale."),
  p("Niche positioning does something counterintuitive: it feels like you're limiting your opportunity, but it actually expands your authority. The agent who is known as \"the Falls Church City expert\" or \"the VA loan specialist in Prince William County\" or \"the agent who works with military families relocating to Quantico\" owns a position that generalists can't take from them."),
  pBold("Your niche should sit at the intersection of: ", "what you're genuinely good at, what the market actually needs, and what you find interesting enough to talk about consistently."),
  p("Don't pick a niche just because it sounds good. You'll burn out talking about it if you don't actually care."),

  h2("The Content Foundation"),
  p("Once you know your niche, content is how you make that niche visible."),
  p("I want to be direct here: you don't need to be on every platform. You need to be consistent on one or two that your target clients actually use."),
  h3("Video: The Highest-ROI Content Format Right Now"),
  p("This isn't speculation — video consistently drives more engagement, more reach, and more trust-building than any other format. And the DMV market has not been saturated with agents doing video well."),
  pBold("What works: ", "Short-form videos about your specific market, neighborhood tours, real talk about the buying/selling process in this region, Q&A formats where you answer questions you hear constantly from clients."),
  pBold("What doesn't: ", "Scripted, over-produced content that feels like a commercial. Authenticity outperforms production value in this format."),
  p("You don't need a studio. A good phone, decent lighting, and something real to say is enough to get started. Consistency beats perfection every time."),
  h3("Written Content: Longer Shelf Life"),
  p("A well-written blog post or LinkedIn article about your market can surface in search results for years. Video is great for reach and trust-building; written content compounds over time."),
  p("If you're the expert in a specific neighborhood or client type, write about it. Regularly. The agents who've built real content libraries around their niche have a long-term SEO and credibility advantage that's difficult to replicate quickly."),

  h2("Show, Don't Tell"),
  p("One of the most effective personal branding strategies is the simplest: share your work."),
  p("When a listing goes under contract quickly, talk about how you prepared the seller. When you help a first-time buyer navigate a competitive multiple-offer situation, tell that story (with the client's permission). When a deal almost fell apart and you found a solution, that's a story that demonstrates real expertise."),
  pBold("Real stories build real credibility. ", "They're also almost impossible to fake, which is why they're more persuasive than any marketing copy."),
  p("This doesn't mean you share every transaction or breach client confidentiality. It means you look for the moments in your work that illustrate your value, and you find ways to share them in a way that's helpful to someone considering hiring you."),

  h2("Reviews and Referrals: The Trust Infrastructure"),
  p("For most consumers, reviews are the brand. Before someone calls you, they've already looked you up — Zillow, Google, realtor.com, maybe Facebook. What they find either confirms or undercuts everything else you're doing."),
  pBold("A systematic approach to reviews is non-negotiable. ", "After every closing, ask. Make it easy — send a direct link. Follow up once if they haven't done it. A steady stream of specific, authentic reviews builds a brand asset that's hard to compete with."),
  p("The same principle applies to referrals. The agents who generate the most referral business aren't necessarily the ones who do the best work — they're the ones who stay in front of their past clients and make it easy to refer them. A quarterly check-in, a market update email, a birthday note. Consistency creates referrals."),

  h2("Your Network in the DMV: An Underrated Brand Asset"),
  p("In the DMV, who you know matters. Relationships with loan officers, title companies, contractors, estate attorneys, and financial planners are a source of both referrals and credibility."),
  p("Agents who are known as connectors — who can refer a client to the right lender, recommend a solid inspector, or connect someone with a probate attorney — build a reputation that extends beyond transaction management."),
  blockquote("Be the person in your market who knows the right people for any situation. That reputation compounds over time in ways that advertising can't replicate."),

  h2("Consistency Is the Brand"),
  p("Here's the part most people skip: brand isn't built in a campaign. It's built through consistent behavior over time."),
  p("What you say, how you say it, how you show up when deals are hard, what you post, how quickly you respond, the experience your clients have — all of it, every day, is building or eroding your brand."),
  p("The agents who have built real personal brands in the DMV market didn't do it with a logo refresh or a clever tagline. They did it by showing up the same way, consistently, for years."),

  h2("Practical Starting Points"),
  p("If you're early in building your brand:"),
  li("Write down your niche in one clear sentence. If you can't do that yet, do the thinking first."),
  li("Audit your current online presence — Google yourself, check your profiles, see what a potential client would find."),
  li("Pick one content format and commit to it for 90 days. Evaluate, then adjust."),
  li("Build a simple system for asking for reviews after every closing."),
  li("Identify 5 relationships in adjacent industries (title, lending, law) and invest in those relationships."),

  h2("The Bottom Line"),
  p("Personal brand isn't optional in the DMV market anymore. With this many agents competing for the same clients, the ones who've built a recognizable, trusted presence have a structural advantage."),
  p("The good news: most agents aren't doing this well. Which means the opportunity to differentiate is real, and the bar isn't as high as it might seem."),
  p("Start with who you are and what you're actually good at. Build from there. The rest follows."),
];

// ─────────────────────────────────────────────────────────────
// POST 5: CE Classes for Real Estate Agents
// ─────────────────────────────────────────────────────────────
const post5 = [
  p("Continuing education is one of those things most agents treat as a box to check. Find the cheapest, fastest option. Click through the slides. Pass the quiz. Done."),
  p("I get it. You're busy. CE requirements feel like homework that doesn't improve your business."),
  p("But here's the thing — the right CE can actually make you better at your job, keep you out of legal trouble, and even open doors to referral relationships. The problem isn't CE itself. It's how most agents approach it."),
  p("Let me walk through what you actually need to know about CE in Virginia, Maryland, and DC — and how to get more out of it than just your license renewal."),

  h2("The Requirements by State"),
  p("The DMV spans three jurisdictions, and each has its own CE requirements. If you're licensed in multiple states (which many DMV agents are), you need to track this carefully."),
  h3("Virginia"),
  pBold("Virginia requires 16 hours of CE ", "every two years for active licensees. This includes:"),
  li("8 hours of required topics set by DPOR (Department of Professional and Occupational Regulation)"),
  li("8 hours of elective topics"),
  p("The mandatory topics rotate and typically cover Fair Housing, agency law, and a mandated topic determined by DPOR for that licensing cycle. Check the current cycle requirements on the DPOR website — they change."),
  p("Your license renewal date is your deadline. Virginia does not grant extensions for CE completion. If you're late, your license lapses."),
  h3("Maryland"),
  pBold("Maryland requires 15 hours of CE ", "every two years, including:"),
  li("3 hours of required Ethics"),
  li("3 hours of required Fair Housing"),
  li("9 hours of elective topics"),
  p("Maryland's CE is administered through the Maryland Real Estate Commission (MREC). All providers must be approved by MREC, so verify before you sign up for anything."),
  h3("DC"),
  pBold("DC requires 15 hours of CE ", "every two years, including:"),
  li("3 hours of Ethics"),
  li("3 hours of DC Legislative and Regulatory Updates"),
  li("9 hours of electives"),
  p("DC's requirements are administered through the Department of Licensing and Consumer Protection (DLCP). DC also requires a core curriculum course for agents in their first renewal cycle."),

  h2("Online vs In-Person: What's Actually Worth Your Time"),
  p("The market for CE has shifted dramatically online. Most agents now complete CE through online platforms — and for the most part, that's fine for meeting the requirement."),
  pBold("Online works well for: ", "straightforward required topics you need to cover, electives where you just need the credit, and scheduling flexibility."),
  pBold("In-person is worth it for: ", "topics that genuinely benefit from discussion and Q&A (Fair Housing, agency law, contract law), designations and certifications that are network-heavy, and any CE that's tied to a conference or event where you'll also be building relationships."),
  p("Don't write off in-person CE just because online is more convenient. The agents in the room with you are potential referral partners. The instructor may be a broker or attorney you'd benefit from knowing. The networking value of in-person CE is real."),

  h2("Designations and Certifications: Worth the Extra Investment?"),
  p("Beyond mandatory CE, there's a whole ecosystem of designations and certifications in real estate. Some are genuinely valuable. Others are mostly marketing."),
  h3("Worth Considering"),
  liBold("GRI (Graduate, REALTOR® Institute): ", "One of the more substantive designations available. Covers contracts, law, finance, and professional standards in depth. The coursework is legitimate and tends to produce agents who are actually better at their jobs."),
  liBold("ABR (Accredited Buyer's Representative): ", "Valuable if buyer representation is a significant part of your business. More relevant now that buyer agency has more formal structure post-NAR settlement."),
  liBold("SRS (Seller Representative Specialist): ", "The seller-side equivalent. Worth doing if you're building a listing-heavy business."),
  liBold("SRES (Seniors Real Estate Specialist): ", "Increasingly valuable in the DMV given the large population of older homeowners. The 55+ market is substantial and has specific needs around downsizing, estate planning, and housing options."),
  liBold("Certified Probate Real Estate Specialist (CPRES): ", "If you want to build a business around inherited and estate properties, this certification is genuinely useful and the niche is underserved in most DMV markets."),
  h3("Approach With Skepticism"),
  p("Some designations are lightly credentialed, primarily exist to generate course revenue, and don't materially differentiate you with consumers. Before investing in a designation, research whether it's recognized and valued in your specific market."),

  h2("Using CE Strategically"),
  p("Here's a different way to think about CE: what do you actually not know well enough?"),
  p("Most agents have knowledge gaps they're aware of but never address. Common ones in the DMV:"),
  li("The specifics of VA loan transactions (enormous opportunity in Northern Virginia, genuinely requires understanding)"),
  li("New construction contracts and builder negotiations"),
  li("Condo law in DC and Maryland (more complex than most agents realize)"),
  li("Investment property analysis and 1031 exchanges"),
  li("Probate and estate property transactions"),
  p("If you have a knowledge gap in an area that's relevant to your market or your niche, look for CE that actually addresses it. Your CE hours are going to pass regardless — you might as well use them to actually get better."),

  h2("Fair Housing: Don't Treat This One Like a Box to Check"),
  pBold("Fair Housing violations are serious. ", "The consequences — license revocation, significant fines, civil liability — are real and they happen to actual agents, not just hypothetically."),
  p("The Fair Housing Act, the Virginia Fair Housing Law, Maryland's Fair Housing Act, and DC's Human Rights Act all have specific requirements and protected classes. DC's protected class list, in particular, is longer than the federal list and more detailed."),
  p("If you're completing Fair Housing CE online and clicking through it in 20 minutes, you may be meeting the hour requirement without actually learning anything. The stakes are high enough that this one is worth taking seriously."),
  blockquote("Fair Housing is not a compliance exercise. It's fundamental to operating with integrity in this industry. Treat the CE like it matters — because it does."),

  h2("Tracking Your CE: Don't Learn This the Hard Way"),
  p("Agents lose their licenses over administrative failures more than anything else. Missing a CE deadline, filing with the wrong state, or completing unapproved courses — these are avoidable problems that derail real businesses."),
  pBold("Set calendar reminders 6 months and 3 months before your renewal deadline ", "in each state where you're licensed. Don't wait until 30 days out — approved courses can fill up, and scheduling crunch creates risk of cutting corners."),
  p("Keep a simple spreadsheet or folder with certificates from every CE course you complete. State boards make mistakes. You want documentation."),
  p("If you're licensed in multiple states, verify each state's requirements independently. Don't assume courses approved in Virginia are automatically accepted in Maryland or DC."),

  h2("CE Providers Worth Knowing in the DMV"),
  p("Several providers serve the DMV market with approved CE:"),
  liBold("NVAR and GCAAR: ", "Northern Virginia Association of REALTORS® and Greater Capital Area Association of REALTORS® both offer CE courses, many of them in-person. Good quality, relevant to local market."),
  liBold("Maryland REALTORS®: ", "Offers approved CE for Maryland licensees."),
  liBold("OnCourse Learning and The CE Shop: ", "Online platforms with broad approval across all three jurisdictions. Convenient, though variable in quality depending on the course."),
  liBold("Local colleges and universities: ", "George Mason, Montgomery College, and others periodically offer real estate courses that qualify for CE credit. Worth checking if you prefer a more academic format."),

  h2("The Bottom Line"),
  p("CE is a given — it's not optional. The question is whether you use it as an opportunity to actually get better or just as a renewal box to check."),
  p("The agents who treat CE as a professional development tool, even occasionally, end up with knowledge gaps filled, designations that open doors, and sometimes referral relationships from the people they meet in the room."),
  p("Know your deadlines, meet your requirements, and occasionally choose a course because it'll actually make you better at something. That's not a revolutionary approach — but it's one most agents don't take."),
];

const posts = [
  { id: 'post-1031-exchange-guide-investors', title: '1031 Exchange Guide', body: post1 },
  { id: 'post-absentee-owner-marketing-strategies', title: 'Marketing to Absentee Owners', body: post2 },
  { id: 'post-ai-tools-real-estate-professionals', title: 'AI Tools for Real Estate', body: post3 },
  { id: 'post-building-personal-brand-real-estate-agent', title: 'Building Personal Brand', body: post4 },
  { id: 'post-ce-continuing-education-real-estate-agents', title: 'CE Continuing Education', body: post5 },
];

async function pushPost(post) {
  console.log(`\n📝 Pushing: ${post.title} (${post.id})`);
  
  // First verify the post exists
  const existing = await client.fetch(`*[_id == $id][0]{ _id, title, slug }`, { id: post.id });
  if (!existing) {
    console.log(`  ⚠️  Post not found with id: ${post.id}`);
    // Try to find by slug
    const bySlug = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{ _id, title, slug }`, 
      { slug: post.id.replace('post-', '') });
    if (bySlug) {
      console.log(`  ✅ Found by slug: ${bySlug._id}`);
      post.id = bySlug._id;
    } else {
      console.log(`  ❌ Could not find post. Skipping.`);
      return false;
    }
  } else {
    console.log(`  ✅ Found: ${existing.title}`);
  }

  const result = await client
    .patch(post.id)
    .set({ body: post.body })
    .commit();
  
  console.log(`  ✅ Updated successfully. Rev: ${result._rev}`);
  return true;
}

async function main() {
  for (const post of posts) {
    const success = await pushPost(post);
    if (!success) {
      console.log(`  ⚠️  Failed to push ${post.title}`);
    }
    // Small delay between posts
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('\n✅ All posts processed.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
