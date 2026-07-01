import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CategoryTile } from "@/components/category-tile";
import { SearchPanel } from "@/components/search-panel";
import { CategoryModal } from "@/components/category-modal";
import { categories, type Category } from "@/data/articles";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sprinter IT Hub — Solve IT issues in minutes" },
      { name: "description", content: "Search clear, step-by-step fixes for common IT problems before opening a ticket." },
      { property: "og:title", content: "Sprinter IT Hub" },
      { property: "og:description", content: "Search clear, step-by-step fixes for common IT problems before opening a ticket." },
    ],
  }),
  component: Home,
});

function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const previewCategories = categories.slice(0, 8);

  return (

    <PageShell>
      {/* Hero */}
      <section className="px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-hero px-6 py-16 text-navy-foreground sm:px-12 md:px-16 md:py-24">
          {/* decorative rings */}
          <svg className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] opacity-20" viewBox="0 0 400 400" fill="none" aria-hidden="true">
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="140" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="100" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="60" stroke="currentColor" strokeDasharray="2 8" />
          </svg>
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Internal knowledge base
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              Solve IT issues<br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                before they slow you down.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Search clear, step-by-step fixes for the most common IT problems. Most issues are solved in under five minutes.
            </p>

            <div className="mt-10">
              <SearchPanel variant="onDark" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="font-medium">Try:</span>
              {["Wi-Fi", "VPN", "Forgot password", "Printer offline"].map((t) => (
                <Link
                  key={t}
                  to="/topics"
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 transition-all duration-200 hover:bg-white/15 hover:scale-105"
                >
                  {t}
                </Link>
              ))}
            </div>

            {/* stat strip */}
            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {[
                { v: "5 min", l: "Avg. resolution" },
                { v: "50+", l: "Common fixes" },
                { v: "24/7", l: "Self-service" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold md:text-3xl">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Browse topics</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">Pick a category to get started.</h2>
          </div>
          <Link to="/topics" className="hidden items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:inline-flex">
            See all topics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewCategories.map((c, i) => (
            <div key={c.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <CategoryTile category={c} onSelect={setActiveCategory} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/topics" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
            View all topics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>


      {/* Quick tips */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="rounded-[2rem] border border-border bg-gradient-soft p-8 md:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Zap className="h-4 w-4" /> Quick tips
          </div>
          <h3 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Try these before opening a ticket.</h3>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { t: "Restart first", b: "A reboot fixes 70% of IT issues. Try it before anything else.", tone: "bg-primary-soft text-primary" },
              { t: "Check the status page", b: "Some issues are company-wide outages we're already on.", tone: "bg-info/15 text-info-foreground" },
              { t: "Use Self Service", b: "Install approved apps and updates without waiting on IT.", tone: "bg-success/20 text-success-foreground" },
            ].map((tip) => (
              <div
                key={tip.t}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tip.tone}`}>
                  Tip
                </span>
                <div className="mt-3 text-xl font-bold tracking-tight">{tip.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{tip.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategoryModal
        category={activeCategory}
        open={!!activeCategory}
        onOpenChange={(o) => !o && setActiveCategory(null)}
      />
    </PageShell>
  );
}

