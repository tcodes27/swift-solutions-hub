import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Search, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CategoryTile } from "@/components/category-tile";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryModal } from "@/components/category-modal";
import { ArticleCard } from "@/components/article-card";
import { articles, categories, type Category } from "@/data/articles";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Browse Topics — Sprinter IT Hub" },
      { name: "description", content: "Browse every IT help topic by category." },
      { property: "og:title", content: "Browse Topics — Sprinter IT Hub" },
      { property: "og:description", content: "Browse every IT help topic by category." },
    ],
  }),
  component: TopicsPage,
});

function TopicsPage() {
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    articles.forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + 1));
    return map;
  }, []);
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase()),
  );
  const popular = useMemo(
    () => [...articles].sort((a, b) => b.views - a.views).slice(0, 6),
    [],
  );
  const recent = useMemo(
    () => [...articles].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 6),
    [],
  );

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <Breadcrumbs items={[{ label: "Browse Topics" }]} />
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Knowledge base</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">Browse all topics.</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Every IT topic in one place. Pick a category to see step-by-step fixes.
        </p>

        <div className="relative mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter topics..."
            className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-sm outline-none transition-shadow focus:shadow-card-hover focus:ring-4 focus:ring-primary/20"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <div key={c.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
              <CategoryTile category={c} count={counts.get(c.slug) ?? 0} onSelect={setActiveCategory} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl bg-muted p-10 text-center text-muted-foreground">
            No topics match "{q}".
          </div>
        )}
      </section>

      {/* Popular articles */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <TrendingUp className="h-4 w-4" /> Popular right now
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Popular articles</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {popular.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently updated */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-6">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Clock className="h-4 w-4" /> Fresh updates
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Recently updated</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
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
