import type { Transition, Variants } from "framer-motion";

/** The site's easing curve. One curve everywhere is most of what makes a set
 *  of animations read as one system rather than several. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Springy, slightly bouncy — buttons and other micro-interactions. */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 26,
  mass: 0.7,
};

/** Softer spring — navbar morphing, larger surfaces. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

/** Magnetic pull and other cursor-tracked values — heavily damped, no wobble. */
export const springMagnetic: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 18,
  mass: 0.5,
};

/** Smooth tween for opacity/colour crossfades. */
export const easeOutSmooth: Transition = {
  duration: 0.45,
  ease: EASE,
};

/** Scroll-into-view fade up, shared by SectionWrapper and friends. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Parent that staggers its children (mobile menu, footer columns, ...). */
export const staggerContainer = (stagger = 0.07, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

/* -------------------------------------------------------------------------
   Section entrances
------------------------------------------------------------------------- */

/**
 * Entrance flavours. Varying the direction section to section is what stops a
 * long page reading as one uniform fade-up repeated fifteen times — the
 * movement is small enough that no single section calls attention to itself,
 * but the page as a whole stops feeling mechanical.
 */
export type EnterFrom = "up" | "left" | "right" | "scale" | "fade";

/**
 * A horizontal entrance on a full-width section is transiently wider than the
 * viewport, so the offset is kept small and `html { overflow-x: clip }` (see
 * globals.css) guarantees it can never turn into a sideways pan. `clip` rather
 * than `hidden` because hidden would make the root a scroll container and take
 * the sticky automation panel with it.
 */
const enterInitial: Record<EnterFrom, Record<string, number>> = {
  up: { opacity: 0, y: 34 },
  left: { opacity: 0, x: -26 },
  right: { opacity: 0, x: 26 },
  scale: { opacity: 0, scale: 0.965 },
  fade: { opacity: 0 },
};

/**
 * Spread onto a motion element for a scroll-triggered entrance.
 *
 * Every transform here is one MotionConfig `reducedMotion="user"` strips
 * automatically, so reduced-motion users get the opacity fade and nothing else
 * without any call site having to branch.
 */
export function enterProps(from: EnterFrom = "up", delay = 0) {
  return {
    initial: enterInitial[from],
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15, margin: "0px 0px -80px 0px" } as const,
    // Kept under 400ms of delay + most of the duration so content is never
    // meaningfully withheld from a reader who scrolled straight to it.
    transition: { duration: 0.7, ease: EASE, delay },
  };
}

/** Media settling out of a slight over-scale as it fades in. */
export const mediaReveal = {
  initial: { opacity: 0, scale: 1.04 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.2, margin: "0px 0px -60px 0px" } as const,
  transition: { duration: 0.9, ease: EASE },
};

/* -------------------------------------------------------------------------
   Line-mask heading reveal
------------------------------------------------------------------------- */

/** Parent of a set of clipped lines. See components/ui/RevealHeading. */
export const lineMaskParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/**
 * One line sliding up from behind its own overflow-hidden clip.
 *
 * 130%, not 100%: the clip box carries a little bottom padding so descenders
 * aren't sheared off at rest, and the resting word has to start below *that*
 * extended edge or its ascenders peek out before the reveal begins.
 */
export const lineMaskChild: Variants = {
  hidden: { y: "130%" },
  visible: { y: "0%", transition: { duration: 0.75, ease: EASE } },
};
