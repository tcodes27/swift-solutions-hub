import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, BookOpen, Database, FileSearch, Send, Sparkles, Users } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — IT Support Hub" },
      { name: "description", content: "How employee questions become published help articles." },
      { property: "og:title", content: "How It Works — IT Support Hub" },
      { property: "og:description", content: "How employee questions become published help articles." },
    ],
  }),
  component: HowPage,
});

const steps = [
  { icon: FileSearch, title: "Search first", body: "An employee searches the hub for their issue and follows the steps." },
  { icon: Send, title: "Request what's missing", body: "If there's no article, they submit a documentation request in seconds." },
  { icon: Sparkles, title: "We write it up", body: "IT reviews the request and drafts a clear, step-by-step article." },
  { icon: BookOpen, title: "Publish to the KB", body: "The article is published to the knowledge base and indexed for search." },
  { icon: Users, title: "Future employees benefit", body: "Next time anyone hits the same issue, they self-serve in minutes." },
];

function HowPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">How it works</p>
        <h1 className="mt-2 font-serif text-5xl md:text-6xl">From question to published fix.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          A simple workflow that turns every repeat question into a permanent answer.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <ol className="space-y-6">
          {steps.map((s, i) => (
            <StepCard key={i} index={i} {...s} isLast={i === steps.length - 1} />
          ))}
        </ol>
      </section>

      {/* Behind the scenes */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[2rem] bg-navy p-10 text-navy-foreground md:p-14">
          <p className="text-sm font-medium uppercase tracking-wider text-white/70">Behind the scenes</p>
          <h2 className="mt-2 font-serif text-4xl">A lean, automated pipeline.</h2>
          <p className="mt-3 max-w-2xl text-white/80">
            Requests flow through a no-code pipeline, so IT spends time writing, not wiring.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
            {[
              { icon: Users, label: "Employee" },
              { icon: BookOpen, label: "Support Hub" },
              { icon: Database, label: "Google Sheets" },
              { icon: Sparkles, label: "Make.com" },
              { icon: FileSearch, label: "Published KB" },
            ].map((b, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-5 text-center backdrop-blur">
                <b.icon className="mx-auto h-6 w-6" />
                <div className="mt-2 text-sm font-medium">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function StepCard({
  icon: Icon,
  title,
  body,
  index,
  isLast,
}: {
  icon: typeof BookOpen;
  title: string;
  body: string;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`relative transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-5 rounded-2xl bg-card p-6 shadow-card">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Step {index + 1}</div>
          <div className="font-serif text-2xl">{title}</div>
          <p className="mt-1 text-muted-foreground">{body}</p>
        </div>
      </div>
      {!isLast && (
        <div className="my-2 flex justify-center text-muted-foreground">
          <ArrowDown className="h-5 w-5" />
        </div>
      )}
    </li>
  );
}
