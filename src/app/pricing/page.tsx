import type { Metadata } from "next";

import { pageMeta } from "@/lib/seo";
import { seoPages } from "@/lib/seo-content";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

import {
  FuelBracketLink,
  FuelPageHeader,
  FuelSectionMeta,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { FuelTierCard } from "@/components/fuel/FuelTierCard";
import { MonoArrowLink } from "@/components/ui/MonoArrowLink";
import { renderAccent } from "@/components/ui/AccentWord";
import {
  fuelPricing,
  pricingCta,
  pricingHero,
  pricingTiers,
  reassurances,
} from "@/lib/pricing-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMeta(seoPages.pricing);

/**
 * /pricing — the homepage's (04) band, given room to breathe.
 *
 * Same tiers, same card component, same numbering. The page adds what the
 * homepage band deliberately leaves out: the reassurance line spelled out, and
 * a closing CTA for the visitor who got this far and still isn't sure.
 */
export default function PricingPage() {
  return (
    <>
      <BreadcrumbSchema name="Pricing" path="/pricing" />

      <FuelPageHeader
        num="03"
        label="Pricing"
        heading={pricingHero.heading}
        intro={pricingHero.intro}
      />

      <section className={cn(fuelShell, "pt-14 pb-20 sm:pt-16 lg:pt-20")}>
        {/* The tier names are h3s, and with no h2 between them and the page
            title the outline jumped h1 -> h3. Visually this section is labelled
            by the page header directly above it, so the heading it was missing
            is one only assistive tech and crawlers need — hence sr-only rather
            than a new line of design. */}
        <h2 className="sr-only">Website design and automation packages</h2>

        <ul className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {pricingTiers.map((tier, i) => (
            <FuelTierCard key={tier.id} tier={tier} index={i} />
          ))}
        </ul>

        <p className={cn(fuelLabel, "mt-10 text-cream/55")}>{fuelPricing.note}</p>
      </section>

      {/* Reassurances — the same promises, as a numbered row rather than a
          pill strip, so they sit in the same register as every other list on
          the site. Four across from lg and two-up at sm: a three-column grid
          left the fourth stranded on its own row. */}
      <section className="bg-ink-alt py-16 sm:py-20">
        <div className={fuelShell}>
          <FuelSectionMeta label="What you get either way" />
          <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
            {reassurances.map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className={cn(fuelLabel, "mt-1 shrink-0 text-primary")}>
                  (0{i + 1})
                </span>
                <span className="text-[0.9375rem] leading-[1.4] font-medium tracking-[-0.01em] text-cream">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA — cream inversion, the page's one change of ground. */}
      <section className="bg-cream py-20 text-ink [--accent-ink:var(--color-primary-darker)] sm:py-24 lg:py-28">
        <div className={fuelShell}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2 className={cn(fuelStatement, "text-ink lg:col-span-8")}>
              {renderAccent(pricingCta.heading)}
            </h2>
            <div className="lg:col-span-4">
              <p className={cn(fuelBody, "text-ink/70")}>
                {pricingCta.description}
              </p>
              <FuelBracketLink
                href={pricingCta.cta.href}
                tone="light"
                className="mt-8 max-w-none"
              >
                {pricingCta.cta.label}
              </FuelBracketLink>

              <MonoArrowLink
                href={pricingCta.secondary.href}
                tone="light"
                className="mt-8"
              >
                {pricingCta.secondary.label}
              </MonoArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
