"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { HeroRipple } from "@/components/fuel/HeroRipple";
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
  return (
    /* `min-h-dvh` after `min-h-screen`, not instead of it: 100vh on mobile is
       the *large* viewport, so with the browser chrome showing, a 100vh hero
       runs under it and the landing view is never the whole hero. dvh tracks
       the visible viewport, so the image fills exactly what the visitor can
       see at any moment. The screen unit stays first as the fallback for
       engines without dvh. */
    <section className="relative flex min-h-screen min-h-dvh flex-col overflow-hidden bg-ink pt-32 pb-0 lg:pt-40">
      {/* 1 — the image, and the ripple that lives in it. Full-bleed, behind
          everything, and the only thing occupying the middle of the viewport. */}
      <HeroRipple src={fuelHero.background.src} />

      {/* 2 — the scrim. Two gradients over the canvas, no blur: one down the
          page, one across it.

          These stops are measured, not judged by eye, and they are specific to
          the photograph currently behind them. Sampling it under the hero's own
          cover fit, cream type over the sun's core is 1.07:1 — so a scrim is
          needed, but where it is needed is very uneven. Solving per pixel for
          the alpha that lifts the brightest point in each tenth of the frame to
          4.5:1 gives ~0.57 for the top fifth, where the low sun sits, then
          ~0.26-0.31 through the middle, and 0.00 across the bottom fifth, which
          is already dark enough to carry cream unaided.

          So the vertical pass is shaped rather than flat: heavy over the sun,
          releasing to roughly 0.40 by a third of the way down so the
          silhouettes and the sweep of light stay legible as a picture, and
          lifting again at the very bottom — not for the photograph's sake but
          for the CTA row, the discipline index and the wordmark, which are
          11px mono and hold to 4.5:1 as small text.

          The stops are taken from the worst case across viewports, since the
          cover crop reframes the sun: at 3440x1440 the top of the frame needs
          only ~0.24 where at 1440x900 it needs 0.57.

          The horizontal pass then adds to the left third, under the headline.

          None of this survives an image swap. Two other candidates were
          measured against this same harness: a bright daylight photo needed
          ~0.59 almost everywhere, a near-flat wash, because cream over open
          sky is 1.00:1; and a dark-topped abstract needed the shape inverted,
          rising down the frame to a peak of only 0.37. Re-run the sampling
          rather than inheriting these numbers — draw the image cover-fitted
          into a canvas, lay the candidate gradients over it, and take the
          worst contrast in the headline band across viewports. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.70)_0%,rgba(10,10,10,0.62)_18%,rgba(10,10,10,0.40)_32%,rgba(10,10,10,0.38)_55%,rgba(10,10,10,0.55)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(10,10,10,0.30)_0%,rgba(10,10,10,0.10)_45%,rgba(10,10,10,0)_72%)]"
      />

      <div className={cn(fuelShell, "relative z-20 flex flex-1 flex-col")}>
        {/* 3 — the statement. Full width, oversized, word-staggered: the same
            reveal language the rest of the site already speaks. */}
        <RevealHeading
          text={fuelHero.headline}
          as="h1"
          className={cn(fuelDisplay, "max-w-[22ch] text-cream")}
          stagger={0.09}
        />

        {/* 4 — the foot of the hero, pushed down so the image owns everything
            between it and the headline: actions on the left, the reference's
            "01/ …" index opposite, over one hairline.

            There is deliberately no media frame here. The hero used to carry
            the screen recording across eight columns, which is exactly the
            slot the background image now occupies — and the reference's own
            hero has no media block either, only the image, the statement and
            one link. Keeping both would also have put a video card under the
            fixed contact buttons, which sit bottom-right on every route. */}
        <motion.div
          {...rise(0.35)}
          className="mt-auto pt-12 pb-8 lg:pt-16"
        >
          <div className="h-px w-full bg-cream/15" aria-hidden />
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
            <div className="flex flex-col items-start gap-4">
              {/* The speed claim, sitting on the decision. It repeats (02)
                  Why NexCRAFT's first USP on purpose — that band is nine
                  screens down, and this is where the promise is worth
                  something. Bordered rather than filled so it reads as a note
                  on the CTA rather than as a second button competing with it.
                  cream/75 on the scrim's foot clears AA at this size. */}
              <p
                className={cn(
                  fuelLabel,
                  "inline-flex items-center gap-2 rounded-full border border-primary/50 bg-ink/40 px-3 py-2 text-cream/85 backdrop-blur-sm",
                )}
              >
                <span aria-hidden className="text-primary">
                  ◆
                </span>
                {fuelHero.highlight}
              </p>

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

            <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2 sm:justify-end">
              <li className={cn(fuelLabel, "text-primary")}>
                {fuelHero.disciplineIndex}
              </li>
              {fuelHero.disciplines.map((d) => (
                <li
                  key={d}
                  className="text-base font-medium tracking-[-0.01em] text-cream"
                >
                  {d}
                </li>
              ))}
              <li className={cn(fuelLabel, "text-cream/60")}>
                {fuelHero.locationTag}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* 5 — the wordmark, bleeding off the bottom edge. Full-bleed rather than
          gutter-bound, and clipped by the section so it can never widen the
          page. */}
      <motion.div
        {...rise(0.5)}
        aria-hidden
        className="relative z-20 h-[9.5vw] w-full overflow-hidden select-none"
      >
        <span className="absolute inset-x-0 bottom-[-0.19em] block text-center font-display text-[13.5vw] leading-[0.8] font-bold tracking-[-0.045em] whitespace-nowrap text-cream/[0.07]">
          {fuelHero.wordmark}
        </span>
      </motion.div>
    </section>
  );
}

export default FuelHero;
