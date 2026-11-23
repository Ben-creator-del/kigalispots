import { describe, expect, it } from "vitest";
import { ALL, SAMPLE_SPOTS, categoryTone, filterSpots, toPriceLevel } from "./spots";
import { mapVenueRow } from "./directory";

const none = { category: ALL, neighborhood: ALL, query: "" };

describe("filterSpots", () => {
  it("returns every spot with no filters", () => {
    expect(filterSpots(SAMPLE_SPOTS, none)).toHaveLength(SAMPLE_SPOTS.length);
  });

  it("only returns cafes when the cafe category is chosen", () => {
    const result = filterSpots(SAMPLE_SPOTS, { ...none, category: "cafe" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((s) => s.category === "cafe")).toBe(true);
  });

  it("only returns spots in the chosen neighbourhood", () => {
    const result = filterSpots(SAMPLE_SPOTS, { ...none, neighborhood: "kiyovu" });
    expect(result.map((s) => s.id).sort()).toEqual(["ikirere-courtyard", "umuhanda-roasters"]);
  });

  it("searches neighbourhood names ignoring case", () => {
    const result = filterSpots(SAMPLE_SPOTS, { ...none, query: "KIYOVU" });
    expect(result).toHaveLength(2);
  });

  it("combines category and search", () => {
    const result = filterSpots(SAMPLE_SPOTS, { ...none, category: "hangout", query: "Kimihurura" });
    expect(result.map((s) => s.id)).toEqual(["skyline-rooftop"]);
  });
});

describe("venues from the database", () => {
  it("reads price tiers as 1 to 3, from numbers or $ signs", () => {
    expect(toPriceLevel(0)).toBeNull();
    expect(toPriceLevel(null)).toBeNull();
    expect(toPriceLevel(5)).toBe(3);
    expect(toPriceLevel("2")).toBe(2);
    expect(toPriceLevel("$$$")).toBe(3);
  });

  it("groups database category slugs into cafe, restaurant and hangout looks", () => {
    expect(categoryTone("cafes-coworking")).toBe("cafe");
    expect(categoryTone("restaurants")).toBe("restaurant");
    expect(categoryTone("rooftops-lounges")).toBe("hangout");
  });

  it("maps a venue row with its category and neighbourhood", () => {
    const spot = mapVenueRow({
      id: "uuid-1",
      slug: "test-cafe",
      name: "Test Cafe",
      description: "Good coffee",
      address: null,
      image_url: null,
      is_featured: true,
      price_tier: 2,
      vibe_tags: ["Quiet", "Views"],
      category: { slug: "cafes-coworking", name: "Cafes & Coworking" },
      neighborhood: [{ slug: "kiyovu", name: "Kiyovu" }],
    });
    expect(spot.id).toBe("test-cafe");
    expect(spot.category).toBe("cafes-coworking");
    expect(spot.neighborhoodName).toBe("Kiyovu");
    expect(spot.priceLevel).toBe(2);
    expect(spot.featured).toBe(true);
    expect(spot.tags).toEqual(["Quiet", "Views"]);
    expect(spot.image).toBeTruthy();
  });
});
