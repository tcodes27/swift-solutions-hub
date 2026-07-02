import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  FileEdit,
  FileSpreadsheet,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Slack,
  Sparkles,
  UploadCloud,
  Workflow,
  Zap,
} from "lucide-react";

type StepStatus = "idle" | "processing" | "done";
type FinalChip = "Sent" | "In Review" | "Approved" | "Published" | "Complete";

type Step = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  finalChip: FinalChip;
};

const STEPS: Step[] = [
  { icon: Send, title: "Employee submits request", finalChip: "Sent" },
  { icon: FileSpreadsheet, title: "Saved to Google Sheets", finalChip: "Sent" },
  { icon: Workflow, title: "Make.com watches for new rows", finalChip: "Sent" },
  { icon: Slack, title: "Slack alert sent to IT / Admin", finalChip: "Sent" },
  { icon: ClipboardCheck, title: "Admin reviews request", finalChip: "In Review" },
  { icon: FileEdit, title: "Article drafted", finalChip: "In Review" },
  { icon: ShieldCheck, title: "Manager approves", finalChip: "Approved" },
  { icon: UploadCloud, title: "Published to IT Support Hub", finalChip: "Published" },
  { icon: Search, title: "Future employees find the answer", finalChip: "Complete" },
];

const MOCK_ROWS = [
  { id: "REQ-1039", title: "Slack login loop after SSO reset", category: "Applications", priority: "High", status: "Published", date: "2026-06-24", owner: "M. Chen" },
  { id: "REQ-1040", title: "Zoom camera missing on macOS 15", category: "Hardware", priority: "Medium", status: "In Review", date: "2026-06-27", owner: "R. Patel" },
  { id: "REQ-1041", title: "Printer showing offline in Finder", category: "Hardware", priority: "Low", status: "Drafted", date: "2026-06-30", owner: "S. Alvarez" },
];

const NEW_ROW = {
  id: "REQ-1042",
  title: "VPN will not connect from hotel Wi-Fi",
  category: "Networking",
  priority: "Medium",
  date: "2026-07-02",
  owner: "Unassigned",
};

export function AutomationDemo() {
  const [active, setActive] = useState<number>(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActive(-1);
    setRunning(false);
  };

  const simulate = () => {
    reset();
    setRunning(true);
    setActive(0);
    const stepMs = 850;
    for (let i = 1; i <= STEPS.length; i++) {
      timers.current.push(
        setTimeout(() => {
          setActive(i);
          if (i === STEPS.length) setRunning(false);
        }, stepMs * i),
      );
    }
  };

  const done = active >= STEPS.length;
  const rowVisible = active >= 1;
  const rowStatus =
    active >= 8 ? "Published" : active >= 7 ? "Approved" : active >= 5 ? "In Review" : "New";
  const slackVisible = active >= 3;

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-4 border-b border-border bg-gradient-soft px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> MVP Concept Demo
              </span>
              <span className="text-xs text-muted-foreground">Visual only · No real APIs connected</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight">Automation workflow demo</h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              This demo shows how documentation requests could move from submission to review, approval, and publishing
              using Google Workspace, Slack, and workflow automation.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {done && (
              <button
                onClick={reset}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </button>
            )}
            <button
              onClick={simulate}
              disabled={running}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-80"
            >
              {running ? (<><Loader2 className="h-4 w-4 animate-spin" /> Simulating…</>) :
                done ? (<><Play className="h-4 w-4" /> Run again</>) :
                (<><Play className="h-4 w-4" /> Simulate documentation request</>)}
            </button>
          </div>
        </div>

        <div className="border-b border-border/60 bg-surface px-6 py-2.5 text-[11px] text-muted-foreground md:px-8">
          This prototype does not connect to private company tools. It demonstrates the intended automation workflow for production.
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:p-8 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow</div>
              {done && (
                <div className="inline-flex animate-fade-in-up items-center gap-1.5 rounded-full bg-success/25 px-3 py-1 text-xs font-semibold text-success-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Request published and searchable
                </div>
              )}
            </div>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STEPS.map((s, i) => {
                const status: StepStatus =
                  active > i ? "done" : active === i && running ? "processing" : active === i ? "done" : "idle";
                return <StepCard key={s.title} index={i} step={s} status={status} />;
              })}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <SheetsPreview visibleNewRow={rowVisible} newRowStatus={rowStatus} highlight={active === 1} />
          </div>
          <div className="lg:col-span-5">
            <SlackPreview visible={slackVisible} highlight={active === 3} />
          </div>

          <div className="lg:col-span-12">
            <MakeCard active={active >= 2 && active < STEPS.length} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ index, step, status }: { index: number; step: Step; status: StepStatus }) {
  const Icon = step.icon;
  const chip = statusChip(status, step.finalChip);
  const ring =
    status === "processing" ? "border-primary/70 shadow-glow" :
    status === "done" ? "border-primary/40" : "border-border/70";
  return (
    <li className={`group/step relative flex items-start gap-3 rounded-xl border ${ring} bg-surface p-3.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-card`}>
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-all duration-300 ease-out ${
        status === "idle" ? "bg-primary-soft text-primary" :
        status === "processing" ? "animate-pulse-glow bg-primary text-primary-foreground" :
        "bg-primary text-primary-foreground"
      } group-hover/step:scale-110`}>
        {status === "processing" ? <Loader2 className="h-4 w-4 animate-spin" /> :
         status === "done" ? <CheckCircle2 className="h-4 w-4" /> :
         <Icon className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Step {index + 1}</div>
        <div className="text-sm font-semibold leading-tight">{step.title}</div>
        <div className="mt-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${chip.className}`}>
            {chip.label}
          </span>
        </div>
      </div>
    </li>
  );
}

