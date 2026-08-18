"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Button } from "@/components/ui/Button";
import { PricingCard } from "@/components/pricing/PricingCard";
import {
  automationTier,
  pricingCta,
  reassurances,
  websiteTiers,
} from "@/lib/pricing-content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PricingSection() {
  return (
    <>
      <SectionWrapper spacing="none" animate={false} width="wide" className="pb-8">
        {/* Featured card scales up 3%, so the row needs headroom to avoid clipping
            the badge and the lifted edges. */}
        <div className="grid items-stretch gap-6 pt-4 lg:grid-cols-3 lg:gap-5 lg:pt-6">
          {websiteTiers.map((tier, i) => (
            <PricingCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        <div className="mt-6 lg:mt-8">
          <PricingCard tier={automationTier} index={3} tone="spotlight" />
        </div>
      </SectionWrapper>

      {/* Reassurance strip */}
      <SectionWrapper spacing="sm" animate={false} width="wide">
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center justify-center gap-3 rounded-full border border-white/8 bg-surface px-6 py-4 sm:flex-row sm:gap-8"
        >
          {reassurances.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="gradient-brand flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-on-brand">
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
              </span>
              <span className="mono-caption text-cream/90">{item}</span>
            </li>
          ))}
        </motion.ul>
      </SectionWrapper>

      {/* Closing mini-CTA */}
      <SectionWrapper spacing="lg" animate={false} width="wide">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          <RevealHeading
            text={pricingCta.heading}
            as="h2"
            className="text-[2rem] sm:text-4xl lg:text-5xl"
          />
          <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/70">
            {pricingCta.description}
          </p>
          <div className="mt-8">
            <Button href={pricingCta.cta.href} size="lg">
              {pricingCta.cta.label}
            </Button>
          </div>
        </motion.div>
      </SectionWrapper>
    </>
  );
}

export default PricingSection;
