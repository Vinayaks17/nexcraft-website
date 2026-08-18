"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { enterProps, type EnterFrom } from "@/lib/motion";

type SectionWrapperProps = {
  children: React.ReactNode;
  /** Extra classes for the inner content container. */
  className?: string;
  /** Extra classes for the outer <section> (backgrounds, overflow, ...). */
  outerClassName?: string;
  id?: string;
  /** Max content width. */
  width?: "content" | "wide" | "narrow" | "full";
  /** Vertical rhythm. */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Disable the entrance entirely (e.g. above-the-fold hero). */
  animate?: boolean;
  /**
   * Which direction the section enters from. Varying this down a page is what
   * keeps a long scroll from reading as the same fade-up fifteen times.
   */
  enterFrom?: EnterFrom;
  /** Semantic element to render. */
  as?: "section" | "div" | "article" | "footer" | "header";
};

const widths: Record<NonNullable<SectionWrapperProps["width"]>, string> = {
  narrow: "max-w-3xl",
  content: "max-w-[1280px]",
  wide: "max-w-[1440px]",
  full: "max-w-none",
};

const spacings: Record<NonNullable<SectionWrapperProps["spacing"]>, string> = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
};

/**
 * Consistent section shell: max-width, gutters and a scroll-into-view fade-up
 * that only plays once. Reused by every section across the site.
 */
export function SectionWrapper({
  children,
  className,
  outerClassName,
  id,
  width = "content",
  spacing = "md",
  animate = true,
  enterFrom = "up",
  as = "section",
}: SectionWrapperProps) {
  const Outer = as;

  const inner = (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        widths[width],
        className,
      )}
    >
      {children}
    </div>
  );

  return (
    <Outer id={id} className={cn("relative w-full", spacings[spacing], outerClassName)}>
      {/* NB: this branch must depend only on props — deriving it from
          useReducedMotion() would render a different tree on the server than
          on the client and break hydration. MotionConfig (see MotionProvider)
          reduces this to a plain fade for users who ask for less motion. */}
      {animate ? (
        <motion.div {...enterProps(enterFrom)}>{inner}</motion.div>
      ) : (
        inner
      )}
    </Outer>
  );
}

export default SectionWrapper;
