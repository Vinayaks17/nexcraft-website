"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { MonoArrowLink } from "@/components/ui/MonoArrowLink";
import { renderAccent } from "@/components/ui/AccentWord";
import {
  FuelTicks,
  fuelBody,
  fuelLabel,
  fuelShell,
  fuelStatement,
} from "@/components/fuel/FuelPrimitives";
import type { FuelCtaBandContent } from "@/lib/home-fuel-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A full-width ask, dropped between bands.
 *
 * The homepage runs nine sections; two of these plus the footer's own CTA mean
 * no visitor scrolls more than three of them without somewhere to go. Both
 * instances share this component and the same pair of actions — a visitor who
 * has decided shouldn't have to learn a new control halfway down — while the
 * copy is written per band (see `fuelCtaBands`) so the repeat doesn't read as a
 * component pasted twice.
 *
 * Two grounds, chosen at the call site by where the band lands:
 *
 * - `brand` — the signature orange gradient. Everything on it is one of the
 *   two warm near-blacks: cream on #ff924d is ~1.9:1 and white is ~2:1, both
 *   nowhere near AA, while `--color-on-brand` clears 4.5:1 against even the
 *   darkest stop of the gradient. The cream button carries a dark hairline
 *   because a cream pill on orange is only ~1.9:1 at its own edge, which is
 *   under the 3:1 that 1.4.11 asks of a control's boundary; the orange button
 *   on cream has the same edge problem in reverse and takes the same fix.
 * - `cream` — the light inversion, for a band that lands between two dark
 *   sections.
 *
 * It carries no section number: these are punctuation between sections, not
 * sections, and numbering them would break the 01..09 run the scrollspy reads.
 */
export function FuelCtaBand({
  content,
  tone,
  className,
}: {
  content: FuelCtaBandContent;
  tone: "brand" | "cream";
  className?: string;
}) {
  const brand = tone === "brand";

  const ground = brand
    ? "gradient-brand text-on-brand"
    : "bg-cream text-ink [--accent-ink:var(--color-primary-darker)]";
  const strong = brand ? "text-on-brand" : "text-ink";
  const muted = brand ? "text-on-brand-soft" : "text-ink/70";
  /* 11px mono holds to 4.5:1 — see the contrast floor on fuelLabel. */
  const faint = brand ? "text-on-brand" : "text-ink/65";
  const rule = brand ? "bg-on-brand/25" : "bg-ink/15";

  return (
    <section
      aria-label={content.heading}
      className={cn("py-16 sm:py-20 lg:py-24", ground, className)}
    >
      <div className={fuelShell}>
        <div className={cn("h-px w-full", rule)} aria-hidden />

        <motion.div
          {...enterProps("up")}
          className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12"
        >
          <div className="lg:col-span-7">
            <p className={cn(fuelLabel, faint)}>({content.eyebrow})</p>
            <h2 className={cn(fuelStatement, "mt-6 max-w-[16ch]", strong)}>
              {renderAccent(content.heading)}
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className={cn(fuelBody, "max-w-[42ch]", muted)}>{content.body}</p>

            <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Button
                href={content.primary.href}
                size="lg"
                magnetic
                variant={brand ? "secondary" : "primary"}
                className={brand ? "ring-1 ring-on-brand/35" : "ring-1 ring-ink/40"}
              >
                {content.primary.label}
              </Button>

              {/* `light` on both grounds: the cream band and the orange one
                  both want ink-coloured type and an ink rule. */}
              <MonoArrowLink href={content.secondary.href} tone="light">
                {content.secondary.label}
              </MonoArrowLink>
            </div>
          </div>
        </motion.div>

        {/* Registration marks. `light` is the ink-on-pale variant; the brand
            band then overrides the tone so the ticks sit on orange without
            going invisible. */}
        <FuelTicks
          tone="light"
          className={cn("mt-14 px-[10%] sm:mt-16", brand && "text-on-brand/45")}
        />
      </div>
    </section>
  );
}

export default FuelCtaBand;
