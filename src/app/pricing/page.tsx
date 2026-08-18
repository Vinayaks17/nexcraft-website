import type { Metadata } from "next";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingSection } from "@/components/pricing/PricingSection";
import { pricingHero } from "@/lib/pricing-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent website and business automation pricing — three website tiers plus custom automation, with every add-on priced up front.",
};

export default function PricingPage() {
  return (
    <>
      {/* Compact page hero — deliberately shorter than the homepage's */}
      <SectionWrapper
        outerClassName="relative overflow-hidden"
        spacing="none"
        animate={false}
        width="wide"
        className="pt-32 pb-10 md:pt-40 md:pb-14"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(255,132,50,0.22),transparent_70%)]"
          aria-hidden
        />
        <SectionHeading
          eyebrow={pricingHero.eyebrow}
          heading={pricingHero.heading}
          intro={pricingHero.intro}
          align="center"
        />
      </SectionWrapper>

      <PricingSection />
    </>
  );
}
