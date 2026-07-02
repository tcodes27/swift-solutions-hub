## Plan: Create `QA_TEST_PLAN.md`

Add a single new file at the project root — `QA_TEST_PLAN.md` — written as a portfolio-ready, enterprise-grade QA document for **Sprinter IT Hub**. No application code will be touched.

### Document structure (20 sections, in order)

1. **QA Overview** — purpose, scope summary, testing approach (manual + exploratory), roles.
2. **Test Environment** — local dev (Vite on `:8080`), preview URL, supported browsers, viewports, tooling (DevTools, Lighthouse, axe, keyboard-only).
3. **Test Scope** — in-scope features + explicit out-of-scope (backend, auth, real analytics).
4. **Functional Testing** — master table of all functional test cases (see list below).
5. **UI / Visual Testing** — typography, spacing, shadows, hover/active states, animation smoothness.
6. **Navigation Testing** — navbar links, footer links, breadcrumbs, active states, "Popular Fixes" removal check.
7. **Search Testing** — homepage inline search, filter search on Topics, category modal search, empty state, containment.
8. **Category Modal Testing** — open/close (X, outside click, Escape), sticky header, internal search, featured section, article list navigation.
9. **Article Walkthrough Testing** — step navigation, progress indicator, completion screen, "Still Need Help" CTA, prev/next article.
10. **Documentation Request Testing** — `/request` page + Admin modal variant, validation, priority pills, confirmation state.
11. **Admin Dashboard Testing** — analytics KPIs, charts render, Quick Actions open correct modals, workflow & best practices interactivity.
12. **Theme Testing** — toggle, persistence across navigation, contrast, no FOUC.
13. **Responsive Testing** — mobile (375), tablet (768), desktop (1280, 1440), no horizontal scroll.
14. **Accessibility Testing** — keyboard nav, focus rings, semantic HTML, alt text, ARIA on modals, color contrast, reduced motion.
15. **Content QA** — no placeholder/demo text, every category populated, every article slug resolves, metadata present.
16. **Browser Compatibility Testing** — Chrome, Safari, Firefox, Edge matrix (desktop + mobile Safari/Chrome).
17. **Regression Testing** — checklist to re-run after any change (nav, search, modal, article, admin, theme).
18. **Production Readiness Checklist** — as specified in the request.
19. **Known Issues** — placeholder table (mock data by design, no real backend, analytics are illustrative).
20. **Sign-Off Checklist** — QA lead, design, engineering, product owner rows.

### Test case table format

Every functional section uses the exact table format requested:

```
| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
```

- Statuses: `Not Started`, `Passed`, `Failed`, `Blocked` (default `Not Started`).
- Priorities: `High`, `Medium`, `Low`.
- IDs namespaced by area: `NAV-001`, `SRCH-001`, `MOD-001`, `ART-001`, `REQ-001`, `ADM-001`, `THM-001`, `RSP-001`, `A11Y-001`, `CNT-001`, `BRW-001`.

### Test cases explicitly covered

All items from the request will appear as individual rows, including: homepage load, navbar routing, Popular Fixes removed, Browse Topics opens, category card opens modal, modal close (X / outside / Escape), modal → article navigation, search relevance, search containment, internal scroll, empty search state, article from search, article from modal, walkthrough next/prev, progress indicator, completion screen, Still Need Help CTA, Submit Request page load, form validation, form confirmation, Admin analytics, Admin quick actions open modals, Admin submit request modal, workflow section, best practices section, back-to-top appear + scroll, light mode, dark mode, theme persistence, mobile/tablet/desktop layouts, keyboard nav, focus states, no horizontal scroll, no broken slugs, no empty categories, no placeholder content, no Lovable/builder references, README completeness.

### Style

Professional tone, concise steps, consistent voice, no emojis, matches enterprise QA documentation conventions. Useful both as a manual testing checklist and as a portfolio artifact.

### Files changed

- **Create:** `QA_TEST_PLAN.md` (root)
- **No other files touched.**
