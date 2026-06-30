import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Clock, ExternalLink, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { getArticle, getCategory } from "@/data/articles";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    const category = getCategory(article.category);
    return { article, category };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.article.title ?? "Article"} — IT Support Hub` },
      { name: "description", content: loaderData?.article.summary ?? "" },
      { property: "og:title", content: `${loaderData?.article.title ?? "Article"} — IT Support Hub` },
      { property: "og:description", content: loaderData?.article.summary ?? "" },
    ],
  }),
  component: ArticlePage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Article not found</h1>
        <Link to="/topics" className="mt-6 inline-flex text-primary">Back to topics</Link>
      </div>
    </PageShell>
  ),
});

function ArticlePage() {
  const { article, category } = Route.useLoaderData();
  const [solved, setSolved] = useState<null | "yes" | "no">(null);
  const [helpful, setHelpful] = useState<null | "yes" | "no">(null);

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 pt-12 pb-24">
        <Link
          to="/topics/$slug"
          params={{ slug: article.category }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {category?.name}
        </Link>

        <h1 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">{article.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.overview}</p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            <Clock className="h-3 w-3" /> {article.estTime}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{article.difficulty}</span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">Updated {article.lastUpdated}</span>
        </div>

        {/* Symptoms */}
        <div className="mt-10 rounded-2xl bg-muted p-6">
          <div className="text-sm font-medium uppercase tracking-wider text-primary">Common symptoms</div>
          <ul className="mt-3 space-y-2 text-foreground/80">
            {article.symptoms.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-primary">•</span> {s}</li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <h2 className="mt-12 font-serif text-3xl">Step-by-step fix</h2>
        <ol className="mt-6 space-y-4">
          {article.steps.map((s, i) => (
            <li key={i} className="rounded-2xl bg-card p-6 shadow-card">
              <div className="flex items-start gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-medium text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <div className="font-serif text-xl">{s.title}</div>
                  <p className="mt-2 text-foreground/80">{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Did this solve */}
        <div className="mt-12 rounded-2xl bg-navy p-8 text-navy-foreground">
          <div className="font-serif text-2xl">Did this solve your problem?</div>
          <p className="mt-1 text-white/70">Let us know — it helps us improve these guides.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setSolved("yes")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                solved === "yes" ? "bg-mint text-navy" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Check className="h-4 w-4" /> Yes, it's fixed
            </button>
            <button
              onClick={() => setSolved("no")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                solved === "no" ? "bg-coral text-navy" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <X className="h-4 w-4" /> No, I still need help
            </button>
          </div>

          {solved === "yes" && (
            <div className="mt-5 rounded-xl bg-white/10 p-4 text-sm">
              🎉 Glad we could help. You can close this page.
            </div>
          )}
          {solved === "no" && (
            <div className="mt-5 rounded-xl bg-white/10 p-5">
              <div className="font-medium">Let's get a human involved.</div>
              <p className="mt-1 text-sm text-white/70">
                Open a support ticket with our IT team. Include what you've tried so far.
              </p>
              <a
                href="https://example.zendesk.com/hc/en-us/requests/new"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Submit Zendesk ticket <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Helpful */}
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-card p-5 shadow-card">
          <div className="text-sm text-muted-foreground">Was this article helpful?</div>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpful("yes")}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                helpful === "yes" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"
              }`}
            >
              <ThumbsUp className="h-4 w-4" /> Yes
            </button>
            <button
              onClick={() => setHelpful("no")}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                helpful === "no" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"
              }`}
            >
              <ThumbsDown className="h-4 w-4" /> No
            </button>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
