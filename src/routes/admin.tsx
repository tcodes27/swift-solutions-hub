import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileEdit,
  FilePlus2,
  FileSearch,
  FileText,
  MessageSquare,
  PencilLine,
  PlusCircle,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { articles } from "@/data/articles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sprinter IT Hub" },
      { name: "description", content: "Operational dashboard for managing IT documentation, analytics, and workflow." },
      { property: "og:title", content: "Admin Dashboard — Sprinter IT Hub" },
      { property: "og:description", content: "Operational dashboard for managing IT documentation, analytics, and workflow." },
    ],
  }),
  component: AdminPage,
});

const COLORS = ["var(--primary)", "var(--mint)", "var(--amber)", "var(--coral)"];

const workflowSteps = [
  { icon: FileSearch, label: "Issue Discovered" },
  { icon: Send, label: "Request Submitted" },
  { icon: ClipboardCheck, label: "Admin Review" },
  { icon: FileEdit, label: "Article Created" },
  { icon: Sparkles, label: "Technical Review" },
  { icon: BookOpen, label: "Published" },
  { icon: Users, label: "Employees Search KB" },
  { icon: MessageSquare, label: "Feedback Collected" },
  { icon: Activity, label: "Continuous Improvement" },
];

const bestPractices = [
  "Write clear, descriptive titles.",
  "Keep steps short and scannable.",
  "Use screenshots wherever possible.",
  "Review documentation quarterly.",
  "Archive outdated articles promptly.",
  "Always verify technical accuracy.",
];

function AdminPage() {
  const total = articles.length;
  const published = total;
  const needsReview = 2;
  const drafts = 3;

  const healthData = [
    { name: "Published", value: published },
    { name: "Needs review", value: needsReview },
    { name: "Drafts", value: drafts },
  ];

  const recent = [...articles]
    .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, 6)
    .map((a) => ({ name: a.title.length > 22 ? a.title.slice(0, 22) + "…" : a.title, views: a.views }));

  return (
    <PageShell>
      {/* Header band */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <Breadcrumbs items={[{ label: "Admin" }]} />
      </section>
      <section className="px-6 pt-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy p-10 text-navy-foreground md:p-14">
          <svg className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 opacity-15" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeDasharray="2 8" />
            <circle cx="200" cy="200" r="120" stroke="currentColor" strokeDasharray="2 8" />
          </svg>
          <p className="text-sm font-medium uppercase tracking-wider text-white/70">Admin dashboard</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">Knowledge base at a glance.</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Monitor documentation health, take action on gaps, and keep the knowledge base moving.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Kpi icon={<FileText className="h-5 w-5" />} label="Total articles" value={total + drafts} />
            <Kpi icon={<CheckCircle2 className="h-5 w-5" />} label="Published" value={published} />
            <Kpi icon={<Activity className="h-5 w-5" />} label="Needs review" value={needsReview} />
            <Kpi icon={<PencilLine className="h-5 w-5" />} label="Drafts" value={drafts} />
          </div>
        </div>
      </section>

      {/* SECTION 1 — Documentation Analytics */}
      <SectionHeader
        eyebrow="Section 1"
        title="Documentation analytics"
        description="What is happening across the knowledge base right now."
      />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-card lg:col-span-1">
          <div className="font-serif text-2xl">Documentation health</div>
          <p className="text-sm text-muted-foreground">Breakdown of all KB articles.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {healthData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2 text-sm">
            {healthData.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: COLORS[i] }} />
                  {d.name}
                </span>
                <span className="font-medium">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card lg:col-span-2">
          <div className="font-serif text-2xl">Most viewed articles</div>
          <p className="text-sm text-muted-foreground">Top performing articles in the last 30 days.</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recent} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pt-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <div className="font-serif text-2xl">Recent activity</div>
          <ul className="mt-4 divide-y divide-border/60">
            {articles.slice(0, 5).map((a) => (
              <li key={a.slug} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{a.title}</div>
                  <div className="text-muted-foreground">Updated {a.lastUpdated}</div>
                </div>
                <span className="shrink-0 rounded-full bg-mint/30 px-3 py-1 text-xs font-medium text-navy">Published</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card">
          <div className="font-serif text-2xl">Searches without results</div>
          <p className="text-sm text-muted-foreground">Gaps in the knowledge base to prioritize next.</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { q: "okta push not arriving", count: 14 },
              { q: "external monitor flickering", count: 9 },
              { q: "zoom background greyed out", count: 7 },
              { q: "figma sso error", count: 5 },
              { q: "airpods not switching devices", count: 4 },
            ].map((s) => (
              <li key={s.q} className="flex items-center justify-between rounded-xl border border-border/60 bg-surface px-4 py-2.5">
                <span className="truncate font-medium">{s.q}</span>
                <span className="shrink-0 rounded-full bg-amber/30 px-2.5 py-0.5 text-xs font-semibold text-navy">
                  {s.count} searches
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 2 — Quick Actions */}
      <SectionHeader
        eyebrow="Section 2"
        title="Quick actions"
        description="Jump straight into the most common admin tasks."
      />
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            to="/request"
            icon={PlusCircle}
            title="Submit Documentation Request"
            body="Open the request form to add a new topic."
            tone="bg-primary-soft text-primary"
            primary
          />
          <ActionCard
            to="/topics"
            icon={FileEdit}
            title="Edit Existing Documentation"
            body="Find an article and update its steps."
            tone="bg-mint/40 text-navy"
          />
          <ActionCard
            to="/request"
            icon={FilePlus2}
            title="Create New Article"
            body="Draft a brand-new troubleshooting guide."
            tone="bg-amber/40 text-navy"
          />
          <ActionCard
            to="/admin"
            icon={BarChart3}
            title="View Analytics"
            body="Deep-dive into KB performance metrics."
            tone="bg-coral/30 text-navy"
          />
        </div>
      </section>

      {/* SECTION 3 — Documentation Workflow */}
      <SectionHeader
        eyebrow="Section 3"
        title="Documentation workflow"
        description="How a request becomes a published article."
      />
      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <ol className="flex flex-wrap items-stretch gap-2">
            {workflowSteps.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2">
                <div className="flex min-w-[10rem] flex-col items-start gap-2 rounded-xl border border-border/70 bg-surface px-3 py-2.5 transition-colors hover:border-primary">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Step {i + 1}
                    </div>
                    <div className="text-sm font-semibold leading-tight">{s.label}</div>
                  </div>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 4 — Best Practices */}
      <SectionHeader
        eyebrow="Section 4"
        title="Documentation best practices"
        description="Standards to keep every article useful and trustworthy."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-gradient-soft p-6 shadow-card md:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Database className="h-4 w-4" /> Guidelines
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">Write once, help forever.</h3>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {bestPractices.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-14 pb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </section>
  );
}

function ActionCard({
  to,
  icon: Icon,
  title,
  body,
  tone,
  primary,
}: {
  to: string;
  icon: typeof PlusCircle;
  title: string;
  body: string;
  tone: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        primary ? "border-primary/40 bg-primary-soft/60 hover:border-primary" : "border-border bg-card hover:border-primary"
      }`}
    >
      <span className={`inline-grid h-12 w-12 place-items-center rounded-xl ${tone} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-6 w-6" />
      </span>
      <div className="mt-4 text-base font-bold tracking-tight">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
        Open <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-white/70">{icon} {label}</div>
      <div className="mt-3 font-serif text-5xl">{value}</div>
    </div>
  );
}
