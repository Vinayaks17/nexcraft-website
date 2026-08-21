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
 * THE PLATE IS NOT DECORATION. The delivered artwork is charcoal facets with
 * orange accents on transparency, drawn for a light ground: measured against
 * this site's #0a0a0a it is 1.82:1 for the body and 0.93:1 for the darkest
 * facets, so on a dark band the fox reads as a floating orange zigzag with no
 * animal attached. Cream behind it hands back the ground it was designed for
 * and leaves every colour in the mark exactly as drawn — which recolouring or
 * brightening the artwork, the two other ways out, would not.
 *
 * On the cream bands the plate would be a square of the same colour as the
 * band, so there it drops away and the mark sits directly on the ground it
 * already suits.
 */
export function Logo({
  className,
  tone = "light",
  href = "/",
  size = 30,
}: LogoProps) {
  const onLight = tone === "onLight";

  const mark = site.logoSrc ? (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        // The plate, and only where it is needed.
        onLight ? "bg-transparent" : "rounded-[7px] bg-cream",
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={site.logoSrc}
        alt=""
        width={size}
        height={size}
        priority
        className="h-[72%] w-auto object-contain"
      />
    </span>
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
