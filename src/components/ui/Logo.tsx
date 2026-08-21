import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

type LogoProps = {
  className?: string;
  /** `onLight` inverts the wordmark for the cream CTA section. */
  tone?: "light" | "onLight";
  /** Wrap in a link to the homepage. */
  href?: string | null;
  /** Mark height in px. The wordmark scales with its own type. */
  size?: number;
};

/**
 * The lockup: the origami fox mark, then the wordmark.
 *
 * The mark joins the wordmark rather than replacing it, because it is a mark
 * and not a wordmark — it carries no letterforms, so on its own it would
 * leave the navbar with nothing that says the studio's name.
 *
 * NO PLATE. The previous pass put the mark on a cream chip because the artwork
 * is charcoal-on-transparent and disappears into a dark band. The client asked
 * for it plain, so plain is what this renders — on every ground, including the
 * near-black ones.
 *
 * What that costs is measured rather than guessed, and it is on the record so
 * nobody has to re-derive it. Sampling the mark's own pixels: the body facet is
 * rgb(72,72,72) and 52% of the drawing, which is 2.16:1 against #0a0a0a and
 * 2.30:1 against the footer's #000; a further 11% is pure black, at 1.06:1 and
 * 1.00:1 — that part of the fox is not dim on the footer, it is absent. Just
 * under 70% of the mark sits below 3:1 on the page's own background. Only the
 * orange accents, about a tenth of it, carry.
 *
 * So on dark the fox reads as its orange edges with the body implied. That is a
 * deliberate, sighted choice by the client, not an oversight — see the
 * comparison sheet committed with this change. If it is ever revisited, the
 * options are a plate (what this replaced), a lighter export of the artwork, or
 * accepting it; recolouring a delivered mark in CSS is the one to avoid.
 */
export function Logo({
  className,
  tone = "light",
  href = "/",
  size = 30,
}: LogoProps) {
  // Only the wordmark changes with the ground now; the mark is the mark.
  const onLight = tone === "onLight";

  const mark = site.logoSrc ? (
    <Image
      src={site.logoSrc}
      alt=""
      width={size}
      height={size}
      priority
      className="w-auto shrink-0 object-contain"
      style={{ height: size }}
    />
  ) : null;

  const lockup = (
    <span className="inline-flex items-center gap-2.5">
      {mark}
      <span
        className={cn(
          "font-heading text-xl font-semibold tracking-[-0.02em] sm:text-[1.375rem]",
          onLight ? "text-ink" : "text-cream",
          className,
        )}
      >
        Nex<span className="text-primary">CRAFT</span>
      </span>
    </span>
  );

  if (!href) return lockup;

  return (
    <Link
      href={href}
      aria-label={`${site.name} — home`}
      className="inline-flex shrink-0 items-center rounded-full"
    >
      {lockup}
    </Link>
  );
}

export default Logo;
