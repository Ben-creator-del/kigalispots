import cafe1 from "@/assets/spot-cafe-1.jpg";
import cafe2 from "@/assets/spot-cafe-2.jpg";
import restaurant1 from "@/assets/spot-restaurant-1.jpg";
import restaurant2 from "@/assets/spot-restaurant-2.jpg";
import hangout1 from "@/assets/spot-hangout-1.jpg";
import hangout2 from "@/assets/spot-hangout-2.jpg";


export type PriceLevel = 1 | 2 | 3;

export interface Category {
  slug: string;
  name: string;
}

export interface Neighborhood {
  slug: string;
  name: string;
}

export interface Spot {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  neighborhood: string;
  neighborhoodName: string;
  tagline: string;
  description: string;
  rating: number | null;
  priceLevel: PriceLevel | null;
  hours: string | null;
  address: string;
  tags: string[];
  image: string;
  featured: boolean;
}

export interface Directory {
  spots: Spot[];
  categories: Category[];
  neighborhoods: Neighborhood[];
  /** "live" = loaded from the external database, "sample" = built-in placeholder data. */
  source: "live" | "sample";
}

export const ALL = "all";

export const PRICE_HINT: Record<PriceLevel, string> = {
  1: "Budget",
  2: "Mid-range",
  3: "Splurge",
};

export type CategoryTone = "cafe" | "restaurant" | "hangout";

/** Groups any category slug (e.g. "cafes-coworking") into one of three colour/photo tones. */
export function categoryTone(categorySlug: string): CategoryTone {
  const slug = categorySlug.toLowerCase();
  if (slug.includes("cafe") || slug.includes("coffee")) return "cafe";
  if (slug.includes("restaurant") || slug.includes("food") || slug.includes("dining"))
    return "restaurant";
  return "hangout";
}

const FALLBACK_IMAGES: Record<CategoryTone, string> = {
  cafe: cafe1,
  restaurant: restaurant1,
  hangout: hangout1,
};

/** Image used when a venue has no image of its own. */
export function fallbackImage(categorySlug: string): string {
  return FALLBACK_IMAGES[categoryTone(categorySlug)];
}

/** Accepts 1–3, "2", or "$$"-style values; returns null when there's no price info. */
export function toPriceLevel(value: unknown): PriceLevel | null {
  if (value === null || value === undefined || value === "") return null;
  let n = Number(value);
  if (Number.isNaN(n) && typeof value === "string") n = value.trim().length;
  if (Number.isNaN(n) || n <= 0) return null;
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return 2;
}

export const SAMPLE_CATEGORIES: Category[] = [
  { slug: "cafe", name: "Cafes" },
  { slug: "restaurant", name: "Restaurants" },
  { slug: "hangout", name: "Hangouts" },
];

export const SAMPLE_NEIGHBORHOODS: Neighborhood[] = [
  { slug: "downtown", name: "Downtown" },
  { slug: "kacyiru", name: "Kacyiru" },
  { slug: "kimihurura", name: "Kimihurura" },
  { slug: "kimironko", name: "Kimironko" },
  { slug: "kiyovu", name: "Kiyovu" },
  { slug: "nyamirambo", name: "Nyamirambo" },
  { slug: "nyarutarama", name: "Nyarutarama" },
  { slug: "remera", name: "Remera" },
];

type SampleInput = Omit<Spot, "categoryName" | "neighborhoodName" | "featured">;

function sample(s: SampleInput): Spot {
  return {
    ...s,
    featured: false,
    categoryName: SAMPLE_CATEGORIES.find((c) => c.slug === s.category)?.name ?? s.category,
    neighborhoodName:
      SAMPLE_NEIGHBORHOODS.find((n) => n.slug === s.neighborhood)?.name ?? s.neighborhood,
  };
}

