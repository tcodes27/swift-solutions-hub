
## Plan: Automation Workflow Demo (Admin page, MVP concept)

Add a compact, clearly-labeled visual demo to `src/routes/admin.tsx` that shows how a documentation request would flow through Google Sheets → Make.com → Slack → review → publish. No APIs, no auth, no new routes, no changes to the request form.

### Files touched

- **Create** `src/components/automation-demo.tsx` — one self-contained component (`<AutomationDemo />`) holding the header, workflow strip, Sheets preview, Slack preview, and Make.com scenario card, plus the simulation state machine.
- **Edit** `src/routes/admin.tsx` — import `AutomationDemo`, add a new `SectionHeader` labeled `Section 3.5 · MVP Concept Demo`, and render `<AutomationDemo />` directly after the existing Documentation Workflow section and before Best Practices.

Nothing else is modified.

### Section layout (top → bottom, one card container)

1. **Header row inside the card**
   - Pill: `MVP CONCEPT DEMO` + small helper "Visual only · No real APIs connected"
   - H3: `Automation workflow demo`
   - Subtitle: "This demo shows how documentation requests could move from submission to review, approval, and publishing using Google Workspace, Slack, and workflow automation."
   - Helper strip (muted, one line): "This prototype does not connect to private company tools. It demonstrates the intended automation workflow for production."
   - Primary button: **Simulate documentation request** (spinner + "Simulating…" while running, becomes **Run again** + ghost **Reset** when complete).

2. **Workflow strip** — 9 compact step cards in a 3-column responsive grid (2 cols tablet, 1 col mobile). Each card: icon, `Step N`, title, status chip.
   - Steps: Employee submits · Saved to Google Sheets · Make.com watches for new rows · Slack alert sent · Admin reviews · Article drafted · Manager approves · Published to IT Hub · Future employees find it.
   - Status chips per lifecycle: `Pending` → `Processing` → one of `Sent` / `In Review` / `Approved` / `Published` / `Complete`.
   - Active step: primary ring + pulse-glow. Completed: filled primary with check. Idle: soft primary.

3. **Two-column detail row** (stacks on mobile)
   - **Mock Google Sheets preview** — spreadsheet-styled table (green header bar reading `documentation-requests · Google Sheets`). Columns: Request ID, Title, Category, Priority, Status, Submitted, Owner. 3 seeded rows always visible; the VPN row (`REQ-1042 · VPN will not connect from hotel Wi-Fi · Networking · Medium`) appends and pulses when the "Saved to Google Sheets" step runs, then its Status column flips through `New → In Review → Approved → Published` as the simulation advances.
   - **Mock Slack alert** — Slack-style card with `#it-requests` header, "Sprinter IT Bot · via Make.com" byline, bold title, Category/Priority/Status fields, "Action needed: Review and assign owner", mock Assign/Approve buttons. Fades in when the Slack step activates; empty state before that.

4. **Make.com scenario card** (full width, compact)
   - Header: `Make.com scenario` with Running/Idle status pill (activates during simulation).
   - Trigger node: `New Sheets row`
   - Action nodes joined by arrows: `Notify Slack channel` · `Update status + assign owner` · `Create draft doc task`.

### Simulation behavior

- Local `useState` + array of `setTimeout` handles (cleared on unmount and on reset). Advances one step every ~850ms.
- Button shows loading state while running; disabled during run.
- When the run completes, a small success chip appears above the workflow ("Request published and searchable") and the button swaps to `Run again` alongside a `Reset` ghost button.
- Simulation is fully re-runnable and idempotent.

### Copy & clarity

- The `MVP CONCEPT DEMO` pill and the muted helper strip make the non-live nature obvious at a glance.
- Subtitle, helper strip, and button labels use the exact language from the brief.

### Styling & interactions (uses existing tokens only)

- Reuses `shadow-card`, `shadow-card-hover`, `shadow-glow`, `bg-gradient-primary`, `bg-gradient-soft`, `bg-primary-soft`, `animate-fade-in-up`, `animate-pulse-glow` from `src/styles.css`.
- Status chips use semantic tokens (`--primary`, `--info`, `--warning`, `--success`, `--muted`) — no hardcoded colors.
- Interactions: hover-lift on every card (`-translate-y-0.5`), spinner on the active step, pulse-glow ring on the active step, fade-in on the Slack card, background pulse on the new spreadsheet row, arrow accents in the Make.com card.
- Respects existing `prefers-reduced-motion` block in `styles.css`.
- Compactness: fixed inside a single bordered card, tight paddings (`p-6 md:p-8`), 3-col workflow grid, small chip typography (`text-[10px]/[11px]`) so it does not dominate the Admin page.

### Explicit non-goals

- No Supabase, Slack, Google, or Make.com API calls; no network requests at all.
- No authentication or environment secrets.
- No new routes, no navigation changes, no footer changes.
- No changes to `RequestForm`, article data, or any existing Admin section besides the single insertion point.

