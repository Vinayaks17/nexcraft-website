"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

import {
  FuelSectionHeader,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { sectionIndex } from "@/lib/home-fuel-content";
import { projects, type Project } from "@/lib/portfolio-content";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE, enterProps } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Newest first, with the original data order as the tie-break — several
 * projects share a year and `sort` is stable, so within a year they stay in
 * the order portfolio-content lists them.
 *
 * `sort` mutates, so this copies first: `projects` is a module-level array
 * shared with /portfolio, and reordering it in place would silently reorder
 * that grid too.
 */
const archive: Project[] = [...projects].sort((a, b) =>
  b.year.localeCompare(a.year),
);

const PREVIEW_W = 260;
const PREVIEW_H = 163;

/* -------------------------------------------------------------------------
   The floating preview

   One instance for the whole list, parked next to the cursor. A pointermove
   writes to motion values, so moving the mouse across eleven rows never
   re-renders React — only the hovered *row id* is state, and that changes at
   most once per row.
------------------------------------------------------------------------- */

function HoverPreview({ project }: { project: Project | null }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 240, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 240, damping: 28, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-40"
      style={{ x: sx, y: sy }}
    >
      <AnimatePresence>
        {project?.screenshot && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25, ease: EASE }}
            /* Offset up and right of the pointer so the cursor itself never
               sits on top of the image it just summoned. */
            className="overflow-hidden rounded-[3px] shadow-lift ring-1 ring-cream/15"
            style={{
              width: PREVIEW_W,
              height: PREVIEW_H,
              translateX: 28,
              translateY: -PREVIEW_H / 2,
            }}
          >
            <Image
              src={project.screenshot}
              alt=""
              width={PREVIEW_W}
              height={PREVIEW_H}
              sizes={`${PREVIEW_W}px`}
              className="h-full w-full object-cover object-top"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   Section
------------------------------------------------------------------------- */

export function FuelArchive() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  /* The cursor preview needs a pointer that can hover. Everywhere else — touch,
     and anyone who asked for less motion — gets a static thumbnail in the row
     instead, so the screenshot is never information only some users can reach. */
  const floating = fine && !reduceMotion;
  const hoveredProject = useMemo(
    () => archive.find((p) => p.id === hovered) ?? null,
    [hovered],
  );
  const section = sectionIndex.archive;

  return (
    <section
      id={section.id}
      className="scroll-mt-28 bg-ink py-20 sm:py-24 lg:py-32"
    >
      <div className={fuelShell}>
        {/* The one-line description this band used to carry separately is now
            the header's subline, so there is one place it can be edited. */}
        <FuelSectionHeader {...section} />

        <ul className="mt-12 border-t border-cream/12 sm:mt-16">
          {archive.map((project, i) => {
            const live = project.url !== null;
            const active = floating && hovered === project.id;

            const row = (
              <span className="grid w-full grid-cols-12 items-center gap-4 py-5 sm:py-7">
                <span className={cn(fuelLabel, "col-span-3 text-cream/50 sm:col-span-2")}>
                  {project.year}
                </span>

                {/* Resting state stays fully legible — this list *is* the
                    section's content, and eleven rows held at low opacity by
                    default reads as disabled rather than as restrained. Only
                    once some row is hovered do the others recede, which is what
                    makes the recession mean something. */}
                <span
                  className={cn(
                    "col-span-9 font-display leading-[1.05] font-semibold tracking-[-0.03em] transition-colors duration-300",
                    "text-[clamp(1.375rem,3vw,2.75rem)]",
                    floating && hovered !== null && !active
                      ? "text-cream/55"
                      : "text-cream",
                    "sm:col-span-6",
                  )}
                >
                  {project.name}
                </span>

                {/* Static thumbnail — the fallback path, so it renders wherever
                    the floating preview can't. */}
                {!floating && project.screenshot && (
                  <span className="col-span-12 mt-3 block sm:col-span-4 sm:mt-0 sm:justify-self-end">
                    <span className="relative block aspect-[16/10] w-full max-w-[9rem] overflow-hidden rounded-[3px] ring-1 ring-cream/12 sm:w-[9rem]">
                      <Image
                        src={project.screenshot}
                        alt={`${project.name} — ${project.industry} website`}
                        fill
                        sizes="144px"
                        className="object-cover object-top"
                      />
                    </span>
                  </span>
                )}

                {floating && (
                  <span
                    className={cn(
                      fuelLabel,
                      "col-span-4 hidden text-right text-cream/55 sm:block",
                    )}
                  >
                    {live ? project.domain : "Private build"}
                  </span>
                )}
              </span>
            );

            const shared = cn(
              "flex w-full border-b border-cream/12 text-left",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
            );

            return (
              <motion.li
                key={project.id}
                {...enterProps("up", Math.min(i, 6) * 0.04)}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() =>
                  setHovered((h) => (h === project.id ? null : h))
                }
              >
                {live ? (
                  <a
                    href={project.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.name} — open ${project.domain} in a new tab`}
                    className={shared}
                  >
                    {row}
                  </a>
                ) : (
                  <span className={shared}>{row}</span>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>

      {floating && <HoverPreview project={hoveredProject} />}
    </section>
  );
}

export default FuelArchive;