// Placeholder data — shown only when the external database can't be reached.
export const SAMPLE_SPOTS: Spot[] = [
  sample({
    id: "umuhanda-roasters",
    name: "Umuhanda Roasters",
    category: "cafe",
    neighborhood: "kiyovu",
    tagline: "Single-origin Rwandan pour-overs with a hillside view.",
    description:
      "A small roastery bar where baristas brew beans from Huye and Nyamasheke to order. Grab a window seat, a slow V60 and watch the city wake up across the valley.",
    rating: 4.8,
    priceLevel: 2,
    hours: "Daily · 7:00 – 19:00",
    address: "KN 14 Ave, Kiyovu",
    tags: ["Specialty coffee", "Wi-Fi", "Views"],
    image: cafe1,
  }),
  sample({
    id: "garden-terrace",
    name: "The Garden Terrace",
    category: "cafe",
    neighborhood: "kimihurura",
    tagline: "Croissants, cappuccinos and palm-shaded mornings.",
    description:
      "A leafy terrace café with fresh pastries baked in-house every morning. Popular for long brunches and laptop afternoons under the umbrellas.",
    rating: 4.6,
    priceLevel: 2,
    hours: "Mon–Sat · 7:30 – 18:00",
    address: "KG 7 Ave, Kimihurura",
    tags: ["Brunch", "Outdoor seating", "Pastries"],
    image: cafe2,
  }),
  sample({
    id: "inzozi-coffee",
    name: "Inzozi Coffee House",
    category: "cafe",
    neighborhood: "nyamirambo",
    tagline: "Neighbourhood café with the best chai latte in town.",
    description:
      "Colourful, friendly and always buzzing. Inzozi serves strong coffee, African tea and sambusas at prices that keep regulars coming back daily.",
    rating: 4.5,
    priceLevel: 1,
    hours: "Daily · 6:30 – 21:00",
    address: "KN 2 Rd, Nyamirambo",
    tags: ["Budget friendly", "Tea", "Local favourite"],
    image: cafe1,
  }),
  sample({
    id: "isoko-kitchen",
    name: "Isoko Kitchen",
    category: "restaurant",
    neighborhood: "kacyiru",
    tagline: "Modern Rwandan plates: brochettes, isombe and plantain.",
    description:
      "Classic Rwandan flavours served with a modern touch. Order the goat brochettes with fried plantain and finish with a passion-fruit tart.",
    rating: 4.7,
    priceLevel: 2,
    hours: "Tue–Sun · 12:00 – 23:00",
    address: "KG 9 Ave, Kacyiru",
    tags: ["Rwandan", "Grill", "Dinner"],
    image: restaurant1,
  }),
  sample({
    id: "horizon-dining",
    name: "Horizon Dining Room",
    category: "restaurant",
    neighborhood: "nyarutarama",
    tagline: "Sunset tasting menus behind floor-to-ceiling glass.",
    description:
      "An elegant dining room with sweeping views over the hills. Seasonal tasting menus pair local produce with an East African wine list.",
    rating: 4.9,
    priceLevel: 3,
    hours: "Wed–Sun · 18:00 – 23:30",
    address: "KG 303 St, Nyarutarama",
    tags: ["Fine dining", "Date night", "Views"],
    image: restaurant2,
  }),
  sample({
    id: "mama-kigali",
    name: "Mama Kigali Buffet",
    category: "restaurant",
    neighborhood: "downtown",
    tagline: "Hearty lunch buffet loved by office crowds.",
    description:
      "Pile your plate with beans, rice, matoke, cassava leaves and grilled fish. Fast, filling and one of the best-value lunches downtown.",
    rating: 4.4,
    priceLevel: 1,
    hours: "Mon–Sat · 11:30 – 15:30",
    address: "KN 4 Ave, Downtown",
    tags: ["Buffet", "Lunch", "Budget friendly"],
    image: restaurant1,
  }),
  sample({
    id: "akagera-grill",
    name: "Akagera Grill House",
    category: "restaurant",
    neighborhood: "remera",
    tagline: "Tilapia, chips and cold drinks by the stadium.",
    description:
      "A relaxed grill house where whole tilapia comes straight off the coals. Busy on match days, easy-going the rest of the week.",
    rating: 4.3,
    priceLevel: 2,
    hours: "Daily · 11:00 – 00:00",
    address: "KG 17 Ave, Remera",
    tags: ["Grill", "Fish", "Groups"],
    image: restaurant2,
  }),
  sample({
    id: "skyline-rooftop",
    name: "Skyline Rooftop",
    category: "hangout",
    neighborhood: "kimihurura",
    tagline: "String lights, city views and weekend DJ sets.",
    description:
      "Kigali's go-to rooftop for sundowners. Cosy lounge corners, cocktails made with local fruit and a DJ spinning Afrobeats every Friday and Saturday.",
    rating: 4.7,
    priceLevel: 3,
    hours: "Thu–Sun · 17:00 – 02:00",
    address: "KG 5 Ave, Kimihurura",
    tags: ["Rooftop", "Cocktails", "Nightlife"],
    image: hangout1,
  }),
  sample({
    id: "ikirere-courtyard",
    name: "Ikirere Courtyard",
    category: "hangout",
    neighborhood: "kiyovu",
    tagline: "Murals, live acoustic music and open-air benches.",
    description:
      "An open-air arts courtyard with rotating murals and live acoustic sessions every afternoon. Bring friends, grab a juice and stay for the music.",
    rating: 4.6,
    priceLevel: 1,
    hours: "Daily · 10:00 – 22:00",
    address: "KN 25 St, Kiyovu",
    tags: ["Live music", "Art", "Outdoor"],
    image: hangout2,
  }),
  sample({
    id: "kimironko-lounge",
    name: "Kimironko Night Lounge",
    category: "hangout",
    neighborhood: "kimironko",
    tagline: "Board games, pool tables and late-night bites.",
    description:
      "A laid-back lounge near the market with pool tables, board games and a kitchen that serves brochettes until late. Great for big groups.",
    rating: 4.2,
    priceLevel: 2,
    hours: "Daily · 16:00 – 01:00",
    address: "KG 11 Ave, Kimironko",
    tags: ["Games", "Groups", "Late night"],
    image: hangout1,
  }),
];

export const SAMPLE_DIRECTORY: Directory = {
  spots: SAMPLE_SPOTS,
  categories: SAMPLE_CATEGORIES,
  neighborhoods: SAMPLE_NEIGHBORHOODS,
  source: "sample",
};

export interface SpotFilters {
  category: string;
  neighborhood: string;
  query: string;
}

export function filterSpots(spots: Spot[], { category, neighborhood, query }: SpotFilters): Spot[] {
  const q = query.trim().toLowerCase();
  return spots.filter((spot) => {
    if (category !== ALL && spot.category !== category) return false;
    if (neighborhood !== ALL && spot.neighborhood !== neighborhood) return false;
    if (!q) return true;
    const haystack = [spot.name, spot.neighborhoodName, spot.categoryName, spot.tagline, ...spot.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function countByCategory(spots: Spot[], category: string): number {
  return category === ALL ? spots.length : spots.filter((s) => s.category === category).length;
}
