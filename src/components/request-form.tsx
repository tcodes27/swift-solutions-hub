import { useState } from "react";
import { Check, Send } from "lucide-react";
import { categories } from "@/data/articles";

export function RequestForm({ onDone }: { onDone?: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: categories[0].slug,
    description: "",
    priority: "Normal",
  });

  if (submitted) {
    return (
      <div className="animate-scale-in rounded-2xl bg-navy p-8 text-navy-foreground shadow-card">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-mint text-navy">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-serif text-3xl">Thanks — we&rsquo;ve got it.</h2>
        <p className="mt-2 text-white/80">
          Your request has been received. Our team will review it and add it to the knowledge base soon.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ title: "", category: categories[0].slug, description: "", priority: "Normal" });
            }}
            className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Submit another
          </button>
          {onDone && (
            <button
              onClick={onDone}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
    >
      <Field label="Article title">
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. How to set up a new Bluetooth headset"
          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
      </Field>
      <Field label="Category">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Description">
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the issue and what you'd like the article to cover."
          className="w-full rounded-xl border border-border bg-background p-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
        />
      </Field>
      <Field label="Priority">
        <div className="flex gap-2">
          {["Low", "Normal", "High"].map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setForm({ ...form, priority: p })}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                form.priority === p
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-muted text-foreground/70 hover:bg-muted/70"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </Field>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        Submit request <Send className="h-4 w-4" />
      </button>
    </form>
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
