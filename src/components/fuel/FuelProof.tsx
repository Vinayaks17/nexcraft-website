"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CountUp } from "@/components/ui/CountUp";
import {
  FuelSectionHeader,
  fuelHeadline,
  fuelLabel,
  fuelNumeral,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { fuelProof, fuelTestimonials, sectionIndex } from "@/lib/home-fuel-content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, enterProps, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** How long a quote holds before the carousel advances itself. */
const ROTATE_MS = 7000;

/**
 * (05) Proof — the quote and the numbers, in one band.
 *
 * These were two sections until F6: a testimonial carousel and a four-up stats
 * grid, each with its own header, meta row and 20-24rem of vertical padding,
 * both making the same argument. Merging them costs nothing — the quote is the
 * claim, the numerals are the evidence, and a reader who wants the second
 * without the first can take it in at a glance directly underneath.
 *
 * The quote half is switched off for launch (`showTestimonials` in
 * home-fuel-content) because the quotes are still placeholders. With it off the
 * band is the header and the numerals, and the row loses the hairline that
 * separated it from the carousel — that rule exists to divide two things, and
 * with one of them gone it would only sit under the header's own.
 *
 * The four figures are the ones the deleted stats band carried, minus its
 * paragraph of description per figure: at this size the label and one mono
 * qualifier say the same thing in a fifth of the height.
 */
export function FuelProof() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const section = sectionIndex.proof;

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
    if (!fuelProof.showTestimonials || reduceMotion || paused) return;
    const id = setInterval(() => go(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion, paused, go]);

  const current = fuelTestimonials[index];
  const { showTestimonials } = fuelProof;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-ink-alt py-20 sm:py-24 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} />

        {showTestimonials && (
        <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
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
            {/* A fixed minimum height keeps the hairline and the numerals row
                below from jumping as quotes of different lengths swap in. */}
            <div className="min-h-[13rem] sm:min-h-[15rem] lg:min-h-[16rem]">
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
                  <footer className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <cite className="text-[0.9375rem] font-medium tracking-[-0.01em] text-cream not-italic">
                      {current.name}
                    </cite>
                    <span className={cn(fuelLabel, "text-cream/55")}>
                      {current.role}
                    </span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <RotateButton label={fuelProof.prevLabel} onClick={() => go(-1)}>
                <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
              </RotateButton>
              <RotateButton label={fuelProof.nextLabel} onClick={() => go(1)}>
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </RotateButton>
              <span className={cn(fuelLabel, "ml-2 text-cream/55")}>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </span>
            </div>

            <p aria-live="polite" className="sr-only">
              Testimonial {index + 1} of {count}.
            </p>
          </div>
        </div>
        )}

        {/* The numbers, full width under the quote. CountUp handles the odd one
            out on its own: "India" has no digits, so it renders untouched
            rather than counting to nothing, and the numeric three count up the
            first time the row scrolls into view. */}
        <dl
          className={cn(
            "grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4",
            showTestimonials
              ? "mt-14 border-t border-cream/12 pt-12 sm:mt-16"
              : "mt-12 sm:mt-16",
          )}
        >
          {fuelProof.stats.map((stat, i) => (
            /* `dt` precedes its `dd` in the DOM and the figure is pulled above
               it with `order` — a definition list whose term follows its
               definition is malformed, and the qualifier has to live inside the
               `dt` rather than beside it as a loose `<p>`, which is not a child
               a `<dl>` is allowed. Flex order buys the value-over-label look
               back at no semantic cost. */
            <motion.div
              key={stat.label}
              {...enterProps("up", i * 0.07)}
              className="flex flex-col"
            >
              <dt className="order-2 mt-4 text-[1.0625rem] font-semibold tracking-[-0.02em] text-cream">
                {stat.label}
                <span className={cn(fuelLabel, "mt-2 block text-cream/60")}>
                  {stat.sub}
                </span>
              </dt>
              <dd
                className={cn(
                  fuelNumeral,
                  "order-1 m-0",
                  // A word-valued figure ("India") is wider than any numeral
                  // beside it, so long values step down rather than overflow.
                  stat.value.length > 4
                    ? "text-[clamp(1.75rem,3vw,3rem)]"
                    : "text-[clamp(2.25rem,4.4vw,4rem)]",
                  "text-cream",
                )}
              >
                <CountUp value={stat.value} />
              </dd>
            </motion.div>
          ))}
        </dl>
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

export default FuelProof;
