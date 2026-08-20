import type { ReactNode } from "react";
import Link from "next/link";

import { renderAccent } from "@/components/ui/AccentWord";

import { YEAR } from "@/lib/home-fuel-content";
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

/**
 * Section title — the plain-language heading in every band's header block.
 *
 * Deliberately a long way below `fuelStatement`: in most bands a marketing
 * statement follows it at 5.75rem, and the title has to read as the label on
 * the section rather than compete with the line under it.
 */
export const fuelSectionTitle =
  "font-display font-semibold leading-[1.05] tracking-[-0.03em] text-[clamp(1.75rem,3.2vw,2.75rem)]";

/** Body copy inside a band. */
export const fuelBody =
  "text-[0.9375rem] leading-[1.55] tracking-[-0.005em] sm:text-base";

/**
 * The mono detail layer — every label, index and meta value on the page.
 *
 * CONTRAST FLOOR: this renders at 11px, which WCAG treats as small text and
 * holds to 4.5:1. On our surfaces that means `text-cream/55` is the lowest
 * usable tone on any dark band (5.45:1 against the lightest of them, #141414)
 * and `text-ink/65` the lowest on the cream band (5.95:1). Anything fainter
 * fails — the whole first pass of this design used /40 and /45 and every one
 * of them came in between 2.65:1 and 4.05:1.
 */
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
  num,
  label,
  className,
  tone = "dark",
}: {
  /**
   * Two digits, e.g. "01". Rendered as `(01)`. Optional: pages that carry
   * their own numbered bands (about, estimate) would otherwise show a page
   * number and a band number at the same time, which reads as a numbering
   * mistake rather than as two scopes.
   */
  num?: string;
  label: string;
  className?: string;
  /** `light` = the band is cream and the row has to invert. */
  tone?: "dark" | "light";
}) {
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
          {num ? `(${num})` : null}
        </p>
        <p className={cn("sm:text-center", ink)}>({label})</p>
        <p className={cn("hidden sm:block sm:text-right", ink)}>© {YEAR}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Section header block

   Every numbered band on the homepage opens with this, and the consistency is
   the point: the meta row alone told a visitor which number they had reached
   and nothing about what it was for, which is exactly the note the client
   raised. Number, then a plain-language title, then one mono line describing
   what is below it.

   The title is the band's `h2`. Bands that also carry an oversized marketing
   statement (about, why, services) render that statement as a `<p>` underneath
   — it is a claim, not a heading, and demoting it keeps one `h2` per section.
------------------------------------------------------------------------- */

export function FuelSectionHeader({
  num,
  label,
  title,
  subline,
  tone = "dark",
  className,
  titleClassName,
}: {
  num?: string;
  label: string;
  title: string;
  subline: string;
  tone?: "dark" | "light";
  className?: string;
  titleClassName?: string;
}) {
  const ink = tone === "light" ? "text-ink" : "text-cream";
  /* The contrast floor for 11px mono — see the note on fuelLabel. */
  const faint = tone === "light" ? "text-ink/65" : "text-cream/60";

  return (
    <div className={className}>
      <FuelSectionMeta num={num} label={label} tone={tone} />

      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
        <h2 className={cn(fuelSectionTitle, ink, titleClassName)}>{title}</h2>
        <p className={cn(fuelLabel, "max-w-[46ch] leading-[1.5] sm:text-right", faint)}>
          {subline}
        </p>
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
   Page header

   The interior-page counterpart to the homepage hero: the numbered meta row,
   an oversized statement, and an optional intro. Every route below "/" opens
   with this, which is most of what makes the set read as one site rather than
   as a homepage plus seven others.

   The heading is a plain element rather than RevealHeading: this sits above
   the fold on a route the visitor navigated to deliberately, and a masked
   line-by-line reveal on arrival delays the one thing they came to read. The
   homepage hero can afford the entrance; a page header can't.
------------------------------------------------------------------------- */

export function FuelPageHeader({
  num,
  label,
  heading,
  intro,
  tone = "dark",
  children,
}: {
  num?: string;
  label: string;
  /** Accent phrases in *asterisks* — see renderAccent. */
  heading: string;
  intro?: string;
  tone?: "dark" | "light";
  /** Actions or extra detail, laid out under the intro. */
  children?: ReactNode;
}) {
  const ink = tone === "light" ? "text-ink" : "text-cream";
  const muted = tone === "light" ? "text-ink/70" : "text-cream/65";

  return (
    <header className={cn(fuelShell, "pt-32 pb-4 sm:pt-36 lg:pt-40")}>
      <FuelSectionMeta num={num} label={label} tone={tone} />

      <h1 className={cn(fuelStatement, "mt-12 max-w-[18ch] sm:mt-16", ink)}>
        {renderAccent(heading)}
      </h1>

      {intro && (
        <p className={cn(fuelBody, "mt-8 max-w-[52ch]", muted)}>{intro}</p>
      )}

      {children}
    </header>
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
