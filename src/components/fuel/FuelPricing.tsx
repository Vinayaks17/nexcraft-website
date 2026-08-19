"use client";

import { motion } from "framer-motion";

import {
  FuelSectionMeta,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { FuelTierCard } from "@/components/fuel/FuelTierCard";
import { fuelPricing, sectionIndex } from "@/lib/home-fuel-content";
import { pricingTiers } from "@/lib/pricing-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * (04) Pricing — the homepage band.
 *
 * The cards themselves are FuelTierCard, shared with /pricing. This component
 * is only the band around them.
 */
export function FuelPricing() {
  return (
    <section id="pricing" className="bg-ink py-20 sm:py-24 lg:py-32">
      <div className={fuelShell}>
        <FuelSectionMeta {...sectionIndex.pricing} />

        {/* Cards are top-aligned, not stretched: the tiers genuinely carry
            different amounts of content and forcing them to one height would
            leave three columns of dead space under the shortest list. */}
        <ul className="mt-14 grid grid-cols-1 items-start gap-6 sm:mt-20 sm:grid-cols-2 xl:grid-cols-4">
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
