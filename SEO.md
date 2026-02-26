# SEO & Marketing Strategy — Gather Catering and Events

**Document created:** 2026-02-26
**Last updated:** 2026-02-26
**Status:** In progress — living document

---

## Why We're Doing This

Gather Catering and Events is a full-service event company competing in a local market where most clients find vendors through search engines, review platforms (The Knot, WeddingWire), and word of mouth. The website is the primary digital storefront. At the start of this work, it was largely invisible to search engines because:

- **No location signals** — page titles, meta descriptions, and body content never named the city or service area, which is the single most important ranking factor for local service businesses
- **Wedding-centric copy on a multi-service brand** — several service descriptions read as wedding-only, which undersells the corporate, private party, and social event market and misses those search queries entirely
- **Thin service pages** — each service page had 3–4 short paragraphs, far below the content depth Google rewards for competitive local queries
- **No structured data** — no JSON-LD schema for LocalBusiness, Service, or FAQPage, so Google couldn't confidently surface the business in map packs or rich results
- **Untapped long-tail keywords** — high-intent queries like "mobile bartending for corporate event" or "catering staffing wedding Cincinnati" were not represented in the content

The goal of this work is to close those gaps systematically so that people actively searching for what Gather offers actually find the website.

---

## Target Audience

| Segment | What They Search For | Priority |
|---------|---------------------|----------|
| Wedding couples | wedding planner, day-of coordinator, wedding catering, mobile bar wedding | High |
| Corporate event organizers | corporate catering, event staffing, corporate event planner | High |
| Private party hosts | catering for birthday party, mobile bartender for party, food cart rental | Medium |
| Venue/vendor referrals | catering company Cincinnati, event coordination services | Medium |

---

## Service Area

**Primary markets:** Cincinnati, OH and Columbus, OH
**Travel policy:** Events within a 100-mile radius of base location included in standard pricing; travel fee applies beyond that range.

---

## Keyword Strategy

### Primary Keywords (highest intent, target on homepage + service pages)
- `catering and events Cincinnati OH`
- `event planning Cincinnati Columbus Ohio`
- `wedding catering Cincinnati`
- `mobile bartending Cincinnati Columbus`
- `day-of wedding coordinator Cincinnati`

### Secondary Keywords (used in body copy and headings)
- `full service event planning`
- `catering staffing services`
- `mobile food cart rental`
- `wedding coordinator near me`
- `corporate catering services`
- `event catering company`
- `catering for weddings and events`

### Long-Tail Keywords (used in FAQ page, blog content, and supporting copy)
- `how much does a wedding coordinator cost`
- `mobile bartending for corporate events`
- `catering staffing for large events`
- `day of coordination vs full planning`
- `food cart for bridal shower`
- `grazing table catering Cincinnati`
- `buffet catering replenishment service`

---

## Implementation Progress

### ✅ 1. Confirm Service Area
**Completed 2026-02-26**
Primary markets confirmed: **Cincinnati, OH** and **Columbus, OH**.

---

### ✅ 2. Title Tags
**Completed 2026-02-26**
All 12 pages updated. Format: `[Primary Keyword] | [Location] | Gather`

Format: `[Page Keyword] | Gather Catering and Events` — consistent across all pages. Location signal carried by meta descriptions and JSON-LD schema.

| Page | Implemented Title |
|------|-------------------|
| Homepage | `Event Catering & Planning \| Gather Catering and Events` |
| Full Planning | `Full Event Planning \| Gather Catering and Events` |
| Day-Of Coordinating | `Day-Of Event Coordinator \| Gather Catering and Events` |
| Mobile Bartending | `Mobile Bartending \| Gather Catering and Events` |
| Catering | `Event Catering Services \| Gather Catering and Events` |
| Catering Staffing | `Catering Staffing & Event Staff \| Gather Catering and Events` |
| Mobile Food Cart | `Mobile Food Cart Rental \| Gather Catering and Events` |
| About | `About Us \| Gather Catering and Events` |
| Testimonials | `Client Reviews \| Gather Catering and Events` |
| Policies | `Policies \| Gather Catering and Events` |
| FAQs | `Frequently Asked Questions \| Gather Catering and Events` |
| Inquiry | `Request a Quote \| Gather Catering and Events` |

---

### ✅ 3. Meta Descriptions
**Completed 2026-02-26**
All 12 pages updated. Each includes: primary keyword + location + value prop. Target ~155 characters.

