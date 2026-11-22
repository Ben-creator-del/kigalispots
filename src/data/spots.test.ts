import { describe, expect, it } from "vitest";
import { SPOTS, filterSpots } from "./spots";

describe("filterSpots", () => {
  it("returns every spot for the 'all' category with no search", () => {
    expect(filterSpots(SPOTS, { category: "all", query: "" })).toHaveLength(SPOTS.length);
  });

  it("only returns cafes when the cafe filter is chosen", () => {
    const result = filterSpots(SPOTS, { category: "cafe", query: "" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((s) => s.category === "cafe")).toBe(true);
  });

  it("matches the search by neighbourhood, ignoring case", () => {
    const result = filterSpots(SPOTS, { category: "all", query: "kiyovu" });
    expect(result.map((s) => s.id).sort()).toEqual(["ikirere-courtyard", "umuhanda-roasters"]);
  });

  it("combines category and search", () => {
    const result = filterSpots(SPOTS, { category: "hangout", query: "Kimihurura" });
    expect(result.map((s) => s.id)).toEqual(["skyline-rooftop"]);
  });
});
