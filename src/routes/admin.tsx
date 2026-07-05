import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { getDocumentationRequests, type DocumentationRequest } from "@/services/googleAppsScript";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Database,
  FileEdit,
  FilePlus2,
  FileSearch,
  FileText,
  MessageSquare,
  PencilLine,
  PlusCircle,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RequestForm } from "@/components/request-form";
import { AutomationDemo } from "@/components/automation-demo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { articles, categories } from "@/data/articles";
import { useInView } from "@/hooks/use-in-view";

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

type ModalKind = "submit" | "edit" | "create" | "analytics" | null;

function AdminPage() {
  const [modal, setModal] = useState<ModalKind>(null);
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

      {/* SECTION 1.5 — Live Documentation Requests */}
      <SectionHeader
        eyebrow="Section 1.5 · Live"
        title="Documentation requests"
        description="Requests submitted through the form, pulled live from the Documentation_Requests sheet."
      />
      <LiveRequestsSection />

      {/* SECTION 2 — Quick Actions */}
      <SectionHeader
        eyebrow="Section 2"
        title="Quick actions"
        description="Jump straight into the most common admin tasks."
      />
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            onClick={() => setModal("submit")}
            icon={PlusCircle}
            title="Submit Documentation Request"
            body="Open the request form to add a new topic."
            tone="bg-primary-soft text-primary"
            primary
          />
          <ActionCard
            onClick={() => setModal("edit")}
            icon={FileEdit}
            title="Edit Existing Documentation"
            body="Find an article and update its steps."
            tone="bg-mint/40 text-navy"
          />
          <ActionCard
            onClick={() => setModal("create")}
            icon={FilePlus2}
            title="Create New Article"
            body="Draft a brand-new troubleshooting guide."
            tone="bg-amber/40 text-navy"
          />
          <ActionCard
            onClick={() => setModal("analytics")}
            icon={BarChart3}
            title="View Analytics"
            body="Deep-dive into KB performance metrics."
            tone="bg-coral/30 text-navy"
          />
        </div>
        <div className="mt-4">
          <Link
            to="/admin-preview"
            className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary-soft/30 px-5 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-soft/60 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow-card">
                <Eye className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold tracking-tight">Preview imported article</div>
                <div className="text-xs text-muted-foreground">
                  See how a Google Sheets / Docs / CSV import renders before publishing.
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              Open preview <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>


      {/* SECTION 3 — Documentation Workflow */}
      <SectionHeader
        eyebrow="Section 3"
        title="Documentation workflow"
        description="How a request becomes a published article."
      />
      <WorkflowSection />

      {/* SECTION 3.5 — Automation Workflow Demo */}
      <SectionHeader
        eyebrow="Section 3.5 · MVP Concept Demo"
        title="Automation workflow demo"
        description="A visual preview of the production automation using Google Workspace, Make.com, and Slack."
      />
      <AutomationDemo />

      {/* SECTION 4 — Best Practices */}
      <SectionHeader
        eyebrow="Section 4"
        title="Documentation best practices"
        description="Standards to keep every article useful and trustworthy."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="group/card rounded-2xl border border-border bg-gradient-soft p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card-hover md:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Database className="h-4 w-4 transition-transform duration-300 ease-out group-hover/card:rotate-6" /> Guidelines
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">Write once, help forever.</h3>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {bestPractices.map((p, i) => (
              <li
                key={p}
                style={{ transitionDelay: `${i * 40}ms` }}
                className="group flex cursor-default items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary-soft/40 hover:shadow-card focus-within:border-primary"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Modals */}
      <AdminModal
        open={modal === "submit"}
        onOpenChange={(v) => !v && setModal(null)}
        title="Submit a Documentation Request"
        description="Suggest a new IT help article. Our team will review and publish it."
        icon={PlusCircle}
      >
        <RequestForm onDone={() => setModal(null)} />
      </AdminModal>

      <AdminModal
        open={modal === "edit"}
        onOpenChange={(v) => !v && setModal(null)}
        title="Edit Existing Documentation"
        description="Pick an article to update. Changes flow through the review workflow."
        icon={FileEdit}
      >
        <EditArticlePicker onClose={() => setModal(null)} />
      </AdminModal>

      <AdminModal
        open={modal === "create"}
        onOpenChange={(v) => !v && setModal(null)}
        title="Create a New Article"
        description="Draft a new troubleshooting guide from scratch."
        icon={FilePlus2}
      >
        <CreateArticleForm onClose={() => setModal(null)} />
      </AdminModal>

      <AdminModal
        open={modal === "analytics"}
        onOpenChange={(v) => !v && setModal(null)}
        title="Analytics Details"
        description="A closer look at knowledge base performance."
        icon={BarChart3}
      >
        <AnalyticsDetails />
      </AdminModal>
    </PageShell>
  );
}

/* ---------------- Workflow ---------------- */

