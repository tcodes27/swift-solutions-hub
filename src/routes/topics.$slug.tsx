import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Search } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articlesByCategory, getCategory } from "@/data/articles";

export const Route = createFileRoute("/topics/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category, list: articlesByCategory(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.name ?? "Topic"} — IT Support Hub` },
      { name: "description", content: loaderData?.category.description ?? "" },
      { property: "og:title", content: `${loaderData?.category.name ?? "Topic"} — IT Support Hub` },
      { property: "og:description", content: loaderData?.category.description ?? "" },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Topic not found</h1>
        <Link to="/topics" className="mt-6 inline-flex text-primary">Back to topics</Link>
      </div>
    </PageShell>
  ),
});

function CategoryPage() {
  const { category, list } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState<string>("all");

  const filtered = useMemo(() => {
    return list.filter((a) => {
      const matchQ = !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.summary.toLowerCase().includes(q.toLowerCase());
      const matchD = diff === "all" || a.difficulty === diff;
      return matchQ && matchD;
    });
  }, [list, q, diff]);

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-6">
        <Link to="/topics" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All topics
        </Link>
        <p className="mt-6 text-sm font-medium uppercase tracking-wider text-primary">{list.length} articles</p>
        <h1 className="mt-2 font-serif text-5xl">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{category.description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search this topic..."
              className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Easy", "Medium", "Advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  diff === d ? "bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:bg-muted"
                }`}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ul className="grid grid-cols-1 gap-4">
          {filtered.map((a) => (
            <li key={a.slug}>
              <Link
                to="/articles/$slug"
                params={{ slug: a.slug }}
                className="group flex items-center justify-between gap-6 rounded-2xl bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div>
                  <div className="font-serif text-2xl text-foreground">{a.title}</div>
                  <p className="mt-1 text-muted-foreground">{a.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.estTime}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{a.difficulty}</span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">Updated {a.lastUpdated}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-2xl bg-muted p-10 text-center text-muted-foreground">No articles match your filters.</li>
          )}
        </ul>
      </section>
    </PageShell>
  );
}
