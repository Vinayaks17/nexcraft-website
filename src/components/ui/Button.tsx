"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";

const MotionLink = motion.create(Link);

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "highlight"
  | "ghost"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold tracking-[-0.01em] whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,box-shadow] duration-300 ease-out " +
  /* A plain opacity fade would drag the label's contrast against its own
     button down to ~2.8:1 on black, so disabled gets a real surface instead. */
  "disabled:pointer-events-none disabled:bg-none disabled:bg-cream/12 disabled:text-cream/60 " +
  "disabled:shadow-none disabled:ring-0";

const variants: Record<ButtonVariant, string> = {
  /**
   * Signature orange gradient. The label is a warm near-black, not white:
   * white on #ff924d is ~2:1, which fails AA badly at any size, while
   * --color-on-brand clears 6:1 against the darkest stop of the gradient.
   */
  primary:
    "gradient-brand text-on-brand shadow-soft hover:shadow-glow " +
    "before:absolute before:inset-0 before:rounded-full before:bg-primary-light before:opacity-0 " +
    "before:transition-opacity before:duration-300 hover:before:opacity-100",
  /** Cream — the light counterweight, and the only button that reads on the orange band. */
  secondary: "bg-cream text-ink shadow-soft hover:bg-white hover:shadow-lift",
  /**
   * Kept as an alias of `secondary` so the many call sites that ask for
   * "highlight" keep working. The yellow it used to name is gone from the
   * palette entirely.
   */
  highlight: "bg-cream text-ink shadow-soft hover:bg-white hover:shadow-lift",
  /** Quiet text button. */
  ghost: "bg-transparent text-cream hover:bg-cream/10 hover:text-primary",
  /** Cream outline. */
  outline:
    "bg-transparent text-cream ring-1 ring-inset ring-cream/25 hover:ring-primary hover:text-primary hover:bg-primary/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  /** Renders a next/link (internal) or a plain anchor (off-site). */
  href?: string;
  /**
   * Force the anchor form. Rarely needed: any `https:`, `mailto:` or `tel:`
   * href is detected as off-site on its own.
   */
  external?: boolean;
  /**
   * Cursor-proximity pull. Opt-in rather than automatic: it belongs on the few
   * CTAs a page is actually steering toward, and stops reading as deliberate
   * the moment every button on screen is doing it.
   */
  magnetic?: boolean;
};

type ButtonProps = CommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps | "onAnimationStart" | "onDragStart" | "onDrag" | "onDragEnd"
  >;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  magnetic = false,
  ...props
}: ButtonProps) {
  /* Scale/lift are transforms, so MotionConfig's reducedMotion="user" skips
     them automatically — no need to branch on the media query here (which
     would desync server and client renders). */
  const interaction = {
    whileHover: { scale: 1.04, y: -2 },
    whileTap: { scale: 0.97, y: 0 },
    transition: springSnappy,
  };

  const classes = cn(base, sizes[size], variants[variant], className);
  /* Keeps the label above the ::before hover layer on the gradient variant. */
  const content = <span className="relative z-10 inline-flex items-center gap-2">{children}</span>;

  const wrap = (node: React.ReactElement) =>
    magnetic ? <Magnetic>{node}</Magnetic> : node;

  if (href) {
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    /* A new tab for real web destinations only. Every booking CTA on the site
       is a Calendly URL, and sending the visitor away from the page they were
       reading to fill in a scheduling form is how you lose both. mailto: and
       tel: hand off to another app and would only leave a blank tab behind. */
    const newTab = isExternal && /^https?:/.test(href);

    if (isExternal) {
      return wrap(
        <motion.a
          href={href}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...interaction}
        >
          {content}
        </motion.a>,
      );
    }

    return wrap(
      <MotionLink href={href} className={classes} {...interaction}>
        {content}
      </MotionLink>,
    );
  }

  return wrap(
    <motion.button className={classes} {...interaction} {...props}>
      {content}
    </motion.button>,
  );
}

export default Button;
