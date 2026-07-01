# Sprinter IT Hub — QA Test Plan

**Project:** Sprinter IT Hub
**Application Type:** Enterprise IT Knowledge Management Platform
**Primary Users:** Employees · Documentation Managers · IT Administrators
**Document Owner:** QA Lead
**Version:** 1.0
**Last Updated:** July 2026

---

## 1. QA Overview

This document defines the quality assurance strategy for **Sprinter IT Hub**, an internal knowledge management platform that helps employees self-serve common IT issues before opening a support ticket. The QA plan validates functional correctness, visual consistency, accessibility, responsive behavior, and production readiness across the full user journey — from the homepage search to the admin dashboard.

**Objectives**

- Verify all user-facing features work as designed across supported browsers and viewports.
- Confirm no placeholder, demo, or builder-tool references remain in production content.
- Establish a repeatable regression baseline that supports future iterations.
- Produce documentation suitable for both manual execution and portfolio presentation.

**Testing Approach**

- Manual functional testing against acceptance criteria.
- Exploratory testing for edge cases and interaction polish.
- Visual verification in light and dark themes across mobile, tablet, and desktop viewports.
- Accessibility validation via keyboard-only navigation, screen reader spot-checks, and automated tooling (axe DevTools, Lighthouse).

**Roles**

| Role | Responsibility |
|------|----------------|
| QA Lead | Owns plan, prioritizes defects, signs off release |
| Design Reviewer | Validates visual fidelity and interaction polish |
| Engineering | Fixes defects, verifies technical criteria |
| Product Owner | Approves scope, signs off production readiness |

---

## 2. Test Environment

| Item | Value |
|------|-------|
| Local dev server | `http://localhost:8080` (Vite) |
| Preview URL | Lovable preview environment |
| Production URL | *(placeholder — add after deploy)* |
| Node runtime | 20.x |
| Package manager | bun |
| Browsers | Chrome 126+, Safari 17+, Firefox 127+, Edge 126+ |
| Mobile browsers | Mobile Safari (iOS 17+), Chrome Android |
| Viewports | 375 × 667, 768 × 1024, 1280 × 800, 1440 × 900, 1920 × 1080 |
| Tooling | Chrome DevTools, Lighthouse, axe DevTools, VoiceOver, keyboard-only pass |

---

## 3. Test Scope

**In Scope**

- Global navigation, footer, breadcrumbs, back-to-top affordance
- Homepage hero + inline search
- Browse Topics landing page and category grid
- Category modal (open, search, navigate, close)
- Article detail page and step-by-step walkthrough
- Documentation request form (standalone page + admin modal)
- Admin dashboard: analytics, quick actions, workflow, best practices
- Light / dark theme toggle and persistence
- Responsive layouts across mobile, tablet, desktop
- Accessibility (keyboard, focus, contrast, ARIA on dialogs)
- Content integrity (categories, article slugs, metadata)

**Out of Scope**

- Backend integrations (Zendesk, Make.com, Google Sheets) — mocked by design
- Authentication and role-based access control
- Real analytics data — dashboard values are illustrative
- Load, performance, and penetration testing

---

