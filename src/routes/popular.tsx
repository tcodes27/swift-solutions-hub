import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articles } from "@/data/articles";

export const Route = createFileRoute("/popular")({
  head: () => ({
    meta: [
      { title: "Popular Fixes — IT Support Hub" },
      { name: "description", content: "The most-viewed IT fixes across the company." },
      { property: "og:title", content: "Popular Fixes — IT Support Hub" },
      { property: "og:description", content: "The most-viewed IT fixes across the company." },
    ],
  }),
  component: PopularPage,
});

function PopularPage() {
  const sorted = [...articles].sort((a, b) => b.views - a.views);
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-10">
        <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-primary">
          <TrendingUp className="h-4 w-4" /> This month
        </p>
        <h1 className="mt-2 font-serif text-5xl md:text-6xl">Popular fixes.</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          The articles your coworkers are reading most. Chances are, your fix is here.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <ol className="divide-y divide-border/60 rounded-2xl bg-card shadow-card">
          {sorted.map((a, i) => (
            <li key={a.slug}>
              <Link
                to="/articles/$slug"
                params={{ slug: a.slug }}
                className="group flex items-center gap-6 px-6 py-5 transition hover:bg-muted/50"
              >
                <span className="w-10 shrink-0 font-serif text-3xl text-muted-foreground">{i + 1}</span>
                <div className="flex-1">
                  <div className="font-serif text-xl">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.summary}</div>
                </div>
                <div className="hidden text-right text-sm text-muted-foreground sm:block">
                  <div className="font-medium text-foreground">{a.views.toLocaleString()}</div>
                  <div>views</div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
