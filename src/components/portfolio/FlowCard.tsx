"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import type { Flow } from "@/lib/portfolio-content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const STEP_MS = 380;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One capability flow. When the card scrolls into view the step chain "runs":
 * each chip warms to orange in turn, then the whole chain settles into a calm
 * completed state.
 *
 * The chain is a wrapping flex row rather than a scrolling one, so it reflows
 * onto as many lines as it needs and can never overflow horizontally.
 */
export function FlowCard({ flow, index }: { flow: Flow; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = usePrefersReducedMotion();

  // -1 = idle, 0..n-1 = that step is lighting up, n = settled.
  const [cursor, setCursor] = useState(-1);

  useEffect(() => {
    // Reduced motion never runs the sequence — `settled` is derived below
    // instead, so there's no state to set here.
    if (!inView || reduceMotion) return;

    // Stagger the four cards so they don't all fire at the same instant.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const lead = index * 220;

    flow.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setCursor(i), lead + i * STEP_MS));
    });
    timers.push(
      setTimeout(() => setCursor(flow.steps.length), lead + flow.steps.length * STEP_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [inView, reduceMotion, flow.steps, index]);

  // Reduced motion skips straight to the finished chain: every chip reads as
  // completed and nothing ever animates.
  const settled = reduceMotion || cursor >= flow.steps.length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay: (index % 2) * 0.08 }}
      className="flex h-full flex-col rounded-2xl border border-white/8 bg-surface p-6 shadow-soft sm:p-7"
    >
      <span className="font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
        Flow / {String(index + 1).padStart(2, "0")}
      </span>

      <h3 className="mt-4 text-2xl leading-[1.05] tracking-[-0.022em] text-cream sm:text-[1.75rem]">
        {flow.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-cream/70">{flow.description}</p>

      <ol className="mt-6 flex flex-wrap items-center gap-y-2.5">
        {flow.steps.map((step, i) => {
          const lit = i === cursor;
          const passed = settled || i < cursor;
          const on = lit || passed;

          return (
            <li key={step} className="flex items-center">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5",
                  "font-mono text-[0.6875rem] font-medium whitespace-nowrap",
                  "transition-[color,border-color,background-color,box-shadow,transform] duration-500 ease-out",
                  on
                    ? "border-primary/45 bg-primary/10 text-cream"
                    : "border-white/10 bg-black/25 text-cream/60",
                  // The moment of execution: brighter, lifted, faintly glowing.
                  lit && !settled && "scale-[1.06] border-primary shadow-glow",
                )}
              >
                <span
                  className={cn(
                    "tabular-nums transition-colors duration-500",
                    on ? "text-primary" : "text-cream/55",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </span>

              {i < flow.steps.length - 1 && (
                <span className="flex items-center gap-1 px-1" aria-hidden>
                  <span className="h-px w-1.5 bg-white/12" />
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-500",
                      passed ? "bg-primary" : "bg-white/20",
                      // Pulse on the connector the flow is crossing right now.
                      lit && !settled && "scale-150 bg-primary",
                    )}
                  />
                  <span className="h-px w-1.5 bg-white/12" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export default FlowCard;
