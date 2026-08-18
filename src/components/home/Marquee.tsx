"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

import { useScrollVelocity } from "@/components/providers/SmoothScroll";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Base travel, px per second. */
const BASE_SPEED = 46;
/** How hard scroll velocity pushes the belt. */
const VELOCITY_GAIN = 2.4;
/** Ceiling on that boost, so a fast flick can't turn the strip into a blur. */
const MAX_BOOST = 150;

export function Marquee({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const velocity = useScrollVelocity();

  const trackRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(0);
  const x = useMotionValue(0);
  const boost = useRef(0);

  /* One copy's width is the wrap distance: the track holds the list twice, so
     translating by exactly that lands copy two where copy one started and the
     loop has no seam. Measured rather than assumed, because the width depends
     on the font and the viewport. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setHalfWidth(el.scrollWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || halfWidth === 0) return;

    // Scroll velocity nudges the belt, then decays back to the base speed —
    // the strip reacts to scrolling without ever being driven by it.
    const target = Math.min(Math.abs(velocity.get()) * VELOCITY_GAIN, MAX_BOOST);
    boost.current += (target - boost.current) * 0.08;

    const next = x.get() - ((BASE_SPEED + boost.current) * delta) / 1000;
    // Wrap in the value itself rather than resetting to 0, so no frame lands
    // mid-jump.
    x.set(next <= -halfWidth ? next + halfWidth : next);
  });

  const strip = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="mono-caption px-6 text-cream/55 sm:px-8">{item}</span>
          <span className="text-primary/70" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-y border-white/8 bg-void/60 py-3.5",
        // Ends fade into the page instead of being sliced off.
        "[mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]",
        className,
      )}
    >
      {/* The visible belt is decorative and duplicated; one readable copy is
          exposed to assistive tech instead. */}
      <p className="sr-only">{items.join(", ")}</p>

      <motion.div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={reduceMotion ? undefined : { x }}
      >
        {strip}
        {strip}
      </motion.div>
    </div>
  );
}

export default Marquee;