| Page | Implemented Description |
|------|-------------------------|
| Homepage | Full-service catering, event planning, and mobile bartending in Cincinnati and Columbus, OH. From dawn to dusk, Gather brings your vision to life. |
| Full Planning | Expert full-service event and wedding planning in Cincinnati & Columbus, OH. From first meeting to final dance — Gather handles every detail. Starting at $2,950. |
| Day-Of Coordinating | Day-of coordination in Cincinnati & Columbus, OH. You've done the planning — Gather manages the timeline, vendors, and every detail. Starting at $2,500. |
| Mobile Bartending | Professional mobile bartending for weddings and events in Cincinnati & Columbus, OH. Craft cocktails, full bar service, experienced staff. Starting at $1,500. |
| Catering | Custom catering menus for weddings and events in Cincinnati & Columbus, OH. Breakfast buffets, mimosa bars, and vendor meals — from dawn to dusk. |
| Catering Staffing | Professional event catering staff in Cincinnati and Columbus, OH. Keep your buffet running and guests happy. $100–$125/hr, 4-hour minimum. |
| Mobile Food Cart | Mobile food cart and grazing table rentals for weddings and events in Cincinnati & Columbus, OH. Charcuterie, mimosa bars, mac & cheese, and more. Starting at $500. |
| About | Meet the team behind Gather Catering and Events — serving Cincinnati and Columbus, OH. Passion, experience, and care in every detail we touch. |
| Testimonials | See what Cincinnati and Columbus clients say about Gather Catering and Events. Real reviews from weddings, corporate events, and private parties. |
| Policies | Review booking, cancellation, payment, and service policies for Gather Catering and Events — serving Cincinnati and Columbus, OH. |
| FAQs | Answers to common questions about Gather's event planning, catering, bartending, and coordination services in Cincinnati and Columbus, OH. |
| Inquiry | Request a quote for event planning, catering, mobile bartending, and staffing in Cincinnati and Columbus, OH. Get a response within 24–48 hours. |

---

### ✅ 4. JSON-LD Structured Data
**Completed 2026-02-26**

**LocalBusiness schema** — added to `src/_partials/head-bottom.html` (appears on all 12 pages).
Includes: business name, URL, email, description, Cincinnati address, both cities in `areaServed`, and verified `sameAs` links:
- The Knot: `https://www.theknot.com/marketplace/gather-from-dawn-to-dusk-cincinnati-oh-2101040`
- WeddingWire: `https://www.weddingwire.com/biz/gather-from-dawn-to-dusk/4e3cac205c612625.html`

**Service schema** — added to each of the 6 service pages with service type, description, provider reference, area served, and pricing:

| Page | Schema Highlights |
|------|------------------|
| Full Planning | serviceType: Event Planning · price: $2,950 |
| Day-Of Coordinating | serviceType: Event Coordination · price: $2,500 |
| Mobile Bartending | serviceType: Mobile Bartending · price: $1,500 |
| Catering | serviceType: Catering |
| Catering Staffing | serviceType: Catering Staffing · price: $100–$125/hr |
| Mobile Food Cart | serviceType: Mobile Food Cart · price: $500 |

**FAQPage schema** — added to `src/pages/faq.html` with all 10 Q&A pairs from the existing FAQ content. Enables Google to surface individual answers in "People Also Ask" results.

---

### ✅ 5. Open Graph Tags
**Completed 2026-02-26 · OG image updated 2026-02-26**

Added to `build.sh` so every page gets correct, page-specific OG tags automatically at build time. Tags output per page:

- `og:type` — `website` (static)
- `og:site_name` — `Gather Catering and Events` (static)
- `og:title` — pulled from each page's `<!-- TITLE: -->` front matter
- `og:description` — pulled from each page's `<!-- DESC: -->` front matter
- `og:url` — computed canonical URL per page
- `og:image` — `images/GATHER.jpg` (branded social share image)

---

### ✅ 6. Canonical Tags
**Completed 2026-02-26**

Added to `build.sh` alongside the OG tags — one line, automatically correct for every page using the same computed `$canonical_url` variable. Homepage points to `https://gathercateringandevents.com/` and all other pages include their full path.

---

### ✅ 7. sitemap.xml + robots.txt
**Completed 2026-02-26**

Both files are now generated automatically on every build and land in `publish/`.

- **`sitemap.xml`** — lists all 12 pages with today's date as `lastmod` and priority weights (1.0 homepage, 0.9 service pages, 0.8 supporting pages). Generated dynamically in `build.sh`.
- **`robots.txt`** — allows all crawlers, points to the sitemap URL. Source file lives in the project root and is copied to `publish/` on each build.

> **Next step (client):** Submit `https://gathercateringandevents.com/sitemap.xml` to Google Search Console once the site is live.

---

### ⬜ 8. H1 Keyword Alignment on Service Pages
**Not started**

Every service page H1 is the bare service name with no location or keyword context. H1 is the strongest on-page ranking signal.

