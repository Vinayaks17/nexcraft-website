"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { RevealHeading } from "@/components/ui/RevealHeading";
import {
  FuelSectionHeader,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { fuelUsps, fuelWhy, sectionIndex, type FuelUsp } from "@/lib/home-fuel-content";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
   The reading light

   One row at a time warms as it crosses the middle of the viewport: a hairline
   of brand orange draws down its left edge, the ground lifts a couple of
   percent, and the oversized index goes from cream to orange. It reads as a
   light travelling down the list as you scroll — which is the one place on the
   page where a scroll-driven flourish says something true, because these five
   rows ARE meant to be read one at a time.

   Driven from each row's own position rather than from the section's, so the
   effect is identical whichever row you stop on and however tall the viewport
   is. It layers under the hover state rather than fighting it: hover still
   warms the whole row, this only decides where the light already is.

   Off under reduced motion and on touch — a scroll-linked value is not an
   animation MotionConfig can intercept, and on a phone the rows are tall
   enough that one is almost always centred, so the light would never travel.
------------------------------------------------------------------------- */

function UspRow({ usp, index }: { usp: FuelUsp; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(min-width: 1024px)");
  const lit = fine && !reduceMotion;

  /* 0 as the row enters from the bottom, 0.5 at the middle of the viewport,
     1 as it leaves the top. The peak is a narrow window around 0.5 so only
     one row is ever lit. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const STOPS = [0.3, 0.42, 0.58, 0.7];
  const glow = useTransform(scrollYProgress, STOPS, [0, 1, 1, 0]);
  const bg = useTransform(glow, (v) => `rgba(242, 237, 228, ${0.035 * v})`);
  const bar = useTransform(glow, [0, 1], [0, 1]);
  const indexColor = useTransform(
    glow,
    [0, 1],
    ["rgba(242, 237, 228, 0.4)", "rgb(255, 146, 77)"],
  );

  return (
    <motion.li
      ref={ref}
      {...enterProps("up", index * 0.08)}
      style={lit ? { backgroundColor: bg } : undefined}
      className="group relative border-b border-cream/12 transition-colors duration-500 hover:bg-cream/[0.04]"
    >
      {/* The travelling hairline. Scaled from the top so it draws downward as
          the row arrives, rather than fading in place. */}
      {lit && (
        <motion.span
          aria-hidden
          style={{ scaleY: bar }}
          className="gradient-brand absolute top-0 left-0 h-full w-[2px] origin-top"
        />
      )}

      <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-4 px-1 py-10 sm:grid-cols-12 sm:py-12 lg:py-14">
        <motion.span
          aria-hidden
          style={lit ? { color: indexColor } : undefined}
          className={cn(
            "font-mono text-[1.75rem] leading-none tracking-[0.02em] transition-colors duration-500 sm:col-span-2 sm:text-[2.25rem]",
            !lit && "text-cream/40",
            "group-hover:text-primary",
          )}
        >
          {usp.num}
        </motion.span>

        <div className="sm:col-span-6">
          <h3 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-cream">
            {usp.title}
          </h3>
          <p className={cn(fuelLabel, "mt-4 text-cream/60")}>{usp.kicker}</p>
        </div>

        <p className={cn(fuelBody, "text-cream/65 sm:col-span-4")}>{usp.body}</p>
      </div>
    </motion.li>
  );
}

/**
 * (03) Why NexCRAFT — the page's thesis.
 *
 * Five full-width rows on hairlines rather than a card grid: cards would make
 * these read as a feature list, and they are the five commitments the whole
 * offer rests on. An oversized mono index in the left column, the claim set
 * big in the middle, the supporting sentence right.
 *
 * Hover warms the whole row and turns its index orange. That is a
 * colour/background transition rather than a transform, so it survives the
 * reduced-motion pass intact — which is what we want, since it is the only
 * thing telling a pointer user the rows are a set.
 *
 * `bg-ink-alt` puts a step of tone between the orange CTA band above and the
 * logo belt below, so the thesis reads as its own plane rather than as the top
 * of the dark run that follows it.
 */
export function FuelUsps() {
  const section = sectionIndex.why;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-ink-alt py-20 sm:py-24 lg:py-32"
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} />

        {/* The claim under the title. A `<p>`, not a heading: the section's
            `h2` is "Why NexCRAFT" and this is the argument, not a second
            label for the same band. */}
        <RevealHeading
          text={fuelWhy.statement}
          as="p"
          className={cn(fuelStatement, "mt-12 max-w-[20ch] text-cream sm:mt-16")}
        />

        <ul className="mt-16 border-t border-cream/12 sm:mt-20">
          {fuelUsps.map((usp, i) => (
            <UspRow key={usp.num} usp={usp} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FuelUsps;
