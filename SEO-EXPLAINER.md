# SEO Strategy Explainer — Gather Catering and Events

This document explains every SEO strategy being applied to the Gather website — what each one is, why it matters, and how it works. It is written for anyone on the team, not just developers.

---

## What Is SEO and Why Does It Matter?

SEO stands for **Search Engine Optimization**. It is the practice of making a website more visible to people who are actively searching for what that business offers.

When someone types "wedding coordinator Cincinnati" or "mobile bartending Columbus" into Google, Google scans millions of websites in milliseconds and decides which ones to show. That decision is based on hundreds of signals — and SEO is the work of making sure as many of those signals as possible point toward Gather's website.

The core insight is this: **people who find you through a search engine are already looking for what you do.** They have high intent. They are not being interrupted by an ad — they raised their hand and asked for exactly this service. That makes organic search traffic some of the most valuable traffic a business website can receive.

---

## Strategy 1: Title Tags

### What they are
The title tag is the text that appears as the clickable blue headline in Google search results. It is also what appears in the browser tab when someone has the page open. Every page on a website has its own title tag.

### Why they matter
The title tag is the single most visible piece of text in a search result. It is the first thing a potential client reads when deciding whether to click. It is also one of the strongest signals Google uses to understand what a page is about and which searches it should appear for.

A poorly written title tag means two things: Google may not rank the page for the right searches, and even if it does show up, people may not click because the title doesn't speak to what they're looking for.

### How they work
Google reads the title tag and uses the words in it as direct evidence of what the page covers. If a page's title tag says "Full Event Planning | Gather Catering and Events," Google understands that page is about full event planning services offered by Gather Catering and Events. When someone searches for "full event planning," that page becomes a candidate to show.

Google displays roughly 50–60 characters before cutting off the title with an ellipsis (…), so brevity and front-loading the most important keywords is critical.

### What we did for Gather
Every page on the site had generic or poorly structured title tags. The homepage was titled "Gather Catering and Events — From Dawn to Dusk," which is brand-forward but tells Google nothing about what the business actually does. Service pages were titled just "Full Planning" or "Catering" with no context.

We rewrote all 12 page titles to follow a consistent format:

> `[What the page is about] | Gather Catering and Events`

Examples:
- `Event Catering & Planning | Gather Catering and Events`
- `Mobile Bartending | Gather Catering and Events`
- `Day-Of Event Coordinator | Gather Catering and Events`

