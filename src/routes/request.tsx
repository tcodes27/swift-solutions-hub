import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RequestForm } from "@/components/request-form";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Submit a Documentation Request — Sprinter IT Hub" },
      { name: "description", content: "Suggest a new IT help article or update." },
      { property: "og:title", content: "Submit a Documentation Request — Sprinter IT Hub" },
      { property: "og:description", content: "Suggest a new IT help article or update." },
    ],
  }),
  component: RequestPage,
});

function RequestPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-6 pt-10 pb-24">
        <Breadcrumbs items={[{ label: "Submit a Request" }]} />
        <p className="text-sm font-medium uppercase tracking-wider text-primary">Submit a request</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Suggest a new help article.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Tell us what's missing. We'll review, write it up, and publish it to the knowledge base.
        </p>
        <div className="mt-10 rounded-2xl bg-card p-8 shadow-card">
          <RequestForm />
        </div>
      </section>
    </PageShell>
  );
}
