"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { FuelCursorChip } from "@/components/fuel/FuelCursorChip";
import {
  FuelSectionMeta,
  fuelHeadline,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { fuelPortfolio } from "@/lib/home-fuel-content";
import { projects, type Project } from "@/lib/portfolio-content";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { enterProps, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

const featured: Project[] = projects.filter((p) => p.featured);

/** Matched to the slide width below: ~86vw on phones, ~48vw from lg. */
const SIZES = "(min-width: 1024px) 48vw, 86vw";

/* -------------------------------------------------------------------------
   Slide
------------------------------------------------------------------------- */

function Slide({
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
  const live = project.url !== null;

  const media = (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] bg-surface">
      {project.screenshot ? (
        <Image
          src={project.screenshot}
          alt={`${project.name} — ${project.industry} website`}
          fill
          sizes={SIZES}
          className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover/slide:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,#1d1409_0%,#151515_60%)]">
          <span className="font-display text-2xl font-medium text-cream/25">
            {project.name}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <li
      // `start` rather than `center`: with two slides visible from lg, centring
      // would leave a half-slide hanging at both ends of the track.
      className={cn(
        "group/slide w-[86vw] shrink-0 snap-start sm:w-[70vw] lg:w-[calc((100%-1rem)/2)]",
        "transition-[opacity,filter] duration-500",
        dimmed && "opacity-25 blur-[2px]",
      )}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {live ? (
        <a
          href={project.url!}
          target="_blank"
          rel="noopener noreferrer"
          onFocus={onEnter}
          onBlur={onLeave}
          aria-label={`${project.name} — open ${project.domain} in a new tab`}
          className="block rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {media}
        </a>
      ) : (
        media
      )}

      {/* Caption row — index left, name + industry centre, year right. Same
          three-up as the section meta, one step down in scale. */}
      <div className={cn("mt-4 grid grid-cols-12 items-start gap-3", fuelLabel)}>
        <span className="col-span-2 text-cream/50">
          (0{index + 1})
        </span>
        <div className="col-span-7">
          <h3 className="text-[0.9375rem] leading-tight font-medium tracking-[-0.01em] text-cream normal-case">
            {project.name}
          </h3>
          <p className="mt-1 text-cream/50">{project.industry}</p>
        </div>
        <span className="col-span-3 text-right text-cream/50">
          {live ? "Live" : "Private"}
        </span>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------
   Section
------------------------------------------------------------------------- */

export function FuelPortfolio() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  const [hovered, setHovered] = useState<string | null>(null);

  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  // Dimming and the cursor chip are desktop-pointer affordances only.
  const interactive = fine && !reduceMotion;
  const hoveredProject = featured.find((p) => p.id === hovered) ?? null;

  /* Index is derived from the real scroll offset rather than tracked
     separately, so a touch swipe, a native keyboard scroll and an arrow click
     all agree about where the carousel is. */
  const syncIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    if (!slide) return;
    const step = slide.offsetWidth + 16; /* gap-4 */
    setIndex(Math.round(el.scrollLeft / step));

    /* The arrows' disabled state comes from the scroll box, not from the index:
       two slides are visible at lg, so the track runs out of travel with two
       slides still to the right of the first. An index-based check would leave
       "next" enabled at the end, pointing at a scroll that cannot happen. The
       1px tolerance absorbs sub-pixel scroll offsets. */
    setEdges({
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft >= el.scrollWidth - el.clientWidth - 1,
    });
  }, []);

  /* Slide widths are viewport-relative, so a resize changes how much travel the
     track has and therefore which arrows should be live. */
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(syncIndex);
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncIndex]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncIndex, { passive: true });
    return () => el.removeEventListener("scroll", syncIndex);
  }, [syncIndex]);

  /**
   * Moves the track by `delta` slides, or to an absolute edge.
   *
   * The starting point is read from the element's live `scrollLeft`, not from
   * the `index` state: `index` only catches up when the scroll event fires, so
   * two presses in quick succession would both compute from the same stale
   * index and the second would be a no-op. Deriving it from the DOM makes every
   * press land on the next snap point regardless of how fast they arrive.
   */
  const move = useCallback(
    (delta: number, to?: "start" | "end") => {
      const el = trackRef.current;
      if (!el) return;
      const slide = el.firstElementChild as HTMLElement | null;
      if (!slide) return;

      const step = slide.offsetWidth + 16; /* gap-4 */
      const max = el.scrollWidth - el.clientWidth;
      const from = Math.round(el.scrollLeft / step);
      const left =
        to === "start" ? 0 : to === "end" ? max : (from + delta) * step;

      el.scrollTo({
        left: Math.max(0, Math.min(left, max)),
        // Honoured here rather than left to the global CSS override: this is a
        // scripted scroll on an element, which that rule doesn't reach.
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion],
  );

  const { atStart, atEnd } = edges;

  /* Left/right on the track itself. The browser already scrolls a focused
     overflow container with the arrow keys, but only by a fixed step — this
     moves it a whole slide so the snap points and the arrow buttons behave
     identically. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0, "start");
    } else if (e.key === "End") {
      e.preventDefault();
      move(0, "end");
    }
  };

  return (
    <section id="work" className="bg-ink py-20 sm:py-24 lg:py-32">
      <div className={fuelShell}>
        <FuelSectionMeta section="portfolio" />

        <div className="mt-14 grid grid-cols-1 gap-10 sm:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Left rail — title, arrows, "see all". Sticky from lg so it holds
              beside the track the way the reference's does. */}
          <motion.div
            {...enterProps("left")}
            className="lg:col-span-3 lg:sticky lg:top-32 lg:self-start"
          >
            <h2 className={cn(fuelHeadline, "text-cream")}>
              {fuelPortfolio.title}
            </h2>
            <p className="mt-4 max-w-[26ch] text-[0.9375rem] leading-[1.55] text-cream/60">
              {fuelPortfolio.intro}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <ArrowButton
                label={fuelPortfolio.prevLabel}
                disabled={atStart}
                onClick={() => move(-1)}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
              </ArrowButton>
              <ArrowButton
                label={fuelPortfolio.nextLabel}
                disabled={atEnd}
                onClick={() => move(1)}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </ArrowButton>

              <span className={cn(fuelLabel, "ml-2 text-cream/45")}>
                {String(Math.min(index + 1, featured.length)).padStart(2, "0")} /{" "}
                {String(featured.length).padStart(2, "0")}
              </span>
            </div>

            <Link
              href={fuelPortfolio.seeAll.href}
              className={cn(
                fuelLabel,
                "mt-8 inline-flex items-center gap-2 text-cream underline decoration-cream/25 underline-offset-[6px]",
                "transition-colors duration-200 hover:text-primary hover:decoration-primary",
              )}
            >
              {fuelPortfolio.seeAll.label}
              <span aria-hidden>→</span>
            </Link>
          </motion.div>

          {/* The track. Native overflow + scroll-snap: touch swipe, trackpad
              and keyboard all work without reimplementing any of them, and the
              snap lands on hardware-accelerated scrolling rather than a JS
              tween. `data-lenis-prevent` keeps Lenis's wheel handler off it. */}
          <div className="lg:col-span-9">
            <ul
              ref={trackRef}
              data-lenis-prevent
              tabIndex={0}
              role="group"
              aria-roledescription="carousel"
              aria-label="Featured projects"
              onKeyDown={onKeyDown}
              className={cn(
                "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4",
                // The native scrollbar under a row of screenshots reads as a
                // stray rule; the arrows and snap carry the affordance.
                "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
              )}
            >
              {featured.map((project, i) => (
                <Slide
                  key={project.id}
                  project={project}
                  index={i}
                  dimmed={interactive && hovered !== null && hovered !== project.id}
                  onEnter={() => setHovered(project.id)}
                  onLeave={() =>
                    setHovered((h) => (h === project.id ? null : h))
                  }
                />
              ))}
            </ul>

            <p aria-live="polite" className="sr-only">
              Project {index + 1} of {featured.length}
              {featured[index] ? `: ${featured[index].name}` : ""}
            </p>
          </div>
        </div>
      </div>

      {interactive && (
        <FuelCursorChip
          visible={hoveredProject !== null}
          label={hoveredProject?.url ? "View" : "Private"}
        />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------
   Arrow

   Square and outlined, like the reference's. The press is a spring rather than
   a tween — that snap is the whole character of the control, and MotionConfig
   drops it for reduced-motion users without this component branching.
------------------------------------------------------------------------- */

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={springSnappy}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-[3px] border transition-colors duration-200",
        disabled
          ? "cursor-not-allowed border-cream/10 text-cream/25"
          : "border-cream/25 text-cream hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </motion.button>
  );
}

export default FuelPortfolio;
