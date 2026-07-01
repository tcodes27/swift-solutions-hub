import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PlusCircle, Sparkles, Zap } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { SearchPanel } from "@/components/search-panel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sprinter IT Hub — Solve IT issues in minutes" },
      { name: "description", content: "Search clear, step-by-step fixes for common IT problems before opening a ticket." },
      { property: "og:title", content: "Sprinter IT Hub" },
      { property: "og:description", content: "Search clear, step-by-step fixes for common IT problems before opening a ticket." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="relative mx-auto max-w-7xl rounded-[2rem] bg-gradient-hero px-6 pt-16 pb-20 text-navy-foreground sm:px-12 md:px-16 md:pt-24 md:pb-28">
          {/* decorative background layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden="true">
            <svg className="absolute -right-32 -top-32 h-[34rem] w-[34rem] opacity-20" viewBox="0 0 400 400" fill="none" aria-hidden="true">
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeDasharray="2 8" />
              <circle cx="200" cy="200" r="140" stroke="currentColor" strokeDasharray="2 8" />
              <circle cx="200" cy="200" r="100" stroke="currentColor" strokeDasharray="2 8" />
              <circle cx="200" cy="200" r="60" stroke="currentColor" strokeDasharray="2 8" />
            </svg>
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Internal knowledge base
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              Solve IT issues<br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                before they slow you down.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Search clear, step-by-step fixes for the most common IT problems. Most issues are solved in under five minutes.
            </p>

            {/* Contained search component */}
            <div className="mx-auto mt-10 w-full max-w-[760px]">
              <SearchPanel variant="onDark" />
            </div>




            {/* stat strip */}
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8 text-left">
              {[
                { v: "5 min", l: "Avg. resolution" },
                { v: "50+", l: "Common fixes" },
                { v: "24/7", l: "Self-service" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold md:text-3xl">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Primary CTA cards */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              to: "/topics",
              eyebrow: "Browse Knowledge Base",
              title: "Browse Topics",
              body: "Explore all IT documentation and troubleshooting guides.",
              cta: "Browse Topics",
              icon: BookOpen,
              tone: "bg-primary-soft text-primary",
            },
            {
              to: "/request",
              eyebrow: "Need Something New?",
              title: "Submit a Documentation Request",
              body: "Can't find what you're looking for? Request new documentation for review.",
              cta: "Submit Request",
              icon: PlusCircle,
              tone: "bg-mint/40 text-navy",
            },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card p-8 shadow-card transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/70 hover:shadow-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 md:p-10"
            >
              {/* soft glow */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-transparent to-mint/20 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              />
              {/* animated border accent */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary via-primary/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                className={`relative inline-grid h-14 w-14 place-items-center rounded-2xl ${c.tone} transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3`}
              >
                <c.icon className="h-7 w-7 transition-transform duration-300 ease-out group-hover:scale-110" />
              </span>
              <p className="relative mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.eyebrow}</p>
              <h3 className="relative mt-2 text-2xl font-bold tracking-tight md:text-3xl">{c.title}</h3>
              <p className="relative mt-3 text-muted-foreground">{c.body}</p>
              <span className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-300 ease-out group-hover:gap-3 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-card">
                {c.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick tips */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">

        <div className="rounded-[2rem] border border-border bg-gradient-soft p-8 md:p-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Zap className="h-4 w-4" /> Quick tips
          </div>
          <h3 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Try these before opening a ticket.</h3>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { t: "Restart first", b: "A reboot fixes 70% of IT issues. Try it before anything else.", tone: "bg-primary-soft text-primary" },
              { t: "Check the status page", b: "Some issues are company-wide outages we're already on.", tone: "bg-info/15 text-info-foreground" },
              { t: "Use Self Service", b: "Install approved apps and updates without waiting on IT.", tone: "bg-success/20 text-success-foreground" },
            ].map((tip) => (
              <div
                key={tip.t}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tip.tone}`}>
                  Tip
                </span>
                <div className="mt-3 text-xl font-bold tracking-tight">{tip.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{tip.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
