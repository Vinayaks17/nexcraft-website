"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { fuelLabel } from "@/components/fuel/FuelPrimitives";
import { cn } from "@/lib/utils";

/**
 * The site's secondary link: a mono label, a rule that draws in from the left
 * on hover, and an arrow that steps forward with it.
 *
 * These were a scatter of near-identical class strings — a static underline
 * plus a colour change, written slightly differently in six places. One
 * component makes them behave identically and gives the rule somewhere to
 * animate from: a real `<span>` scaled on the x axis, rather than
 * `text-decoration`, which cannot be animated.
 *
 * Both moves are transform-only, so the global `prefers-reduced-motion` block
 * flattens them to an instant state change and the link stays exactly as
 * legible.
 */
export function MonoArrowLink({
  href,
  children,
  tone = "dark",
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  /** `light` = sitting on the cream or orange ground. */
  tone?: "dark" | "light";
  /** Force the anchor form; https/mailto/tel are detected on their own. */
  external?: boolean;
  className?: string;
}) {
  /* Contrast floor for 11px mono — see the note on fuelLabel. */
  const ink = tone === "light" ? "text-ink/70" : "text-cream/60";
  const hover = tone === "light" ? "hover:text-ink" : "hover:text-primary";
  const rule = tone === "light" ? "bg-ink/25" : "bg-cream/25";
  const ruleHot = tone === "light" ? "bg-ink" : "bg-primary";

  const inner = (
    <>
      <span className="inline-flex items-center gap-2">
        {children}
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 ease-out group-hover/mono:translate-x-1"
        >
          →
        </span>
      </span>

      {/* Two rules stacked: the resting hairline, and the brand one that wipes
          across it. Scaling from the left is what makes it read as drawn
          rather than as switched on. */}
      <span className={cn("relative mt-2 block h-px w-full", rule)}>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 origin-left scale-x-0 transition-transform duration-400 ease-out",
            "group-hover/mono:scale-x-100",
            ruleHot,
          )}
        />
      </span>
    </>
  );

  const classes = cn(
    fuelLabel,
    "group/mono inline-block transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
    ink,
    hover,
    className,
  );

  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        {...(/^https?:/.test(href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

export default MonoArrowLink;
