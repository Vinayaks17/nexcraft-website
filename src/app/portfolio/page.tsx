import type { Metadata } from "next";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Button } from "@/components/ui/Button";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { FlowCard } from "@/components/portfolio/FlowCard";
import {
  automationsSection,
  flows,
  portfolioCta,
  portfolioHero,
} from "@/lib/portfolio-content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Eleven websites shipped across recruitment, retail, real estate, media and AI — plus the in-house automation flows we build for clients.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* Compact page hero */}
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
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {portfolioHero.eyebrow}
          </span>
          <RevealHeading
            text={portfolioHero.heading}
            as="h1"
            className="mt-5 text-[2.5rem] sm:text-6xl lg:text-7xl"
          />
          <p className="mono-lead mt-6 max-w-xl text-cream/70">
            {portfolioHero.intro}
          </p>
        </div>
      </SectionWrapper>

      {/* Websites — editorial grid */}
      <SectionWrapper
        id="websites"
        spacing="md"
        animate={false}
        width="wide"
        outerClassName="scroll-mt-28"
      >
        <ProjectsSection />
      </SectionWrapper>

      {/* Automations — capability flows, not client projects */}
      <SectionWrapper
        id="automations"
        spacing="lg"
        animate={false}
        width="wide"
        outerClassName="scroll-mt-28 bg-ink-alt"
      >
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {automationsSection.eyebrow}
          </span>
          <RevealHeading
            text={automationsSection.heading}
            as="h2"
            className="mt-5 text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]"
          />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {flows.map((flow, i) => (
            <FlowCard key={flow.id} flow={flow} index={i} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-cream/70">
            {automationsSection.note}
          </p>
          <Button href={automationsSection.cta.href} size="lg">
            {automationsSection.cta.label}
          </Button>
        </div>
      </SectionWrapper>

      {/* Closing CTA */}
      <SectionWrapper spacing="lg" width="wide" enterFrom="scale">
        <div className="flex flex-col items-center text-center">
          <RevealHeading
            text={portfolioCta.heading}
            as="h2"
            className="max-w-2xl text-[2rem] sm:text-5xl lg:text-6xl"
          />
          <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/70 sm:text-lg">
            {portfolioCta.description}
          </p>
          <div className="mt-9">
            <Button href={portfolioCta.cta.href} size="lg">
              {portfolioCta.cta.label}
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
