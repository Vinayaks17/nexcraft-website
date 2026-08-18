"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { LinkedInIcon } from "@/components/ui/BrandIcons";
import type { TeamMember } from "@/lib/about-content";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** 1 col under sm, 3 from lg — mirrored in the `sizes` hint. */
const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Branded monogram used until a headshot lands. Set `photo` on the member in
 * about-content.ts and this is replaced automatically — no component change.
 */
function InitialsAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#1d1409_0%,#151515_60%)]">
      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-raised font-display text-3xl font-medium tracking-[-0.005em] text-cream ring-2 ring-primary/60">
        {initials}
      </span>
    </div>
  );
}

export function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const linkedinLabel = member.linkedinLabel ?? "Connect on LinkedIn";

  return (
    <motion.li
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.1 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface shadow-soft transition-colors duration-300 hover:border-primary/40"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-raised">
        {member.photo ? (
          <>
            <Image
              src={member.photo}
              alt={`${member.name}, ${member.role} at NexCRAFT`}
              fill
              sizes={SIZES}
              className={cn(
                "object-cover object-top",
                // Warm duotone at rest, full colour on hover/focus.
                "grayscale-[0.65] sepia-[0.28] contrast-[1.05] brightness-[0.92]",
                "transition-[filter,transform] duration-700 ease-out",
                "group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100",
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
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
          {member.role}
        </span>
        <h3 className="mt-2.5 font-heading text-xl font-semibold text-cream">{member.name}</h3>
        <p className="mono-caption mt-3 text-cream/70">{member.blurb}</p>

        <div className="mt-auto flex flex-col gap-2.5 pt-5">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-heading text-sm font-medium text-cream/80 transition-colors duration-200 hover:text-primary"
          >
            <LinkedInIcon className="h-4 w-4 shrink-0 text-primary" />
            {linkedinLabel}
          </a>

          {member.site && (
            <a
              href={member.site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/site inline-flex items-center gap-1.5 text-xs font-medium text-cream/60 transition-colors duration-200 hover:text-primary"
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
      </div>
    </motion.li>
  );
}

export default TeamCard;
