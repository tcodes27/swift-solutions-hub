import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, CheckCircle2, FileText, PencilLine } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { articles } from "@/data/articles";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — IT Support Hub" },
      { name: "description", content: "Knowledge base health and recent activity." },
      { property: "og:title", content: "Admin Dashboard — IT Support Hub" },
      { property: "og:description", content: "Knowledge base health and recent activity." },
    ],
  }),
  component: AdminPage,
});

const COLORS = ["var(--primary)", "var(--mint)", "var(--amber)", "var(--coral)"];

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
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            <Kpi icon={<FileText className="h-5 w-5" />} label="Total articles" value={total + drafts} />
            <Kpi icon={<CheckCircle2 className="h-5 w-5" />} label="Published" value={published} />
            <Kpi icon={<Activity className="h-5 w-5" />} label="Needs review" value={needsReview} />
            <Kpi icon={<PencilLine className="h-5 w-5" />} label="Drafts" value={drafts} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-10 lg:grid-cols-3">
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
          <div className="font-serif text-2xl">Views by article</div>
          <p className="text-sm text-muted-foreground">Most-read articles in the last 30 days.</p>
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

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <div className="font-serif text-2xl">Recent activity</div>
          <ul className="mt-4 divide-y divide-border/60">
            {articles.slice(0, 5).map((a) => (
              <li key={a.slug} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-muted-foreground">Updated {a.lastUpdated}</div>
                </div>
                <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-medium text-navy">Published</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
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
