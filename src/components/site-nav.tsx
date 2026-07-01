import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/topics", label: "Browse Topics" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/admin", label: "Admin" },
];


export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-background transition-shadow duration-300 ${
        scrolled ? "border-border shadow-card" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-card transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">Sprinter IT Hub</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/70 transition-colors duration-200 hover:bg-muted hover:text-foreground"
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "rounded-full px-3.5 py-1.5 text-sm font-medium bg-primary-soft text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/request"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-card transition-all duration-200 hover:bg-primary/90 hover:shadow-card-hover hover:-translate-y-0.5 active:translate-y-0"
          >
            Submit Request
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center">
        <div>
          <div className="text-base font-bold tracking-tight text-foreground">Sprinter IT Hub</div>
          <div className="mt-1">Helping employees solve IT issues, fast.</div>
        </div>
        <div className="flex gap-6">
          <Link to="/topics" className="transition-colors hover:text-foreground">Topics</Link>
          <Link to="/admin" className="transition-colors hover:text-foreground">Admin</Link>
          <Link to="/how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
          <Link to="/request" className="transition-colors hover:text-foreground">Submit a request</Link>
        </div>
      </div>
    </footer>
  );
}
