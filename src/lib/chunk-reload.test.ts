import { describe, expect, it } from "vitest";
import { isChunkLoadError } from "./chunk-reload";

describe("isChunkLoadError", () => {
  it("recognises a page file that failed to download", () => {
    expect(
      isChunkLoadError(
        new TypeError(
          "Failed to fetch dynamically imported module: https://x.lovableproject.com/@oj-start/hmr/lazy?id=spots",
        ),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new TypeError("Importing a module script failed."))).toBe(true);
  });

  it("ignores ordinary errors", () => {
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
  });
});
