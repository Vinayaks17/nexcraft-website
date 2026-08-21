"use client";

import { motion } from "framer-motion";

import { FuelVideo } from "@/components/fuel/FuelVideo";
import { Parallax } from "@/components/ui/Parallax";
import { fuelLabel, fuelShell } from "@/components/fuel/FuelPrimitives";
import { YEAR, fuelPreview } from "@/lib/home-fuel-content";
import { mediaReveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The media band under the hero: one big frame of a site we shipped, scrolling.
 *
 * This is the recording that used to sit inside the hero across eight columns,
 * given a band of its own now that the hero is image-led. At full width with
 * ink above and below it, it reads as evidence rather than as decoration in a
 * corner — which is the whole reason to show a build at all.
 *
 * The frame gets shallower as the viewport widens. The source is a 1080×1920
 * portrait screen recording, so every landscape crop is showing a horizontal
 * slice of a tall page: 16/9 on a phone would be a letterbox slot two
 * paragraphs high, while on a desktop the extra width earns the shallower cut.
 *
 * It carries no section number on purpose — see the note on `fuelPreview`.
 */
export function FuelPreview() {
  const { video, caption } = fuelPreview;

  return (
    <section className="bg-ink pt-4 pb-16 sm:pb-20 lg:pt-8 lg:pb-28">
      <div className={fuelShell}>
        <motion.figure {...mediaReveal} className="m-0">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-[3px] bg-surface ring-1 ring-cream/10",
              "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]",
            )}
          >
            {/* The frame is the page's largest media block, which makes it
                the one place a drift is worth having — it reads as the band
                having depth rather than as an image sliding. Parallax
                oversizes itself past the frame's edges, so the 5% never
                exposes a gap and the rounded clip does the rest. */}
            <Parallax amount={5}>
              <FuelVideo
                src={video.src}
                poster={video.poster}
                alt={video.alt}
              />
            </Parallax>
            {/* Settles the recording into the band instead of letting it sit on
                top as a bright rectangle, and keeps the caption's ground dark. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.30)_0%,transparent_30%,rgba(10,10,10,0.45)_100%)]"
            />
          </div>

          <figcaption className="mt-4">
            <div className="h-px w-full bg-cream/15" aria-hidden />
            <div className="flex items-center justify-between gap-6 pt-4">
              <p className={cn(fuelLabel, "flex items-center gap-2 text-cream/60")}>
                <span aria-hidden className="text-primary">
                  ◆
                </span>
                {caption}
              </p>
              <p className={cn(fuelLabel, "hidden text-cream/60 sm:block")}>
                © {YEAR}
              </p>
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

export default FuelPreview;
