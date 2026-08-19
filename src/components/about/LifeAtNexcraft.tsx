"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  FuelSectionMeta,
  fuelBody,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { renderAccent } from "@/components/ui/AccentWord";
import { lifeAt } from "@/lib/about-content";
import { enterProps, mediaReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (03) Life at NexCRAFT — the candid band.
 *
 * The polaroid tilt and cream mounts that used to frame these are gone: on a
 * page ruled with hairlines and set in a Swiss ramp, a pair of rotated snapshots
 * read as a different site's idea. They sit square now, at the same radius as
 * every other media block, and the photographs carry themselves.
 *
 * The sources are small (the widest is 1008px), so the pair is capped rather
 * than stretched across the band — blowing them past their intrinsic size would
 * only look soft.
 */
export function LifeAtNexcraft() {
  // The band is content, not chrome: with no photos there's nothing to show.
  if (lifeAt.photos.length === 0) return null;

  return (
    <section className="bg-ink-alt py-20 sm:py-24 lg:py-28">
      <div className={fuelShell}>
        <FuelSectionMeta num="03" label="Life at NexCRAFT" />

        <div className="mt-12 grid grid-cols-1 gap-12 sm:mt-16 lg:grid-cols-12 lg:gap-12">
          <motion.div {...enterProps("left")} className="lg:col-span-5">
            <h2 className={cn(fuelStatement, "text-cream")}>
              {renderAccent(lifeAt.heading)}
            </h2>
            {lifeAt.paragraphs.map((p) => (
              <p key={p} className={cn(fuelBody, "mt-6 text-cream/60")}>
                {p}
              </p>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {lifeAt.photos.map((photo, i) => (
              <motion.figure
                key={photo.src}
                {...mediaReveal}
                transition={{ ...mediaReveal.transition, delay: i * 0.1 }}
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-surface-raised",
                  // The second drops half a step, so the pair reads as placed
                  // rather than as a two-cell table.
                  i === 1 && "sm:mt-12",
                )}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LifeAtNexcraft;
