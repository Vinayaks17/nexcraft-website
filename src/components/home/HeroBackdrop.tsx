"use client";

import { motion } from "framer-motion";

/**
 * Ambient hero background: three slow-drifting orange orbs over a dot grid and
 * a faint grain wash. Everything animates on transform/opacity only, so it
 * stays on the compositor and never triggers layout.
 *
 * Values are hand-picked (no randomness) so server and client render alike.
 */

type Orb = {
  className: string;
  drift: { x: number[]; y: number[]; scale: number[] };
  duration: number;
};

/* Deep amber rather than the light theme's pastel orange: on black an orb has
   to be a glow (saturated, low alpha, additive-looking) instead of a wash, or
   it just greys the background out. */
const ORBS: Orb[] = [
  {
    className:
      "left-[-12%] top-[-10%] h-[46rem] w-[46rem] bg-[radial-gradient(circle_at_center,rgba(255,122,32,0.30),transparent_66%)]",
    drift: { x: [0, 70, -30, 0], y: [0, 50, 90, 0], scale: [1, 1.08, 0.96, 1] },
    duration: 26,
  },
  {
    className:
      "right-[-14%] top-[6%] h-[38rem] w-[38rem] bg-[radial-gradient(circle_at_center,rgba(255,190,60,0.20),transparent_66%)]",
    drift: { x: [0, -60, 25, 0], y: [0, 70, -35, 0], scale: [1, 0.94, 1.1, 1] },
    duration: 32,
  },
  {
    className:
      "bottom-[-22%] left-[28%] h-[42rem] w-[42rem] bg-[radial-gradient(circle_at_center,rgba(190,72,18,0.30),transparent_66%)]",
    drift: { x: [0, 45, -55, 0], y: [0, -45, 25, 0], scale: [1, 1.06, 0.98, 1] },
    duration: 29,
  },
];

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Drifting colour orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl will-change-transform ${orb.className}`}
          animate={{ x: orb.drift.x, y: orb.drift.y, scale: orb.drift.scale }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          }}
        />
      ))}

      {/* Dot grid, faded out towards the edges. Very low alpha — a grid that
          reads as texture on white reads as a visible mesh on black. */}
      <div className="hero-dot-grid absolute inset-0 opacity-60" />

      {/* Grain so the gradients don't band. `screen` rather than `multiply`:
          multiplying noise into black is a no-op. */}
      <div className="hero-grain absolute inset-0 opacity-[0.06] mix-blend-screen" />

      {/* Veil: dark enough that cream headline text stays clear of contrast
          limits over the brightest part of an orb, and solid at the bottom so
          the section hands off cleanly to the page base below. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink" />
    </div>
  );
}

export default HeroBackdrop;
