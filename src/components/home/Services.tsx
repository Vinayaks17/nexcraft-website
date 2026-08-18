"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AutomationShowcase } from "@/components/home/AutomationShowcase";
import { PhoneMockups } from "@/components/home/PhoneMockups";
import { services } from "@/lib/home-content";
import { enterProps } from "@/lib/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-28">
      <SectionWrapper spacing="lg" animate={false} as="div">
        <motion.div
          {...enterProps("left")}
        >
          <SectionHeading
            eyebrow={services.eyebrow}
            heading={services.heading}
            align="center"
          />
        </motion.div>

        {/* Website development intro */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-14 overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-soft"
        >
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14 lg:p-12">
            {/* Copy + checklist share the left column now; the phones take the right. */}
            <div>
              <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
                <span className="h-px w-6 bg-primary" aria-hidden />
                {services.web.eyebrow}
              </span>
              <RevealHeading
                text={services.web.title}
                as="h3"
                className="mt-4 text-3xl leading-[1.05] tracking-[-0.022em] sm:text-4xl"
              />
              <p className="mono-caption mt-4 max-w-xl text-cream/70">
                {services.web.description}
              </p>

              <ul className="mt-7 flex flex-col gap-3">
                {services.web.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="mono-caption flex items-start gap-3 rounded-2xl border border-white/8 bg-surface-raised p-3.5 text-cream/85"
                  >
                    <span className="gradient-brand mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-on-brand">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <PhoneMockups />
          </div>
        </motion.div>
      </SectionWrapper>

      {/* Automation cube showcase */}
      <div className="pb-20 lg:pb-28">
        <AutomationShowcase />
      </div>
    </section>
  );
}

export default Services;
