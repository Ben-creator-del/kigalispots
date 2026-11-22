import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABEL, PRICE_HINT, type Category, type Spot } from "@/data/spots";

const DOT: Record<Category, string> = {
  cafe: "bg-cafe",
  restaurant: "bg-restaurant",
  hangout: "bg-hangout",
};

export function CategoryBadge({ category, className }: { category: Category; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground shadow-soft backdrop-blur",
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", DOT[category])} />
      {CATEGORY_LABEL[category]}
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

export function Price({ level }: { level: Spot["priceLevel"] }) {
  return (
    <span className="text-sm font-semibold tracking-wider" title={PRICE_HINT[level]}>
      <span className="text-foreground">{"$".repeat(level)}</span>
      <span className="text-border">{"$".repeat(3 - level)}</span>
      <span className="sr-only"> {PRICE_HINT[level]}</span>
    </span>
  );
}
