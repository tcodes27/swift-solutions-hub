## Problem

The homepage search dropdown is absolutely positioned, so when it opens it overlays down past the bottom edge of the purple hero card and floats into the section below. Visually the panel escapes the hero "box."

## Fix

Make the dropdown part of the hero's normal flow so the hero grows with it and always contains it.

### `src/components/search-panel.tsx`
- Change the results panel from `absolute` to `relative` (inline block below the input inside the same flex column).
- Keep `max-height: 360px` with `overflow-y: auto` so long result lists scroll inside the panel instead of stretching the page.
- Keep the existing pill input, rounded 24px panel, border, shadow, header, result rows (title, summary, category badge, difficulty, time, arrow), and Recent footer — all untouched.
- Remove the now-unneeded `top-[calc(100%+12px)]` / `z-50` absolute offsets; use a simple `mt-3` gap.

### `src/routes/index.tsx`
- Wrap the `SearchPanel` in the existing centered `max-w-[760px]` container (already there) — no structural change.
- Slightly increase hero bottom padding (`pb-20 md:pb-28`) so there is comfortable breathing room under the panel when it is closed, and the CTAs/stat strip still sit cleanly inside the hero.

### Result
- Panel is always visually inside the purple hero card.
- Panel width matches the input exactly.
- Long result lists scroll internally; the page never jumps.
- No other page, component, or functionality changes.
