import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  LayoutList,
  Lightbulb,
  PartyPopper,
  Send,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Wrench,
  X,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleSections, ArticleSectionsFallback } from "@/components/article-sections";
import {
  articlesByCategory,
  getArticle,
  getCategory,
  type Article,
  type Category,
} from "@/data/articles";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    const category = getCategory(article.category);
    return { article, category };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.article.title ?? "Article"} — Sprinter IT Hub` },
      { name: "description", content: loaderData?.article.summary ?? "" },
      { property: "og:title", content: `${loaderData?.article.title ?? "Article"} — Sprinter IT Hub` },
      { property: "og:description", content: loaderData?.article.summary ?? "" },
    ],
  }),
  component: ArticlePage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-bold">Article not found</h1>
        <Link to="/topics" className="mt-6 inline-flex text-primary">Back to topics</Link>
      </div>
    </PageShell>
  ),
});

const difficultyTone: Record<string, string> = {
  Easy: "bg-success/20 text-success-foreground",
  Medium: "bg-warning/25 text-warning-foreground",
  Advanced: "bg-critical/20 text-critical-foreground",
};

function ArticlePage() {
  const { article, category } = Route.useLoaderData() as {
    article: Article;
    category: Category | undefined;
  };
  return <ArticleView article={article} category={category} />;
}

/**
 * Reusable article renderer. Used by the /articles/$slug route and by
 * the Admin preview mode. Renders the extended article schema safely
 * so imported / incomplete content never crashes the page.
 */
export function ArticleView({
  article,
  category,
  previewBanner,
}: {
  article: Article;
  category: Category | undefined;
  previewBanner?: React.ReactNode;
}) {
  const siblings = useMemo(() => articlesByCategory(article.category), [article.category]);
  const currentIdx = siblings.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextArticle =
    currentIdx >= 0 && currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  const hasSteps = Array.isArray(article.steps) && article.steps.length > 0;
  const hasSections = Array.isArray(article.sections) && article.sections.length > 0;
  const sectionsFailed =
    article.sections !== undefined && !Array.isArray(article.sections);
  const hasOverview = !!article.overview?.trim();
  const hasSymptoms = Array.isArray(article.symptoms) && article.symptoms.length > 0;

  const displayDifficulty = article.difficulty ?? "Not specified";
  const displayEstTime = article.estTime?.trim() ? article.estTime : "Varies";
  const displayUpdated = article.lastUpdated?.trim() ? article.lastUpdated : "Recently updated";

  const [showAll, setShowAll] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [solved, setSolved] = useState<null | "yes" | "no">(null);
  const [helpful, setHelpful] = useState<null | "yes" | "no">(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = hasSteps ? article.steps.length : 0;
  const isLast = total > 0 && stepIdx === total - 1;
  const progressPct = !hasSteps
    ? 0
    : completed
    ? 100
    : Math.round(((stepIdx + 1) / total) * 100);

  const next = useCallback(() => {
    if (!hasSteps) return;
    if (isLast) {
      setCompleted(true);
      return;
    }
    setDirection(1);
    setStepIdx((i) => Math.min(total - 1, i + 1));
  }, [isLast, total, hasSteps]);

  const prev = useCallback(() => {
    if (!hasSteps) return;
    if (completed) {
      setCompleted(false);
      return;
    }
    setDirection(-1);
    setStepIdx((i) => Math.max(0, i - 1));
  }, [completed, hasSteps]);

  useEffect(() => {
    if (showAll || !hasSteps) return;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, showAll, hasSteps]);

  const step = hasSteps ? article.steps[stepIdx] : null;

  return (
    <PageShell>
      {previewBanner}

      {/* Header */}
      <section className="border-b border-border/60 bg-gradient-soft">
        <div className="mx-auto max-w-4xl px-6 pt-8 pb-12">
          <Breadcrumbs
            items={[
              { label: "Browse Topics", to: "/topics" },
              ...(category ? [{ label: category.name, to: "/topics/$slug", params: { slug: category.slug } }] : []),
              { label: article.title },
            ]}
          />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Wrench className="h-3 w-3" /> Troubleshooting
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                difficultyTone[displayDifficulty] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {displayDifficulty}
            </span>
            {article.status && article.status !== "published" && (
              <span className="rounded-full bg-amber/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy">
                {article.status}
              </span>
            )}
            {article.sourceType && article.sourceType !== "manual" && (
              <span className="rounded-full bg-sky/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy">
                via {article.sourceType}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {article.title}
          </h1>
          {article.summary && (
            <p className="mt-3 text-lg text-muted-foreground">{article.summary}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {displayEstTime}
            </span>
            {hasSteps && (
              <span className="inline-flex items-center gap-1.5">
                <LayoutList className="h-4 w-4" /> {total} steps
              </span>
            )}
            <span>Updated {displayUpdated}</span>
            {article.owner && <span>Owner: {article.owner}</span>}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Overview */}
      {hasOverview && (
        <section className="mx-auto max-w-4xl px-6 pt-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overview
            </div>
            <p className="mt-2 text-foreground/85">{article.overview}</p>
          </div>
        </section>
      )}

      {/* Symptoms */}
      {hasSymptoms && (
        <section className="mx-auto max-w-4xl px-6 pt-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Lightbulb className="h-4 w-4" /> Common symptoms
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {article.symptoms.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Structured sections */}
      {(hasSections || sectionsFailed) && (
        <section className="mx-auto max-w-4xl px-6 pt-10">
          {sectionsFailed ? (
            <ArticleSectionsFallback />
          ) : (
            <ArticleSections sections={article.sections} />
          )}
        </section>
      )}

      {/* Walkthrough OR all-steps view */}
      {hasSteps && step && (
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Step-by-step fix</h2>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground/80 transition-all hover:bg-muted hover:text-foreground"
            >
              <LayoutList className="h-3.5 w-3.5" />
              {showAll ? "Walkthrough mode" : "Show all steps"}
            </button>
          </div>

          {showAll ? (
            <ol className="space-y-4">
              {article.steps.map((s, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                      {s.stepNumber ?? i + 1}
                    </span>
                    <div>
                      <div className="text-lg font-bold tracking-tight">{s.title}</div>
                      <p className="mt-2 text-foreground/80">{s.description ?? s.body}</p>
                      {s.details && (
                        <p className="mt-2 text-sm text-muted-foreground">{s.details}</p>
                      )}
                      {s.tip && (
                        <div className="mt-3 rounded-lg bg-mint/25 px-3 py-2 text-xs text-navy">
                          <strong className="mr-1">Tip:</strong>
                          {s.tip}
                        </div>
                      )}
                      {s.warning && (
                        <div className="mt-3 rounded-lg bg-critical/15 px-3 py-2 text-xs text-critical-foreground">
                          <strong className="mr-1">Warning:</strong>
                          {s.warning}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : completed ? (
            <CompletionCard
              article={article}
              solved={solved}
              setSolved={setSolved}
              onRestart={() => {
                setCompleted(false);
                setStepIdx(0);
                setSolved(null);
              }}
            />
          ) : (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>
                    Step <span className="text-primary">{stepIdx + 1}</span> of {total}
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                    role="progressbar"
                    aria-valuenow={progressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {article.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > stepIdx ? 1 : -1);
                        setStepIdx(i);
                      }}
                      aria-label={`Go to step ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === stepIdx
                          ? "w-8 bg-primary"
                          : i < stepIdx
                          ? "w-2 bg-primary/50"
                          : "w-2 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Animated step card */}
              <div
                key={stepIdx}
                className={`rounded-3xl border border-border bg-card p-8 shadow-card-hover md:p-12 ${
                  direction === 1 ? "animate-slide-in-right" : "animate-slide-in-left"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Step {stepIdx + 1} of {total}
                  </span>

                  <div className="my-6 grid h-32 w-32 place-items-center rounded-3xl bg-gradient-primary text-primary-foreground shadow-card-hover animate-scale-in">
                    <span className="text-5xl font-extrabold">{stepIdx + 1}</span>
                  </div>

                  <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/80">
                    {step.description ?? step.body}
                  </p>
                  {step.details && (
                    <p className="mt-3 max-w-xl text-sm text-muted-foreground">{step.details}</p>
                  )}
                  {step.tip && (
                    <div className="mt-4 max-w-xl rounded-xl bg-mint/25 px-4 py-2 text-sm text-navy">
                      <strong className="mr-1">Tip:</strong>
                      {step.tip}
                    </div>
                  )}
                  {step.warning && (
                    <div className="mt-3 max-w-xl rounded-xl bg-critical/15 px-4 py-2 text-sm text-critical-foreground">
                      <strong className="mr-1">Warning:</strong>
                      {step.warning}
                    </div>
                  )}

                  <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {step.estimatedTime ?? "About 1 min"}
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={prev}
                  disabled={stepIdx === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-all duration-200 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Tip: use ← → arrow keys
                </span>
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLast ? (
                    <>
                      Finish <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Prev / Next Article */}
      {(prevArticle || nextArticle) && (
        <section className="mx-auto max-w-4xl px-6 pt-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              More in {category?.name}
            </div>
            <Link
              to="/topics/$slug"
              params={{ slug: article.category }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              All articles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {prevArticle ? (
              <Link
                to="/articles/$slug"
                params={{ slug: prevArticle.slug }}
                className="group flex cursor-pointer flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                  Previous
                </span>
                <div className="text-base font-bold tracking-tight transition-colors group-hover:text-primary">
                  {prevArticle.title}
                </div>
                <div className="line-clamp-1 text-sm text-muted-foreground">{prevArticle.summary}</div>
              </Link>
            ) : (
              <div />
            )}
            {nextArticle && (
              <Link
                to="/articles/$slug"
                params={{ slug: nextArticle.slug }}
                className="group flex cursor-pointer flex-col items-end gap-2 rounded-2xl border border-border bg-card p-5 text-right shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover md:col-start-2"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                  Next
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="text-base font-bold tracking-tight transition-colors group-hover:text-primary">
                  {nextArticle.title}
                </div>
                <div className="line-clamp-1 text-sm text-muted-foreground">{nextArticle.summary}</div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Helpful */}
      <section className="mx-auto max-w-4xl px-6 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="text-sm text-muted-foreground">Was this article helpful?</div>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpful("yes")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                helpful === "yes"
                  ? "bg-success/25 text-success-foreground"
                  : "bg-muted text-foreground/70 hover:bg-muted/70"
              }`}
            >
              <ThumbsUp className="h-4 w-4" /> Yes
            </button>
            <button
              onClick={() => setHelpful("no")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                helpful === "no"
                  ? "bg-critical/20 text-critical-foreground"
                  : "bg-muted text-foreground/70 hover:bg-muted/70"
              }`}
            >
              <ThumbsDown className="h-4 w-4" /> No
            </button>
          </div>
        </div>
        {helpful && (
          <p className="mt-3 text-center text-sm text-muted-foreground animate-fade-in-up">
            Thanks for the feedback — we use it to improve these guides.
          </p>
        )}
      </section>

      {/* Still need help CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-soft p-6 shadow-card md:flex-row md:text-left">
          <div>
            <div className="text-base font-bold tracking-tight">Still need help?</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Open a ticket and our IT team will pick up where you left off.
            </p>
          </div>
          <a
            href="https://example.zendesk.com/hc/en-us/requests/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <Send className="h-4 w-4" /> Submit support ticket
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </PageShell>
  );
}

/** Banner shown at the top of the article page when rendered in preview mode. */
export function ArticlePreviewBanner({ sourceLabel }: { sourceLabel?: string }) {
  return (
    <div className="border-b border-amber/40 bg-amber/20">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm text-navy">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Eye className="h-4 w-4" />
          Preview mode — {sourceLabel ?? "imported content"} not yet published
        </span>
        <Link
          to="/admin"
          className="rounded-full border border-navy/20 bg-white/60 px-3 py-1 text-xs font-semibold text-navy transition hover:bg-white"
        >
          Back to Admin
        </Link>
      </div>
    </div>
  );
}

function CompletionCard({
  article,
  solved,
  setSolved,
  onRestart,
}: {
  article: Article;
  solved: null | "yes" | "no";
  setSolved: (s: "yes" | "no") => void;
  onRestart: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card-hover animate-scale-in">
      <div className="relative overflow-hidden bg-gradient-hero p-10 text-center text-navy-foreground md:p-14">
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <svg viewBox="0 0 400 200" className="h-full w-full">
            <circle cx="80" cy="100" r="60" fill="none" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="320" cy="100" r="80" fill="none" stroke="currentColor" strokeDasharray="2 8" />
          </svg>
        </div>
        <div className="relative">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground shadow-card-hover animate-pulse-glow">
            <PartyPopper className="h-10 w-10" />
          </div>
          <h3 className="mt-6 text-3xl font-extrabold tracking-tight md:text-4xl">
            You've completed all steps!
          </h3>
          <p className="mt-3 text-white/80">
            Nice work walking through "{article.title}". Let us know how it went.
          </p>
        </div>
      </div>

      <div className="p-8 md:p-10">
        {solved === null && (
          <div className="animate-fade-in-up">
            <div className="text-center text-lg font-semibold">Issue resolved?</div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSolved("yes")}
                className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-semibold text-success-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <Check className="h-4 w-4" /> Yes, it's fixed
              </button>
              <button
                onClick={() => setSolved("no")}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-muted hover:-translate-y-0.5"
              >
                <X className="h-4 w-4" /> Still need help
              </button>
            </div>
          </div>
        )}

        {solved === "yes" && (
          <div className="rounded-2xl bg-success/15 p-6 text-center animate-fade-in-up">
            <div className="text-2xl">🎉</div>
            <div className="mt-2 text-lg font-bold">Glad we could help!</div>
            <p className="mt-1 text-sm text-muted-foreground">
              You can close this page or browse more topics.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link
                to="/topics"
                className="rounded-full bg-card border border-border px-4 py-2 text-xs font-semibold transition hover:bg-muted"
              >
                Browse all topics
              </Link>

              <button
                onClick={onRestart}
                className="rounded-full bg-card border border-border px-4 py-2 text-xs font-semibold transition hover:bg-muted"
              >
                Restart walkthrough
              </button>
            </div>
          </div>
        )}

        {solved === "no" && (
          <div className="rounded-2xl bg-surface-2 p-6 animate-slide-in-right">
            <div className="text-center">
              <div className="text-lg font-bold">Let's get a human involved.</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Open a support ticket. Include what you've already tried so the team can pick up where you left off.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <a
                href="https://example.zendesk.com/hc/en-us/requests/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" /> Submit support ticket <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={onRestart}
                className="rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:bg-muted"
              >
                Try the steps again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