## 4. Functional Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| FUNC-001 | Homepage | Homepage loads successfully | 1. Navigate to `/` | Hero, search, and CTA cards render without errors | Not Started | High |
| FUNC-002 | Homepage CTAs | Browse Knowledge Base CTA routes to Topics | 1. Click "Browse Knowledge Base" card | User lands on `/topics` | Not Started | High |
| FUNC-003 | Homepage CTAs | Submit Request CTA routes to Request | 1. Click "Need Something New?" card | User lands on `/request` | Not Started | High |
| FUNC-004 | Submit Request | Standalone page loads | 1. Navigate to `/request` | Form renders with all fields | Not Started | High |
| FUNC-005 | Submit Request | Required field validation | 1. Submit form with empty title | Browser prevents submission with validation message | Not Started | High |
| FUNC-006 | Submit Request | Success confirmation | 1. Fill all fields 2. Submit | Success screen appears with confirmation copy | Not Started | High |
| FUNC-007 | Admin | Admin page loads | 1. Navigate to `/admin` | Analytics KPIs, charts, quick actions, workflow, best practices all render | Not Started | High |
| FUNC-008 | Admin Modal | Submit Request modal opens from Admin | 1. Click "Submit Documentation Request" | Modal opens with request form | Not Started | High |
| FUNC-009 | Admin Modal | Edit Existing Documentation modal opens | 1. Click "Edit Existing Documentation" | Edit modal opens | Not Started | Medium |
| FUNC-010 | Admin Modal | Create New Article modal opens | 1. Click "Create New Article" | Create modal opens | Not Started | Medium |
| FUNC-011 | Admin Modal | View Analytics modal opens | 1. Click "View Analytics" | Analytics detail modal opens | Not Started | Medium |
| FUNC-012 | Back to Top | Button appears after scrolling | 1. Scroll down 600px on any long page | Back-to-top button becomes visible | Not Started | Medium |
| FUNC-013 | Back to Top | Button scrolls to top | 1. Click back-to-top button | Page smoothly scrolls to `y=0` | Not Started | Medium |

---

## 5. UI / Visual Testing

Validates that visual design matches the Sprinter brand system.

| Test ID | Area | Scenario | Expected Result | Status | Priority |
|---------|------|----------|-----------------|--------|----------|
| UI-001 | Typography | Inter font renders consistently | No fallback serif fonts visible | Not Started | High |
| UI-002 | Color tokens | Primary purple, surface, and text tokens applied | No hardcoded hex colors bleeding through | Not Started | High |
| UI-003 | Spacing | Card padding, section gaps consistent | Layout matches design across pages | Not Started | Medium |
| UI-004 | Shadows | Card + hover shadows render softly | No harsh or missing shadows | Not Started | Medium |
| UI-005 | Radii | 12–16px border radii on cards and buttons | Consistent rounded corners | Not Started | Medium |
| UI-006 | Hover states | Cards lift, glow, and animate on hover | Smooth 200–300ms transitions | Not Started | High |
| UI-007 | Active states | Buttons compress subtly on click | Visible tactile feedback | Not Started | Low |
| UI-008 | Animations | Fade-in and scale animations play smoothly | No jank or layout shift | Not Started | Medium |
| UI-009 | Iconography | Lucide icons render at correct stroke width | Icons align to text baseline | Not Started | Low |
| UI-010 | Favicon | Purple activity-pulse favicon matches nav logo | Tab icon matches header brand | Not Started | Medium |

---

## 6. Navigation Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| NAV-001 | Navbar | Navbar renders on all pages | 1. Visit `/`, `/topics`, `/admin`, `/request`, an article | Nav visible and sticky | Not Started | High |
| NAV-002 | Navbar | Home link routes to `/` | 1. Click "Home" | Lands on homepage | Not Started | High |
| NAV-003 | Navbar | Browse Topics routes to `/topics` | 1. Click "Browse Topics" | Lands on topics page | Not Started | High |
| NAV-004 | Navbar | Admin routes to `/admin` | 1. Click "Admin" | Lands on admin page | Not Started | High |
| NAV-005 | Navbar | Submit Request button routes to `/request` | 1. Click "Submit Request" | Lands on request page | Not Started | High |
| NAV-006 | Navbar | Popular Fixes removed from navigation | 1. Inspect nav and footer | No Popular Fixes link present | Not Started | High |
| NAV-007 | Navbar | Active link is visually highlighted | 1. Visit each route | Active pill/color applied to current route | Not Started | Medium |
| NAV-008 | Navbar | Scroll shadow appears | 1. Scroll page down | Nav gains subtle border/shadow after 8px scroll | Not Started | Medium |
| NAV-009 | Footer | Footer links route correctly | 1. Click each footer link | Correct destination for Topics, Admin, Submit Request | Not Started | Medium |
| NAV-010 | Breadcrumbs | Breadcrumbs render on inner pages | 1. Visit `/topics`, `/request`, an article | Breadcrumbs show correct hierarchy | Not Started | Medium |
| NAV-011 | Prev/Next | Article prev/next navigation works | 1. Open article 2. Click next/prev | Navigates to sibling article | Not Started | Medium |
| NAV-012 | Broken links | No 404s from primary nav | 1. Click every nav + footer link | All destinations resolve | Not Started | High |

