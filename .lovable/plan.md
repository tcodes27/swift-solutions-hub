
# IT Support Hub — Build Plan

A modern internal app that helps employees solve common IT issues before opening a ticket. Visual language pulled directly from the uploaded Sprinter Health screenshots: deep indigo navy, vivid Sprinter purple, off-white background, with accent pops (mint, coral, amber) used sparingly on icon tiles like the "Your Sprinter Offer" cards.

## Color system (from the screenshots)

Defined as tokens in `src/styles.css` (`@theme inline` + `:root`):

- `--background`: warm off-white `#F7F6F2` (the page bg in screenshots)
- `--foreground`: deep indigo `#1B1145`
- `--primary`: Sprinter purple `#6B4EFF` (pill buttons, links)
- `--primary-foreground`: white
- `--secondary` / hero surface: deep navy `#221A5C` (hero card + dashboard bg)
- `--accent`: lighter purple `#8E7BFF` (decorative rings, hovers)
- `--muted`: soft lavender-gray `#EDEAF7`
- `--card`: white with soft shadow
- Icon-tile accents (used only on category/benefit tiles, like the offer cards): mint `#3FC9A3`, coral `#FF6B6B`, amber `#FFB547`, sky `#5BB7FF`, pink `#FF8FB1`
- Soft shadow tokens: `--shadow-card`, `--shadow-card-hover` (low-opacity indigo)
- Radius: 2xl (matches the rounded pill buttons + rounded cards in the screenshots)

All values live in one block so they're trivial to retune later.

## Typography

- Headings: **Instrument Serif** (matches the serif display used in "Bringing care to wherever patients call home" and "Your Sprinter Offer").
- Body / UI: **Inter** (matches body + nav).
- Loaded via `<link>` in `__root.tsx` head (per Tailwind v4 rule — no remote `@import` in CSS).
- All copy at ~6th-grade reading level: short sentences, no jargon, every page answers "what do I do next?".

## Motion + craft

- Cards lift on hover (translateY + deeper shadow).
- Pill buttons scale subtly + arrow nudges right.
- Skeleton loaders on list pages.
- Fade/slide-in on scroll for the How It Works workflow (IntersectionObserver).
- Decorative dashed-arc background motif (echoing the circular dotted rings in the Sprinter hero) used behind the home hero and dashboard header as a subtle SVG.

## Routes (TanStack file-based, under `src/routes/`)

```
__root.tsx           App shell: top nav (logo + links + "Submit Request" pill CTA) + Outlet
index.tsx            Home
topics.tsx           Browse Topics
topics.$slug.tsx     Category page (article list + search/filter)
articles.$slug.tsx   Knowledge article (step-by-step + feedback)
popular.tsx          Popular Fixes
request.tsx          Submit Documentation Request
admin.tsx            Admin Dashboard
how-it-works.tsx     Workflow + behind-the-scenes diagram
```

Each route sets its own `head()` with unique title + description.

## Page contents

- **Home**: navy hero card with serif headline "IT Support Hub", subtitle, and large centered search ("What do you need help with today?"). 8 category tiles below (Laptop Setup, Wi-Fi & Internet, Passwords & Login, Email, Software, New Employee Setup, Security, Printers & Devices) — each tile uses a colored rounded icon square (purple/mint/coral/amber/sky/pink) like the offer cards, with title, one-line description, and an arrow that nudges on hover. Sections below: Popular Articles, Recently Updated, Quick Tips.
- **Browse Topics**: same 8 categories as larger cards with article counts + search.
- **Category page**: article cards (title, summary, est. time, difficulty badge, last updated), client-side search + difficulty/time filter.
- **Article page** (the hero page): large serif title, overview, common symptoms list, time + difficulty pills. Troubleshooting steps each render as their own card with a numbered purple chip, instruction, illustration placeholder, and a "Next" button that advances/scrolls. Bottom: 🎉 "Did this solve your problem?" with ✅/❌ pill buttons. ❌ reveals a "Submit Zendesk Support Ticket" CTA (placeholder URL, new tab). Separate 👍/👎 "Helpful?" row.
- **Popular Fixes**: ranked list of most-viewed sample articles with view counts.
- **Submit Documentation Request**: friendly form (Title, Category, Description, Priority, Submit) → success card with the requested confirmation message.
- **Admin Dashboard**: navy header band with KPI cards (Total Articles, Published, Needs Review, Drafts) styled like the "Momentum at Scale" stat cards (large serif numbers, label below). Recharts donut for Documentation Health, bar chart for Recently Updated, Recent Activity feed.
- **How It Works**: vertical workflow with cards connected by arrows, fade/slide-in on scroll. Below: Behind-the-Scenes architecture diagram (Employee → IT Support Hub → Google Sheets → Make.com → Published KB → Future Employees).

## Sample data

Single `src/data/articles.ts` with categories + ~9 articles (Mac won't connect to Wi-Fi, VPN won't connect, Forgot password, Slack login issues, Printer offline, Camera not working, New employee laptop setup, Software installation, Google Workspace access). Each article: slug, category, title, summary, overview, symptoms[], estTime, difficulty, lastUpdated, steps[]. Pages read from this file so adding articles is one place.

## Out of scope (for now)

- No backend — form submit + feedback buttons show local confirmation only.
- No auth — Admin Dashboard is open and uses sample data.
- No real Zendesk integration — button links to a placeholder URL.

Approve and I'll build it.
