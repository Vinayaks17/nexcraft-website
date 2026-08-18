"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Wordmark } from "@/components/ui/Wordmark";
import {
  FuelBracketLink,
  FuelTicks,
  fuelHeadline,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { YEAR, fuelFooter, fuelNav } from "@/lib/home-fuel-content";
import { contact, footerLegal } from "@/lib/site";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The homepage's closing band — CTA and footer in one, the way the reference
 * folds them together.
 *
 * "Let's work together" sits muted above the email set bright: the lead is the
 * setup, the address is the thing you're meant to act on, and the contrast
 * ordering says so without a size change.
 */
export function FuelFooter() {
  return (
    <footer className="relative overflow-hidden bg-void text-cream">
      <div className={cn(fuelShell, "pt-20 sm:pt-24 lg:pt-32")}>
        <div className="h-px w-full bg-cream/12" aria-hidden />

        <div className="mt-14 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Lead + email + actions */}
          <motion.div {...enterProps("up")} className="lg:col-span-7">
            <p className={cn(fuelHeadline, "text-cream/40")}>
              {fuelFooter.lead}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className={cn(
                fuelHeadline,
                "mt-1 block break-words text-cream transition-colors duration-200 hover:text-primary",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
              )}
            >
              {contact.email}
            </a>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-12">
              <FuelBracketLink href={fuelFooter.cta.href}>
                {fuelFooter.cta.label}
              </FuelBracketLink>
              <FuelBracketLink href={fuelFooter.secondary.href}>
                {fuelFooter.secondary.label}
              </FuelBracketLink>
            </div>
          </motion.div>

          {/* Numbered nav — the same convention the navbar uses, with a
              hairline under each row. */}
          <motion.nav
            {...enterProps("up", 0.08)}
            aria-label="Footer"
            className="lg:col-span-4 lg:col-start-9"
          >
            <ul className="border-t border-cream/12">
              {fuelNav.map((link) => (
                <li key={link.href} className="border-b border-cream/12">
                  <Link
                    href={link.href}
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-[0.9375rem] font-medium tracking-[-0.01em] text-cream/70 transition-colors duration-200 group-hover:text-cream">
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        fuelLabel,
                        "text-cream/35 transition-colors duration-200 group-hover:text-primary",
                      )}
                    >
                      {link.num}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {footerLegal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      fuelLabel,
                      "text-cream/40 transition-colors duration-200 hover:text-cream",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        <FuelTicks className="mt-16 px-[12%] sm:mt-20" />

        <div className="mt-14 h-px w-full bg-cream/12" aria-hidden />
      </div>

      {/* The signature, full-bleed rather than gutter-bound. Solid rather than
          outlined here: the closing band is the heaviest moment on the page and
          an outline reads as tentative at this scale. */}
      <Wordmark fill="solid" className="mt-10" />

      <div className={cn(fuelShell, "pb-8")}>
        <div className={cn("flex flex-col gap-2 sm:flex-row sm:justify-between", fuelLabel)}>
          <p className="text-cream/45">© {YEAR} NexCRAFT</p>
          <p className="text-cream/45">{fuelFooter.location}</p>
        </div>
      </div>
    </footer>
  );
}

export default FuelFooter;
