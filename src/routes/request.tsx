import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Send } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { categories } from "@/data/articles";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Submit a Documentation Request — IT Support Hub" },
      { name: "description", content: "Suggest a new IT help article or update." },
      { property: "og:title", content: "Submit a Documentation Request — IT Support Hub" },
      { property: "og:description", content: "Suggest a new IT help article or update." },
    ],
  }),
  component: RequestPage,
});

function RequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: "", category: categories[0].slug, description: "", priority: "Normal" });

  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-6 pt-10 pb-24">
        <Breadcrumbs items={[{ label: "Submit a Request" }]} />
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Submit a request</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Suggest a new help article.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Tell us what's missing. We'll review, write it up, and publish it to the knowledge base.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl bg-navy p-8 text-navy-foreground shadow-card">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-mint text-navy">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-3xl">Thanks — we've got it.</h2>
            <p className="mt-2 text-white/80">
              Your request has been received. Our team will review it and add it to the knowledge base soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ title: "", category: categories[0].slug, description: "", priority: "Normal" });
              }}
              className="mt-6 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/20"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mt-10 space-y-5 rounded-2xl bg-card p-8 shadow-card"
          >
            <Field label="Article title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. How to set up a new Bluetooth headset"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:ring-4 focus:ring-primary/20"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:ring-4 focus:ring-primary/20"
              >
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Description">
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the issue and what you'd like the article to cover."
                className="w-full rounded-xl border border-border bg-background p-4 outline-none focus:ring-4 focus:ring-primary/20"
              />
            </Field>
            <Field label="Priority">
              <div className="flex gap-2">
                {["Low", "Normal", "High"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setForm({ ...form, priority: p })}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      form.priority === p ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/70"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02] hover:bg-primary/90"
            >
              Submit request <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
