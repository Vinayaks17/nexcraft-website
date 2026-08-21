"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { projectAlt, type Project } from "@/lib/portfolio-content";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial rhythm. Rows alternate which side carries the large item, and the
 * small one starts lower — that stagger is what stops a two-up grid reading as
 * a table. Large items span 7 of 12 columns, small ones 5.
 */
function slot(i: number) {
  const row = Math.floor(i / 2);
  const firstInRow = i % 2 === 0;
  const large = row % 2 === 0 ? firstInRow : !firstInRow;
  return {
    large,
    span: large ? "lg:col-span-7" : "lg:col-span-5",
    // Only the small item drops, and only from lg where the two sit side by side.
    offset: large ? "" : "lg:mt-28",
  };
}

/** Sizes hints matched to the 7/12 and 5/12 spans inside a 1280px container. */
const SIZES_LARGE = "(min-width: 1024px) 58vw, 100vw";
const SIZES_SMALL = "(min-width: 1024px) 42vw, 100vw";

function ProjectItem({
  project,
  index,
  dimmed,
  onEnter,
  onLeave,
}: {
  project: Project;
  index: number;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { large, span, offset } = slot(index);
  const live = project.url !== null;

  const media = (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-surface">
      {project.screenshot ? (
        <Image
          src={project.screenshot}
          alt={projectAlt(project)}
          fill
          sizes={large ? SIZES_LARGE : SIZES_SMALL}
          className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#1d1409_0%,#151515_60%)]">
          <span className="font-display text-2xl font-medium text-cream/25">
            {project.name}
          </span>
        </div>
      )}

      {/* Tags sit on the image, bottom-right, like a contact sheet annotation. */}
      <div className="pointer-events-none absolute right-3 bottom-3 flex flex-wrap justify-end gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-[2px] border border-white/15 bg-black/55 px-2 py-1 font-mono text-[0.5625rem] tracking-[0.14em] text-cream/90 uppercase backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 34, clipPath: "inset(8% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      className={cn(
        "group col-span-12",
        span,
        offset,
        // Everything that isn't the hovered item recedes.
        "transition-[opacity,filter] duration-500",
        dimmed && "opacity-15 blur-[2px]",
      )}
    >
      {live ? (
        <a
          href={project.url!}
          target="_blank"
          rel="noopener noreferrer"
          onFocus={onEnter}
          onBlur={onLeave}
          aria-label={`${project.name} — open ${project.domain} in a new tab`}
          className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {media}
        </a>
      ) : (
        media
      )}

      <div className="mt-5 flex items-start justify-between gap-6">
        <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-cream">
          {project.name}
        </h3>

        {live ? (
          <a
            href={project.url!}
            target="_blank"
            rel="noopener noreferrer"
            onFocus={onEnter}
            onBlur={onLeave}
            className="group/view mt-1.5 shrink-0 font-mono text-[0.625rem] tracking-[0.16em] text-cream/70 uppercase underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {/* The arrow leads rather than trails here, so it steps *back* out
                of the label's way on hover instead of forward into it. */}
            <span
              aria-hidden
              className="mr-1 inline-block transition-transform duration-300 ease-out group-hover/view:-translate-x-0.5"
            >
              →
            </span>
            View project
          </a>
        ) : (
          <span className="mt-1.5 shrink-0 rounded-[2px] border border-cream/20 px-2 py-1 font-mono text-[0.5625rem] tracking-[0.16em] text-cream/70 uppercase">
            Private build
          </span>
        )}
      </div>

      {/* Industry in the mono register, then the blurb. The year that used to
          lead this row is gone for the same reason it left the archive: the
          values are guesses, and a date next to a client's name reads as a
          recorded fact. Both views drop it together so they still agree. */}
      <p className="mono-caption mt-3 flex flex-wrap items-center gap-x-3 text-cream/50">
        <span>{project.industry}</span>
      </p>
      <p className="mono-caption mt-2 max-w-md text-cream/60">
        {project.blurb}
      </p>
    </motion.li>
  );
}

/**
 * The cursor chip. One instance for the whole grid, following the pointer on
 * spring-smoothed motion values — a pointermove writes to a motion value and
 * never re-renders React.
 */
function CursorChip({ label, visible }: { label: string; visible: boolean }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });

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
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.7 }}
        transition={{ duration: 0.18, ease: EASE }}
        className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-[2px] bg-white px-3 py-2 font-mono text-[0.625rem] tracking-[0.16em] text-ink uppercase shadow-lift"
      >
        <span aria-hidden>↗</span>
        {label}
      </motion.span>
    </motion.div>
  );
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Dimming and the chip are desktop-pointer affordances only.
  const interactive = fine && !reduceMotion;
  const hoveredProject = projects.find((p) => p.id === hovered) ?? null;

  return (
    <>
      <ul className="mt-14 grid grid-cols-12 gap-x-8 gap-y-20 lg:gap-y-28">
        {projects.map((project, i) => (
          <ProjectItem
            key={project.id}
            project={project}
            index={i}
            dimmed={interactive && hovered !== null && hovered !== project.id}
            onEnter={() => setHovered(project.id)}
            onLeave={() => setHovered((h) => (h === project.id ? null : h))}
          />
        ))}
      </ul>

      {interactive && (
        <CursorChip
          visible={hoveredProject !== null}
          label={hoveredProject?.url ? "View" : "Private"}
        />
      )}
    </>
  );
}

export default ProjectShowcase;
