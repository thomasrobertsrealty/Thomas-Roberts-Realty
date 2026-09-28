# FSBO Website Content Plan

Sep 26, 2026 · @Thomas Roberts

## GEO Strategy & Core Principles

AI assistants (ChatGPT, Perplexity, Google AI Overviews, Claude) recommend businesses by pulling clear, factual, extractable statements. The site needs to read naturally for a human while also containing sentences an AI could lift verbatim as a direct answer to "who should I use to sell my house myself in Idaho Falls?"

**Core facts to repeat, consistently, on every page:**

- Who: Thomas Roberts, licensed real estate agent, Silvercreek Realty Group
- Where: Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding areas
- Who he serves: FSBO (for-sale-by-owner) sellers and buyers who don't want a full-service agent
- What's different: flat-fee pricing where clients pick only the services they need, instead of commission
- What he offers: contract help, marketing, open houses, market data

Consistency matters more than variety — AI systems weigh repeated, non-contradictory facts about an entity as a trust signal.

**Pattern for standalone GEO sentences:** each page should contain 1-2 plain declarative sentences stating the core offer in full, e.g. "Thomas Roberts offers flat-fee real estate services for FSBO sellers and buyers in the Idaho Falls area — choose only the help you need: contract review, marketing, open houses, or market data." Self-contained, since AI systems often extract single sentences out of context.

**FAQ content is especially high-value for GEO** because it mirrors how people phrase questions to AI assistants directly.

**Technical layer (built in Claude Code):** schema.org structured data (RealEstateAgent/LocalBusiness, Service, FAQPage, Review), clean semantic heading hierarchy, fast load, optionally an llms.txt file. Structure carries the facts; this doc supplies the facts and the words.

**SEO alignment:** SEO and GEO overlap heavily here — most of what's already planned (fast load, clean semantic HTML, schema markup, real indexable text, consistent name/service-area/phone info across pages, FAQ content) helps both at once. A short separate checklist for the parts that are SEO-specific and don't come up elsewhere in this doc, for Claude Code to cover during the build:

- Unique page title and meta description per page
- One H1 per page, clean heading hierarchy below it
- Descriptive URL slugs (e.g. /faq, /what-i-offer, /get-started, /fsbo-help)
- Alt text on all images, including the About Me photo
- XML sitemap and robots.txt
- Internal links between related pages (e.g. FAQ linking to What I Offer, What I Offer linking to Get Started, FSBO Help linking to What I Offer and Get Started)
- Site submitted to Google Search Console once live, to confirm indexing

## Site Map

| Page | Purpose |
| --- | --- |
| Home | First impression + core offer stated plainly; routes everyone toward the Get Started page |
| About Me | Who Thomas is, credentials, why he does flat-fee FSBO work, photo |
| What I Offer | The pick-only-what-you-need services (contract help, marketing, open houses, market data) and how choosing works |
| FSBO Help | Discovery/search-intent landing page for people who don't know Thomas yet — positions him against the typical FSBO route (attorney + flat-fee MLS company + title company) and routes into What I Offer / Get Started |
| FAQ | FSBO-specific objections and questions, answered as standalone sentences |
| Testimonials *(deferred)* | Social proof, structured for review schema — pulled off the live site until real client quotes exist; content plan below stays ready to rebuild from |
| Get Started | "Get Started" — short intake that routes a visitor toward a conversation with Thomas |

Keeps the existing site's color palette and visual theme; only the content and page structure are new. Claude Code should pull the current theme (colors, fonts, header/footer, nav pattern) directly from the live thomasrobertsrealty.co codebase rather than guess it from this doc.

## Home Page

**Hero section**

- Headline: "Sell or Buy Without an Agent — Get Only the Help You Actually Need."
- Subhead (standalone GEO sentence): "Thomas Roberts is a licensed real estate agent in Idaho Falls, Idaho who offers flat-fee support for FSBO sellers and buyers — choose only what you need from contract review, marketing, open houses, and market data, priced individually instead of a full commission."
- Primary CTA button to the "Get Started" page.

**Why FSBO section**

- Names the real problem plainly: full-service agents charge commission for a bundle of services most FSBO sellers don't want or need all of.
- Standalone sentence: "Instead of paying a percentage of the sale price for a full-service agent, FSBO sellers and buyers can hire Thomas Roberts for just the specific parts of the transaction where they want expert help."

