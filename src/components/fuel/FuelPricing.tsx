"use client";

import { motion } from "framer-motion";

import {
  FuelSectionHeader,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { FuelTierCard } from "@/components/fuel/FuelTierCard";
import { fuelPricing, sectionIndex } from "@/lib/home-fuel-content";
import { pricingTiers } from "@/lib/pricing-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (05) Pricing — the homepage band.
 *
 * The cards themselves are FuelTierCard, shared with /pricing. This component
 * is only the band around them.
 */
export function FuelPricing() {
  const section = sectionIndex.pricing;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-ink py-20 sm:py-24 lg:py-32"
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} />

        {/* Cards are top-aligned, not stretched: the tiers genuinely carry
            different amounts of content and forcing them to one height would
            leave three columns of dead space under the shortest list. */}
        <ul className="mt-12 grid grid-cols-1 items-start gap-6 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
          {pricingTiers.map((tier, i) => (
            <FuelTierCard key={tier.id} tier={tier} index={i} />
          ))}
        </ul>

        <motion.p
          {...enterProps("fade", 0.1)}
          className={cn(fuelLabel, "mt-10 text-cream/55")}
        >
          {fuelPricing.note}
        </motion.p>
      </div>
    </section>
  );
}

export default FuelPricing;