---

## 7. Search Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| SRCH-001 | Homepage search | Empty state shows Popular Searches | 1. Focus homepage search input | 4–5 popular items displayed | Not Started | High |
| SRCH-002 | Homepage search | Query returns relevant articles | 1. Type "vpn" | VPN-related articles listed | Not Started | High |
| SRCH-003 | Homepage search | Results contained inside search component | 1. Type query 2. Inspect layout | Results never overflow hero section | Not Started | High |
| SRCH-004 | Homepage search | Results scroll internally at max height | 1. Type broad query returning many results | Panel scrolls internally, capped ~360–420px | Not Started | High |
| SRCH-005 | Homepage search | Keywords highlighted in results | 1. Type "password" | Matching text highlighted | Not Started | Medium |
| SRCH-006 | Homepage search | Empty results state | 1. Type "asdfghjk" | "No results" empty state renders | Not Started | Medium |
| SRCH-007 | Homepage search | Keyboard navigation | 1. Type query 2. Use ↑/↓/Enter | Arrow keys move focus, Enter opens article | Not Started | Medium |
| SRCH-008 | Homepage search | Clicking result opens article | 1. Type query 2. Click result | Article page loads for correct slug | Not Started | High |
| SRCH-009 | Topics search | Filter narrows categories | 1. Type in Topics search | Category grid filters live | Not Started | Medium |
| SRCH-010 | Modal search | Category modal internal search works | 1. Open modal 2. Type in modal search | Article list filters within category | Not Started | Medium |

---

## 8. Category Modal Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| MOD-001 | Trigger | Category card opens modal | 1. Click a category tile on `/` or `/topics` | Modal fades in, scales up | Not Started | High |
| MOD-002 | Header | Sticky header shows icon, name, count, description | 1. Open any modal | All header elements visible | Not Started | High |
| MOD-003 | Featured | Featured article renders when query empty | 1. Open modal | Featured card visible above list | Not Started | Medium |
| MOD-004 | Article list | All category articles listed | 1. Open modal | Each article shows title, summary, difficulty, time, updated date | Not Started | High |
| MOD-005 | Navigation | Clicking article closes modal + opens article page | 1. Click article row | Modal closes; article page loads | Not Started | High |
| MOD-006 | Close X | X button closes modal | 1. Click X icon | Modal closes | Not Started | High |
| MOD-007 | Close outside | Backdrop click closes modal | 1. Click outside modal | Modal closes | Not Started | High |
| MOD-008 | Close Escape | Escape key closes modal | 1. Press Escape | Modal closes | Not Started | High |
| MOD-009 | Focus trap | Focus stays within modal | 1. Tab through modal | Focus cycles within dialog | Not Started | Medium |
| MOD-010 | Empty search | Modal empty search state | 1. Type gibberish in modal search | Empty state with Clear button | Not Started | Low |

---

