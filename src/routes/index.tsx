import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Info, Search, X } from "lucide-react";
import heroImage from "@/assets/hero-kigali.jpg";
import { ALL, countByCategory, filterSpots } from "@/data/spots";
import { directoryQuery } from "@/data/directory";
import { SpotCard } from "@/components/spots/SpotCard";
import { Logo, SiteFooter } from "@/components/spots/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KigaliSpots — Discover cafes, restaurants & hangouts in Kigali" },
      {
        name: "description",
        content:
          "Find the best cafes, restaurants and hangouts in Kigali. Filter by category and explore spots across Kiyovu, Kimihurura, Nyamirambo and more.",
      },
      { property: "og:title", content: "KigaliSpots — Discover Kigali's best spots" },
      {
        property: "og:description",
        content: "Cafes, restaurants and hangouts across Kigali, all in one directory.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(directoryQuery()),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(directoryQuery());
  const { spots, categories, neighborhoods, source } = data;
  const [category, setCategory] = useState<string>(ALL);
  const [neighborhood, setNeighborhood] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => filterSpots(spots, { category, neighborhood, query }),
    [spots, category, neighborhood, query],
  );
  const chips = [{ slug: ALL, name: "All spots" }, ...categories];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Kigali's green hills at golden hour"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto max-w-6xl px-5 pt-6">
          <Logo inverted />
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:pb-24 sm:pt-40">
          <p className="animate-rise text-sm font-semibold uppercase tracking-[0.2em] text-hero-ink/80">
            The city of a thousand hills
          </p>
          <h1 className="animate-rise mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] text-hero-ink sm:text-7xl">
            Find your next favourite <em className="text-accent">spot</em> in Kigali.
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-lg text-hero-ink/85">
            Hand-picked cafes, restaurants and hangouts — from morning pour-overs to rooftop
            sundowners.
          </p>
          <label className="animate-rise mt-8 flex max-w-xl items-center gap-3 rounded-full bg-card px-5 py-3.5 shadow-lift">
            <Search className="size-5 text-muted-foreground" aria-hidden />
            <span className="sr-only">Search spots</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, neighbourhood or vibe…"
              className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Explore spots</h2>
            <p className="mt-1 text-muted-foreground">
              {results.length} {results.length === 1 ? "place" : "places"} to check out
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  className="chip"
                  data-active={category === c.slug}
                  aria-pressed={category === c.slug}
                  onClick={() => setCategory(c.slug)}
                >
                  {c.name}
                  <span className="text-xs opacity-70">{countByCategory(spots, c.slug)}</span>
                </button>
              ))}
            </div>
            {neighborhoods.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Neighbourhood
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="chip appearance-none pr-8"
                >
                  <option value={ALL}>All of Kigali</option>
                  {neighborhoods.map((n) => (
                    <option key={n.slug} value={n.slug}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>

        {source === "sample" && (
          <p className="mt-6 flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            <Info className="size-4 shrink-0" aria-hidden />
            Showing sample spots — the venues database isn't set up yet.
          </p>
        )}

        {results.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((spot, i) => (
              <SpotCard key={spot.id} spot={spot} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-foreground">
              {spots.length === 0 ? "No venues added yet" : "No spots match that"}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {spots.length === 0
                ? "New cafes, restaurants and hangouts will show up here as soon as they're added."
                : "Try another word, neighbourhood or category."}
            </p>
            <button
              type="button"
              className="chip mt-6"
              onClick={() => {
                setQuery("");
                setCategory(ALL);
                setNeighborhood(ALL);
              }}
            >
              Show all spots
            </button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
