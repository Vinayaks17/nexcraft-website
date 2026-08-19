"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CountUp } from "@/components/ui/CountUp";
import {
  FuelSectionMeta,
  fuelHeadline,
  fuelLabel,
  fuelNumeral,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import {
  fuelTestimonialSection,
  fuelTestimonials, sectionIndex } from "@/lib/home-fuel-content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, enterProps, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** How long a quote holds before the carousel advances itself. */
const ROTATE_MS = 7000;

export function FuelTestimonial() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const count = fuelTestimonials.length;
  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  /* Auto-advance is an enhancement, not the only way through: the arrows are
     always there. It stops entirely under reduced motion — an unrequested
     content change on a timer is exactly what that setting is asking us not to
     do — and pauses while the section is hovered or focused. */
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => go(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, paused, go]);

  const current = fuelTestimonials[index];

  return (
    <section
      className="bg-ink-alt py-20 sm:py-24 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={fuelShell}>
        <FuelSectionMeta {...sectionIndex.testimonial} />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Left rail — the standing flag that none of this is real yet. */}
          <motion.div {...enterProps("left")} className="lg:col-span-3">
            <p
              className={cn(
                fuelLabel,
                "inline-block rounded-[2px] border border-primary/40 bg-primary/10 px-2.5 py-2 text-primary",
              )}
            >
              Placeholder — pending client sign-off
            </p>
          </motion.div>

          <div className="lg:col-span-9">
            {/* A fixed minimum height keeps the hairline and the stats row
                below from jumping as quotes of different lengths swap in. */}
            <div className="min-h-[16rem] sm:min-h-[18rem] lg:min-h-[20rem]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className={cn(fuelHeadline, "text-cream")}>
                    <span aria-hidden>“</span>
                    {current.quote}
                    <span aria-hidden>”</span>
                  </p>
                  <footer className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <cite
                      className={cn(
                        "text-[0.9375rem] font-medium tracking-[-0.01em] text-cream not-italic",
                      )}
                    >
                      {current.name}
                    </cite>
                    <span className={cn(fuelLabel, "text-cream/50")}>
                      {current.role}
                    </span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-10 h-px w-full bg-cream/12" aria-hidden />

            {/* Controls left, stats right — the reference's bottom row. */}
            <div className="mt-8 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
              <div className="flex items-center gap-3">
                <RotateButton
                  label={fuelTestimonialSection.prevLabel}
                  onClick={() => go(-1)}
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
                </RotateButton>
                <RotateButton
                  label={fuelTestimonialSection.nextLabel}
                  onClick={() => go(1)}
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </RotateButton>
                <span className={cn(fuelLabel, "ml-2 text-cream/55")}>
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </span>
              </div>

              <dl className="flex flex-wrap gap-x-14 gap-y-8">
                {fuelTestimonialSection.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd
                      className={cn(
                        fuelNumeral,
                        "text-[clamp(2rem,3.4vw,3rem)] text-cream",
                      )}
                    >
                      <CountUp value={stat.value} />
                    </dd>
                    <dt className="mt-3 text-[0.9375rem] font-medium tracking-[-0.01em] text-cream">
                      {stat.label}
                    </dt>
                    <p className={cn(fuelLabel, "mt-2 text-cream/55")}>
                      {stat.sub}
                    </p>
                  </div>
                ))}
              </dl>
            </div>

            <p aria-live="polite" className="sr-only">
              Testimonial {index + 1} of {count}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RotateButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={springSnappy}
      className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-cream/25 text-cream transition-colors duration-200 hover:border-primary hover:text-primary"
    >
      {children}
    </motion.button>
  );
}

export default FuelTestimonial;