function WorkflowSection() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <ol className="flex flex-wrap items-stretch gap-2">
          {workflowSteps.map((s, i) => (
            <WorkflowStep key={s.label} step={s} index={i} last={i === workflowSteps.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function WorkflowStep({
  step,
  index,
  last,
}: {
  step: { icon: ComponentType<{ className?: string }>; label: string };
  index: number;
  last: boolean;
}) {
  const { ref, inView } = useInView<HTMLLIElement>();
  const Icon = step.icon;
  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${index * 70}ms` }}
      className={`flex items-center gap-2 transition-all duration-500 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="group/step flex min-w-[10rem] cursor-default flex-col items-start gap-2 rounded-xl border border-border/70 bg-surface px-3 py-2.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:bg-primary-soft/30 hover:shadow-card focus-within:border-primary">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary transition-transform duration-300 ease-out group-hover/step:scale-110 group-hover/step:rotate-3">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Step {index + 1}
          </div>
          <div className="text-sm font-semibold leading-tight">{step.label}</div>
        </div>
      </div>
      {!last && (
        <ArrowRight className="h-4 w-4 shrink-0 animate-pulse text-primary/60" />
      )}
    </li>
  );
}

/* ---------------- Modal shell ---------------- */

function AdminModal({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-hidden rounded-2xl border-border p-0 shadow-card-hover">
        <DialogHeader className="sticky top-0 z-10 flex-row items-start gap-3 space-y-0 border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 pr-8 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight">{title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
          </div>
        </DialogHeader>
        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto px-6 py-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Modal contents ---------------- */

function EditArticlePicker({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const results = articles.filter((a) => a.title.toLowerCase().includes(q.toLowerCase())).slice(0, 8);

  if (picked) {
    const article = articles.find((a) => a.slug === picked)!;
    return (
      <div className="animate-scale-in space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Now editing</div>
          <div className="mt-1 font-semibold">{article.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">Last updated {article.lastUpdated}</div>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Change summary</span>
          <textarea
            rows={4}
            placeholder="What did you change and why?"
            className="w-full rounded-xl border border-border bg-background p-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setPicked(null)}
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Back
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            Save draft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles to edit…"
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
      </div>
      <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {results.map((a) => (
          <li key={a.slug}>
            <button
              onClick={() => setPicked(a.slug)}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface px-4 py-3 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary hover:bg-primary-soft/40 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground">Updated {a.lastUpdated}</div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          </li>
        ))}
        {results.length === 0 && (
          <li className="rounded-xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
            No articles match &ldquo;{q}&rdquo;.
          </li>
        )}
      </ul>
    </div>
  );
}

function CreateArticleForm({ onClose }: { onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: categories[0].slug,
    summary: "",
    difficulty: "Easy",
  });

  if (done) {
    return (
      <div className="animate-scale-in rounded-2xl bg-navy p-6 text-navy-foreground">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-mint text-navy">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-2xl">Draft created.</h3>
        <p className="mt-1 text-sm text-white/80">Your new article draft is saved and queued for review.</p>
        <button
          onClick={onClose}
          className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Article title</span>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Set up Zoom SSO on macOS"
          className="h-11 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Category</span>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="h-11 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Summary</span>
        <textarea
          required
          rows={4}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="A one-paragraph overview of the fix."
          className="w-full rounded-xl border border-border bg-background p-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Difficulty</span>
        {["Easy", "Medium", "Hard"].map((d) => (
          <button
            type="button"
            key={d}
            onClick={() => setForm({ ...form, difficulty: d })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              form.difficulty === d ? "bg-primary text-primary-foreground shadow-card" : "bg-muted text-foreground/70 hover:bg-muted/70"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-muted px-4 py-2 text-sm font-medium transition hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          Create draft <FilePlus2 className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function AnalyticsDetails() {
  const stats = [
    { label: "Total views (30d)", value: "12,483", icon: TrendingUp, tone: "bg-primary-soft text-primary" },
    { label: "Tickets deflected", value: "312", icon: CheckCircle2, tone: "bg-mint/40 text-navy" },
    { label: "Avg. helpfulness", value: "87%", icon: Sparkles, tone: "bg-amber/40 text-navy" },
    { label: "Search queries", value: "4,201", icon: Search, tone: "bg-coral/30 text-navy" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group rounded-xl border border-border bg-surface p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
          >
            <span className={`inline-grid h-9 w-9 place-items-center rounded-lg ${s.tone} transition-transform duration-300 group-hover:scale-110`}>
              <s.icon className="h-4 w-4" />
            </span>
            <div className="mt-3 text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-semibold">Top categories</div>
        <ul className="mt-3 space-y-2 text-sm">
          {categories.slice(0, 5).map((c, i) => (
            <li key={c.slug} className="flex items-center justify-between">
              <span>{c.name}</span>
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                {(5 - i) * 180 + 220} views
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Shared primitives ---------------- */

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
  onClick,
  icon: Icon,
  title,
  body,
  tone,
  primary,
}: {
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tone: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 text-left shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 ${
        primary
          ? "border-primary/40 bg-primary-soft/60 hover:border-primary"
          : "border-border bg-card hover:border-primary/60"
      }`}
    >
      {/* soft glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
      />
      {/* animated top border accent */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary via-primary/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span
        className={`relative inline-grid h-12 w-12 place-items-center rounded-xl ${tone} transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3`}
      >
        <Icon className="h-6 w-6 transition-transform duration-300 ease-out group-hover:scale-110" />
      </span>
      <div className="relative mt-4 text-base font-bold tracking-tight">{title}</div>
      <p className="relative mt-1 text-sm text-muted-foreground">{body}</p>
      <span className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all duration-300 ease-out group-hover:gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
        Open <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      </span>
    </button>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15">
      <div className="flex items-center gap-2 text-sm text-white/70">{icon} {label}</div>
      <div className="mt-3 font-serif text-5xl">{value}</div>
    </div>
  );
}

/* ---------------- Live Documentation Requests ---------------- */

function LiveRequestsSection() {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "ready"; data: DocumentationRequest[] }
    | { status: "error"; message: string }
  >({ status: "loading" });

  const load = () => {
    setState({ status: "loading" });
    getDocumentationRequests()
      .then((res) => {
        if (res.success) {
          const raw = res.data as unknown;
          // Apps Script may return { requests: [...] } or an array directly.
          const list = Array.isArray(raw)
            ? (raw as DocumentationRequest[])
            : Array.isArray((raw as { requests?: unknown })?.requests)
              ? ((raw as { requests: DocumentationRequest[] }).requests)
              : [];
          setState({ status: "ready", data: list });
        } else {
          setState({ status: "error", message: res.message });
        }
      })
      .catch(() =>
        setState({
          status: "error",
          message: "Unable to load requests. Please try again.",
        }),
      );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-2xl bg-card p-6 shadow-card md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-serif text-2xl">Submitted requests</div>
            <p className="text-sm text-muted-foreground">
              Live from Google Apps Script · Documentation_Requests sheet.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={state.status === "loading"}
            className="rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          >
            {state.status === "loading" ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="mt-6">
          {state.status === "loading" && (
            <div className="grid gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-border/60 bg-muted/40"
                />
              ))}
            </div>
          )}

          {state.status === "error" && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm">
              <div className="font-semibold text-destructive">Couldn&rsquo;t load requests</div>
              <p className="mt-1 text-muted-foreground">{state.message}</p>
              <button
                type="button"
                onClick={load}
                className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Try again
              </button>
            </div>
          )}

          {state.status === "ready" && state.data.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-surface/60 p-8 text-center">
              <div className="font-serif text-xl">No requests yet</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Submissions from the request form will show up here.
              </p>
            </div>
          )}

          {state.status === "ready" && state.data.length > 0 && (
            <ul className="grid gap-3">
              {state.data.map((r, idx) => (
                <RequestRow key={String(r.id ?? idx)} req={r} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function RequestRow({ req }: { req: DocumentationRequest }) {
  const r = req as Record<string, unknown>;
  const id = String(r.id ?? r.request_id ?? r.requestId ?? "—");
  const title = String(r.title ?? "Untitled");
  const category = String(r.category ?? "—");
  const priority = String(r.priority ?? "Normal");
  const status = String(r.status ?? "new");
  const submittedBy = String(r.submitted_by ?? r.submittedBy ?? "anonymous");
  const createdAt = String(r.created_at ?? r.createdAt ?? "");
  const description = String(r.description ?? "");
  const preview =
    description.length > 180 ? description.slice(0, 180).trimEnd() + "…" : description;

  const priorityTone =
    priority.toLowerCase() === "high"
      ? "bg-coral/30 text-navy"
      : priority.toLowerCase() === "low"
        ? "bg-muted text-foreground/70"
        : "bg-amber/30 text-navy";

  return (
    <li className="rounded-xl border border-border/60 bg-surface/60 p-5 transition hover:border-primary/40 hover:bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono">{id}</span>
            <span>·</span>
            <span>{category}</span>
            {createdAt && (
              <>
                <span>·</span>
                <span>{formatDate(createdAt)}</span>
              </>
            )}
          </div>
          <div className="mt-1.5 truncate font-semibold">{title}</div>
          {preview && (
            <p className="mt-1 text-sm text-muted-foreground">{preview}</p>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            Submitted by <span className="font-medium text-foreground">{submittedBy}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityTone}`}>
            {priority}
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary capitalize">
              {status}
            </span>
            <select
              disabled
              title="Coming next"
              className="cursor-not-allowed rounded-full border border-border bg-background px-2 py-1 text-xs text-muted-foreground opacity-70"
            >
              <option>Coming next</option>
            </select>
          </div>
        </div>
      </div>
    </li>
  );
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

