// When a page's code can't be downloaded (the preview just rebuilt, or a new version was
// published while the tab was open), the old file is gone. Reloading fetches the current one.

const RELOAD_KEY = "kigalispots:chunk-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;

const CHUNK_ERROR =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\w-]+ failed/i;

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return CHUNK_ERROR.test(message);
}

/** Reloads the page unless it already reloaded for this reason moments ago (avoids loops). */
export function reloadOnceForChunkError(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage unavailable: still reload once; the cooldown just can't be tracked.
  }
  window.location.reload();
  return true;
}
