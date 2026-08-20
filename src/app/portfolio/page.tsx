import type { Metadata } from "next";

import {
  FuelBracketLink,
  FuelPageHeader,
  FuelSectionMeta,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { FuelArchive } from "@/components/fuel/FuelArchive";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { FlowCard } from "@/components/portfolio/FlowCard";
import { renderAccent } from "@/components/ui/AccentWord";
import {
  automationsSection,
  flows,
  portfolioCta,
  portfolioHero,
  projects,
} from "@/lib/portfolio-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Eleven websites shipped across recruitment, retail, real estate, media and AI — plus the in-house automation flows we build for clients.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* No number on the header: the bands below run (01)-(03), and a
          fourth number above them would read as a numbering mistake rather
          than as a second scope. Same rule /about follows. */}
      <FuelPageHeader
        label="Portfolio"
        heading={portfolioHero.heading}
        intro={portfolioHero.intro}
      >
        <p className={cn(fuelLabel, "mt-8 text-cream/55")}>
          {projects.length} projects · 2024—2026
        </p>
      </FuelPageHeader>

      {/* The editorial grid. The hover-dim and cursor chip are kept as they
          were — they already speak the same restrained language the rest of the
          site now uses, and rebuilding them would only lose the tuning. */}
      <section id="websites" className={cn(fuelShell, "scroll-mt-28 pt-16 pb-20 sm:pt-20 lg:pt-24")}>
        <ProjectsSection />
      </section>

      {/* Automations — capability flows, not client projects. */}
      <section id="automations" className="scroll-mt-28 bg-ink-alt py-20 sm:py-24 lg:py-28">
        <div className={fuelShell}>
          <FuelSectionMeta num="02" label="Automation flows" />

          <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2 className={cn(fuelStatement, "text-cream lg:col-span-9")}>
              {renderAccent(automationsSection.heading)}
            </h2>
            <p className={cn(fuelBody, "text-cream/60 lg:col-span-3")}>
              {automationsSection.note}
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {flows.map((flow, i) => (
              <FlowCard key={flow.id} flow={flow} index={i} />
            ))}
          </div>

          <FuelBracketLink
            href={automationsSection.cta.href}
            className="mt-12"
          >
            {automationsSection.cta.label}
          </FuelBracketLink>
        </div>
      </section>

      {/* (03) The full index, newest first — moved here from the homepage,
          where it sat two sections below a carousel showing four of the same
          projects. After the featured grid and the flows it reads as the
          complete list rather than as a repeat. */}
      <FuelArchive />

      {/* Closing CTA — cream inversion, the page's one change of ground. */}
      <section className="bg-cream py-20 text-ink [--accent-ink:var(--color-primary-darker)] sm:py-24 lg:py-28">
        <div className={fuelShell}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2 className={cn(fuelStatement, "text-ink lg:col-span-8")}>
              {renderAccent(portfolioCta.heading)}
            </h2>
            <div className="lg:col-span-4">
              <p className={cn(fuelBody, "text-ink/70")}>
                {portfolioCta.description}
              </p>
              <FuelBracketLink
                href={portfolioCta.cta.href}
                tone="light"
                className="mt-8 max-w-none"
              >
                {portfolioCta.cta.label}
              </FuelBracketLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
