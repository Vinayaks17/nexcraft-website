"use client";

import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/RevealHeading";
import {
  FuelSectionHeader,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { fuelUsps, fuelWhy, sectionIndex } from "@/lib/home-fuel-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
            <motion.li
              key={usp.num}
              {...enterProps("up", i * 0.08)}
              className="group border-b border-cream/12 transition-colors duration-500 hover:bg-cream/[0.04]"
            >
              <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-4 px-1 py-10 sm:grid-cols-12 sm:py-12 lg:py-14">
                {/* Oversized index — mono, so it stays in the detail layer's
                    voice even at four times the size the rest of that layer
                    runs at. */}
                <span
                  aria-hidden
                  className={cn(
                    "font-mono text-[1.75rem] leading-none tracking-[0.02em] transition-colors duration-500 sm:col-span-2 sm:text-[2.25rem]",
                    "text-cream/40 group-hover:text-primary",
                  )}
                >
                  {usp.num}
                </span>

                <div className="sm:col-span-6">
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-cream">
                    {usp.title}
                  </h3>
                  <p className={cn(fuelLabel, "mt-4 text-cream/60")}>
                    {usp.kicker}
                  </p>
                </div>

                <p className={cn(fuelBody, "text-cream/65 sm:col-span-4")}>
                  {usp.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FuelUsps;