The keyword comes first (because it's the most important), followed by the full brand name for recognition and trust. The format is now identical across every page.

---

## Strategy 2: Meta Descriptions

### What they are
The meta description is the short paragraph of text that appears below the title tag in search results. It is not visible on the page itself — only in search results and link previews.

### Why they matter
Meta descriptions do not directly affect how Google ranks a page. However, they have a major indirect effect: they influence whether someone clicks.

Think of the title tag as the headline of a newspaper ad and the meta description as the supporting copy underneath. A compelling description that speaks directly to what someone is searching for significantly increases click-through rate — and a higher click-through rate sends a positive signal back to Google that the result is relevant.

They also matter when links are shared in text messages, emails, or messaging apps, where the description populates the link preview.

### How they work
Google reads the meta description and often (though not always) displays it in the search result. If no meta description is provided, Google will pull a random excerpt from the page's content, which is often awkward and unhelpful.

The ideal meta description is 140–155 characters, includes the primary keyword, mentions the location (for local businesses), and gives the reader a reason to click.

### What we did for Gather
Every page had weak or generic descriptions. Several didn't mention location at all. We rewrote all 12 to include:
- The primary keyword for that page
- The service area (Cincinnati and Columbus, OH)
- A clear value statement or hook

Examples:
- **Mobile Bartending:** *"Professional mobile bartending for weddings and events in Cincinnati & Columbus, OH. Craft cocktails, full bar service, experienced staff. Starting at $1,500."*
- **Day-Of Coordinating:** *"Day-of coordination in Cincinnati & Columbus, OH. You've done the planning — Gather manages the timeline, vendors, and every detail. Starting at $2,500."*

Including starting prices in descriptions for service pages is a deliberate tactic — it attracts serious, pre-qualified leads and filters out people whose budget doesn't match.

---

## Strategy 3: Keywords

### What they are
Keywords are the words and phrases people type into search engines. A keyword strategy is a plan for which terms to target and where to use them across the website.

### Why they matter
If the words on your website don't match the words people are searching, your page will not appear in those results — even if your business is a perfect fit for what they need. Keywords are the bridge between what a potential client is looking for and the content on your website.

### How they work
Search engines compare the language on your website against the language in a search query. The more naturally and specifically your content reflects the exact language people use to search, the more likely Google is to surface your page for those searches.

Keywords are organized into tiers:

| Tier | Description | Example |
|------|-------------|---------|
| **Primary** | High-intent, high-competition terms. Target on homepage and service pages. | `wedding coordinator Cincinnati` |
| **Secondary** | Supporting terms used throughout body copy and headings. | `full service event planning` |
| **Long-tail** | Longer, more specific phrases with lower competition. Easier to rank for, highly targeted. | `day of coordination vs full planning` |

Long-tail keywords are especially valuable for small businesses. They have less competition than broad terms and attract people who are further along in their decision-making process.

### What we did for Gather
We identified three tiers of keywords relevant to Gather's services and service area, then made sure those terms appear naturally throughout title tags, meta descriptions, headings, and body copy. The location — Cincinnati and Columbus, OH — is woven into keyword usage because local search queries almost always include a city name.

---

## Strategy 4: JSON-LD Structured Data

### What it is
JSON-LD (JavaScript Object Notation for Linked Data) is a block of code added to a web page's source that gives Google a machine-readable fact sheet about the business and its content. It is invisible to website visitors but read directly by search engines.

### Why it matters
Without structured data, Google has to read your webpage the way a human would — scanning paragraph text and inferring meaning. This is imprecise. With structured data, you hand Google a structured set of facts: this is a local business, this is its location, these are its services, these are its verified profiles elsewhere on the internet.

Structured data unlocks two specific features:

1. **Rich results** — Enhanced search listings that can show star ratings, service types, pricing, and other details directly in the search result, making your listing stand out visually and increasing click-through rates.

2. **Local map pack eligibility** — The three local businesses that appear at the top of a search result with a map (the most coveted placement in local SEO). Google uses structured data as a key input when deciding which businesses to surface there.

### The three schema types we implemented

#### LocalBusiness Schema
This is a structured description of Gather as a business. It tells Google:
- The official business name
- The website URL
- The contact email
- A keyword-rich description of what the business does
- The physical address and service area (Cincinnati and Columbus, OH)
- Links to verified third-party profiles (The Knot and WeddingWire)

The `sameAs` field — linking to The Knot and WeddingWire — is particularly valuable. It tells Google that all of these profiles represent the same real-world business, consolidating trust signals from multiple authoritative platforms into a single entity. This directly strengthens local ranking.

This schema was added to the shared header that appears on every page, so all 12 pages benefit from it.

#### Service Schema
Each of the six service pages received its own Service schema block. This tells Google:
- The type of service (Event Planning, Mobile Bartending, Catering, etc.)
- A description of the service
- That Gather is the provider
- The geographic area served
- Pricing information where available

By explicitly naming each service as a structured data entity, Google can confidently match Gather's pages to service-specific searches rather than guessing from page text alone.

#### FAQPage Schema
The FAQ page received a FAQPage schema containing all 10 question-and-answer pairs from the page content. This makes every Q&A eligible to appear in Google's **"People Also Ask"** feature — the expandable question boxes that appear in the middle of search results.

"People Also Ask" placements appear above many regular search results and capture clicks from people who haven't yet decided on a specific vendor — exactly the audience Gather wants to reach.

---

## Strategy 5: Local SEO Signals

### What they are
Local SEO is a subset of SEO focused specifically on helping a business appear in geographically-targeted searches. For a service business like Gather, this is the most important category of SEO.

### Why they matter
When someone searches for "catering Cincinnati" or "event planner near me," Google doesn't just return generic web results — it returns a map with three highlighted local businesses (the "local pack") followed by regular results. Appearing in that local pack drives an enormous amount of inquiries. Studies consistently show that the top three map results capture the majority of clicks for local service searches.

### How they work
Google determines local pack rankings based on three factors:
1. **Relevance** — Does the business offer what was searched for?
2. **Distance** — How close is the business to the searcher?
3. **Prominence** — How well-known and trusted is the business based on online signals?

SEO work on the website primarily influences relevance and prominence. The strategies above — location keywords in titles and descriptions, LocalBusiness schema with verified service area, and sameAs links to The Knot and WeddingWire — all strengthen Gather's local relevance signals.

### What we did for Gather
- Added Cincinnati and Columbus, OH to meta descriptions on every page
- Added both cities to the `areaServed` field in the LocalBusiness JSON-LD schema
- Linked Gather's verified The Knot and WeddingWire profiles via the `sameAs` field in schema, consolidating trust signals from those high-authority platforms

### What still needs to happen (client action)
The single most important local SEO action is **claiming and fully completing a Google Business Profile**. This is separate from the website and is what populates Gather's information in Google Maps and the local pack. The website SEO work complements and reinforces the Google Business Profile — but it cannot replace it.

---

## Strategy 6: Title Tag Format Consistency

### What it is
Using an identical structural pattern for title tags across every page on the site.

### Why it matters
Consistency in title tags does two things. First, it trains Google to recognize the brand name and its relationship to the service keywords — repetition across many pages reinforces the association. Second, it creates a uniform, professional appearance in search results. When multiple pages from the same site appear in a search, inconsistent titles look disorganized and erode trust.

### What we did for Gather
All 12 pages now follow the same format:

> `[Page Keyword] | Gather Catering and Events`

Previously, some pages used "Gather" (short), some used "Gather Catering and Events" (full), some put the location in the title, some put the brand name first, and some used a dash instead of a pipe separator. The format was different on nearly every page. It is now identical across the entire site.

---

## What's Still Ahead

The strategies above are implemented. The following remain and will continue to improve search visibility:

| Strategy | What It Does |
|----------|-------------|
| **Open Graph Tags** | Controls how links to the site appear when shared on social media, iMessage, etc. — title, description, and preview image |
| **Canonical Tags** | Prevents Google from penalizing the site if the same page becomes reachable at multiple URLs |
| **sitemap.xml** | A file that tells Google every page on the site and when it was last updated — speeds up indexing of new content |
| **robots.txt** | Confirms to Google what it is and isn't allowed to crawl |
| **H1 Keyword Alignment** | Updates the main heading on each service page to include a keyword phrase — the H1 is the strongest on-page ranking signal after the title tag |
| **Body Copy Broadening** | Adds language about corporate events, private parties, and other non-wedding occasions to service pages that currently read as wedding-only |
| **Image Alt Text** | Adds descriptive, keyword-aware text to images — read by Google as content and required for accessibility |
| **Google Business Profile** | The off-site profile that powers Google Maps and local pack appearances — must be claimed and fully completed by the client |

---

## H1 Keyword Alignment — Two Approaches

When it comes to getting the service page H1s to include keyword phrases, there are two distinct strategies worth understanding before choosing a direction.

### The Problem They Both Solve

Right now every service page H1 is just the bare service name — "Mobile Bartending," "Catering," "Full Planning." The H1 is the most important on-page ranking signal after the title tag. Google reads it as the clearest statement of what a page is about. A page whose H1 says "Mobile Bartending" is weaker than one that says "Mobile Bartending in Cincinnati, OH" because the first gives Google no geographic context.

Gather also serves two markets — Cincinnati and Columbus. That creates a choice: one page trying to rank in both cities, or dedicated pages built for each.

---

### Option A: Update the H1s on the Existing Pages

**What it is:** Change the H1 on each of the six existing service pages to include a keyword phrase and location reference.

Example — Mobile Bartending page H1:
- Current: `Mobile Bartending`
- Updated: `Mobile Bartending Services in Cincinnati & Columbus, OH`

**Pros:**
- Fast and simple — six small edits, done in an hour
- Immediate improvement to ranking signals for both cities
- No new pages to write or maintain

**Cons:**
- One page is doing double duty — trying to rank for Cincinnati and Columbus simultaneously
- Google splits attention between both markets rather than giving full weight to one
- Less targeted than dedicated city pages

---

### Option B: City-Specific Landing Pages

**What it is:** Create a dedicated page for each service in each city. Instead of one Mobile Bartending page, you'd have two:
- `/services/mobile-bartending-cincinnati.html` — H1: "Mobile Bartending in Cincinnati, OH"
- `/services/mobile-bartending-columbus.html` — H1: "Mobile Bartending in Columbus, OH"

Applied across all six services and both cities, this means 12 targeted service pages instead of 6.

**Pros:**
- Each page has one job — rank for that exact service in that exact city
- Significantly stronger local ranking signal per city
- More total pages for Google to index, meaning more opportunities to appear in search
- Each page can target city-specific long-tail keywords naturally
- Each page gets its own schema markup

**Cons:**
- More work upfront — 12 pages of content to write instead of 6 edits
- Each city version must have meaningfully different content, not just a swapped city name. If the two versions of a page are too similar, Google may treat them as duplicate content and discount both.
- More pages to keep updated when services or pricing change

---

### The Key Risk with Landing Pages: Thin Content

The biggest pitfall with city-specific landing pages is creating pages that are nearly identical — just swapping "Cincinnati" for "Columbus." Google recognizes this pattern and penalizes it as duplicate content. For landing pages to work, each city version needs genuinely distinct content: local references, different phrasing, perhaps testimonials from clients in that city, or venue/neighborhood mentions that are specific to that market.

---

### Recommendation

| If the priority is... | Go with... |
|-----------------------|-----------|
| Shipping a quick improvement now | Option A — update H1s on existing pages |
| Maximum long-term SEO performance | Option B — city-specific landing pages |
| A phased approach | Option A now, build out Option B pages as content is developed |

The phased approach is often the most practical for a growing business: update the H1s today for an immediate win, then build out city-specific landing pages as a second phase once there is time and content to do them properly.

---

*This document is part of the ongoing SEO initiative for gathercateringandevents.com. See `SEO.md` for the implementation progress tracker.*
