import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Clock, PenLine, Search, SearchX, Sparkles, TrendingUp, X } from "lucide-react";
import { articles, getCategory, type Article } from "@/data/articles";

const RECENT_KEY = "sprinter-it-recent-searches";
const MAX_RECENT = 5;

const difficultyTone: Record<string, string> = {
  Easy: "bg-success/20 text-success-foreground",
  Medium: "bg-warning/25 text-warning-foreground",
  Advanced: "bg-critical/20 text-critical-foreground",
};

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const q = query.trim();
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-primary-soft text-primary rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SearchPanel({
  variant = "light",
  placeholder = "What do you need help with today?",
}: {
  variant?: "light" | "onDark";
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const results: Article[] = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(needle) ||
          a.summary.toLowerCase().includes(needle) ||
          a.symptoms.some((s) => s.toLowerCase().includes(needle)),
      )
      .slice(0, 10);
  }, [q]);

  const popular = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views).slice(0, 5),
    [],
  );

  const suggestions = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views).slice(0, 3),
    [],
  );

  const showResults = q.trim().length > 0;
  const items = showResults ? results : popular;
  const noResults = showResults && results.length === 0;

  function pushRecent(term: string) {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }

  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      const sel = items[active];
      if (sel) {
        pushRecent(q || sel.title);
        window.location.href = `/articles/${sel.slug}`;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const inputBase =
    variant === "onDark"
      ? "bg-card text-foreground placeholder:text-foreground/40"
      : "bg-card text-foreground placeholder:text-muted-foreground";

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search the knowledge base"
          aria-autocomplete="list"
          aria-expanded={open}
          className={`h-16 w-full rounded-full border border-border ${inputBase} pl-14 pr-14 text-base shadow-card outline-none transition-shadow duration-200 focus:shadow-card-hover focus:ring-4 focus:ring-primary/20`}
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-muted text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[4.5rem] z-30 origin-top overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-card-hover animate-scale-in"
        >
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              {showResults ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {results.length} {results.length === 1 ? "result" : "results"}
                </>
              ) : (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Popular searches
                </>
              )}
            </span>
            <span className="hidden gap-1 text-[10px] text-muted-foreground/70 sm:inline-flex">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↑↓</kbd>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↵</kbd>
            </span>
          </div>

          <div className="max-h-[70vh] overflow-y-auto overscroll-contain scroll-smooth">
            {noResults ? (
              <div className="px-6 py-10 text-center animate-fade-in-up">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
                  <SearchX className="h-8 w-8" />
                </div>
                <div className="mt-4 text-lg font-bold text-foreground">No matching articles found.</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different keyword — or ask for a new article.
                </p>
                <div className="mt-6 text-left">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Suggested articles
                  </div>
                  <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border bg-card">
                    {suggestions.map((a) => (
                      <li key={a.slug}>
                        <Link
                          to="/articles/$slug"
                          params={{ slug: a.slug }}
                          onClick={() => setOpen(false)}
                          className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-semibold group-hover:text-primary">{a.title}</div>
                            <div className="truncate text-xs text-muted-foreground">{a.summary}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link
                    to="/popular"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold transition hover:bg-muted"
                  >
                    <TrendingUp className="h-3.5 w-3.5" /> Browse popular fixes
                  </Link>
                  <Link
                    to="/request"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-card transition hover:shadow-card-hover"
                  >
                    <PenLine className="h-3.5 w-3.5" /> Request an article
                  </Link>
                </div>
              </div>
            ) : (
              <ul>
                {items.map((a, i) => {
                  const category = getCategory(a.category);
                  return (
                    <li key={a.slug}>
                      <Link
                        to="/articles/$slug"
                        params={{ slug: a.slug }}
                        onClick={() => pushRecent(q || a.title)}
                        onMouseEnter={() => setActive(i)}
                        role="option"
                        aria-selected={i === active}
                        className={`group flex items-start justify-between gap-4 border-b border-border/40 px-5 py-4 last:border-b-0 transition-all ${
                          i === active ? "bg-primary-soft" : "hover:bg-muted"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">
                            {showResults ? highlight(a.title, q) : a.title}
                          </div>
                          <div className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                            {showResults ? highlight(a.summary, q) : a.summary}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                            {category && (
                              <span className="rounded-full bg-primary-soft px-2 py-0.5 font-semibold uppercase tracking-wider text-primary">
                                {category.name}
                              </span>
                            )}
                            <span className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider ${difficultyTone[a.difficulty]}`}>
                              {a.difficulty}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                              <Clock className="h-3 w-3" /> {a.estTime}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {!showResults && recent.length > 0 && (
            <div className="border-t border-border/60 bg-surface px-5 py-3">
              <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Recent
                </span>
                <button
                  onClick={clearRecent}
                  className="text-[11px] normal-case tracking-normal text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setQ(r);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/70 transition hover:bg-muted hover:text-foreground"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
