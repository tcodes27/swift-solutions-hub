import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Sparkles, Clock, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CategoryTile } from "@/components/category-tile";
import { articles, categories } from "@/data/articles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IT Support Hub — Solve IT issues in minutes" },
      { name: "description", content: "Search clear, step-by-step fixes for common IT problems before opening a ticket." },
      { property: "og:title", content: "IT Support Hub" },
      { property: "og:description", content: "Search clear, step-by-step fixes for common IT problems before opening a ticket." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return articles
      .filter((a) => a.title.toLowerCase().includes(needle) || a.summary.toLowerCase().includes(needle))
      .slice(0, 5);
  }, [q]);

  const popular = [...articles].sort((a, b) => b.views - a.views).slice(0, 3);
  const recent = [...articles].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 3);

  return (
    <PageShell>
      {/* Hero */}
      <section className="px-6 pt-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy px-8 py-16 text-navy-foreground md:px-16 md:py-24">
          {/* decorative rings */}
          <svg className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] opacity-20" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="140" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="100" stroke="currentColor" strokeDasharray="2 8" />
          </svg>
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Internal knowledge base
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">
              Solve IT issues<br />before they slow you down.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Search clear, step-by-step fixes for the most common IT problems. Most issues are solved in under five minutes.
            </p>

            <div className="relative mt-10">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What do you need help with today?"
                className="h-16 w-full rounded-full border border-white/10 bg-white pl-14 pr-6 text-base text-foreground shadow-card outline-none ring-primary/30 placeholder:text-foreground/40 focus:ring-4"
              />
              {results.length > 0 && (
                <div className="absolute left-0 right-0 top-[4.5rem] z-20 overflow-hidden rounded-2xl bg-card text-foreground shadow-card-hover">
                  {results.map((a) => (
                    <Link
                      key={a.slug}
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3 last:border-b-0 hover:bg-muted"
                    >
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-muted-foreground">{a.summary}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/70">
              <span>Try:</span>
              {["Wi-Fi", "VPN", "Forgot password", "Printer offline"].map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="rounded-full border border-white/15 px-3 py-1 transition hover:bg-white/10"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">Browse topics</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">Pick a category to get started.</h2>
          </div>
          <Link to="/topics" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">
            See all topics →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Popular + Recent */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-8 shadow-card">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
              <TrendingUp className="h-4 w-4" /> Popular articles
            </div>
            <ul className="divide-y divide-border/60">
              {popular.map((a, i) => (
                <li key={a.slug}>
                  <Link
                    to="/articles/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center justify-between gap-4 py-4 transition hover:text-primary"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-2xl text-muted-foreground">0{i + 1}</span>
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-muted-foreground">{a.views.toLocaleString()} views</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-card p-8 shadow-card">
            <div className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
              <Clock className="h-4 w-4" /> Recently updated
            </div>
            <ul className="divide-y divide-border/60">
              {recent.map((a) => (
                <li key={a.slug}>
                  <Link
                    to="/articles/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center justify-between gap-4 py-4 transition hover:text-primary"
                  >
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-sm text-muted-foreground">Updated {a.lastUpdated}</div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick tips */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl bg-muted p-10">
          <h3 className="font-serif text-3xl">Quick tips before you submit a ticket</h3>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { t: "Restart first", b: "A reboot fixes 70% of IT issues. Try it before anything else." },
              { t: "Check the status page", b: "Some issues are company-wide outages we're already on." },
              { t: "Use Self Service", b: "Install approved apps and updates without waiting on IT." },
            ].map((tip) => (
              <div key={tip.t} className="rounded-xl bg-card p-6 shadow-card">
                <div className="font-serif text-xl">{tip.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{tip.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
