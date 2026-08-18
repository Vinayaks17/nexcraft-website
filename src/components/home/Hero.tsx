"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { AccentWord } from "@/components/ui/AccentWord";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroMockup } from "@/components/home/HeroMockup";
import { hero } from "@/lib/home-content";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const word = {
  hidden: { opacity: 0, y: "0.5em", rotateX: -55 },
  visible: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
      <HeroBackdrop />

      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 pt-32 pb-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pt-36">
        <motion.div initial="hidden" animate="visible" variants={container}>
          <motion.p
            variants={fade}
            className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase"
          >
            <span className="h-px w-6 bg-primary" aria-hidden />
            {hero.eyebrow}
          </motion.p>

          {/* Scaled back at lg since the headline shares the row with the
              mockup; xl gets the size back once there's room again. */}
          <h1 className="mt-5 max-w-2xl text-[2.75rem] sm:text-6xl lg:text-[3.75rem] xl:text-[4.5rem]">
            {/* perspective + per-word rotateX gives the words a subtle "flip up" */}
            <span className="sr-only">
              {hero.headline.map((w) => w.text).join(" ")}
            </span>
            <span
              aria-hidden
              className="flex flex-wrap items-baseline gap-x-[0.24em] gap-y-1"
              style={{ perspective: "800px" }}
            >
              {hero.headline.map((w) => (
                <span key={w.text} className="inline-block overflow-hidden pb-[0.12em]">
                  <motion.span
                    variants={word}
                    className="inline-block will-change-transform"
                  >
                    {w.accent ? <AccentWord>{w.text}</AccentWord> : w.text}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            variants={fade}
            className="mono-lead mt-3.5 max-w-2xl text-cream/70 sm:mt-4"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div variants={fade} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={hero.primaryCta.href} size="lg" magnetic>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="highlight" size="lg" magnetic>
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </motion.div>

        {/* Mockup is desktop-only: on phones it would push the CTAs below the
            fold, and it carries no information the headline doesn't. */}
        <div className="hidden lg:block">
          <HeroMockup />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[0.625rem] font-medium tracking-[0.18em] text-cream/60 uppercase">
          {hero.scrollHint}
        </span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-cream/15"
        >
          <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
        </motion.span>
      </motion.div>
    </section>
  );
}

export default Hero;
