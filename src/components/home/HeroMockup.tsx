"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap } from "lucide-react";

import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

/** Parent timeline — children assemble in sequence once the hero lands. */
const assemble = {
  hidden: {},
  visible: { transition: { delayChildren: 0.45, staggerChildren: 0.13 } },
};

const chrome = {
  hidden: { opacity: 0, scale: 0.94, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 22 },
  },
} as const;

const navBar = {
  hidden: { opacity: 0, y: -18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
} as const;

const heroBlock = {
  hidden: { opacity: 0, scale: 0.86 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 20 },
  },
} as const;

const cardsRow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const card = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
} as const;

const chip = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 18 },
  },
} as const;

/**
 * Stylised browser window showing a miniature site assembling itself.
 * Pure DOM — no image, no second WebGL context.
 */
export function HeroMockup() {
  const reduceMotion = usePrefersReducedMotion();
  // Pointer parallax is a desktop affordance; touch devices never fire it.
  const isDesktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pointer parallax, spring-smoothed. -0.5..0.5 relative to the mockup centre.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 18, mass: 0.6 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [10, -2]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [-6, 8]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  /* Tracked against the viewport rather than the mockup's own box, so the tilt
     follows the pointer while it's anywhere over the hero — hovering the
     headline moves it too. Writes to motion values only, never React state, so
     no re-render per pointer event. */
  useEffect(() => {
    if (reduceMotion || !isDesktop) return;

    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5);
      pointerY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, isDesktop, pointerX, pointerY]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      // Decorative: the real content is the headline beside it.
      aria-hidden
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={assemble}
        style={{
          perspective: 1400,
          // Static base tilt lives here so the pointer springs stay centred on 0.
          transformStyle: "preserve-3d",
        }}
      >
        {/* Outer layer: pointer parallax */}
        <motion.div
          style={
            reduceMotion
              ? undefined
              : { rotateX, rotateY, x: translateX, y: translateY, transformPerspective: 1400 }
          }
          className="relative"
        >
          {/* Inner layer: slow idle float, kept separate so it can't fight the
              parallax transform on the same element. */}
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              variants={chrome}
              className="relative overflow-hidden rounded-2xl bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
              style={{ rotate: "-1.5deg" }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-3 border-b border-white/8 bg-surface-raised px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex h-6 flex-1 items-center rounded-full bg-ink px-3 ring-1 ring-white/8">
                  <span className="font-heading text-[0.625rem] font-medium text-cream/55">
                    nexcraft.dev
                  </span>
                </div>
              </div>

              {/* Miniature page */}
              <div className="space-y-3 p-4">
                {/* Nav */}
                <motion.div variants={navBar} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="gradient-brand h-3 w-3 rounded" />
                    <span className="h-2 w-12 rounded-full bg-cream/80" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-8 rounded-full bg-cream/25" />
                    <span className="h-1.5 w-8 rounded-full bg-cream/25" />
                    <span className="h-1.5 w-8 rounded-full bg-cream/25" />
                    <span className="h-4 w-12 rounded-full bg-cream" />
                  </div>
                </motion.div>

                {/* Hero block */}
                <motion.div
                  variants={heroBlock}
                  className="gradient-brand relative overflow-hidden rounded-xl p-4"
                >
                  <div className="absolute -top-6 -right-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
                  <span className="block h-2 w-16 rounded-full bg-white/50" />
                  <span className="mt-2.5 block h-3.5 w-40 rounded-full bg-white/90" />
                  <span className="mt-1.5 block h-3.5 w-28 rounded-full bg-white/70" />
                  <div className="mt-3.5 flex gap-2">
                    <span className="h-5 w-20 rounded-full bg-white" />
                    <span className="h-5 w-16 rounded-full bg-white/35" />
                  </div>
                </motion.div>

                {/* Content cards */}
                <motion.div variants={cardsRow} className="grid grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      variants={card}
                      className="rounded-lg border border-white/8 bg-surface-raised p-2.5"
                    >
                      <span className="block h-4 w-4 rounded bg-primary/60" />
                      <span className="mt-2 block h-1.5 w-full rounded-full bg-cream/30" />
                      <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-cream/15" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating chips, each on its own drift offset */}
          <motion.div
            variants={chip}
            className="absolute -top-4 -left-6 lg:-left-10"
            animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 rounded-full bg-cream px-3.5 py-2 shadow-lift">
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-primary-dark/60"
                  animate={reduceMotion ? undefined : { scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-dark" />
              </span>
              <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.06em] text-ink">
                Automation: ON
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={chip}
            className="absolute -right-4 -bottom-5 lg:-right-8"
            animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <div className="gradient-brand flex items-center gap-2 rounded-full px-3.5 py-2 text-on-brand shadow-glow">
              <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="font-mono text-[0.6875rem] font-semibold tracking-[0.06em]">Built in 3 weeks</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HeroMockup;
