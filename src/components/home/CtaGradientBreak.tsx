"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ctaPrimary } from "@/lib/home-content";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CtaGradientBreak() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.section
      className="gradient-brand relative isolate overflow-hidden [--accent-ink:var(--color-ink)]"
      // Oversized background so there is somewhere for the position to travel.
      style={{ backgroundSize: "180% 180%" }}
      animate={
        reduceMotion
          ? undefined
          : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
      }
      transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
    >
      {/* Ghost word. The track holds the word twice and travels exactly -50%,
          so the second copy lands where the first started and the loop has no
          seam. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="flex w-max"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="px-[3vw] font-display text-[26vw] leading-none font-semibold tracking-[-0.015em] whitespace-nowrap text-transparent uppercase select-none [-webkit-text-stroke:1.5px_rgba(31,15,2,0.20)]"
                >
                  {ctaPrimary.ghostWord}
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Soft light sweep for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,214,160,0.35),transparent_55%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-28">
        <RevealHeading
          text={ctaPrimary.heading}
          as="h2"
          className="max-w-3xl text-[2.25rem] text-on-brand sm:text-5xl lg:text-6xl"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mono-caption mt-5 max-w-xl text-on-brand-soft"
        >
          {ctaPrimary.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="mt-9"
        >
          <Magnetic>
            <Button href={ctaPrimary.cta.href} variant="secondary" size="lg">
              {ctaPrimary.cta.label}
            </Button>
          </Magnetic>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default CtaGradientBreak;
