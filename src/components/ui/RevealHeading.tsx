"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { AccentWord } from "@/components/ui/AccentWord";
import { EASE, lineMaskChild } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Word = { text: string; accent: boolean };

const ACCENT_PATTERN = /\*([^*]+)\*/g;

/** Words, each tagged with whether it came from an *accent* phrase. */
function splitWords(text: string): Word[] {
  const out: Word[] = [];
  text.split(ACCENT_PATTERN).forEach((part, i) => {
    if (!part) return;
    const accent = i % 2 === 1;
    for (const token of part.split(/\s+/)) {
      if (token) out.push({ text: token, accent });
    }
  });
  return out;
}

type RevealHeadingProps = {
  /** Accent phrases in *asterisks*, same convention as renderAccent. */
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Seconds between consecutive lines. */
  stagger?: number;
  delay?: number;
};

/**
 * Display headline that reveals a line at a time, each line rising out from
 * behind its own clip.
 *
 * Lines aren't authored — they're measured. Every word gets its own clip, then
 * after layout the words are grouped by `offsetTop` so all words that actually
 * landed on the same visual line share one delay and rise in unison. That reads
 * as a line mask while surviving any reflow: change the viewport, the font, or
 * the copy and the grouping simply re-derives.
 *
 * The reveal is held until that measurement lands (one frame) so a heading
 * already on screen at mount can't start animating with the wrong delays and
 * then restart.
 */
export function RevealHeading({
  text,
  as: Tag = "h2",
  className,
  stagger = 0.08,
  delay = 0,
}: RevealHeadingProps) {
  const words = useMemo(() => splitWords(text), [text]);

  const ref = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lineIndex, setLineIndex] = useState<number[] | null>(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -60px 0px",
  });

  useEffect(() => {
    const measure = () => {
      const tops = wordRefs.current
        .slice(0, words.length)
        .map((el) => el?.offsetTop ?? 0);
      const rows = [...new Set(tops)].sort((a, b) => a - b);
      setLineIndex(tops.map((t) => rows.indexOf(t)));
    };

    measure();

    // Re-measure on reflow, but only while the reveal hasn't run: once the
    // words are at rest their delays no longer matter.
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [words.length]);

  const MotionTag = motion[Tag];
  const measured = lineIndex !== null;

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      /* No staggerChildren here: the delays are computed per word from the
         measured line index below, and a parent stagger would compound with
         them and drift the later lines out. */
      variants={{ hidden: {}, visible: {} }}
      initial="hidden"
      animate={measured && inView ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <span key={`${word.text}-${i}`}>
          {/* The clip. Padding on three sides gives descenders and the accent
              italic's overhang somewhere to live; the matching negative margin
              keeps the word's footprint — and so the line breaks — unchanged. */}
          <span
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className={cn(
              "inline-block overflow-hidden align-bottom",
              "px-[0.08em] pb-[0.18em] -mx-[0.08em] -mb-[0.18em]",
            )}
          >
            <motion.span
              className="inline-block"
              variants={lineMaskChild}
              // Words on the same visual line share a delay, so they rise as
              // one; framer's own stagger only knows DOM order.
              transition={{
                duration: 0.75,
                ease: EASE,
                delay: delay + (lineIndex?.[i] ?? 0) * stagger,
              }}
            >
              {word.accent ? <AccentWord>{word.text}</AccentWord> : word.text}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </MotionTag>
  );
}

export default RevealHeading;
