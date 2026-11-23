import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { PRICE_HINT, type Spot } from "@/data/spots";
import { directoryQuery } from "@/data/directory";
import { CategoryBadge, Price, Rating } from "@/components/spots/SpotMeta";
import { SpotCard } from "@/components/spots/SpotCard";
import { Logo, SiteFooter } from "@/components/spots/SiteHeader";

export const Route = createFileRoute("/spots/$id")({
  loader: async ({ params, context }) => {
    const directory = await context.queryClient.ensureQueryData(directoryQuery());
    const spot = directory.spots.find((s) => s.id === params.id);
    if (!spot) throw notFound();
    const related = directory.spots
      .filter((s) => s.category === spot.category && s.id !== spot.id)
      .slice(0, 3);
    return { spot, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Spot not found — KigaliSpots" }, { name: "robots", content: "noindex" }],
      };
    }
    const { spot } = loaderData;
    const title = `${spot.name} · ${spot.neighborhoodName}, Kigali — KigaliSpots`;
    return {
      meta: [
        { title },
        { name: "description", content: spot.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: spot.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: SpotNotFound,
  component: SpotPage,
});

function SpotPage() {
  const { spot, related } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent"
        >
          <ArrowLeft className="size-4" /> All spots
        </Link>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16">
        <div className="relative overflow-hidden rounded-3xl shadow-lift">
          <img
            src={spot.image}
            alt={spot.name}
            className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
          />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <CategoryBadge slug={spot.category} name={spot.categoryName} />
            <h1 className="mt-3 text-4xl font-semibold text-hero-ink sm:text-6xl">{spot.name}</h1>
            <p className="mt-2 max-w-2xl text-lg text-hero-ink/85">{spot.tagline}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">About this spot</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {spot.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {spot.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <dl className="space-y-5">
              {spot.rating !== null && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Rating</dt>
                  <dd>
                    <Rating value={spot.rating} />
                  </dd>
                </div>
              )}
              {spot.priceLevel !== null && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Price</dt>
                  <dd className="flex items-center gap-2">
                    <Price level={spot.priceLevel} />
                    <span className="text-sm text-muted-foreground">
                      {PRICE_HINT[spot.priceLevel]}
                    </span>
                  </dd>
                </div>
              )}
              <div>
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> Neighbourhood
                </dt>
                <dd className="mt-1 font-semibold text-foreground">{spot.neighborhoodName}</dd>
              </div>
              {spot.hours && (
                <div>
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" /> Hours
                  </dt>
                  <dd className="mt-1 font-semibold text-foreground">{spot.hours}</dd>
                </div>
              )}
              <div>
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" /> Address
                </dt>
                <dd className="mt-1 font-semibold text-foreground">{spot.address}</dd>
              </div>
            </dl>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-semibold text-foreground">
              More {spot.categoryName.toLowerCase()} to try
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s: Spot, i: number) => (
                <SpotCard key={s.id} spot={s} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function SpotNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="text-4xl font-semibold text-foreground">We couldn't find that spot</h1>
      <p className="text-muted-foreground">It may have moved or closed.</p>
      <Link to="/" className="chip">
        Back to all spots
      </Link>
    </div>
  );
}