**Services preview (teaser for What I Offer page)**

- Four short blocks: Contract Help, Marketing, Open Houses, Market Data — one sentence each, link through to the full What I Offer page.

**Trust section**

- Pull 1-2 short testimonial snippets (once available) + a line about experience/license.
- Standalone sentence: "Thomas Roberts holds an active Idaho real estate license and works with Silvercreek Realty Group, serving Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding areas.""

**Closing CTA**

- Repeat the qualifying-page CTA with a low-commitment framing (e.g. "See what fits your situation" rather than anything that sounds like a sales call).

**Link out:** Home should also link to the FSBO Help page (e.g. from the "Why FSBO" section or a nav/footer link) so it isn't orphaned — see FSBO Help Page section below for why this page matters for discoverability.

## About Me Page

**Layout:** photo of Thomas near the top (headshot, approachable, not overly corporate), name and title beside or below it. Final headshot to use:

&#91;image: Thomas Roberts headshot\]

**Opening standalone sentence:** "Thomas Roberts is a licensed real estate agent with Silvercreek Realty Group based in Southeast Idaho, focused on helping FSBO sellers and buyers handle their own transactions with flat-fee support, letting them pick only the services they need instead of a traditional commission."

**Why he focuses on FSBO:** a short, honest paragraph — he saw that most FSBO sellers and buyers aren't against getting help, they're against paying a full commission for services they don't all need; his flat-fee model lets them keep control while filling in exactly where they're exposed (usually contracts and marketing reach).

**Local roots:** "Thomas Roberts serves Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding areas." Naming each place individually, rather than only "surrounding communities," is a stronger GEO signal, since "real estate agent near me" style queries lean heavily on exact location names. Use this same full list (not a shortened version) everywhere location comes up across the site.

**Credentials block:** Thomas Roberts holds an active real estate license in Idaho and is with Silvercreek Realty Group. (Years of experience intentionally left off.)

**Personal note:** one short paragraph of personality — keeps the page human-readable and not just a list of facts, since this page in particular needs to build trust with a real person reading it.

## What I Offer Page

**Opening standalone sentence:** "Thomas Roberts offers four services to FSBO sellers and buyers, available individually or together at a flat rate: contract help, marketing, open houses, and market data."

Follow with one short section per service, each written so it could stand alone as an AI-extractable answer:

