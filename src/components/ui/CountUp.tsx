"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { usePrefersReducedMotion } from "@/lib/hooks";

const DURATION = 1200;
/** Ease-out cubic — fast off the mark, long settle. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Splits a stat like "15+" or "2024" into a number to count and the characters
 * that bracket it. Anything without digits ("India") comes back numberless
 * and is rendered untouched.
 */
function parse(value: string) {
  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  return { prefix, suffix, target: Number(digits.replace(/,/g, "")), grouped: digits.includes(",") };
}

/**
 * Counts a stat up from zero the first time it scrolls into view.
 *
 * Renders the final value on the server and for reduced-motion users, so the
 * number is never withheld — the animation is an enhancement on top of correct
 * static output, not the thing that produces it.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!parsed || !inView || reduceMotion) return;

    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / DURATION, 1);
      setDisplay(Math.round(ease(t) * parsed.target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `parsed` is derived from `value` and stable for a given one.
  }, [inView, reduceMotion, parsed?.target, value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!parsed) return <span className={className}>{value}</span>;

  const shown = display === null ? parsed.target : display;

  return (
    <span ref={ref} className={className}>
      {/* The real value stays in the accessible name throughout, so a screen
          reader is never read a half-finished number. */}
      <span aria-hidden>
        {parsed.prefix}
        {parsed.grouped ? shown.toLocaleString("en-US") : shown}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

export default CountUp;
