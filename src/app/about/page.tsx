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
  fuelNumeral,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { LifeAtNexcraft } from "@/components/about/LifeAtNexcraft";
import { CountUp } from "@/components/ui/CountUp";
import { MonoArrowLink } from "@/components/ui/MonoArrowLink";
import { renderAccent } from "@/components/ui/AccentWord";
import {
  aboutCta,
  aboutHero,
  stats,
  story,
  storyLink,
} from "@/lib/about-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMeta(seoPages.about);

/**
 * /about — three numbered bands.
 *
 * The page header carries no number of its own: the bands below run (01)–(03),
 * and a fourth number above them would read as a numbering mistake rather than
 * as a second scope.
 */
export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema name="About" path="/about" />

      <FuelPageHeader
        label="About us"
        heading={aboutHero.heading}
        intro={aboutHero.intro}
      />

      {/* (01) The story — the page's cream inversion, matching the homepage's
          (01) About band so "about" reads as the same ground site-wide. */}
      <section className="mt-16 bg-cream py-20 text-ink [--accent-ink:var(--color-primary-darker)] sm:mt-20 sm:py-24 lg:py-28">
        <div className={fuelShell}>
          <FuelSectionMeta num="01" label="The story" tone="light" />

          <h2 className={cn(fuelStatement, "mt-12 max-w-[20ch] text-ink sm:mt-16")}>
            {renderAccent(story.heading)}
          </h2>

          {/* Two paragraphs, two columns — the dual mission is literally a pair,
              so setting it as one is the layout doing the explaining. */}
          <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
            {story.paragraphs.map((p, i) => (
              <div
                key={p}
                className={cn(
                  "lg:col-span-5",
                  i === 0 ? "lg:col-start-2" : "lg:col-start-8",
                )}
              >
                <p className={cn(fuelLabel, "text-ink/65")}>(0{i + 1})</p>
                <p className={cn(fuelBody, "mt-4 text-ink/75")}>{p}</p>
              </div>
            ))}
          </div>

          <MonoArrowLink
            href={storyLink.href}
            tone="light"
            className="mt-14 sm:mt-16"
          >
            {storyLink.label}
          </MonoArrowLink>
        </div>
      </section>

      {/* (02) Life at NexCRAFT — the team as a group. It follows the cream
          story band directly, on ink-alt, so the page still alternates ground
          on every band: cream, ink-alt, ink, ink-alt. */}
      <LifeAtNexcraft />

      {/* (03) Stats */}
      <section className="bg-ink py-20 sm:py-24 lg:py-28">
        <div className={fuelShell}>
          <FuelSectionMeta num="03" label="By the numbers" />

          <dl className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd
                  className={cn(
                    fuelNumeral,
                    // A word-valued figure ("India") is wider than any
                    // numeral beside it, so long values step down rather
                    // than overflow.
                    stat.value.length > 6
                      ? "text-[clamp(1.75rem,3vw,2.5rem)]"
                      : "text-[clamp(2.25rem,4vw,3.5rem)]",
                    "text-cream",
                  )}
                >
                  <CountUp value={stat.value} />
                </dd>
                <div className="mt-5 h-px w-full bg-cream/15" aria-hidden />
                <dt className="mt-4 text-[0.9375rem] font-medium tracking-[-0.01em] text-cream/70">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink-alt py-20 sm:py-24 lg:py-28">
        <div className={fuelShell}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2 className={cn(fuelStatement, "text-cream lg:col-span-7")}>
              {renderAccent(aboutCta.heading)}
            </h2>
            <div className="lg:col-span-5">
              <p className={cn(fuelBody, "text-cream/60")}>
                {aboutCta.description}
              </p>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-12">
                <FuelBracketLink href={aboutCta.primary.href}>
                  {aboutCta.primary.label}
                </FuelBracketLink>
                <FuelBracketLink href={aboutCta.secondary.href}>
                  {aboutCta.secondary.label}
                </FuelBracketLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
