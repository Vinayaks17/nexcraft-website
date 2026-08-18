"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howItWorks } from "@/lib/home-content";
import { enterProps } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The line draws over 1.1s from 0.25s; a circle lights as the line reaches it. */
const LINE_DELAY = 0.25;
const LINE_DURATION = 1.1;
const circleDelay = (i: number, total: number) =>
  LINE_DELAY + (i / Math.max(1, total - 1)) * LINE_DURATION;

/**
 * The dot that runs the connector once the line has drawn. Wrapped in a
 * full-width element so `x: 0% -> 100%` resolves against the line's length
 * rather than the dot's own 8px — that keeps it a pure transform, with no
 * per-frame layout.
 */
function PulseDot({ vertical }: { vertical?: boolean }) {
  const axis = vertical ? { y: ["0%", "100%"] } : { x: ["0%", "100%"] };
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      animate={axis}
      transition={{
        duration: 4.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1.2,
        delay: LINE_DELAY + LINE_DURATION,
      }}
      aria-hidden
    >
      <span
        className={
          vertical
            ? "absolute top-0 -left-[3px] h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_3px_rgba(255,146,77,0.55)]"
            : "absolute -top-[3px] left-0 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_3px_rgba(255,146,77,0.55)]"
        }
      />
    </motion.div>
  );
}

export function HowItWorks() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(timelineRef, { once: true, amount: 0.35 });
  const reduceMotion = usePrefersReducedMotion();
  const total = howItWorks.steps.length;

  // Reduced motion lands everything at its rest state immediately.
  const on = reduceMotion || inView;

  return (
    <SectionWrapper id="how-it-works" spacing="lg" animate={false}>
      <motion.div
        {...enterProps("right")}
      >
        <SectionHeading
          eyebrow={howItWorks.eyebrow}
          heading={howItWorks.heading}
          intro={howItWorks.intro}
          align="center"
        />
      </motion.div>

      <div ref={timelineRef} className="relative mt-16">
        {/* Connecting line — horizontal on desktop, vertical on mobile.
            scaleX/scaleY only, so drawing it in costs no layout. */}
        <div
          className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-cream/12 lg:block"
          aria-hidden
        >
          <motion.div
            className="gradient-brand h-full origin-left"
            initial={{ scaleX: reduceMotion ? 1 : 0 }}
            animate={on ? { scaleX: 1 } : { scaleX: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: LINE_DURATION, ease: EASE, delay: LINE_DELAY }
            }
          />
          {on && !reduceMotion && <PulseDot />}
        </div>
        <div
          className="absolute top-4 bottom-8 left-7 w-px bg-cream/12 lg:hidden"
          aria-hidden
        >
          <motion.div
            className="gradient-brand w-full origin-top"
            initial={{ scaleY: reduceMotion ? 1 : 0 }}
            animate={on ? { scaleY: 1 } : { scaleY: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: LINE_DURATION, ease: EASE, delay: LINE_DELAY }
            }
          />
          {on && !reduceMotion && <PulseDot vertical />}
        </div>

        <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
          {howItWorks.steps.map((step, i) => {
            const delay = reduceMotion ? 0 : circleDelay(i, total);
            return (
              <motion.li
                key={step.number}
                initial="rest"
                animate={on ? "on" : "rest"}
                whileHover="hover"
                className="group flex gap-5 lg:flex-col lg:items-center lg:text-center"
              >
                {/* ring-8 ring-ink punches the circle out of the line behind it. */}
                <motion.span
                  variants={{
                    rest: { scale: reduceMotion ? 1 : 0.5 },
                    on: { scale: 1 },
                    hover: { scale: 1, y: -4 },
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 320, damping: 18, delay }
                  }
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-raised ring-8 ring-ink"
                >
                  {/* The fill warms from dark surface to the brand gradient as
                      the drawn line arrives — a crossfade, since a gradient
                      background-image can't be tweened from a flat colour. */}
                  <motion.span
                    className="gradient-brand absolute inset-0 rounded-full"
                    variants={{ rest: { opacity: 0 }, on: { opacity: 1 }, hover: { opacity: 1 } }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE, delay }
                    }
                    aria-hidden
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    variants={{
                      rest: { opacity: 0 },
                      on: { opacity: 1 },
                      hover: { opacity: 1 },
                    }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.45, delay }
                    }
                    style={{ boxShadow: "0 10px 34px -8px rgb(255 146 77 / 0.55)" }}
                    aria-hidden
                  />
                  <motion.span
                    className="relative font-mono text-lg leading-none font-medium"
                    variants={{
                      rest: { color: "rgba(242,237,228,0.45)" },
                      on: { color: "#1f0f02" },
                      hover: { color: "#1f0f02" },
                    }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.45, delay }
                    }
                  >
                    {step.number}
                  </motion.span>
                </motion.span>

                <motion.div
                  className="lg:max-w-xs"
                  variants={{
                    rest: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 },
                    on: { opacity: 1, y: 0 },
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.5, ease: EASE, delay: delay + 0.12 }
                  }
                >
                  <h3 className="font-heading text-xl leading-snug font-semibold">
                    {step.title}
                  </h3>
                  <p className="mono-caption mt-3 text-cream/70">
                    {step.description}
                  </p>
                </motion.div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </SectionWrapper>
  );
}

export default HowItWorks;
