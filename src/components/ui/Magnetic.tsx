"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { springMagnetic } from "@/lib/motion";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type MagneticOptions = {
  /** Peak displacement in px. */
  strength?: number;
  /** Radius in px within which the cursor starts pulling. */
  range?: number;
  disabled?: boolean;
};

/**
 * Cursor-proximity pull.
 *
 * Writes to motion values only — never React state — so a pointermove costs a
 * transform and nothing else, however many magnetic elements are on the page.
 * Desktop pointers only: on touch there is no hover to anticipate, and the
 * effect would only fire after a tap had already landed.
 */
export function useMagnetic({
  strength = 6,
  range = 160,
  disabled = false,
}: MagneticOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const active = fine && !reduceMotion && !disabled;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springMagnetic);
  const sy = useSpring(y, springMagnetic);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist > range) {
        x.set(0);
        y.set(0);
        return;
      }
      // Falls off toward the edge of the range and also toward dead centre,
      // so the element leans into an approach and settles under the cursor.
      const pull = 1 - dist / range;
      x.set((dx / range) * strength * pull * 2);
      y.set((dy / range) * strength * pull * 2);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, range, strength, x, y]);

  return { ref, style: active ? { x: sx, y: sy } : undefined };
}

/** Wrapper form, for the common case of making one element magnetic. */
export function Magnetic({
  children,
  className,
  strength,
  range,
  disabled,
}: MagneticOptions & { children: ReactNode; className?: string }) {
  const { ref, style } = useMagnetic({ strength, range, disabled });

  /* inline-flex by default so wrapping a button in this doesn't turn it into a
     block and reflow whatever it was sitting next to. */
  return (
    <motion.div
      ref={ref}
      style={style}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}

export default Magnetic;
