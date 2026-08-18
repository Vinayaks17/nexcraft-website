"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { EASE } from "@/lib/motion";

/**
 * A chip that rides the cursor — lifted from the portfolio grid's own chip so
 * the two systems keep the same physics and the same look.
 *
 * A pointermove writes to motion values and never re-renders React, so this
 * stays off the render path entirely no matter how fast the pointer moves.
 * Mount it only when the pointer is fine and motion isn't reduced; the call
 * site decides that.
 */
export function FuelCursorChip({
  label,
  visible,
}: {
  label: string;
  visible: boolean;
}) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
        transition={{ duration: 0.18, ease: EASE }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-[2px] bg-white px-3 py-2 font-mono text-[0.625rem] tracking-[0.16em] text-ink uppercase shadow-lift"
      >
        <span aria-hidden>↗</span>
        {label}
      </motion.span>
    </motion.div>
  );
}

export default FuelCursorChip;
