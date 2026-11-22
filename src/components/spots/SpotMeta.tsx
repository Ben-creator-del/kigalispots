import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICE_HINT, categoryTone, type CategoryTone, type PriceLevel } from "@/data/spots";

const DOT: Record<CategoryTone, string> = {
  cafe: "bg-cafe",
  restaurant: "bg-restaurant",
  hangout: "bg-hangout",
};

export function CategoryBadge({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-soft backdrop-blur",
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", DOT[categoryTone(slug)])} />
      {name}
    </span>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
      <Star className="size-4 fill-star text-star" aria-hidden />
      {value.toFixed(1)}
    </span>
  );
}

export function Price({ level }: { level: PriceLevel }) {
  return (
    <span className="text-sm font-semibold tracking-wider" title={PRICE_HINT[level]}>
      <span className="text-foreground">{"$".repeat(level)}</span>
      <span className="text-border">{"$".repeat(3 - level)}</span>
      <span className="sr-only"> {PRICE_HINT[level]}</span>
    </span>
  );
}
