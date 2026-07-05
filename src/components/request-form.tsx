import { useState } from "react";
import { Check, Send, X, Loader2, AlertCircle } from "lucide-react";
import { categories } from "@/data/articles";
import { submitDocumentationRequest } from "@/services/googleAppsScript";

type Status = "idle" | "loading" | "success" | "error";

const INITIAL_FORM = {
  title: "",
  category: categories[0].slug,
  description: "",
  priority: "Normal",
  submitted_by: "",
};

export function RequestForm({ onDone }: { onDone?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [modal, setModal] = useState<null | "success" | "error">(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    setStatus("loading");
    try {
      const result = await submitDocumentationRequest({
        action: "submit_request",
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        priority: form.priority,
        submitted_by: form.submitted_by.trim() || "anonymous",
        source: "Knowledge Capture Hub",
      });

      if (result.success) {
        setStatus("success");
        setModal("success");
        setForm(INITIAL_FORM);
      } else {
        setStatus("error");
        setModal("error");
      }
    } catch {
      setStatus("error");
      setModal("error");
    }
  };

  const closeModal = () => {
    setModal(null);
    if (status !== "loading") setStatus("idle");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
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
        <Field label="Your email (optional)">
          <input
            type="email"
            value={form.submitted_by}
            onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
            placeholder="you@company.com"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
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
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100"
        >
          {status === "loading" ? (
            <>
              Submitting… <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Submit request <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md animate-scale-in rounded-2xl bg-card p-8 shadow-card-hover"
          >
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X className="h-4 w-4" />
            </button>

            {modal === "success" ? (
              <>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-mint text-navy">
                  <Check className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-serif text-2xl">Request submitted</h2>
                <p className="mt-2 text-muted-foreground">
                  Thanks! Your documentation request has been submitted for review.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={closeModal}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Close
                  </button>
                  {onDone && (
                    <button
                      onClick={() => {
                        closeModal();
                        onDone();
                      }}
                      className="rounded-full bg-muted px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                    >
                      Done
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-serif text-2xl">Submission failed</h2>
                <p className="mt-2 text-muted-foreground">
                  Something went wrong. Please try again.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setModal(null);
                      setStatus("idle");
                      // Re-submit using current form state
                      handleSubmit({
                        preventDefault: () => {},
                      } as React.FormEvent);
                    }}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Try again
                  </button>
                  <button
                    onClick={closeModal}
                    className="rounded-full bg-muted px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/70"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
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
