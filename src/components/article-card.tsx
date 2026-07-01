import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import type { Article } from "@/data/articles";
import { getCategory } from "@/data/articles";

const difficultyTone: Record<string, string> = {
  Easy: "bg-success/20 text-success-foreground",
  Medium: "bg-warning/25 text-warning-foreground",
  Advanced: "bg-critical/20 text-critical-foreground",
};

export function ArticleCard({ article, showCategory = true }: { article: Article; showCategory?: boolean }) {
  const category = getCategory(article.category);
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-card-hover focus-visible:border-primary/50"
    >
      {/* accent glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-primary transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="flex flex-wrap items-center gap-2">
        {showCategory && category && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            {category.name}
          </span>
        )}
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${difficultyTone[article.difficulty]}`}>
          {article.difficulty}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Clock className="h-3 w-3" /> {article.estTime}
        </span>
        {article.featured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-warning-foreground">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{article.summary}</p>
        <p className="mt-3 line-clamp-2 rounded-xl bg-surface px-3 py-2 text-xs text-muted-foreground/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-semibold text-foreground/70">Preview: </span>
          {article.preview}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>Updated {article.lastUpdated}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-foreground/70 transition-all duration-300 group-hover:gap-2 group-hover:text-primary">
          Read
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
