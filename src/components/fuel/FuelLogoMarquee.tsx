"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

import { useScrollVelocity } from "@/components/providers/SmoothScroll";
import { fuelLabel, fuelShell } from "@/components/fuel/FuelPrimitives";
import { marqueeCaption } from "@/lib/home-fuel-content";
import { tiles } from "@/lib/tech-graph";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Base travel, px per second. Matches the existing text marquee. */
const BASE_SPEED = 46;
const VELOCITY_GAIN = 2.4;
const MAX_BOOST = 150;

/**
 * The tool-logo belt, standing in for the reference's client-logo marquee.
 *
 * Glyphs are the simple-icons paths already used by the stack section, painted
 * flat cream rather than in brand colours — a row of two dozen saturated logos
 * would out-shout every headline on the page, and monochrome is what makes it
 * read as texture. `tiles` is the single source, so adding a tool to the stack
 * adds it here too.
 */
export function FuelLogoMarquee() {
  const reduceMotion = usePrefersReducedMotion();
  const velocity = useScrollVelocity();

  const trackRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(0);
  const x = useMotionValue(0);
  const boost = useRef(0);

  /* One copy's width is the wrap distance: the track holds the list twice, so
     translating by exactly that lands copy two where copy one started and the
     loop has no seam. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setHalfWidth(el.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || halfWidth === 0) return;

    const target = Math.min(Math.abs(velocity.get()) * VELOCITY_GAIN, MAX_BOOST);
    boost.current += (target - boost.current) * 0.08;

    const next = x.get() - ((BASE_SPEED + boost.current) * delta) / 1000;
    // Wrap in the value itself rather than resetting to 0, so no frame lands
    // mid-jump.
    x.set(next <= -halfWidth ? next + halfWidth : next);
  });

  const strip = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {tiles.map((tile, i) => (
        <span
          key={`${tile.id}-${i}`}
          className="flex h-16 w-[8.5rem] shrink-0 items-center justify-center border-r border-cream/8 sm:w-[10rem]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 fill-cream/35 transition-colors duration-300 sm:h-7 sm:w-7"
          >
            <path d={tile.path} />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <section className="border-y border-cream/12 bg-ink py-10 sm:py-12">
      <div className={cn(fuelShell, "mb-6")}>
        <p className={cn(fuelLabel, "text-cream/55")}>{marqueeCaption}</p>
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden",
          // Ends fade into the page instead of being sliced off.
          "[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]",
        )}
      >
        {/* The belt is decorative and duplicated; one readable copy is exposed
            to assistive tech instead. */}
        <p className="sr-only">
          {marqueeCaption}: {tiles.map((t) => t.label).join(", ")}.
        </p>

        <motion.div
          ref={trackRef}
          className="flex w-max items-center will-change-transform"
          style={reduceMotion ? undefined : { x }}
        >
          {strip}
          {strip}
        </motion.div>
      </div>
    </section>
  );
}

export default FuelLogoMarquee;