function statusChip(status: StepStatus, finalChip: FinalChip) {
  if (status === "idle") return { label: "Pending", className: "bg-muted text-muted-foreground" };
  if (status === "processing") return { label: "Processing", className: "bg-info/25 text-info-foreground" };
  const map: Record<FinalChip, string> = {
    Sent: "bg-primary-soft text-primary",
    "In Review": "bg-amber/40 text-navy",
    Approved: "bg-info/25 text-info-foreground",
    Published: "bg-success/30 text-success-foreground",
    Complete: "bg-success/30 text-success-foreground",
  };
  return { label: finalChip, className: map[finalChip] };
}

function SheetsPreview({ visibleNewRow, newRowStatus, highlight }: { visibleNewRow: boolean; newRowStatus: string; highlight: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center gap-2 border-b border-border bg-[oklch(0.94_0.06_155)] px-4 py-2 text-xs font-semibold text-[oklch(0.28_0.12_155)] dark:bg-[oklch(0.28_0.08_155)] dark:text-[oklch(0.92_0.05_155)]">
        <FileSpreadsheet className="h-4 w-4" />
        documentation-requests · Google Sheets
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Request ID", "Title", "Category", "Priority", "Status", "Submitted", "Owner"].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {MOCK_ROWS.map((r) => (
              <tr key={r.id} className="bg-card">
                <td className="whitespace-nowrap px-3 py-2 font-mono">{r.id}</td>
                <td className="px-3 py-2">{r.title}</td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.category}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.priority}</td>
                <td className="whitespace-nowrap px-3 py-2">{r.status}</td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.date}</td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.owner}</td>
              </tr>
            ))}
            {visibleNewRow && (
              <tr className={`animate-fade-in-up ${highlight ? "bg-primary-soft/70" : "bg-primary-soft/30"} transition-colors duration-500`}>
                <td className="whitespace-nowrap px-3 py-2 font-mono font-semibold text-primary">{NEW_ROW.id}</td>
                <td className="px-3 py-2 font-semibold">{NEW_ROW.title}</td>
                <td className="whitespace-nowrap px-3 py-2">{NEW_ROW.category}</td>
                <td className="whitespace-nowrap px-3 py-2">{NEW_ROW.priority}</td>
                <td className="whitespace-nowrap px-3 py-2 font-semibold">{newRowStatus}</td>
                <td className="whitespace-nowrap px-3 py-2">{NEW_ROW.date}</td>
                <td className="whitespace-nowrap px-3 py-2">{NEW_ROW.owner}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlackPreview({ visible, highlight }: { visible: boolean; highlight: boolean }) {
  return (
    <div className={`h-full overflow-hidden rounded-xl border ${highlight ? "border-primary/60 shadow-glow" : "border-border"} bg-card shadow-card transition-all duration-500`}>
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2 text-xs font-semibold">
        <Slack className="h-4 w-4 text-primary" />
        <span>#it-requests</span>
        <span className="text-muted-foreground">· Slack</span>
      </div>
      <div className="p-4">
        {visible ? (
          <div className="animate-fade-in-up">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-semibold">Sprinter IT Bot</span>
                  <span className="text-[10px] text-muted-foreground">just now · via Make.com</span>
                </div>
                <div className="mt-1 rounded-lg border-l-4 border-primary bg-surface p-3">
                  <div className="text-sm font-bold">New documentation request</div>
                  <div className="mt-0.5 text-sm">{NEW_ROW.title}</div>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                    <Field label="Category" value={NEW_ROW.category} />
                    <Field label="Priority" value={NEW_ROW.priority} />
                    <Field label="Status" value="New" />
                  </dl>
                  <div className="mt-2 text-[11px] text-muted-foreground">Action needed: Review and assign owner</div>
                  <div className="mt-3 flex gap-2">
                    <span className="cursor-default rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">Assign</span>
                    <span className="cursor-default rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-semibold">Approve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Slack className="h-6 w-6 opacity-40" />
            Slack alert will appear when the workflow runs.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-card px-2 py-1">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-[11px] font-semibold">{value}</div>
    </div>
  );
}

function MakeCard({ active }: { active: boolean }) {
  return (
    <div className={`rounded-xl border ${active ? "border-primary/50 shadow-glow" : "border-border"} bg-gradient-soft p-5 shadow-card transition-all duration-500`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-bold">Make.com scenario</div>
            <div className="text-[11px] text-muted-foreground">Google Sheets → Slack → Task creation</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${active ? "bg-success/25 text-success-foreground" : "bg-muted text-muted-foreground"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-muted-foreground"}`} />
          {active ? "Running" : "Idle"}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch">
        <MakeNode label="Trigger" title="New Sheets row" icon={FileSpreadsheet} tone="trigger" />
        <MakeArrow />
        <MakeNode label="Action" title="Notify Slack channel" icon={Slack} />
        <MakeArrow />
        <MakeNode label="Action" title="Update status + assign owner" icon={ClipboardCheck} />
        <MakeArrow />
        <MakeNode label="Action" title="Create draft doc task" icon={FileEdit} />
      </div>
    </div>
  );
}

function MakeNode({ label, title, icon: Icon, tone }: { label: string; title: string; icon: ComponentType<{ className?: string }>; tone?: "trigger" }) {
  return (
    <div className={`flex flex-1 items-start gap-2 rounded-lg border ${tone === "trigger" ? "border-primary/40 bg-primary-soft/40" : "border-border bg-card"} px-3 py-2 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card`}>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-xs font-semibold">{title}</div>
      </div>
    </div>
  );
}

function MakeArrow() {
  return (
    <div className="flex items-center justify-center text-primary/60">
      <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" />
    </div>
  );
}