| Page | Current H1 | Recommended H1 |
|------|-----------|----------------|
| Full Planning | `Full Planning` | `Full-Service Event Planning in Cincinnati & Columbus` |
| Day-Of Coordinating | `"Day Of" Coordinating` | `Day-Of Event Coordination in Cincinnati & Columbus` |
| Mobile Bartending | `Mobile Bartending` | `Mobile Bartending Services in Cincinnati & Columbus` |
| Catering | `Catering` | `Event Catering in Cincinnati & Columbus, OH` |
| Catering Staffing | `Catering Staffing` | `Catering Staffing & Event Staff in Cincinnati & Columbus` |
| Mobile Food Cart | `Mobile Food Cart` | `Mobile Food Cart Rentals in Cincinnati & Columbus` |

---

### ✅ 9. Body Copy — Broaden Beyond Weddings
**Completed 2026-02-26**

Several service descriptions read as wedding-only, causing non-wedding searchers to bounce. Updated 5 pages with inclusive language. Wedding references retained — corporate events, private parties, and other celebrations added throughout.

| Page | Key Changes |
|------|-------------|
| Homepage | Service card descriptions broadened for Full Planning, Day-Of, Bartending, and Catering |
| Full Planning | "couples/wedding" → "anyone/event"; pricing sections renamed Pre-Event and Event Day |
| Day-Of Coordinating | "wedding" → "event" throughout; "first look" → "first arrival"; "couples" → "anyone" |
| Catering | "wedding" → "wedding, corporate gathering, or private celebration" |
| Mobile Bartending | Broadened to include corporate events and private parties alongside weddings |

---

### ✅ 10. Image Alt Text
**Completed 2026-02-26**

Updated on both the homepage service cards and the hero image on each service detail page.

| Image | Updated Alt |
|-------|-------------|
| Full planning | `Elegantly lit wedding reception — full event planning by Gather` |
| Day-Of Coordinating | `Elegantly set event table — day-of coordination by Gather` |
| Mobile Bartending | `Bartender crafting cocktails at a Gather mobile bar event` |
| Catering | `Elegant appetizers and small plates at a Gather-catered event` |
| Catering Staffing | `Professional catering staff serving guests at a Gather event` |
| Mobile Food Cart | `Assorted pastries and desserts at a Gather mobile food cart` |
| Team photo | *(unchanged — already correct)* |

---

## Local SEO — Client Action Items

These live outside the codebase but directly affect local ranking.

| Action | Status | Notes |
|--------|--------|-------|
| **Google Business Profile** | ⬜ Not confirmed | Claim/verify, add all services, photos, and hours. NAP must match website exactly. |
| **NAP Consistency** | ⬜ Not confirmed | Business name, address, phone must be identical across website, Google, The Knot, WeddingWire, Yelp. |
| **The Knot profile** | ✅ URL confirmed | `theknot.com/marketplace/gather-from-dawn-to-dusk-cincinnati-oh-2101040` |
| **WeddingWire profile** | ✅ URL confirmed | `weddingwire.com/biz/gather-from-dawn-to-dusk/4e3cac205c612625.html` |
| **Review generation** | ⬜ Not started | After each event, request a Google review from the client. Reviews are a direct local pack ranking factor. |
| **Local citations** | ⬜ Not started | Submit to local chamber of commerce, regional bridal guides, event directories. |

---

## Content Strategy (Beyond Current Pages)

### FAQ Page (built — content is live)
FAQPage JSON-LD schema added. Now 14 Q&A pairs across three groups: Pricing, Services, and Logistics. All questions are present in both the visible page content and the JSON-LD schema for "People Also Ask" eligibility.

**Added 2026-02-26:**
- Do you provide bar service at dry venues? *(Services)*
- Can services be bundled or packaged? *(Services)*
- What is included in catering staffing? *(Services)*
- Do you travel outside of Cincinnati or Columbus? *(Logistics — new group)*

### Future: Blog / Journal
A simple blog can capture long-tail traffic that service pages can't efficiently target:
- "How to Choose a Day-Of Wedding Coordinator in Cincinnati"
- "What to Expect from a Mobile Bartending Service"
- "Grazing Table vs. Traditional Buffet: Which Is Right for Your Event?"

Future scope — not launch-blocking.

---

## Open Questions

- [ ] **Phone number** — needed for NAP consistency in footer and Google Business Profile
- [ ] **Google Business Profile** — does one exist? Is it claimed and verified?
- [x] **OG image** — `images/GATHER.jpg` added and wired up in `build.sh`
- [ ] **Service area clarification** — do they serve outside Cincinnati/Columbus metro? Statewide?
