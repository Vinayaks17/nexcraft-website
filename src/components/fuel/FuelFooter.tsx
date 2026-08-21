"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import Image from "next/image";

import { Logo } from "@/components/ui/Logo";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  FuelBracketLink,
  FuelTicks,
  fuelHeadline,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { YEAR, fuelFooter } from "@/lib/home-fuel-content";
import { contact, footerLegal, footerPages, navLinks } from "@/lib/site";
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
            {/* The lockup opens the closing band. The giant outlined wordmark
                further down is a signature, not identification — it is clipped
                by the viewport edge and set at 7% opacity, so this is the only
                place in the footer the mark is actually legible. */}
            <Logo href={null} size={34} />
            <p className={cn(fuelHeadline, "mt-8 text-cream/55")}>
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
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-cream/12">
                  <Link
                    href={link.href}
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-[0.9375rem] font-medium tracking-[-0.01em] text-cream/70 transition-colors duration-200 group-hover:text-cream">
                      {link.label}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        fuelLabel,
                        "text-cream/55 transition-colors duration-200 group-hover:text-primary",
                      )}
                    >
                      {link.num}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Routes the numbered nav doesn't carry, plus the legal pages.
                Both are secondary, so they share one quiet mono row. */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {[...footerPages, ...footerLegal].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      fuelLabel,
                      "text-cream/55 transition-colors duration-200 hover:text-cream",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* The mark at size, centred directly over the NEXCRAFT signature so
            the two read as one closing lockup — mark above wordmark — rather
            than as two brand objects in the same room. 200px at desktop, half
            that on a phone where it would otherwise own the whole width.

            Centred rather than right-aligned, which is where it started: the
            floating WhatsApp and email buttons are fixed to the bottom-right
            corner on every route, and a 200px mark anchored there sat directly
            under them. It is the same collision the hero hit in F3 — anything
            parked bottom-right meets those buttons eventually.

            The signature underneath is a 14.5vw watermark at 7% opacity, a
            texture the eye reads as ground, so a solid object at a fifteenth of
            its width sits over it without either losing. The signature yields
            the spacing rather than the mark shrinking — its top margin opens up
            to give the fox air. */}
        <motion.div
          {...enterProps("up", 0.16)}
          className="mt-16 flex justify-center sm:mt-20"
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={200}
            height={240}
            className="h-[100px] w-auto sm:h-[150px] lg:h-[200px]"
          />
        </motion.div>

        <FuelTicks className="mt-12 px-[12%] sm:mt-16" />

        <div className="mt-14 h-px w-full bg-cream/12" aria-hidden />
      </div>

      {/* The signature, full-bleed rather than gutter-bound. Solid rather than
          outlined here: the closing band is the heaviest moment on the page and
          an outline reads as tentative at this scale. */}
      <Wordmark fill="solid" className="mt-16" />

      <div className={cn(fuelShell, "pb-8")}>
        <div className={cn("flex flex-col gap-2 sm:flex-row sm:justify-between", fuelLabel)}>
          <p className="text-cream/55">© {YEAR} NexCRAFT</p>
          <p className="text-cream/55">{fuelFooter.location}</p>
        </div>
      </div>
    </footer>
  );
}

export default FuelFooter;
