"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { lifeAt } from "@/lib/about-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Static tilts, alternating, so the pair reads as dropped-on-a-desk polaroids. */
const TILT = ["-rotate-3", "rotate-2"];

/**
 * Candid team band. The source photos are small (the widest is 1008px), so the
 * frames are deliberately capped rather than stretched across the column —
 * blowing them up past their intrinsic size would just look soft.
 */
export function LifeAtNexcraft() {
  // The band is content, not chrome: with no photos there's nothing to show.
  if (lifeAt.photos.length === 0) return null;

  return (
    <SectionWrapper spacing="lg" animate={false} width="wide" outerClassName="bg-ink-alt">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <motion.div
          {...enterProps("left")}
        >
          <RevealHeading
            text={lifeAt.heading}
            as="h2"
            className="text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]"
          />
          {lifeAt.paragraphs.map((p) => (
            <p key={p} className="mt-5 text-base leading-relaxed text-cream/70">
              {p}
            </p>
          ))}
        </motion.div>

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-6 lg:gap-8">
          {lifeAt.photos.map((photo, i) => (
            <motion.figure
              key={photo.src}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.12 }}
              className={cn(
                "w-full max-w-[19rem] shrink-0 rounded-lg bg-cream p-2.5 pb-8 shadow-lift",
                "transition-transform duration-500 ease-out hover:rotate-0 hover:scale-[1.03]",
                TILT[i % TILT.length],
                // Overlap the pair slightly on wide screens.
                i === 1 && "sm:-ml-6 lg:-ml-8",
              )}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-surface-raised">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 19rem, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default LifeAtNexcraft;
