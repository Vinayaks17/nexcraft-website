"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { site } from "@/lib/site";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * The oversized footer wordmark. Two stacked copies: a cream stroke that is
 * always there, and an orange stroke revealed only inside a radial mask that
 * follows the cursor — so the letters warm where the pointer is.
 *
 * The mask is built with useMotionTemplate from motion values, which keeps the
 * whole effect off React's render path: a pointermove updates a CSS string, not
 * component state.
 *
 * Extracted from Footer so the Fuel-structured homepage footer can carry the
 * same signature without duplicating the mask logic. Behaviour is unchanged
 * from the original; `fill` and `className` are the only additions, and both
 * default to what Footer was already doing.
 */
export function Wordmark({
  /** `stroke` = outlined letters. `solid` = filled, for a heavier footer. */
  fill = "stroke",
  className,
}: {
  fill?: "stroke" | "solid";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const mask = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, #000 0%, rgba(0,0,0,0.35) 45%, transparent 72%)`;

  const active = fine && !reduceMotion;

  const onMove = (e: React.PointerEvent) => {
    if (!active) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  /* Sized from the real advance width — measured for Switzer, which is a
     normal-width face and so runs wider than the condensed one this replaced.
     The vw value holds at every width because text and viewport both scale
     in vw. */
  const base =
    "font-display text-[14.5vw] leading-[0.8] font-bold tracking-[-0.03em] whitespace-nowrap uppercase select-none";

  const resting =
    fill === "solid"
      ? "text-cream/[0.07]"
      : "text-transparent [-webkit-text-stroke:1px_rgba(242,237,228,0.16)]";

  const warmed =
    fill === "solid"
      ? "text-primary/25"
      : "text-transparent [-webkit-text-stroke:1px_rgba(255,146,77,0.85)]";

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(-9999);
        my.set(-9999);
      }}
      // Clipped so the wordmark can bleed off the bottom edge without ever
      // widening the page.
      className={cn(
        "pointer-events-auto relative h-[10.5vw] w-full overflow-hidden select-none",
        className,
      )}
      aria-hidden
    >
      <span className={cn(base, "absolute inset-x-0 bottom-[-0.16em] block text-center", resting)}>
        {site.name}
      </span>

      {active && (
        <motion.span
          style={{ WebkitMaskImage: mask, maskImage: mask }}
          className={cn(base, "absolute inset-x-0 bottom-[-0.16em] block text-center", warmed)}
        >
          {site.name}
        </motion.span>
      )}
    </div>
  );
}

export default Wordmark;
