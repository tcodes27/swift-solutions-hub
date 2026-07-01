import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Search, Sparkles, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { articlesByCategory, getCategory, type Article, type Category } from "@/data/articles";

export const Route = createFileRoute("/topics/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category, list: articlesByCategory(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.name ?? "Topic"} — Sprinter IT Hub` },
      { name: "description", content: loaderData?.category.description ?? "" },
      { property: "og:title", content: `${loaderData?.category.name ?? "Topic"} — Sprinter IT Hub` },
      { property: "og:description", content: loaderData?.category.description ?? "" },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-bold">Topic not found</h1>
        <Link to="/topics" className="mt-6 inline-flex text-primary">Back to topics</Link>
      </div>
    </PageShell>
  ),
});

function CategoryPage() {
  const { category, list } = Route.useLoaderData() as { category: Category; list: Article[] };
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<string>("all");

  const filtered = useMemo(() => {
    return list.filter((a) => {
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q.toLowerCase()) ||
        a.summary.toLowerCase().includes(q.toLowerCase());
      const matchD = diff === "all" || a.difficulty === diff;
      return matchQ && matchD;
    });
  }, [list, q, diff]);

  const featured = useMemo(() => {
    const f = list.filter((a) => a.featured);
    return f.length > 0 ? f.slice(0, 2) : [...list].sort((a, b) => b.views - a.views).slice(0, 2);
  }, [list]);

  const recent = useMemo(
    () => [...list].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 3),
    [list],
  );
  const popular = useMemo(
    () => [...list].sort((a, b) => b.views - a.views).slice(0, 3),
    [list],
  );

  return (
    <PageShell>
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <Breadcrumbs
          items={[
            { label: "Browse Topics", to: "/topics" },
            { label: category.name },
          ]}
        />
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {list.length} article{list.length === 1 ? "" : "s"}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{category.description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search this topic..."
              className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-sm outline-none transition-shadow focus:shadow-card-hover focus:ring-4 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Easy", "Medium", "Advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  diff === d ? "bg-primary text-primary-foreground shadow-card" : "bg-card text-foreground/70 hover:bg-muted"
                }`}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {!q && diff === "all" && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-6">
          <SectionHeading icon={<Sparkles className="h-4 w-4" />} label="Featured" />
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            {featured.map((a, i) => (
              <div key={a.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                <ArticleCard article={a} showCategory={false} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent + Popular side-by-side */}
      {!q && diff === "all" && (
        <section className="mx-auto max-w-7xl px-6 pt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <SectionHeading icon={<Clock className="h-4 w-4" />} label="Recently updated" />
              <ul className="mt-4 divide-y divide-border/60 rounded-2xl border border-border bg-card shadow-card">
                {recent.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      className="group flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold group-hover:text-primary">{a.title}</div>
                        <div className="text-xs text-muted-foreground">Updated {a.lastUpdated}</div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{a.estTime}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading icon={<TrendingUp className="h-4 w-4" />} label="Popular" />
              <ul className="mt-4 divide-y divide-border/60 rounded-2xl border border-border bg-card shadow-card">
                {popular.map((a, i) => (
                  <li key={a.slug}>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold group-hover:text-primary">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{a.views.toLocaleString()} views</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* All articles */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <SectionHeading label={q || diff !== "all" ? "Matching articles" : "All articles"} />
        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <div key={a.slug} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <ArticleCard article={a} showCategory={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center text-muted-foreground">
            No articles match your filters. Try clearing the search or difficulty.
          </div>
        )}
      </section>
    </PageShell>
  );
}

function SectionHeading({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
      {icon}
      {label}
    </div>
  );
}
