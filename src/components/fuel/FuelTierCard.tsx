"use client";

import { motion } from "framer-motion";

import { FuelBracketLink, fuelLabel } from "@/components/fuel/FuelPrimitives";
import { fuelPricing } from "@/lib/home-fuel-content";
import type { PricingTier } from "@/lib/pricing-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Splits "Starts at €799" into its qualifier and its figure so the figure can
 * be set at display size with the qualifier riding above it — the reference's
 * superscript-plus-huge-numeral treatment, adapted to prices that are ranges
 * and "starts at" values rather than flat monthly numbers.
 *
 * Anything that doesn't match (a price written without a currency mark) is
 * returned whole as the figure, so the card still renders correctly.
 */
function splitPrice(price: string) {
  const match = price.match(/^(.*?)\s*(€.*)$/);
  if (!match) return { qualifier: null, figure: price };
  return { qualifier: match[1] || null, figure: match[2] };
}

/**
 * One pricing tier.
 *
 * Shared by the homepage's (04) band and the /pricing page so the two can't
 * drift — a visitor who scrolls the homepage and then opens /pricing is looking
 * at the same offer, and any difference in how it's drawn reads as a different
 * offer.
 */
export function FuelTierCard({
  tier,
  index,
}: {
  tier: PricingTier;
  index: number;
}) {
  const highlighted = tier.featured === true;
  const { qualifier, figure } = splitPrice(tier.price);

  /* The highlighted card inverts to cream. Everything inside it therefore has
     to flip too — including the accent, since brand orange is ~1.8:1 on cream.
     Same override the cream bands elsewhere on the site use. */
  const ink = highlighted ? "text-ink" : "text-cream";
  const muted = highlighted ? "text-ink/65" : "text-cream/60";
  const faint = highlighted ? "text-ink/65" : "text-cream/55";
  const rule = highlighted ? "border-ink/15" : "border-cream/12";

  return (
    <motion.li
      {...enterProps("up", index * 0.07)}
      className={cn(
        "flex flex-col rounded-[3px] border p-6 sm:p-7",
        highlighted
          ? "border-transparent bg-cream [--accent-ink:var(--color-primary-darker)]"
          : "border-cream/12 bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className={cn("text-[1.125rem] font-semibold tracking-[-0.02em]", ink)}>
          {tier.name}
        </h3>
        {tier.badge && (
          <span
            className={cn(
              fuelLabel,
              "shrink-0 rounded-[2px] px-2 py-1.5",
              highlighted ? "bg-ink text-cream" : "bg-cream/10 text-cream/70",
            )}
          >
            {tier.badge}
          </span>
        )}
      </div>

      {tier.bestFor && (
        <p className={cn("mt-3 text-[0.8125rem] leading-[1.5]", muted)}>
          {tier.bestFor}
        </p>
      )}

      {/* The figure. `text-balance` is deliberately absent — a price is one
          unit and must never be broken across lines by the balancer. */}
      <div className="mt-7">
        {qualifier && <p className={cn(fuelLabel, faint)}>{qualifier}</p>}
        <p
          className={cn(
            "mt-2 font-display leading-[0.95] font-semibold tracking-[-0.035em]",
            // Ranges run three times the length of a single figure, so the
            // long ones step down rather than wrapping mid-number.
            figure.length > 10
              ? "text-[clamp(1.5rem,2.2vw,2rem)]"
              : "text-[clamp(2.25rem,3.4vw,3.25rem)]",
            ink,
          )}
        >
          {figure}
        </p>
      </div>

      <div className="mt-7">
        <FuelBracketLink
          href={tier.cta.href}
          tone={highlighted ? "light" : "dark"}
          className="max-w-none"
        >
          {tier.cta.label}
        </FuelBracketLink>
      </div>

      <p className={cn(fuelLabel, "mt-8", faint)}>{fuelPricing.includedLabel}</p>
      <ul className="mt-4 grow space-y-2.5">
        {tier.included.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span
              aria-hidden
              className={cn(
                "mt-px shrink-0 text-primary",
                highlighted && "text-primary-darker",
              )}
            >
              +
            </span>
            <span className={cn("text-[0.8125rem] leading-[1.5]", muted)}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      {tier.addOns.length > 0 && (
        <>
          <div className={cn("mt-7 border-t", rule)} aria-hidden />
          <p className={cn(fuelLabel, "mt-5", faint)}>{fuelPricing.addOnsLabel}</p>
          <ul className="mt-4 space-y-2.5">
            {tier.addOns.map((addOn) => (
              <li
                key={addOn.label}
                className="flex items-baseline justify-between gap-3"
              >
                <span className={cn("text-[0.8125rem] leading-[1.5]", muted)}>
                  {addOn.label}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[0.8125rem] font-medium tracking-[-0.01em]",
                    ink,
                  )}
                >
                  {addOn.price}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.li>
  );
}

export default FuelTierCard;
