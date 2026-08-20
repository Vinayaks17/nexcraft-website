"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/RevealHeading";
import { CountUp } from "@/components/ui/CountUp";
import {
  FuelSectionHeader,
  fuelLabel,
  fuelNumeral,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { fuelAbout, sectionIndex } from "@/lib/home-fuel-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (04) Who we are — the page's cream inversion, and now one of its shortest
 * bands rather than its second-tallest.
 *
 * The portrait, the two prose blocks and the bracket link out are gone. All of
 * that already exists on /about at greater length, and by the time a visitor
 * reaches this point they have seen the work, the argument and the stack — the
 * studio's own biography is the one thing on the page that can afford to be a
 * statement, three figures and a door.
 *
 * The band is cream, which is why `--accent-ink` is overridden here: brand
 * orange is ~1.8:1 on cream and effectively invisible, so the accent word falls
 * back to the darker brand tone.
 */
export function FuelAbout() {
  const section = sectionIndex.about;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-cream py-16 text-ink [--accent-ink:var(--color-primary-darker)] sm:py-20 lg:py-24"
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} tone="light" />

        {/* Statement left, metrics and the way out right, on one row. The
            link sits inside the metrics column rather than in a block of its
            own underneath: that column is the shorter of the two, so the link
            costs the band no height at all above lg. */}
        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* The statement. A `<p>`, not a heading: "Who we are" is this band's
              h2 and this is the claim under it. */}
          <RevealHeading
            text={fuelAbout.statement}
            as="p"
            className={cn(fuelStatement, "text-ink lg:col-span-7")}
          />

          <div className="lg:col-span-5">
            {/* Numerals rather than the label/value rule the long version
                used — at three items a rule per row reads as a table of
                nothing. */}
            <motion.dl
              {...enterProps("up", 0.08)}
              className="grid grid-cols-3 gap-6 lg:gap-8"
            >
              {fuelAbout.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd
                    className={cn(
                      fuelNumeral,
                      "text-[clamp(1.75rem,3vw,2.75rem)] text-ink",
                    )}
                  >
                    <CountUp value={metric.value} />
                  </dd>
                  <dt className={cn(fuelLabel, "mt-3 text-ink/65")}>
                    {metric.label}
                  </dt>
                </div>
              ))}
            </motion.dl>

            <motion.div {...enterProps("fade", 0.12)} className="mt-8">
              <div className="h-px w-full bg-ink/15" aria-hidden />
              <Link
                href={fuelAbout.cta.href}
                className={cn(
                  fuelLabel,
                  "mt-5 inline-flex items-center gap-2 text-ink underline decoration-ink/30 underline-offset-[6px]",
                  "transition-colors duration-200 hover:text-primary-darker hover:decoration-primary-darker",
                )}
              >
                {fuelAbout.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FuelAbout;
