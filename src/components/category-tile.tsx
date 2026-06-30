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
      className="group relative flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${toneBg[category.tone]}`}>
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <div>
        <div className="text-lg font-bold tracking-tight text-foreground">{category.name}</div>
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
