"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/RevealHeading";
import { CountUp } from "@/components/ui/CountUp";
import {
  FuelBracketLink,
  FuelSectionHeader,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { fuelAbout, sectionIndex } from "@/lib/home-fuel-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (01) Who we are — the page's first inversion.
 *
 * The band is cream, which is why `--accent-ink` is overridden here: brand
 * orange is ~1.8:1 on cream and effectively invisible, so the accent word falls
 * back to the darker brand tone. Same override the existing CtaMinimalBreak
 * uses, kept identical on purpose.
 */
export function FuelAbout() {
  const section = sectionIndex.about;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-cream py-20 text-ink [--accent-ink:var(--color-primary-darker)] sm:py-24 lg:py-32"
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} tone="light" />

        {/* The oversized statement, under the header's title. A `<p>`, not a
            heading: "Who we are" is this band's h2 and this is the claim
            beneath it, so a second heading here would only make the outline
            say the same thing twice.

            The first line is indented, which is the reference's one real
            typographic signature — it turns a block of display type into
            something that reads as set rather than typed.

            `text-indent` is inherited, and RevealHeading wraps every word in an
            `overflow-hidden` inline-block — each of which is a block container
            and so applies the inherited indent to its own first line, pushing
            each word sideways inside its own clip and shearing it. Resetting it
            on the descendants keeps the indent on the heading's first line only,
            which is the only place it was ever meant to apply. */}
        <RevealHeading
          text={fuelAbout.statement}
          as="p"
          className={cn(
            fuelStatement,
            "mt-12 text-ink sm:mt-16 lg:[text-indent:18%] lg:[&_span]:[text-indent:0]",
          )}
        />

        {/* Portrait, then the label + body split — the reference's three-column
            lower half. The photo carries the left column, which is otherwise a
            third of the band's width standing empty. */}
        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          <motion.div {...enterProps("left")} className="lg:col-span-4">
            <div className="relative aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-[3px] bg-ink/10">
              <Image
                src={fuelAbout.photo.src}
                alt={fuelAbout.photo.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="flex flex-col gap-10 sm:gap-14">
              {fuelAbout.blocks.map((block, i) => (
                <motion.div
                  key={block.label}
                  {...enterProps("up", i * 0.08)}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-8"
                >
                  <dt className={cn(fuelLabel, "text-ink/60 sm:col-span-4")}>
                    {block.label}
                  </dt>
                  <dd className={cn(fuelBody, "text-ink/75 sm:col-span-8")}>
                    {block.body}
                  </dd>
                </motion.div>
              ))}
            </dl>

            {/* Metrics — label left, value right, hairline under each. */}
            <motion.dl {...enterProps("up", 0.12)} className="mt-14">
              {fuelAbout.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-baseline justify-between gap-6 border-b border-ink/15 py-4"
                >
                  <dt className="text-[0.9375rem] font-medium tracking-[-0.01em] text-ink">
                    {metric.label}
                  </dt>
                  <dd className="text-[0.9375rem] font-medium tracking-[-0.01em] text-ink/60">
                    <CountUp value={metric.value} />
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div {...enterProps("up", 0.16)} className="mt-12">
              <FuelBracketLink href={fuelAbout.cta.href} tone="light">
                {fuelAbout.cta.label}
              </FuelBracketLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FuelAbout;
