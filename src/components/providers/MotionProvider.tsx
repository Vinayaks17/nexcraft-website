"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * `reducedMotion="user"` makes every framer-motion animation in the tree honour
 * the OS "reduce motion" setting (transforms/opacity are skipped, layout
 * animations become instant).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export default MotionProvider;
