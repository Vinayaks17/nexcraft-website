"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { FuelVideo } from "@/components/fuel/FuelVideo";
import {
  fuelLabel,
  fuelDisplay,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { fuelHero } from "@/lib/home-fuel-content";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Blocks under the headline settle in after it, not with it. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export function FuelHero() {
  const { video } = fuelHero;

  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-0 lg:pt-40">
      <div className={fuelShell}>
        {/* 1 — the statement. Full width, oversized, word-staggered: the same
            reveal language the rest of the site already speaks. */}
        <RevealHeading
          text={fuelHero.headline}
          as="h1"
          className={cn(fuelDisplay, "max-w-[22ch] text-cream")}
          stagger={0.09}
        />

        {/* 2 — supporting row: actions and the discipline index on the left,
            the media block on the right. */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <motion.div
            {...rise(0.35)}
            className="flex flex-col justify-between gap-10 lg:col-span-4"
          >
            <div className="flex flex-col items-start gap-4">
              <Button href={fuelHero.primaryCta.href} size="lg" magnetic>
                {fuelHero.primaryCta.label}
              </Button>
              <a
                href={fuelHero.secondaryCta.href}
                className={cn(
                  fuelLabel,
                  "text-cream/60 underline decoration-cream/25 underline-offset-[6px]",
                  "transition-colors duration-200 hover:text-primary hover:decoration-primary",
                )}
              >
                {fuelHero.secondaryCta.label} →
              </a>
            </div>

            {/* The reference's "01/ …" index, bottom-left of the hero. */}
            <div>
              <div className="h-px w-full bg-cream/15" aria-hidden />
              <ul className="mt-4 space-y-1.5">
                {fuelHero.disciplines.map((d, i) => (
                  <li key={d} className="flex items-baseline gap-3">
                    <span className={cn(fuelLabel, "w-6 shrink-0 text-primary")}>
                      {i === 0 ? fuelHero.disciplineIndex : ""}
                    </span>
                    <span className="text-base font-medium tracking-[-0.01em] text-cream">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            {...rise(0.2)}
            className="relative lg:col-span-8"
          >
            {/* The media frame. Our screen recordings are 1080×1920 portrait,
                so the frame is landscape and the video is cropped to it —
                object-cover on a fixed aspect keeps the composition stable
                across every width instead of letting a tall video set the
                hero's height. */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] bg-surface sm:aspect-[16/9]">
              <FuelVideo
                src={video.src}
                poster={video.poster}
                alt={video.alt}
                className="scale-[1.02]"
              />
              {/* Warms the recording into the page rather than letting it sit
                  on top as a bright rectangle. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,transparent_35%,rgba(10,10,10,0.55)_100%)]"
              />
              <span
                className={cn(
                  fuelLabel,
                  "absolute bottom-4 left-4 text-cream/80",
                )}
              >
                {fuelHero.locationTag}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3 — the wordmark, bleeding off the bottom edge. Full-bleed rather than
          gutter-bound, and clipped by the section so it can never widen the
          page. */}
      <motion.div
        {...rise(0.5)}
        aria-hidden
        className="relative mt-14 h-[9.5vw] w-full overflow-hidden select-none lg:mt-20"
      >
        <span className="absolute inset-x-0 bottom-[-0.19em] block text-center font-display text-[13.5vw] leading-[0.8] font-bold tracking-[-0.045em] whitespace-nowrap text-cream/[0.07]">
          {fuelHero.wordmark}
        </span>
      </motion.div>
    </section>
  );
}

export default FuelHero;
