import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
        <MapPin className="size-5" aria-hidden />
      </span>
      <span
        className={`font-display text-2xl font-semibold tracking-tight ${inverted ? "text-hero-ink" : "text-foreground"}`}
      >
        Kigali<span className="italic text-accent">Spots</span>
      </span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center">
        <Logo />
        <p className="text-sm text-muted-foreground">
          Cafes, restaurants & hangouts across the city of a thousand hills.
        </p>
      </div>
    </footer>
  );
}
