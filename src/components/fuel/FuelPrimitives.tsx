import type { ReactNode } from "react";
import Link from "next/link";

import { YEAR, sectionIndex, type SectionId } from "@/lib/home-fuel-content";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
   Layout

   The reference layout is near-full-bleed: a ~24px gutter at 1470, no narrow
   centred measure. `fuelShell` reproduces that while still using our own
   gutter steps, so a 390px phone keeps the 20px edge the rest of the site has.
   The cap is well above 1440 on purpose — at 1440 this is effectively edge to
   edge, which is the whole point of the grid.
------------------------------------------------------------------------- */

export const fuelShell = "mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-10";

/* -------------------------------------------------------------------------
   Type scale

   Derived from the reference's measured ramp at 1470px wide — 195 / 100 / 56 /
   16 / 12 — expressed as clamps so the same relationships hold at 390. Weight
   sits at 600-700 rather than the reference's 1000: Switzer is a normal-width
   grotesque and goes muddy at black weight in these sizes, where the previous
   face did not.
------------------------------------------------------------------------- */

/** Hero statement. 195px at 1470 ≈ 13vw. */
export const fuelDisplay =
  "font-display font-semibold leading-[0.9] tracking-[-0.04em] text-[clamp(2.75rem,9vw,8rem)]";

/** Section statement — the oversized two-liner that opens a band. */
export const fuelStatement =
  "font-display font-semibold leading-[0.95] tracking-[-0.035em] text-[clamp(2rem,6vw,5.75rem)]";

/** Headline — quotes, footer lead, archive rows. */
export const fuelHeadline =
  "font-display font-semibold leading-[1.02] tracking-[-0.03em] text-[clamp(1.625rem,3.8vw,3.375rem)]";

/** Big numerals — pricing figures and the stats grid. */
export const fuelNumeral =
  "font-display font-semibold leading-[0.88] tracking-[-0.035em] text-[clamp(2.5rem,6vw,5.5rem)]";

/** Body copy inside a band. */
export const fuelBody =
  "text-[0.9375rem] leading-[1.55] tracking-[-0.005em] sm:text-base";

/** The mono detail layer — every label, index and meta value on the page. */
export const fuelLabel =
  "font-mono text-[0.6875rem] leading-none tracking-[0.1em] uppercase";

/* -------------------------------------------------------------------------
   Section meta row

   The page's connective tissue: a hairline, then `◆ (0N)` / `(Section)` /
   `© 2026` on one line. Repeating it above every band is most of what makes
   the numbering read as a system rather than as decoration.

   Three columns rather than flex-between so the centre label is centred
   against the *page*, not against whatever the two outer labels happen to
   measure. Below `sm` the centre label carries the row on its own — at 390 the
   three-up collapses into an unreadable squeeze.
------------------------------------------------------------------------- */

export function FuelSectionMeta({
  section,
  className,
  tone = "dark",
}: {
  section: SectionId;
  className?: string;
  /** `light` = the band is cream and the row has to invert. */
  tone?: "dark" | "light";
}) {
  const { num, label } = sectionIndex[section];
  const rule = tone === "light" ? "bg-ink/15" : "bg-cream/15";
  const ink = tone === "light" ? "text-ink/70" : "text-cream/60";
  const strong = tone === "light" ? "text-ink" : "text-cream";

  return (
    <div className={className}>
      <div className={cn("h-px w-full", rule)} aria-hidden />
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-2 pt-4 sm:grid-cols-3",
          fuelLabel,
        )}
      >
        <p className={cn("flex items-center gap-2", strong)}>
          <span aria-hidden className="text-primary">
            ◆
          </span>
          ({num})
        </p>
        <p className={cn("sm:text-center", ink)}>({label})</p>
        <p className={cn("hidden sm:block sm:text-right", ink)}>© {YEAR}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Bracket link

   The reference's signature CTA: a label over a full-width rule with a small
   corner bracket floating at the right end. On hover the rule wipes in from
   the left in brand orange and the bracket steps outward.

   Both moves are transform/opacity only, so MotionConfig's reduced-motion pass
   and the global `prefers-reduced-motion` block leave a static, legible link.
------------------------------------------------------------------------- */

export function FuelBracketLink({
  href,
  children,
  className,
  tone = "dark",
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
  external?: boolean;
}) {
  const ink = tone === "light" ? "text-ink" : "text-cream";
  const rule = tone === "light" ? "bg-ink/25" : "bg-cream/25";

  const inner = (
    <>
      <span className="flex items-baseline justify-between gap-6">
        <span className="text-[0.9375rem] font-medium tracking-[-0.01em] sm:text-base">
          {children}
        </span>
        {/* The corner bracket — two borders on an empty box. */}
        <span
          aria-hidden
          className={cn(
            "mb-1 block h-2 w-2 border-t border-r transition-transform duration-300 ease-out",
            "group-hover/bracket:translate-x-1 group-hover/bracket:-translate-y-1",
            tone === "light" ? "border-ink/50" : "border-cream/50",
          )}
        />
      </span>

      <span className={cn("relative mt-3 block h-px w-full", rule)}>
        <span
          aria-hidden
          className="gradient-brand absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover/bracket:scale-x-100"
        />
      </span>
    </>
  );

  const classes = cn(
    "group/bracket block w-full max-w-[19rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
    ink,
    className,
  );

  // "#" is the not-yet-wired Calendly placeholder in site.ts — it has to stay
  // an anchor, since next/link would try to route to it.
  const isExternal = external ?? (/^(https?:|mailto:|tel:)/.test(href) || href === "#");

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

/* -------------------------------------------------------------------------
   Registration marks

   Small `+` ticks dropped on the grid. Purely decorative — they give the wide
   empty bands a sense of measured space, which is what stops full-bleed
   reading as unfinished.
------------------------------------------------------------------------- */

export function FuelTicks({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex items-center justify-between",
        tone === "light" ? "text-ink/25" : "text-cream/20",
        className,
      )}
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="text-xs leading-none select-none">
          +
        </span>
      ))}
    </div>
  );
}
