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
};

export function Logo({ className, tone = "light", href = "/" }: LogoProps) {
  const mark = site.logoSrc ? (
    <Image
      src={site.logoSrc}
      alt={`${site.name} logo`}
      width={140}
      height={32}
      priority
      className={cn("h-8 w-auto", className)}
    />
  ) : (
    <span
      className={cn(
        "font-heading text-xl font-semibold tracking-[-0.02em] sm:text-[1.375rem]",
        tone === "onLight" ? "text-ink" : "text-cream",
        className,
      )}
    >
      Nex<span className="text-primary">CRAFT</span>
    </span>
  );

  if (!href) return mark;

  return (
    <Link
      href={href}
      aria-label={`${site.name} — home`}
      className="inline-flex shrink-0 items-center rounded-full"
    >
      {mark}
    </Link>
  );
}

export default Logo;
