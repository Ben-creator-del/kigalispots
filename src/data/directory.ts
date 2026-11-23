import { queryOptions } from "@tanstack/react-query";
import { externalSupabase } from "@/lib/externalSupabase";
import {
  SAMPLE_DIRECTORY,
  fallbackImage,
  toPriceLevel,
  type Category,
  type Directory,
  type Neighborhood,
  type Spot,
} from "./spots";

type Ref = { slug: string | null; name: string | null } | null;

/** Shape of a row in the external `venues` table (with its category and neighborhood joined). */
export interface VenueRow {
  id: string | number;
  slug: string | null;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  price_tier: number | string | null;
  vibe_tags?: string[] | null;
  category: Ref | Ref[];
  neighborhood: Ref | Ref[];
}

function one(ref: Ref | Ref[]): Ref {
  return Array.isArray(ref) ? (ref[0] ?? null) : ref;
}

export function mapVenueRow(row: VenueRow): Spot {
  const category = one(row.category);
  const neighborhood = one(row.neighborhood);
  const categorySlug = category?.slug ?? "other";
  const description = row.description ?? "";
  return {
    id: row.slug || String(row.id),
    name: row.name,
    category: categorySlug,
    categoryName: category?.name ?? "Other",
    neighborhood: neighborhood?.slug ?? "unknown",
    neighborhoodName: neighborhood?.name ?? "Kigali",
    tagline: description,
    description,
    rating: null,
    priceLevel: toPriceLevel(row.price_tier),
    hours: null,
    address: row.address ?? "Kigali",
    tags: (row.vibe_tags ?? []).filter((t) => t.trim() !== ""),
    image: row.image_url || fallbackImage(categorySlug),
    featured: row.is_featured === true,
  };
}

const VENUE_SELECT =
  "id, slug, name, description, address, image_url, is_featured, price_tier, vibe_tags, category:categories(slug, name), neighborhood:neighborhoods(slug, name)";

export async function fetchDirectory(): Promise<Directory> {
  const [venues, categories, neighborhoods] = await Promise.all([
    externalSupabase
      .from("venues")
      .select(VENUE_SELECT)
      .order("is_featured", { ascending: false })
      .order("name"),
    externalSupabase.from("categories").select("slug, name").order("name"),
    externalSupabase.from("neighborhoods").select("slug, name").order("name"),
  ]);

  const error = venues.error ?? categories.error ?? neighborhoods.error;
  if (error) {
    console.warn("[KigaliSpots] External database unavailable, showing sample spots:", error.message);
    return SAMPLE_DIRECTORY;
  }

  return {
    spots: ((venues.data ?? []) as unknown as VenueRow[]).map(mapVenueRow),
    categories: (categories.data ?? []) as Category[],
    neighborhoods: (neighborhoods.data ?? []) as Neighborhood[],
    source: "live",
  };
}

export const directoryQuery = () =>
  queryOptions({
    queryKey: ["directory"],
    queryFn: fetchDirectory,
    staleTime: 5 * 60 * 1000,
  });
