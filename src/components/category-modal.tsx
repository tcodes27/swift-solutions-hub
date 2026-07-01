import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Search, Sparkles, X, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Category } from "@/data/articles";
import { articlesByCategory } from "@/data/articles";

const toneBg: Record<Category["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  mint: "bg-success/20 text-success-foreground",
  coral: "bg-critical/20 text-critical-foreground",
  amber: "bg-warning/25 text-warning-foreground",
  sky: "bg-info/20 text-info-foreground",
  pink: "bg-accent/30 text-accent-foreground",
};

const difficultyTone: Record<string, string> = {
  Easy: "bg-success/20 text-success-foreground",
  Medium: "bg-warning/25 text-warning-foreground",
  Advanced: "bg-critical/20 text-critical-foreground",
};

export function CategoryModal({
  category,
  open,
  onOpenChange,
}: {
  category: Category | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const all = useMemo(
    () => (category ? articlesByCategory(category.slug) : []),
    [category],
  );
  const featured = useMemo(
    () => all.find((a) => a.featured) ?? [...all].sort((a, b) => b.views - a.views)[0],
    [all],
  );
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.summary.toLowerCase().includes(term),
    );
  }, [all, q]);

  if (!category) return null;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon] ?? Icons.Folder;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-h-[90vh] gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-lifted sm:max-w-2xl">
        {/* Sticky header */}
        <DialogHeader className="sticky top-0 z-10 space-y-0 border-b border-border bg-card px-6 py-5 text-left">
          <div className="flex items-start gap-4">
            <span
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${toneBg[category.tone]}`}
            >
              <Icon className="h-6 w-6" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {category.name}
                  </DialogTitle>
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {all.length} article{all.length === 1 ? "" : "s"}
                  </span>
                </div>
                <DialogClose
                  aria-label="Close"
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </DialogDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search in ${category.name.toLowerCase()}...`}
              className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-4 focus:ring-primary/20"
            />
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto px-6 py-6">
          {!q && featured && (
            <section>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Featured
              </div>
              <Link
                to="/articles/$slug"
                params={{ slug: featured.slug }}
                onClick={() => onOpenChange(false)}
                className="group block rounded-2xl border border-primary/40 bg-primary-soft/40 p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                  <span className={`rounded-full px-2 py-0.5 ${difficultyTone[featured.difficulty]}`}>
                    {featured.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {featured.estTime}
                  </span>
                </div>
                <div className="mt-2 text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
                  {featured.title}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{featured.summary}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </section>
          )}

          <section>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {q ? "Results" : "All articles"}
              </div>
              <div className="text-[11px] text-muted-foreground">{filtered.length} shown</div>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">No articles match "{q}".</p>
                <button
                  onClick={() => setQ("")}
                  className="mt-3 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold transition hover:bg-muted"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {filtered.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      onClick={() => onOpenChange(false)}
                      className="group flex cursor-pointer items-start gap-4 rounded-xl border border-transparent bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-card-hover"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${difficultyTone[a.difficulty]}`}>
                            {a.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" /> {a.estTime}
                          </span>
                          <span className="text-[11px] text-muted-foreground">· Updated {a.lastUpdated}</span>
                        </div>
                        <div className="mt-1 font-semibold tracking-tight transition-colors group-hover:text-primary">
                          {a.title}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
