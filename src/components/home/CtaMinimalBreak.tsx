"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { ctaMinimal } from "@/lib/home-content";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Deliberate breathing room — the quiet counterpart to the gradient band. */
export function CtaMinimalBreak() {
  return (
    <section className="bg-cream [--accent-ink:var(--color-primary-darker)]">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 py-24 text-center sm:px-8 lg:px-10 lg:py-40"
      >
        <RevealHeading
          text={ctaMinimal.heading}
          as="h2"
          className="max-w-2xl text-[2.25rem] text-ink sm:text-5xl lg:text-6xl"
        />
        <p className="mono-caption mt-5 max-w-lg text-ink/70">
          {ctaMinimal.description}
        </p>
        <div className="mt-10">
          <Button href={ctaMinimal.cta.href} size="lg">
            {ctaMinimal.cta.label}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

export default CtaMinimalBreak;
