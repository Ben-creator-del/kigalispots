import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { Spot } from "@/data/spots";
import { CategoryBadge, Price, Rating } from "./SpotMeta";

export function SpotCard({ spot, index = 0 }: { spot: Spot; index?: number }) {
  return (
    <Link
      to="/spots/$id"
      params={{ id: spot.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={spot.image}
          alt={spot.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-card-overlay" />
        <CategoryBadge category={spot.category} className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold leading-tight text-foreground">{spot.name}</h3>
          <Rating value={spot.rating} />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{spot.tagline}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="size-4 text-accent" aria-hidden />
            {spot.neighborhood}
          </span>
          <Price level={spot.priceLevel} />
        </div>
      </div>
    </Link>
  );
}
