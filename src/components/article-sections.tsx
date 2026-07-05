import {
  AlertTriangle,
  Check,
  Image as ImageIcon,
  Info,
  Lightbulb,
} from "lucide-react";
import type { ArticleSection } from "@/data/articles";

/**
 * Renders a list of structured article sections with the design system.
 * Safe against unknown types — unknown/malformed sections are skipped.
 */
export function ArticleSections({ sections }: { sections?: ArticleSection[] }) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case "text":
      return (
        <p className="text-base leading-relaxed text-foreground/85">
          {section.body}
        </p>
      );

    case "heading":
      return (
        <h2 className="mt-4 text-2xl font-bold tracking-tight">{section.text}</h2>
      );

    case "subheading":
      return (
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground/90">
          {section.text}
        </h3>
      );

    case "bulletList":
      return (
        <ul className="space-y-2 pl-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-foreground/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "numberedList":
      return (
        <ol className="space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground/85">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case "callout":
      return (
        <NoteCard
          tone="primary"
          icon={<Info className="h-4 w-4" />}
          title={section.title ?? "Note"}
          body={section.body}
        />
      );

    case "tip":
      return (
        <NoteCard
          tone="mint"
          icon={<Lightbulb className="h-4 w-4" />}
          title={section.title ?? "Tip"}
          body={section.body}
        />
      );

    case "warning":
      return (
        <NoteCard
          tone="warning"
          icon={<AlertTriangle className="h-4 w-4" />}
          title={section.title ?? "Warning"}
          body={section.body}
        />
      );

    case "checklist":
      return (
        <ul className="space-y-2">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                  item.checked
                    ? "border-success bg-success/20 text-success-foreground"
                    : "border-border bg-muted"
                }`}
              >
                {item.checked && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="text-sm text-foreground/85">{item.text}</span>
            </li>
          ))}
        </ul>
      );

    case "imagePlaceholder":
      return (
        <figure className="overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40">
          <div className="flex aspect-[16/8] items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {section.label ?? "Image placeholder"}
              </span>
            </div>
          </div>
          {section.caption && (
            <figcaption className="border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground">
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case "codeBlock":
      return (
        <pre className="overflow-x-auto rounded-xl border border-border bg-navy p-4 text-sm leading-relaxed text-navy-foreground shadow-card">
          <code>{section.code}</code>
        </pre>
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                {section.headers.map((h, i) => (
                  <th key={i} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-border/60">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-foreground/85">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "steps":
      return (
        <ol className="space-y-3">
          {section.steps.map((s, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {s.stepNumber ?? i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-base font-bold tracking-tight">{s.title}</div>
                  {(s.description || s.body) && (
                    <p className="mt-1 text-sm text-foreground/80">
                      {s.description ?? s.body}
                    </p>
                  )}
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
      );

    case "faq":
      return (
        <div className="space-y-3">
          {section.items.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border bg-card p-4 shadow-card transition-shadow open:shadow-card-hover"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold tracking-tight text-foreground/90">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-foreground/75">{item.a}</p>
            </details>
          ))}
        </div>
      );

    default:
      return null;
  }
}

function NoteCard({
  tone,
  icon,
  title,
  body,
}: {
  tone: "primary" | "mint" | "warning";
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  const styles: Record<typeof tone, string> = {
    primary: "border-primary/30 bg-primary-soft/50 text-foreground",
    mint: "border-mint/50 bg-mint/20 text-navy",
    warning: "border-warning/40 bg-warning/20 text-warning-foreground",
  } as const;
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 shadow-card ${styles[tone]}`}>
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-card/70 text-primary">
        {icon}
      </span>
      <div>
        <div className="text-sm font-bold tracking-tight">{title}</div>
        <p className="mt-1 text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/** Safe fallback when sections JSON fails to parse. */
export function ArticleSectionsFallback({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
      {message ??
        "This article's structured content could not be displayed. Showing summary only."}
    </div>
  );
}
