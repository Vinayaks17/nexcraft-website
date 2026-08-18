import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one emphasised word (or short phrase) inside a headline: the same
 * grotesque as the rest of the line, set italic and painted brand orange.
 *
 * No size or leading correction any more — it shares the headline's family and
 * metrics, so it sits on the baseline without help. Only the italic's overhang
 * needs room, hence the trailing padding: the hero masks each word in an
 * `overflow-hidden` box for its entrance and would otherwise clip the last
 * glyph.
 *
 * Colour comes from `--accent-ink`, defaulting to brand orange. Sections that
 * aren't near-black override it on their own wrapper, because orange only has
 * the contrast to carry an accent against a dark ground: it is 1.8:1 on the
 * cream band and effectively invisible on the orange one. See the overrides in
 * CtaMinimalBreak (deeper orange) and CtaGradientBreak (near-black, where the
 * italic alone does the emphasising).
 */
export function AccentWord({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-accent italic",
        "text-[color:var(--accent-ink,var(--color-primary))]",
        "pr-[0.06em]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Matches an accent phrase written as *asterisks* in the content files. */
const ACCENT_PATTERN = /\*([^*]+)\*/g;

/**
 * Rich-text convention for headings: content modules wrap the accent phrase in
 * asterisks (`"Questions, *answered.*"`) and every heading renders through
 * this, so any section can carry an accent without a bespoke component.
 *
 * Splitting on a capturing group interleaves the captures with the plain text,
 * so odd indices are exactly the accent phrases.
 */
export function renderAccent(text: string): ReactNode {
  if (!text.includes("*")) return text;

  return text.split(ACCENT_PATTERN).map((part, i) => {
    if (part === "") return null;
    return i % 2 === 1 ? (
      <AccentWord key={i}>{part}</AccentWord>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

/** Plain-text version of an accented string — for `sr-only`, alt text, meta. */
export function stripAccent(text: string) {
  return text.replace(ACCENT_PATTERN, "$1");
}

export default AccentWord;
