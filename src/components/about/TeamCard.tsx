"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { LinkedInIcon } from "@/components/ui/BrandIcons";
import { fuelBody, fuelLabel } from "@/components/fuel/FuelPrimitives";
import type { TeamMember } from "@/lib/about-content";
import { enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** 1 col under sm, 3 from lg — mirrored in the `sizes` hint. */
const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Branded monogram used until a headshot lands. Set `photo` on the member in
 * about-content.ts and this is replaced automatically — no component change.
 *
 * Unused as of F7: all three of the current team have real photographs. It
 * stays because the next person to join won't, and the fallback is one null
 * away from being live again.
 */
function InitialsAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#1d1409_0%,#151515_60%)]">
      <span className="font-display text-[clamp(3rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.04em] text-cream/70">
        {initials}
      </span>
    </div>
  );
}

/**
 * One team member, in the Fuel portrait register: a tall image, then the index
 * and role in mono, then the name at display scale.
 *
 * The card chrome is gone — no border, no rounded panel, no shadow. On this
 * grid the photograph is the object and a box drawn around it only competes
 * with the hairlines the rest of the site rules with.
 */
export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const linkedinLabel = member.linkedinLabel ?? "Connect on LinkedIn";

  /* Framing is per photo and lives in about-content.ts — see PhotoFraming for
     what the numbers mean and how to measure a new one. The position doubles as
     the transform-origin so `zoom` magnifies about the same point the crop is
     anchored to; without that the zoom would pull away from the face it was
     added to reach. Defaults reproduce the old `object-top` behaviour for any
     member added without framing. */
  const position = member.framing?.position ?? "50% 0%";
  const zoom = member.framing?.zoom ?? 1;

  return (
    <motion.li
      {...enterProps("up", index * 0.09)}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-surface-raised">
        {member.photo ? (
          <>
            <Image
              src={member.photo}
              alt={`${member.name}, ${member.role} at NexCRAFT`}
              fill
              sizes={SIZES}
              style={
                {
                  objectPosition: position,
                  transformOrigin: position,
                  "--photo-zoom": zoom,
                } as CSSProperties
              }
              className={cn(
                "object-cover",
                // Warm duotone at rest, full colour on hover/focus.
                "grayscale-[0.65] sepia-[0.28] contrast-[1.05] brightness-[0.92]",
                "transition-[filter,transform] duration-700 ease-out",
                /* The hover lift multiplies the framing zoom rather than
                   replacing it — a plain `scale-[1.03]` here would throw a
                   zoomed photo back to its uncropped framing the moment the
                   pointer touched the card. Arbitrary-property syntax, not
                   `scale-[…]`, so tailwind-merge groups it by property name
                   and a later utility can't silently drop it. */
                "[transform:scale(var(--photo-zoom))]",
                "group-hover:[transform:scale(calc(var(--photo-zoom)*1.03))]",
                "group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100",
                "group-focus-within:grayscale-0 group-focus-within:sepia-0 group-focus-within:brightness-100",
              )}
            />
            {/* Warm wash that lifts away with the duotone. */}
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,146,77,0.10)_0%,rgba(10,10,10,0.55)_100%)] transition-opacity duration-700 group-hover:opacity-40"
              aria-hidden
            />
          </>
        ) : (
          <InitialsAvatar initials={member.initials} />
        )}

        <span
          aria-hidden
          className={cn(
            fuelLabel,
            "absolute top-4 left-4 rounded-[2px] bg-ink/70 px-2 py-1.5 text-cream/80 backdrop-blur-sm",
          )}
        >
          (0{index + 1})
        </span>
      </div>

      <p className={cn(fuelLabel, "mt-6 text-primary")}>{member.role}</p>

      <h3 className="mt-3 font-display text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-cream">
        {member.name}
      </h3>

      <p className={cn(fuelBody, "mt-3 grow text-cream/60")}>{member.blurb}</p>

      <div className="mt-6 flex flex-col gap-3 border-t border-cream/12 pt-5">
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-[0.875rem] font-medium tracking-[-0.01em] text-cream/80 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <LinkedInIcon className="h-4 w-4 shrink-0 text-primary" />
          {linkedinLabel}
        </a>

        {member.site && (
          <a
            href={member.site.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              fuelLabel,
              "group/site inline-flex items-center gap-1.5 text-cream/55 transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
            )}
          >
            {member.site.label}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/site:-translate-y-0.5 group-hover/site:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </a>
        )}
      </div>
    </motion.li>
  );
}

export default TeamCard;