## 9. Article Walkthrough Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| ART-001 | Load | Article loads from search | 1. Search → click result | Correct article renders | Not Started | High |
| ART-002 | Load | Article loads from modal | 1. Open modal → click article | Correct article renders | Not Started | High |
| ART-003 | Metadata | Time, difficulty, category visible | 1. Open any article | All metadata rendered | Not Started | Medium |
| ART-004 | Steps | Step cards render sequentially | 1. Open article | Steps numbered and legible | Not Started | High |
| ART-005 | Next button | Advances to next step | 1. Click Next | Progress increments; next step displays | Not Started | High |
| ART-006 | Previous button | Returns to previous step | 1. Click Previous | Progress decrements; previous step displays | Not Started | High |
| ART-007 | Progress indicator | Updates as user progresses | 1. Advance through steps | Progress bar/counter reflects position | Not Started | High |
| ART-008 | Completion | Completion screen appears at final step | 1. Advance past last step | "Nice work" style completion state shown | Not Started | High |
| ART-009 | Helpful feedback | Was-this-helpful buttons register | 1. Click yes/no | UI confirms feedback | Not Started | Medium |
| ART-010 | Still Need Help | Zendesk CTA appears | 1. Reach end of article | "Still Need Help" CTA visible | Not Started | High |
| ART-011 | Prev/Next article | Sibling article navigation works | 1. Click next/previous article link | Loads adjacent article | Not Started | Medium |
| ART-012 | Slugs | No broken article slugs | 1. Visit every article across all categories | Every slug resolves to an article page | Not Started | High |

---

## 10. Documentation Request Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| REQ-001 | Page load | `/request` renders | 1. Visit `/request` | Form and hero visible | Not Started | High |
| REQ-002 | Fields | All fields render | 1. Inspect form | Title, category, description, priority, submit visible | Not Started | High |
| REQ-003 | Validation | Required fields enforced | 1. Submit empty form | Native validation blocks submission | Not Started | High |
| REQ-004 | Priority pills | Priority toggle works | 1. Click Low / Normal / High | Active pill visually reflected | Not Started | Medium |
| REQ-005 | Category select | Category dropdown lists all categories | 1. Open select | Every category present | Not Started | Medium |
| REQ-006 | Confirmation | Success state shows after submit | 1. Fill + submit | Confirmation card appears | Not Started | High |
| REQ-007 | Submit another | Reset flow works | 1. Click "Submit another" | Form resets to blank state | Not Started | Low |
| REQ-008 | Admin modal parity | Modal form matches standalone form | 1. Open request modal from Admin | Same fields + validation behavior | Not Started | High |

---

## 11. Admin Dashboard Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| ADM-001 | Analytics | KPI cards render values | 1. Visit `/admin` | Articles Published, Tickets Deflected, etc. render numbers | Not Started | High |
| ADM-002 | Charts | Recharts chart renders | 1. Visit `/admin` | Chart displays without errors | Not Started | High |
| ADM-003 | Quick Actions | All quick actions visible | 1. Inspect Quick Actions section | Four action cards render | Not Started | High |
| ADM-004 | Quick Actions | Hover elevation + purple accent | 1. Hover each action | Lift, border, and icon animation trigger | Not Started | Medium |
| ADM-005 | Quick Actions | Each opens correct modal | 1. Click each action | Corresponding modal opens | Not Started | High |
| ADM-006 | Workflow | Documentation Workflow section displays | 1. Scroll to workflow | Cards render with progression + pulse arrows | Not Started | Medium |
| ADM-007 | Workflow | Cards animate on scroll into view | 1. Scroll page | Fade-in animation triggers once | Not Started | Low |
| ADM-008 | Best Practices | Section renders | 1. Scroll to best practices | Card with checkmark items visible | Not Started | Medium |
| ADM-009 | Best Practices | Hover feedback | 1. Hover card | Soft shadow + subtle highlight | Not Started | Low |
| ADM-010 | Modal close | Modals close via X, outside, Escape | 1. Open + close each modal three ways | Modal dismisses cleanly | Not Started | High |

---

## 12. Theme Testing

| Test ID | Feature | Scenario | Steps | Expected Result | Status | Priority |
|---------|---------|----------|-------|-----------------|--------|----------|
| THM-001 | Toggle | Theme toggle switches modes | 1. Click theme toggle | UI switches between light and dark | Not Started | High |
| THM-002 | Light mode | Light mode renders correctly | 1. Set light 2. Visit every page | Colors, contrast, and shadows correct | Not Started | High |
| THM-003 | Dark mode | Dark mode renders correctly | 1. Set dark 2. Visit every page | No unreadable text or broken tokens | Not Started | High |
| THM-004 | Persistence | Preference persists across navigation | 1. Toggle theme 2. Navigate around | Theme remains applied | Not Started | High |
| THM-005 | Persistence | Preference persists on reload | 1. Toggle 2. Refresh | Theme restored from storage | Not Started | Medium |
| THM-006 | FOUC | No flash of wrong theme on load | 1. Hard refresh | Initial paint matches saved theme | Not Started | Medium |
| THM-007 | Modals in dark | Modals styled correctly in dark | 1. Open modals in dark | Header, body, controls readable | Not Started | High |

