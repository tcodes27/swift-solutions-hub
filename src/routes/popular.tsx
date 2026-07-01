import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { articles } from "@/data/articles";

export const Route = createFileRoute("/popular")({
  head: () => ({
    meta: [
      { title: "Popular Fixes — Sprinter IT Hub" },
      { name: "description", content: "The most-viewed IT fixes across the company." },
      { property: "og:title", content: "Popular Fixes — Sprinter IT Hub" },
      { property: "og:description", content: "The most-viewed IT fixes across the company." },
    ],
  }),
  component: PopularPage,
});

function PopularPage() {
  const sorted = [...articles].sort((a, b) => b.views - a.views);
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <Breadcrumbs items={[{ label: "Popular Fixes" }]} />
        <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
          <TrendingUp className="h-4 w-4" /> This month
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">Popular fixes.</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          The articles your coworkers are reading most. Chances are, your fix is here.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a, i) => (
            <div key={a.slug} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
              <ArticleCard article={a} />
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
