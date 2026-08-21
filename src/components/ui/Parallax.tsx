"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Drifts its child against the page as the block scrolls past.
 *
 * The wrapper is deliberately oversized — `inset-[-8%]` on an absolutely
 * positioned box — so that a ±5% drift never pulls an edge into view. Put it
 * inside a frame that already clips (every media block on this site has
 * `overflow-hidden` for its rounded corners) and the effect is free of layout
 * consequences: nothing reflows, nothing can overflow the page.
 *
 * `amount` is a percentage of the child's own height, and it is small on
 * purpose. The reference sites this design borrows from move media 4-6% across
 * a full viewport of scroll; past that it stops reading as depth and starts
 * reading as the image being dragged.
 *
 * MotionConfig's reduced-motion pass does NOT cover this. It intercepts
 * animations, and a `style`-bound motion value is not an animation — it is a
 * value the browser reads every frame. So the branch is explicit: no motion
 * value is attached at all, and the child sits still.
 */
export function Parallax({
  children,
  amount = 5,
  className,
}: {
  children: ReactNode;
  /** Peak drift, in percent of the child's height. Keep it under ~6. */
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  /* "start end" → "end start" is the whole time the block is on screen, from
     its top touching the bottom of the viewport to its bottom leaving the top.
     Measuring against that rather than against the page means the drift is the
     same at every scroll depth and on every viewport height. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${-amount}%`, `${amount}%`]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { y }}
      className={cn("absolute inset-[-8%]", className)}
    >
      {children}
    </motion.div>
  );
}

export default Parallax;