---

## 13. Responsive Testing

| Test ID | Viewport | Scenario | Expected Result | Status | Priority |
|---------|----------|----------|-----------------|--------|----------|
| RSP-001 | 375 × 667 (Mobile) | Homepage stacks cleanly | Hero, search, CTAs stack vertically | Not Started | High |
| RSP-002 | 375 × 667 | Nav collapses appropriately | Nav remains usable on mobile | Not Started | High |
| RSP-003 | 375 × 667 | Modals fit within viewport | Modal scrolls internally, no overflow | Not Started | High |
| RSP-004 | 768 × 1024 (Tablet) | Category grid renders 2-up | Two-column grid + readable spacing | Not Started | Medium |
| RSP-005 | 1280 × 800 (Desktop) | Category grid renders 3-up | Three-column grid with correct gutters | Not Started | High |
| RSP-006 | 1440 × 900 | Layout scales without stretching | Max-width containers respected | Not Started | Medium |
| RSP-007 | All viewports | No horizontal scroll anywhere | Body never exceeds viewport width | Not Started | High |
| RSP-008 | All viewports | Sticky nav behaves correctly | Nav remains pinned + performant | Not Started | Medium |

---

## 14. Accessibility Testing

| Test ID | Area | Scenario | Expected Result | Status | Priority |
|---------|------|----------|-----------------|--------|----------|
| A11Y-001 | Keyboard | Tab traversal reaches all interactive elements | Every button, link, input reachable | Not Started | High |
| A11Y-002 | Keyboard | Focus states visible on all controls | Clear focus ring on every element | Not Started | High |
| A11Y-003 | Keyboard | Modals trap focus | Focus never escapes open dialog | Not Started | High |
| A11Y-004 | Keyboard | Escape closes modals | Escape dismisses dialog reliably | Not Started | High |
| A11Y-005 | Semantics | Single H1 per page | Heading hierarchy is logical | Not Started | Medium |
| A11Y-006 | Semantics | Landmarks present (header, main, footer, nav) | Screen readers navigate landmarks | Not Started | Medium |
| A11Y-007 | ARIA | Dialogs use `role="dialog"` + labelled title/description | Announced correctly by AT | Not Started | High |
| A11Y-008 | Images | Meaningful alt text | Decorative images marked appropriately | Not Started | Medium |
| A11Y-009 | Contrast | Text meets WCAG AA in light + dark | axe reports no contrast violations | Not Started | High |
| A11Y-010 | Motion | Animations degrade with prefers-reduced-motion | Motion reduced when OS setting enabled | Not Started | Low |
| A11Y-011 | Forms | Inputs have associated labels | Every field has visible label | Not Started | High |

---

## 15. Content QA

| Test ID | Area | Scenario | Expected Result | Status | Priority |
|---------|------|----------|-----------------|--------|----------|
| CNT-001 | Placeholder copy | No "Lorem ipsum" or TODO copy | Every string is real product copy | Not Started | High |
| CNT-002 | Demo content | No test / demo article names | All articles look production-grade | Not Started | High |
| CNT-003 | Categories | Every category has 4–6 real articles | No empty categories | Not Started | High |
| CNT-004 | Slugs | All article slugs resolve | No broken article routes | Not Started | High |
| CNT-005 | Metadata | Every article has title, summary, time, difficulty | No missing metadata | Not Started | Medium |
| CNT-006 | SEO | Each route sets unique title + description | Head metadata unique per page | Not Started | Medium |
| CNT-007 | Branding | No "Lovable" / "builder" / template references anywhere | Search codebase + rendered UI | Not Started | High |
| CNT-008 | Branding | App name reads "Sprinter IT Hub" (not "IT Support Hub") | Consistent naming across UI + README | Not Started | High |
| CNT-009 | Favicon | Favicon matches nav logo | Purple pulse mark visible in tab | Not Started | Medium |
| CNT-010 | README | README exists and is complete | Portfolio-ready README present at root | Not Started | High |

