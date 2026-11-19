"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { fuelLabel, fuelShell } from "@/components/fuel/FuelPrimitives";
import { valueLine } from "@/lib/home-fuel-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The strip between the build preview and (01). One promise, one mono list, an
 * ask, hairlines top and bottom — a beat, not a section, so it carries no
 * number.
 *
 * It grew a real button in F6. It is the first point on the page where a
 * visitor has seen both the claim and a build. Making it the page's first ask
 * is what lets the reorder run three numbered sections before the next one
 * without a gap in the rhythm.
 */
export function FuelValueLine() {
  return (
    <section className="border-y border-cream/12 bg-ink-alt py-8 sm:py-10">
      <div className={fuelShell}>
        <motion.div
          {...enterProps("fade")}
          className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
        >
          <div className="max-w-[30ch] lg:max-w-[38ch]">
            <p className="text-[1.25rem] leading-[1.25] font-medium tracking-[-0.02em] text-cream sm:text-[1.5rem]">
              {valueLine.statement}
            </p>
            {/* The "no copy-paste" USP, stated once early. (03) Why NexCRAFT
                makes the full argument; this is the qualifier a visitor needs
                while they are still reading the offer. */}
            <p className={cn(fuelLabel, "mt-4 text-cream/60")}>
              {valueLine.note}
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {valueLine.items.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                <span className={cn(fuelLabel, "text-primary")}>
                  0{i + 1}
                </span>
                <span className={cn(fuelLabel, "text-cream/70")}>{item}</span>
              </li>
            ))}
          </ul>

          <Button href={valueLine.primaryCta.href} magnetic>
            {valueLine.primaryCta.label}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default FuelValueLine;
