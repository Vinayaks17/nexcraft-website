"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/RevealHeading";
import { AutomationDiagram } from "@/components/home/AutomationDiagram";
import { FuelVideo } from "@/components/fuel/FuelVideo";
import {
  FuelBracketLink,
  FuelSectionHeader,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import { fuelServices, type FuelService, sectionIndex } from "@/lib/home-fuel-content";
import { diagramById } from "@/lib/automation-graph";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Matched to the card width: one-up below lg, three-up from lg. */
const SIZES = "(min-width: 1024px) 31vw, 90vw";

/* -------------------------------------------------------------------------
   Media block

   Always a dark panel, even though the band around it is cream. That double
   inversion is what the reference does with its light image cards on a black
   section, and it's also the only ground the schematic reads on — its grid and
   edges are drawn in translucent cream.
------------------------------------------------------------------------- */

function ServiceMedia({ media }: { media: FuelService["media"] }) {
  const reduceMotion = usePrefersReducedMotion();

  if (media.kind === "video") {
    return (
      <FuelVideo
        src={media.src}
        poster={media.poster}
        alt={media.alt}
        className="scale-[1.02]"
      />
    );
  }

  if (media.kind === "diagram") {
    const diagram = diagramById.get(media.diagramId);
    if (!diagram) return null;
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <AutomationDiagram
          diagram={diagram}
          reducedMotion={reduceMotion}
          className="max-h-full"
        />
      </div>
    );
  }

  /* Collage — three screenshots stepped back into the panel. Each is pushed
     further right and further down than the one in front, so the stack reads
     as depth rather than as a misaligned grid. */
  return (
    <div className="relative h-full w-full">
      {media.screenshots.map((src, i) => (
        <div
          key={src}
          className="absolute overflow-hidden rounded-[2px] shadow-lift ring-1 ring-cream/10"
          style={{
            left: `${8 + i * 13}%`,
            top: `${10 + i * 21}%`,
            width: "72%",
            aspectRatio: "16 / 10",
            zIndex: media.screenshots.length - i,
          }}
        >
          <Image
            src={src}
            alt={i === 0 ? media.alt : ""}
            aria-hidden={i !== 0}
            fill
            sizes={SIZES}
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Section
------------------------------------------------------------------------- */

export function FuelServices() {
  const section = sectionIndex.services;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-cream py-20 text-ink [--accent-ink:var(--color-primary-darker)] sm:py-24 lg:py-32"
    >
      <div className={fuelShell}>
        <FuelSectionHeader {...section} tone="light" />

        {/* The statement is a `<p>`: the band's heading is "What we build",
            in the header above, and this is the claim under it. */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:items-end lg:gap-12">
          <RevealHeading
            text={fuelServices.statement}
            as="p"
            className={cn(fuelStatement, "text-ink lg:col-span-9")}
          />
          <motion.div {...enterProps("up", 0.1)} className="lg:col-span-3">
            <FuelBracketLink href={fuelServices.cta.href} tone="light">
              {fuelServices.cta.label}
            </FuelBracketLink>
          </motion.div>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-3 lg:gap-8">
          {fuelServices.items.map((service, i) => (
            <motion.li
              key={service.num}
              {...enterProps("up", i * 0.09)}
              className="flex flex-col"
            >
              {/* Tall media panel — 4:5 keeps the three cards reading as a set
                  of columns rather than a row of landscape thumbnails. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-ink">
                <ServiceMedia media={service.media} />
                {/* Scrim under the numeral. Two of the three media blocks are
                    screenshots of light websites, and cream type sat straight on
                    those was well under 3:1 — the gradient guarantees a dark
                    ground behind the numeral whatever the media happens to be. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(10,10,10,0.85)_0%,rgba(10,10,10,0.45)_55%,transparent_100%)]"
                />
                <span
                  className="absolute top-4 left-4 font-display text-[2.5rem] leading-none font-semibold tracking-[-0.04em] text-cream"
                  aria-hidden
                >
                  {service.num}
                </span>
              </div>

              <h3 className="mt-6 text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[1.75rem]">
                {service.title}
              </h3>
              <p className={cn(fuelLabel, "mt-3 text-ink/65")}>
                {service.kicker}
              </p>
              <p className={cn(fuelBody, "mt-4 grow text-ink/70")}>
                {service.description}
              </p>

              <div className="mt-7">
                {/* Three "Learn more"s on one page are three links a screen
                    reader announces identically. The service name is appended
                    for assistive tech only, so the visible label stays as short
                    as the layout wants it. */}
                <FuelBracketLink href={service.href} tone="light">
                  Learn more
                  <span className="sr-only"> about {service.title}</span>
                </FuelBracketLink>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FuelServices;
