"use client";

import { useCallback, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Media query hook built on useSyncExternalStore so it is hydration-safe by
 * construction: React uses the server snapshot (`false`) for the hydration
 * render, then re-renders with the real value. Reading matchMedia during the
 * first client render instead would desync the two trees.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** False on the server and during hydration, true from the first commit on. */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Same hydration-safe contract, for the reduced-motion setting. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
