"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { PricingTier } from "@/lib/pricing-content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type PricingCardProps = {
  tier: PricingTier;
  index: number;
  /**
   * `spotlight` is the full-width automation tier. Every card is a dark
   * surface now, so it can no longer stand apart by being the dark one — it
   * gets a warm surface behind an orange-tinted gradient hairline instead.
   */
  tone?: "surface" | "spotlight";
};

export function PricingCard({ tier, index, tone = "surface" }: PricingCardProps) {
  const spotlight = tone === "spotlight";

  const body = (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl p-6 sm:p-7",
        spotlight
          ? "bg-[linear-gradient(140deg,#1d1409_0%,#151515_58%)] shadow-lift"
          : tier.featured
            ? "border border-primary/45 bg-surface-raised shadow-lift ring-1 ring-primary/20"
            : "border border-white/8 bg-surface shadow-soft",
      )}
    >
      <h3 className="font-heading text-xl font-semibold text-cream">{tier.name}</h3>

      <p
        className={cn(
          "mt-3 font-display text-[1.75rem] leading-[1.1] font-medium tracking-[-0.008em] sm:text-[2rem]",
          tier.featured ? "text-gradient-brand" : "text-cream",
        )}
      >
        {tier.price}
      </p>

      {tier.bestFor && (
        <p className="mono-caption mt-3 text-cream/70">
          <span className="text-cream">Best for: </span>
          {tier.bestFor}
        </p>
      )}

      {/* Included */}
      <ul
        className={cn(
          "mt-6 flex flex-col gap-2.5",
          spotlight && "sm:grid sm:grid-cols-2 sm:gap-3",
        )}
      >
        {tier.included.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="gradient-brand mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-on-brand">
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
            </span>
            <span className="text-sm leading-relaxed text-cream/85">{item}</span>
          </li>
        ))}
      </ul>

      {/* Add-ons — visually demoted so they never compete with what's
          included. mt-auto pins this block and the CTA below it to the
          bottom, so uneven tier lengths leave one tidy gap rather than a
          ragged run of them. */}
      <div
        className={cn(
          "mt-auto rounded-2xl p-4 pt-4",
          spotlight
            ? "mt-6 bg-black/45 ring-1 ring-white/10"
            : "bg-black/30 ring-1 ring-white/6",
        )}
      >
        <p className="font-mono text-[0.625rem] font-medium tracking-[0.18em] text-primary uppercase">
          + Optional add-ons
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {tier.addOns.map((addOn) => (
            <li
              key={addOn.label}
              className="flex items-baseline justify-between gap-3 text-xs"
            >
              <span className="text-cream/65">{addOn.label}</span>
              <span className="shrink-0 font-heading font-medium text-cream/90 tabular-nums">
                {addOn.price}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-6">
        <Button
          href={tier.cta.href}
          variant={tier.featured ? "primary" : spotlight ? "secondary" : "outline"}
          size={spotlight ? "lg" : "md"}
          // Full-bleed on the wide spotlight card reads as a banner, not a button.
          className={cn("w-full", spotlight && "sm:w-auto sm:px-10")}
        >
          {tier.cta.label}
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.12 }}
      className={cn("relative h-full", tier.featured && "lg:z-10 lg:scale-[1.03]")}
    >
      {tier.badge && (
        <span className="gradient-brand absolute -top-3.5 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-1.5 font-mono text-[0.6875rem] font-semibold tracking-[0.08em] whitespace-nowrap text-on-brand uppercase shadow-lift">
          {tier.badge}
        </span>
      )}

      {/* 1px orange-tinted gradient hairline, drawn as a padded gradient
          backdrop — a plain border can't hold a gradient. */}
      {spotlight ? (
        <div className="h-full rounded-[calc(1rem+1px)] bg-[linear-gradient(140deg,rgba(255,146,77,0.6)_0%,rgba(255,146,77,0.12)_45%,rgba(255,255,255,0.07)_100%)] p-px">
          {body}
        </div>
      ) : (
        body
      )}
    </motion.div>
  );
}

export default PricingCard;
