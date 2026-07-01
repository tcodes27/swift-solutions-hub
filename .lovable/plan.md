## Version 2.2 — Simplify navigation & introduce Category Modal

No visual redesign. No data loss. Preserve all article slugs and the interactive article walkthrough.

### 1. Navigation (`src/components/site-nav.tsx`, `SiteFooter`)
- Remove "Popular Fixes" link from the primary nav array. Final links: Home, Browse Topics, How It Works, Admin. Keep "Submit Request" CTA button.
- Remove the footer link to `/popular` as well.

### 2. Popular Fixes route (`src/routes/popular.tsx`)
- Delete the file so `/popular` no longer resolves. Confirm no `<Link to="/popular">` remains anywhere (search & remove/replace with `/topics`).
- Article data in `src/data/articles.ts` stays untouched — `views`, `featured`, categories, slugs all preserved.

### 3. New reusable Category Articles Modal (`src/components/category-modal.tsx`)
- Built on existing shadcn `Dialog` primitives (already gives fade backdrop, scale-in, Esc close, click-outside close, focus trap, a11y).
- Props: `category: Category | null`, `open: boolean`, `onOpenChange`.
- Structure:
  - **Sticky header** (inside DialogContent): category icon in a colored square, category name, one-line description, article count pill, close button (shadcn default).
  - **Search input** — filters that category's articles by title/summary.
  - **Featured article block** — first `featured: true` article in category (fallback: top-viewed). Larger card with accent border.
  - **All articles list** — scrollable (`max-h-[60vh] overflow-y-auto`) list of compact article rows: title, summary, difficulty pill, estTime, lastUpdated, arrow icon. Hover: lift, soft glow, accent border, arrow translate-x, `cursor-pointer`.
- Each row is a `<Link to="/articles/$slug">` that navigates to the full article page (closes modal via router navigation + `onOpenChange(false)` in an onClick handler).
- Sizing: `sm:max-w-2xl`, rounded-2xl, `shadow-lifted`, purple accent trim on header.
- Empty search state: small "No articles match" message with a "Clear search" button.

### 4. Home page (`src/routes/index.tsx`)
- Categories preview section: show only **6–8** categories (slice from `categories`), heading "Pick a category to get started", and a "View all topics →" link to `/topics`.
- Clicking a `CategoryTile` on Home opens the **Category Modal** instead of navigating. To keep `CategoryTile` reusable, add an optional `onSelect?: (category) => void` prop; when provided, render as a `<button>` and call `onSelect` instead of `<Link>`. When absent, keep existing `<Link>` behavior.
- Home page manages `const [activeCategory, setActiveCategory] = useState<Category | null>(null)` and renders `<CategoryModal category={activeCategory} open={!!activeCategory} onOpenChange={o => !o && setActiveCategory(null)} />`.
- Remove/soften any "Popular Fixes" hero CTA on Home; if a popular section exists on Home, keep it as a small supporting strip or remove — do not link to `/popular`.

### 5. Browse Topics page (`src/routes/topics.tsx`) — becomes the main KB
- Keep breadcrumb, page title, subtitle, topic filter input.
- Topic cards use the same `onSelect` prop pattern → open Category Modal (no navigation to `/topics/$slug`).
- Add supporting sections **below** the topic grid, each using existing `ArticleCard`:
  - **Popular Articles** — top 6 by `views`.
  - **Recently Updated** — top 6 by `lastUpdated`.
  - (Optional third "Suggested" — skip to avoid repetition; two sections is enough.)
- Each section: heading + horizontal-ish responsive grid (`md:grid-cols-2 lg:grid-cols-3`).

### 6. Category detail route (`src/routes/topics.$slug.tsx`)
- Keep the route working (deep links from prior sessions, breadcrumbs). No changes required beyond ensuring it still renders. Users primarily reach articles through the modal now, but `/topics/$slug` remains a valid fallback page.

### 7. Article page (`src/routes/articles.$slug.tsx`)
- Unchanged: breadcrumbs, interactive walkthrough, prev/next nav all stay.
- Update prev/next breadcrumb link "Browse Topics" is already correct; no `/popular` references to remove here.

### 8. Content sanity pass (`src/data/articles.ts`)
- Verify every category has ≥4 articles; every article has a unique slug and renders in `articles.$slug.tsx`. Add filler articles only if a category falls short (unlikely — current set has ~5 per category).

### Files created
- `src/components/category-modal.tsx`

### Files edited
- `src/components/site-nav.tsx` (remove Popular Fixes link + footer link)
- `src/components/category-tile.tsx` (add optional `onSelect` prop → renders as button)
- `src/routes/index.tsx` (limit to 6–8 categories, wire modal, remove Popular CTA)
- `src/routes/topics.tsx` (wire modal, add Popular + Recently Updated sections)
- `src/data/articles.ts` (sanity check only; add articles only if short)

### Files deleted
- `src/routes/popular.tsx`

### Out of scope
- Visual redesign, theme changes, article walkthrough logic, admin dashboard, request form, how-it-works page, breadcrumbs component, back-to-top button.
