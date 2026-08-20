"use client";

import { motion } from "framer-motion";

import { CountUp } from "@/components/ui/CountUp";
import {
  FuelSectionHeader,
  fuelBody,
  fuelNumeral,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { fuelStats, sectionIndex } from "@/lib/home-fuel-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (08) The numbers — four figures, all real, all taken from about-content.ts.
 *
 * CountUp handles the odd one out on its own: "India" has no digits, so it
 * renders untouched rather than counting to nothing. The three numeric values
 * count up the first time the grid scrolls into view, and render at their final
 * value on the server and for reduced-motion users.
 */
export function FuelStats() {
  const section = sectionIndex.stats;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-ink-alt py-20 sm:py-24 lg:py-32"
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} />

        <dl className="mt-12 grid grid-cols-1 gap-x-12 gap-y-14 sm:mt-16 sm:grid-cols-2">
          {fuelStats.map((stat, i) => (
            <motion.div key={stat.label} {...enterProps("up", i * 0.08)}>
              <dd
                className={cn(
                  fuelNumeral,
                  // A word-valued figure ("India") is wider than any numeral
                  // beside it, so long values step down instead of overflowing
                  // the cell.
                  stat.value.length > 6
                    ? "text-[clamp(2rem,4vw,3.5rem)]"
                    : undefined,
                  "text-cream",
                )}
              >
                <CountUp value={stat.value} />
              </dd>

              <div className="mt-6 h-px w-full bg-cream/15" aria-hidden />

              <dt className="mt-5 text-[1.0625rem] font-semibold tracking-[-0.02em] text-cream">
                {stat.label}
              </dt>
              <p className={cn(fuelBody, "mt-3 max-w-[46ch] text-cream/60")}>
                {stat.description}
              </p>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default FuelStats;
