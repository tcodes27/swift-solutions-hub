## Version 2.1 — Refinement & Content Expansion

Preserves all existing routes, components, and design tokens. Focused on polish, content depth, and navigation completeness.

### 1. Global Navigation (`src/components/site-nav.tsx`)
- Remove `backdrop-blur` / translucent bg. Use solid `bg-background` matching the active theme.
- Add scroll listener: apply `shadow-soft` + subtle border only after `window.scrollY > 8`.
- Keep sticky positioning and existing links (unchanged structure).

### 2. Back-to-Top button (new `src/components/back-to-top.tsx`)
- Mounted from `PageShell` so it appears on every route.
- Listens to scroll; visible when `scrollY / (docHeight - viewport) > 0.4`.
- Fixed bottom-right, circular, primary color, `animate-fade-in` on show, `hover:scale-110` transition.
- Click → `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- Add `scroll-behavior: smooth` to `html` in `src/styles.css`.

### 3. Content expansion (`src/data/articles.ts`)
Rework categories to match the 11 requested groups: Account Access, Devices, Networking, Applications, Security, New Employee Setup, Remote Work, Hardware, Software Requests, Policies, IT Procedures. Preserve existing article slugs where possible (remap categories) so no article link 404s.

Add ~5 articles per category (~55 total) using the titles listed in the brief. Each article gets: `title`, `summary`, `overview`, `symptoms`, `estTime`, `difficulty`, `lastUpdated`, `views`, `steps` (4–6 realistic steps), plus new fields `featured?: boolean` and `preview: string` (one-line quick-preview shown on hover).

### 4. Home page category cards (`src/components/category-tile.tsx`)
Already has hover lift + icon scale. Enhance:
- Add `cursor-pointer`, stronger `hover:shadow-lifted`, border-color transition to `primary/60`.
- Arrow: translate + rotate slightly; icon: scale + subtle rotate; add a soft radial glow via pseudo-element on hover.
- Ensure focus-visible ring for a11y.

### 5. Browse Topics page (`src/routes/topics.tsx`)
- Remove `font-serif`, keep SearchPanel-lite filter.
- Reuse enhanced `CategoryTile` (glow, border accent, arrow slide, icon animation).
- Add breadcrumb (Home › Browse Topics).

### 6. Category page (`src/routes/topics.$slug.tsx`) — intermediate article list
Restructure the page to include:
- Breadcrumb: Home › Browse Topics › {Category}.
- Category header (title, description, count).
- Article search input (local filter).
- **Featured Articles** row (articles with `featured: true`, fallback to top-viewed 2).
- **Recently Updated** row (sorted by `lastUpdated` desc, top 3).
- **Popular Articles** row (sorted by `views` desc, top 3).
- **All Articles** grid using a new `ArticleCard` component.

### 7. New `src/components/article-card.tsx`
Reusable card with: category badge, title, summary, `preview` line, `estTime`, `difficulty` pill, `lastUpdated`, arrow icon. Hover: lift, glow shadow, accent border, arrow translate-x, `cursor-pointer`, smooth transitions, focus ring.

Used in: category page, popular page, search results, related lists.

### 8. Breadcrumbs
Add a small `src/components/breadcrumbs.tsx` (using existing shadcn `breadcrumb.tsx` primitives) and render on: Browse Topics, Category, Article, Popular, Request, Admin, How it Works.

### 9. Article page (`src/routes/articles.$slug.tsx`)
- Add breadcrumb at top: Home › Browse Topics › {Category} › {Article}.
- Keep existing interactive walkthrough (unchanged behavior).
- Add **Previous / Next Article** footer nav — computed from the article's category list order; wraps around at ends or hides at boundaries. Each side shows arrow + article title in a card with hover lift.

### 10. Search experience (`src/components/search-panel.tsx`)
- Enhance result rows to include: title, category badge, difficulty, estTime, short description, keyword highlighting (already present), arrow icon.
- Make dropdown scrollable (`max-h-[70vh] overflow-y-auto`).
- **Empty state**: when query yields 0 results, show a friendly illustration block (Lucide `SearchX` in a soft circle) with heading "No matching articles found.", followed by Suggested Articles (top 3 by views), Popular Articles link, and a CTA button to `/request`.

### 11. Popular page (`src/routes/popular.tsx`)
Swap ad-hoc rows for the new `ArticleCard`; add breadcrumb; remove serif.

### 12. Animations & micro-interactions
- Ensure `PageShell` wraps children in `animate-fade-in` (already present) — verify each route benefits.
- Add loading skeleton utility class usage where lists render (search panel while typing debounce, though data is local so mostly instant — keep skeleton component ready).
- Standardize transitions to `transition-all duration-300 ease-out` on interactive cards.

### Files created
- `src/components/back-to-top.tsx`
- `src/components/article-card.tsx`
- `src/components/breadcrumbs.tsx`

### Files edited
- `src/data/articles.ts` (major expansion, category remap)
- `src/components/site-nav.tsx` (opaque + scroll shadow)
- `src/components/page-shell.tsx` (mount BackToTop)
- `src/components/category-tile.tsx` (enhanced hover)
- `src/components/search-panel.tsx` (richer results + empty state)
- `src/styles.css` (smooth scroll + any new keyframes/glow utility)
- `src/routes/topics.tsx` (breadcrumb, polish)
- `src/routes/topics.$slug.tsx` (featured/recent/popular sections, breadcrumb, ArticleCard)
- `src/routes/articles.$slug.tsx` (breadcrumb, prev/next footer)
- `src/routes/popular.tsx` (ArticleCard + breadcrumb)
- `src/routes/request.tsx`, `src/routes/admin.tsx`, `src/routes/how-it-works.tsx` (breadcrumb only)

### Out of scope
No changes to routing structure, theme toggle, admin dashboard logic, or the walkthrough state machine.
