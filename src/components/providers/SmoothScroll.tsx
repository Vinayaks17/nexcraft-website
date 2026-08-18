"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { motionValue, type MotionValue } from "framer-motion";

import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

type SmoothScrollApi = {
  /**
   * Signed scroll velocity in px/frame, as a motion value so readers can react
   * without re-rendering. Stays at 0 when Lenis isn't running.
   */
  velocity: MotionValue<number>;
  /** Scrolls to an absolute document offset, through Lenis when it's active. */
  scrollTo: (target: number | HTMLElement, offset?: number) => void;
};

/** Native fallback, also used as the context default outside any provider. */
function nativeScrollTo(target: number | HTMLElement, offset = 0, instant = false) {
  if (typeof window === "undefined") return;
  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + offset, behavior: instant ? "auto" : "smooth" });
}

/* motionValue() is a plain factory, not a hook, so a module-level default is
   safe and gives consumers outside the provider a valid MotionValue to read. */
const zeroVelocity = motionValue(0);

const SmoothScrollContext = createContext<SmoothScrollApi>({
  velocity: zeroVelocity,
  scrollTo: (target, offset) => nativeScrollTo(target, offset),
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/** Just the velocity — the common case, and its identity never changes. */
export const useScrollVelocity = () => useContext(SmoothScrollContext).velocity;

/**
 * Inertial smooth scrolling, site-wide.
 *
 * Lenis drives the real document scroll position (it calls the native scroll
 * APIs on a rAF loop rather than transforming a container), so everything built
 * on native scroll keeps working untouched: IntersectionObserver, position:
 * sticky, framer's useScroll, and the navbar's scrollY threshold.
 *
 * Off on touch — mobile browsers already have momentum scrolling, and layering
 * a JS loop over it costs frames and breaks address-bar collapse — and off
 * under prefers-reduced-motion.
 *
 * The instance lives in a ref rather than state: nothing here renders from it,
 * and keeping it out of state means the effect doesn't have to call setState
 * and trigger a second render pass on every mount.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  const coarse = useMediaQuery("(pointer: coarse)");
  const enabled = !reduceMotion && !coarse;

  const lenisRef = useRef<Lenis | null>(null);
  // Lazy initialiser: created once per provider, stable for its lifetime.
  const [velocity] = useState(() => motionValue(0));

  useEffect(() => {
    if (!enabled) return;

    const instance = new Lenis({
      // ~1s to settle: enough glide to feel considered, short enough that a
      // deliberate flick still lands where the reader meant it to.
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Touch is excluded above; belt-and-braces if the query flips live.
      syncTouch: false,
      wheelMultiplier: 1,
    });

    instance.on("scroll", ({ velocity: v }: { velocity: number }) => {
      velocity.set(v);
    });

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    lenisRef.current = instance;

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenisRef.current = null;
      velocity.set(0);
    };
  }, [enabled, velocity]);

  const api = useMemo<SmoothScrollApi>(
    () => ({
      velocity,
      scrollTo: (target, offset = 0) => {
        const instance = lenisRef.current;
        if (instance) {
          instance.scrollTo(target, { offset, duration: 1.1 });
          return;
        }
        nativeScrollTo(target, offset, reduceMotion);
      },
    }),
    [velocity, reduceMotion],
  );

  return (
    <SmoothScrollContext.Provider value={api}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export default SmoothScrollProvider;
