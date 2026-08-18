import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The site's one link-hover treatment: the label slides up out of its own clip
 * while an orange copy rises into its place.
 *
 * Two copies stacked in normal flow inside a fixed-height window, both moving
 * by exactly one window height — so the pair travels as a unit and no absolute
 * positioning has to be kept in sync with the text metrics. The window is a
 * little taller than the line so descenders aren't shaved off at rest.
 *
 * Pure CSS transitions, which the global prefers-reduced-motion block already
 * flattens to ~0ms — no per-call-site branching needed.
 *
 * The parent link must carry `group/link`.
 */
export function SlideLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const copy =
    "block h-[1.35em] leading-[1.35em] transition-transform duration-300 ease-out " +
    "group-hover/link:-translate-y-full group-focus-visible/link:-translate-y-full";

  return (
    <span className={cn("relative block h-[1.35em] overflow-hidden", className)}>
      <span className={copy}>{children}</span>
      <span className={cn(copy, "text-primary")} aria-hidden>
        {children}
      </span>
    </span>
  );
}

export default SlideLabel;