---

## 16. Browser Compatibility Testing

| Test ID | Browser | Version | Scenario | Expected Result | Status | Priority |
|---------|---------|---------|----------|-----------------|--------|----------|
| BRW-001 | Chrome | 126+ | Full smoke pass | All features work | Not Started | High |
| BRW-002 | Safari | 17+ | Full smoke pass | All features work; no Safari-only glitches | Not Started | High |
| BRW-003 | Firefox | 127+ | Full smoke pass | All features work | Not Started | Medium |
| BRW-004 | Edge | 126+ | Full smoke pass | All features work | Not Started | Medium |
| BRW-005 | Mobile Safari | iOS 17+ | Smoke on iPhone | Layout, modal, search work | Not Started | High |
| BRW-006 | Chrome Android | Latest | Smoke on Android | Layout, modal, search work | Not Started | Medium |

---

## 17. Regression Testing

Run after any code change touching navigation, search, modals, articles, admin, or theming.

- [ ] Homepage loads with hero, search, and both CTA cards.
- [ ] Homepage search returns results, contained and scrollable.
- [ ] Browse Topics renders full category grid + Popular + Recently Updated sections.
- [ ] Category modal opens, filters, and navigates to article.
- [ ] Modal closes via X, outside click, and Escape.
- [ ] Article walkthrough steps forward, backward, and shows completion state.
- [ ] Still Need Help CTA appears on articles.
- [ ] `/request` submits and shows confirmation.
- [ ] Admin analytics, quick actions, workflow, and best practices all render.
- [ ] Admin quick actions each open the correct modal.
- [ ] Theme toggle persists across navigation and reload.
- [ ] Mobile, tablet, desktop layouts pass smoke test.
- [ ] No new console errors or warnings.
- [ ] No new Lovable / builder references appear in code or UI.

---

## 18. Production Readiness Checklist

- [ ] All routes tested
- [ ] All buttons tested
- [ ] All forms tested
- [ ] All modals tested
- [ ] All article links tested
- [ ] Responsive design reviewed (mobile, tablet, desktop)
- [ ] Accessibility reviewed (keyboard, focus, contrast, ARIA)
- [ ] Dark mode reviewed
- [ ] No console errors
- [ ] No broken links
- [ ] No placeholder content
- [ ] No builder branding
- [ ] README complete
- [ ] Screenshots added or placeholders confirmed
- [ ] Live demo URL placeholder ready

---

## 19. Known Issues

| ID | Area | Description | Impact | Resolution |
|----|------|-------------|--------|------------|
| KI-001 | Admin analytics | KPI values and charts are illustrative mock data | Low — intentional for portfolio demo | Replace with real analytics when backend is integrated |
| KI-002 | Request form | Submissions are not persisted to a backend | Low — confirmation UX is functional | Wire to Make.com / Google Sheets per Operational Workflow concept |
| KI-003 | Zendesk CTA | "Still Need Help" links to a placeholder ticket URL | Low | Point to real Zendesk instance on deploy |
| KI-004 | Authentication | No auth layer present | N/A — out of scope for v2 | Add SSO for production rollout |

---

## 20. Sign-Off Checklist

| Role | Name | Date | Signature / Approval |
|------|------|------|----------------------|
| QA Lead | | | |
| Design Reviewer | | | |
| Engineering Lead | | | |
| Product Owner | | | |

**Release Decision:** ☐ Approved for Release  ☐ Approved with Conditions  ☐ Not Approved

---

*This QA test plan is a living document. Update it as new features, browsers, or accessibility requirements are added to Sprinter IT Hub.*
