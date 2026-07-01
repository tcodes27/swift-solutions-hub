import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export type Crumb = {
  label: ReactNode;
  to?: string;
  params?: Record<string, string>;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 animate-fade-in-up">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <li>
                {c.to && !last ? (
                  <Link
                    to={c.to}
                    params={c.params}
                    className="rounded-full px-2 py-1 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={`px-2 py-1 ${last ? "font-semibold text-foreground" : ""}`}
                  >
                    {c.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
