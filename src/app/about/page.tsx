import type { Metadata } from "next";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountUp } from "@/components/ui/CountUp";
import { Button } from "@/components/ui/Button";
import { TeamCard } from "@/components/about/TeamCard";
import { LifeAtNexcraft } from "@/components/about/LifeAtNexcraft";
import {
  aboutCta,
  aboutHero,
  stats,
  story,
  team,
  teamSection,
} from "@/lib/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founded in New Delhi in January 2024, NexCRAFT builds websites and automations for clients worldwide — and trains the next generation of Indian engineers while doing it.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <SectionWrapper
        outerClassName="relative overflow-hidden"
        spacing="none"
        animate={false}
        width="wide"
        className="pt-32 pb-10 md:pt-40 md:pb-16"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(255,132,50,0.22),transparent_70%)]"
          aria-hidden
        />
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {aboutHero.eyebrow}
          </span>
          <RevealHeading
            text={aboutHero.heading}
            as="h1"
            className="mt-5 text-[2.5rem] sm:text-6xl lg:text-7xl"
          />
          <p className="mono-lead mt-6 max-w-xl text-cream/70">
            {aboutHero.intro}
          </p>
        </div>
      </SectionWrapper>

      {/* Story + stat strip */}
      <SectionWrapper spacing="md" width="wide" enterFrom="left">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow={story.eyebrow}
            heading={story.heading}
            className="max-w-none"
          />
          <div>
            {story.paragraphs.map((p) => (
              <p
                key={p}
                className="mt-5 text-base leading-relaxed text-cream/80 first:mt-0 sm:text-lg"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 lg:grid-cols-4">
          {/* col-reverse puts each number above its label visually, while the
              DOM keeps the term-before-description order a <dl> needs. */}
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse bg-surface px-5 py-7 text-center sm:px-6"
            >
              <dt className="mt-3 font-mono text-[0.625rem] font-medium tracking-[0.18em] text-primary uppercase">
                {stat.label}
              </dt>
              <dd className="font-display text-[1.75rem] leading-none font-medium tracking-[-0.01em] text-cream sm:text-[2.25rem]">
                <CountUp value={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </SectionWrapper>

      {/* Team */}
      <SectionWrapper id="team" spacing="lg" animate={false} width="wide" outerClassName="scroll-mt-28">
        <SectionHeading
          eyebrow={teamSection.eyebrow}
          heading={teamSection.heading}
          intro={teamSection.intro}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </ul>
      </SectionWrapper>

      {/* Life at NexCRAFT */}
      <LifeAtNexcraft />

      {/* Closing CTA */}
      <SectionWrapper spacing="lg" width="wide" enterFrom="scale">
        <div className="flex flex-col items-center text-center">
          <RevealHeading
            text={aboutCta.heading}
            as="h2"
            className="max-w-2xl text-[2rem] sm:text-5xl lg:text-6xl"
          />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/70 sm:text-lg">
            {aboutCta.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={aboutCta.primary.href} size="lg" magnetic>
              {aboutCta.primary.label}
            </Button>
            <Button href={aboutCta.secondary.href} variant="outline" size="lg">
              {aboutCta.secondary.label}
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
