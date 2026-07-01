import { Link } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import type { Category } from "@/data/articles";

const toneBg: Record<Category["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  mint: "bg-success/20 text-success-foreground",
  coral: "bg-critical/20 text-critical-foreground",
  amber: "bg-warning/25 text-warning-foreground",
  sky: "bg-info/20 text-info-foreground",
  pink: "bg-accent/30 text-accent-foreground",
};

export function CategoryTile({ category, count }: { category: Category; count?: number }) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[category.icon] ?? Icons.Folder;
  return (
    <Link
      to="/topics/$slug"
      params={{ slug: category.slug }}
      className="group relative flex h-full cursor-pointer flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:border-primary/50 hover:shadow-card-hover focus-visible:border-primary/50"
    >
      {/* soft radial glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* accent bar */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-primary transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`grid h-12 w-12 place-items-center rounded-xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 ${toneBg[category.tone]}`}
        >
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <div className="relative">
        <div className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {category.name}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        {count !== undefined && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {count} article{count === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </Link>
  );
}
