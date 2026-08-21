"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * The card-deck rollover: one section pins, the next slides up over it like a
 * card laid on a deck, and the one underneath recedes and dims as it is
 * covered.
 *
 * WHY ONLY TWO SECTIONS, AND WHY THESE TWO.
 *
 * A pinned card is `position: sticky; top: 0`, which engages the moment the
 * card's top reaches the viewport top. Anything below the fold at that instant
 * is then unreachable — the card is held still, so scrolling no longer moves
 * it. That makes one rule non-negotiable: **a card that pins must be no taller
 * than the viewport.** The card that rolls over has no such limit, because it
 * never pins.
 *
 * Measured at 1279x812, the homepage's bands run 1637 / 780 / 443 / 1862 /
 * 197 / 533 / 962 / 504 / 687 px. Exactly one contiguous pair has a short
 * first card, a simply-scrolling second card, and a change of ground colour
 * between them to make the card edge legible: (04) Who we are at 533px, pinning
 * under (05) Proof.
 *
 * The runs that look tempting and are not:
 *
 *   - anything through (02) Our work — it carries a `lg:sticky` rail and a
 *     `snap-x` carousel, and nesting a sticky rail inside a pinned card makes
 *     the rail resolve against a container that is itself frozen.
 *   - a three-card run ending at CTA band B — the middle card would be (05)
 *     Proof at 962px, which pins with its last ~150px permanently below the
 *     fold. Trimming Proof to fit would only move the failure to shorter
 *     laptops.
 *
 * WHAT IT COSTS ELSEWHERE. Pinning breaks two things that read geometry, and
 * both are fixed at the source rather than here: the scrollspy resolves the
 * active section by hit-testing the viewport rather than by page order, since
 * a pinned card keeps intersecting long after it is covered; and its jumps
 * measure `offsetTop` rather than `getBoundingClientRect`, since a pinned
 * element reports where it is *painted*, not where it lives.
 *
 * Off below `lg` and under reduced motion, where it renders as two ordinary
 * sections in normal flow. `useMediaQuery` is false during SSR, so that plain
 * version is also what the server sends — no hydration mismatch, and the
 * effect is an upgrade rather than something the page waits for.
 */
export function SectionRollover({
  base,
  over,
}: {
  /** The section that pins. Must be shorter than the viewport — see above. */
  base: ReactNode;
  /** The section that rides up over it. Any height. */
  over: ReactNode;
}) {
  const overRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const enabled = isDesktop && !reduceMotion;

  /* Progress across the covering move alone: 0 when the incoming card's top is
     at the bottom of the viewport, 1 when it reaches the top and the card
     beneath is fully hidden. Everything below is driven from this one value, so
     the recede, the dim and the corner radius stay in step by construction. */
  const { scrollYProgress } = useScroll({
    target: overRef,
    offset: ["start end", "start start"],
  });

  /* 0.96 is the whole move. The card has to read as *set down onto*, which is a
     few percent — past about 0.94 it stops looking like depth and starts
     looking like the section shrinking. */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  /* The radius is what sells the card, and it only exists while the edge is
     visible: it holds at 24px through the travel and flattens over the last
     8%, so the card arrives seated rather than parking with rounded corners
     against the top of the window. */
  const radius = useTransform(scrollYProgress, [0, 0.92, 1], [24, 24, 0]);

  /* The radius alone is not enough to sell the edge, and the reason is the
     recede: once the card underneath is scaled in by ~25px a side, the corner
     curve no longer has cream behind it — it rounds against the page's own
     black and disappears. A shadow cast upward off the incoming card's leading
     edge reads across the full width instead of only at the two corners, which
     is where the eye actually is. It lifts off as the card seats. */
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.92, 1],
    [
      "0 -24px 60px -12px rgba(0,0,0,0.7)",
      "0 -24px 60px -12px rgba(0,0,0,0.7)",
      "0 0px 0px 0px rgba(0,0,0,0)",
    ],
  );

  if (!enabled) {
    return (
      <>
        {base}
        {over}
      </>
    );
  }

  return (
    <div className="relative">
      {/* The sticky wrapper and the transformed child are separate elements on
          purpose: a transform on the sticky box itself is a containing block,
          and browsers disagree about what that does to the stick. */}
      <div className="sticky top-0 z-0">
        <motion.div style={{ scale, opacity }} className="origin-top">
          {base}
        </motion.div>
      </div>

      {/* z-10 and an opaque ground are what make this a card rather than a
          transparency: the section under it is still painted, directly behind. */}
      <motion.div
        ref={overRef}
        style={{
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          boxShadow: shadow,
        }}
        className="relative z-10 overflow-hidden"
      >
        {over}
      </motion.div>
    </div>
  );
}

export default SectionRollover;