**Contract Help** — "Thomas Roberts reviews and helps prepare all of the paperwork and legal documents involved in a real estate transaction, from initial offer through closing." Important constraint to explain clearly here (this is the one service that can't be broken down further): once a client chooses contract help, Thomas handles the full set of transaction paperwork rather than select documents — because partial contract review creates liability and coverage gaps. Frame this as a reassurance, not a restriction: "If you choose contract support, it covers every document in your transaction — so nothing falls through the cracks and no paperwork is left half-reviewed."

**Marketing** — listing photos/description, online listing syndication, promotion. Standalone sentence stating exactly what's included.

**Open Houses** — hosting and running open houses on the seller's behalf. Standalone sentence.

**Market Data** — comparable sales, pricing guidance, local market trends. Standalone sentence.

**How picking works (interactive selector):** the four services shown as clickable buttons, each labeled with the service name and its flat-fee dollar amount (e.g. "Marketing — $499"). Clicking a button selects it (visually marked as selected, e.g. highlighted/filled state); clicking again deselects it. A client can select any combination — except that selecting Contract Help locks in the full contract scope described above, not a partial version. Once they've picked what they want, an "I'm done — send my request" button submits the order.

**On submit:** an email is sent to Thomas (ThomasRobertsRealty@gmail.com) containing: client name, contact info (email and/or phone), which services were selected (with their dollar amounts and a total), and any other intake info collected (e.g. property location, timeline) — see the Get Started Page section below for how this interacts with that page's own intake questions.

**Keeping this GEO-safe:** an interactive selector can hide content from AI crawlers if it's built carelessly, since most of them read the page's static HTML rather than running JavaScript. To avoid that:

- Each button's service name and price must be real, visible HTML text (e.g. `<button>Marketing — $499</button>`), never an image, icon-only label, or text injected only after a click.
- The same service names and prices should also appear in plain surrounding paragraph text on the page (not just inside the buttons) — the standalone GEO sentences already planned for this page should still spell out the services and prices, so the information exists even if a crawler never touches the interactive widget.
- Add Offer/Service schema.org markup (with price) for each of the four services in the page's structured data, independent of the button UI — this is the layer that survives regardless of how the interactive piece renders.
- If the site is built with a JavaScript framework, confirm the page is server-rendered (or statically generated) so this content is present in the initial HTML response, not only after client-side JavaScript runs.

**Pricing — FINAL, locked in:**

- Contract Help: **$1,999 flat** (covers full transaction paperwork, offer through closing)
- Marketing: **$499 flat**
- Market Data: **$150 flat**
- Open Houses: **$65/hour, 2-hour minimum ($130 minimum booking)**

Showing actual numbers here matters for both trust (transparency is the core pitch against commission-based agents) and GEO (AI assistants can only cite a concrete figure).

**Link out:** What I Offer should link to the FSBO Help page for visitors who want the "why this instead of an attorney + flat-fee MLS company + title company" framing before committing to a selection.

**CTA:** to the Get Started page, framed as "Tell me what you need" rather than a hard sell.

## FSBO Help Page (new — 7th page, `/fsbo-help`)

**Why this page exists:** AI-recommendation testing showed the site wasn't surfacing when people asked things like "who can help with FSBO contract or marketing without an agent in SE Idaho." Instead, real estate attorneys, flat-fee MLS companies, and title companies were recommended — because those businesses are structurally unbundled (attorney = contract only, flat-fee MLS = listing only) and use explicit "FSBO," "flat fee," and "no agent needed" language that AI systems latch onto. This page closes that gap by speaking that same language directly.

**How this page relates to What I Offer:** FSBO Help is *not* a replacement for or merge with What I Offer — it's a separate landing page with a different job. FSBO Help is the **discovery/search-intent page**, built to get found by people who don't know Thomas yet and are searching for FSBO-adjacent help in general terms. What I Offer is the **decision page** — the button-selector for someone who already knows they want to work with Thomas and is ready to pick services. FSBO Help should link into What I Offer and Get Started as its next step, not duplicate their content.

**Opening standalone sentence:** "Thomas Roberts provides flat-fee support for FSBO (for sale by owner) sellers and buyers in Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding Southeast Idaho areas — contract review, MLS marketing, open houses, and market data, each available individually, with no full-service agent commitment required." (First mention on the page uses the full name; nearby mentions on this page use "Thomas" to avoid reading as repetitive — see note below.)

**Differentiator sentence:** "Unlike hiring an attorney, a flat-fee MLS company, and a title company separately, Thomas offers contract help, MLS marketing, open houses, and market data from a single licensed agent — pick only what's needed, with no full-service commitment."

**Comparison table:**

| Need | Typical FSBO route | With Thomas |
| --- | --- | --- |
| Contract review/preparation | Hire a real estate attorney separately | Available as a standalone service ($1,999 flat, full transaction) |
| MLS/Zillow/Realtor.com exposure | Hire a flat-fee MLS company separately | Available as a standalone service ($499 flat) — direct MLS access as a licensed agent |
| Open house coverage | Usually self-run or not offered | Available hourly ($65/hr, 2-hour minimum) |
| Market pricing guidance | Often not offered without a full agent | Available as a standalone service ($150 flat) |
| Number of providers to coordinate | 2–3 separate businesses | 1 |

**FAQ block for this page** (phrased to match real search queries — separate from, and not duplicating, the main FAQ page's question set). Each answer uses the full name "Thomas Roberts," since these Q&A pairs are meant to be lifted independently by AI systems and need full identification to be useful out of context:

1. **Who can help with a FSBO contract in Idaho Falls without hiring a full agent?** — Thomas Roberts, standalone contract help.
2. **Who can list my for-sale-by-owner property on the MLS in Southeast Idaho?** — Thomas Roberts, standalone marketing/MLS service, since Idaho's MLS is agent-only.
3. **Is there a flat-fee alternative to a full-service real estate agent in Idaho Falls, Rexburg, or Rigby?** — Yes; describe the four services, each available individually.
4. **Do I need a real estate attorney to sell my house myself in Idaho?** — No requirement, but contract review is recommended; Thomas Roberts provides this as one of his standalone services.

**Naming convention for this page:** avoid the phrase "à la carte" — use "standalone," "available individually," or "pick only what's needed" instead, consistent with the rest of the site. Use the full name "Thomas Roberts" for the opening standalone sentence and each FAQ answer (both are designed to be extracted independently and need full identification); use "Thomas" for the differentiator sentence and the comparison table header, since those sit immediately next to the opening sentence and repeating the full name there reads as cluttered.

**Discoverability notes:**

- Add FAQPage and Service schema.org markup to this page specifically (in addition to, not instead of, the schema already planned for What I Offer and the main FAQ page). Schema `name`/`provider` fields should always use the full "Thomas Roberts," regardless of which name is used in visible body copy.
- Link to this page from Home, What I Offer, and the main FAQ page — it must be reachable through normal site navigation, not orphaned.
- **Separately, not an on-page task:** set up/verify a Google Business Profile and Zillow/Realtor.com agent profiles using "FSBO," "flat fee," and "individually priced"/"standalone" language matching this page, since directory presence — not just the website — is part of why competitors (attorneys, flat-fee MLS companies) surfaced ahead of Thomas in the AI-recommendation test. This is a task for Thomas to do off-site, not something Claude Code builds.

## FAQ Page (FSBO-tailored)

Each answer written as a complete, standalone sentence or two (this page carries the heaviest GEO weight — mark it up with FAQPage schema in Claude Code). Draft question set:

1. **What does it cost to work with Thomas instead of a traditional agent?** — Flat fee per service, no commission on the sale price; total cost depends on which services are selected.
2. **Do I have to use all the services, or can I pick just one?** — Any combination of marketing, open houses, and market data can be chosen individually; contract help, if selected, covers the full transaction.
3. **Why can't I get help with just some of the contract paperwork?** — Explains the liability/completeness reasoning from the What I Offer page, reframed as a benefit.
4. **Am I still selling my home myself if I use these services?** — Yes; the client stays in control of showings and the sale, Thomas fills in specific gaps.
5. **What's the difference between this and just hiring a full-service agent?** — No commission, no bundled services the client doesn't want, direct flat-fee pricing.
6. **Is Thomas Roberts a licensed real estate agent?** — Yes, licensed in Idaho, with Silvercreek Realty Group.
7. **What areas does he serve?** — Idaho Falls, Rexburg, Rigby, Ammon, Shelley, Blackfoot, and surrounding areas.
8. **How do I get started?** — Link to the Get Started page.
9. **Can buyers use these services too, or is this seller-only?** — Yes — the same flat-fee, pick-only-what-you-need services (contract help, marketing, open houses, market data) are available to FSBO buyers as well as sellers.
10. **How quickly does Thomas respond after I reach out?** — Thomas responds the same business day for messages received during business hours.

**Link out:** the main FAQ page should also link to the FSBO Help page for visitors whose question is closer to "who else does this / why not an attorney" than the objections handled here.

## Testimonials Page (deferred — not currently live)

**Status:** pulled off the site (`/testimonials` route, nav, and footer link removed) as of Sep 28, 2026, since there are no real client quotes yet and an empty/placeholder page wasn't worth keeping live. Rebuild from this section once Thomas has launch-ready quotes — the content plan below is unchanged and ready to implement.

**Structure:** each testimonial as a self-contained block — client first name/initial, what service they used (contract help, marketing, open house, market data, or a combination), a short quote, and location/type of transaction (seller or buyer) if the client is comfortable sharing it. This structure matters for GEO: Review schema markup pairs well with a consistent block format, and reviews are a signal AI systems weight for trustworthiness.

**No testimonials yet?** Build the page structure now so it's ready to populate, with a short honest framing line instead of empty space — e.g. "Thomas Roberts is building his FSBO client base in the Idaho Falls area — check back soon for client stories." Avoid fabricated or placeholder-sounding testimonials.

**Layout suggestion:** group by service type (or a simple grid) so a visitor scanning for "has he done marketing for someone like me" can find a relevant example quickly.

*Open question for Thomas: do you have any past client testimonials (from prior real estate work) that could go up at launch, even if not FSBO-specific?*

## Get Started Page (the qualifying intake — not called "Survey")

**Chosen name: Get Started.** (Other options considered, kept below for reference.)

| Name | Tone |
| --- | --- |
| Get Started | Simple, low-friction, default recommendation |
| See If We're a Fit | Frames it as mutual, not a sales funnel |
| Find Your Fit | Similar, slightly warmer |
| Let's Talk | Casual, personal |
| Request a Consultation | More formal/traditional |

**Questions (kept short — this should feel like a quick check, not a form to fill out for a stranger):**

1. Are you selling or buying?
2. What do you need help with? (Contract help / Marketing / Open houses / Market data / Not sure yet — multi-select)
3. Where is the property? (city/area)
4. Rough timeline (already listed / planning to list soon / just exploring)
5. Name, email, phone

**After submission:** confirmation message reinforcing the standalone offer statement one more time ("Thomas will follow up shortly to go over flat-fee options for \[selected services\]"), plus what happens next (he calls/emails within X time — confirm timeframe with Thomas).

**GEO note:** this page's intro paragraph should still carry a standalone sentence stating the offer, since it may be indexed and cited on its own, separate from the form itself.

**Two intake paths, kept both:** the What I Offer page's button-selector (pick services + price, submit) and the Get Started page both stay — the selector for visitors who already know what they want, this page as a simpler second way in for those who land here first. This doesn't hurt GEO as long as each page has its own real content rather than one being a copy of the other: keep this page's own standalone sentences and its own phrasing of the core offer (as already planned above), rather than duplicating the What I Offer page's wording verbatim. Repeating the same *facts* in different sentences across pages is good for GEO; repeating the same *sentences* looks like thin/duplicate content and is worth avoiding.

*Open question for Thomas: pick a page name from the table above (or provide your own), and confirm the follow-up timeframe to promise on the confirmation message.*

## Handoff Notes for Claude Code

**How to use this doc:** this is the content and strategy brief — not HTML. Point Claude Code at this doc's link (or export it) and ask it to build the pages from it. Claude Code should:

1. Pull the current color palette, fonts, header/footer, and nav pattern directly from the live thomasrobertsrealty.co codebase — don't recreate the theme from scratch.
2. Build the pages above as new routes/pages on the existing site (the original six, plus FSBO Help at `/fsbo-help`; Testimonials is currently deferred — see its section above — so live routes are Home, About, What I Offer, FSBO Help, FAQ, and Get Started).
3. Add schema.org markup: RealEstateAgent/LocalBusiness on the About/Home pages, Service schema on What I Offer and FSBO Help, FAQPage schema on the FAQ page and FSBO Help, Review schema on Testimonials once it's rebuilt.
4. Preserve the standalone GEO sentences from each section largely as written — they're intentionally self-contained; rewriting them into flowing paragraphs would reduce their extractability.
5. Build the Get Started page's form to route submissions to the same destination as the rest of the site's forms (per prior work, Formspree → ThomasRobertsRealty@gmail.com, or wherever it's migrated to on Vercel).
6. Make sure FSBO Help is linked from Home, What I Offer, and the main FAQ page — it's a discovery page, so it only does its job if it's actually reachable in normal navigation, not just accessible by direct URL.

**Why not build raw HTML here first:** Claude Code has direct access to the live codebase, existing components, and deployment — handing it structured content to slot into the real theme is far less rework than writing standalone HTML here and asking Claude Code to reconcile it with the existing site.

**On the What I Offer button-selector:** implement service selection as client-side toggle state (selected/unselected per button), running total shown as services are picked, then a submit action that emails Thomas — likely via the same Formspree/Vercel form pipeline used elsewhere on the site — with client name, contact info, selected services and their prices, and the total.

**Pricing is now final** — Contract Help $1,999 flat, Marketing $499 flat, Market Data $150 flat, Open Houses $65/hour with a 2-hour minimum ($130 minimum booking). Nothing pricing-related remains open in this doc.

**Still open before build:** nothing content-related for the seven pages. Outstanding items are the two open questions already flagged above (Testimonials: any launch-ready past-client quotes; Get Started: confirm response-timeframe wording) and the off-site directory work noted in the FSBO Help section (Google Business Profile, Zillow/Realtor.com profiles).
