"use client";

import { useCallback, useEffect, useState } from "react";

import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { fuelLabel } from "@/components/fuel/FuelPrimitives";
import { sectionList } from "@/lib/home-fuel-content";
import { cn } from "@/lib/utils";

/**
 * Clearance for the fixed navbar when a click jumps to a section. Negative
 * because Lenis and the native fallback both add the offset to the target's
 * document position, so the section top has to be asked to land *below* the
 * bar rather than under it.
 */
const JUMP_OFFSET = -96;

/**
 * A thin band across the viewport, at ~40% from the top. Whichever section
 * crosses it is the one being read — a better answer than "whichever is most
 * visible" on a page whose bands run several screens and where two of them
 * share the viewport for most of a scroll.
 */
const ACTIVE_BAND = "-38% 0px -57% 0px";

/**
 * The wayfinding rail: section numbers stacked down the left edge, the current
 * one orange and a step larger, each a jump to its band.
 *
 * Desktop only. It is an aid for a long page with a mouse and a tall viewport;
 * at 390 there is no gutter to put it in, and the section headers already carry
 * the same information in the flow.
 *
 * It sits on its own near-opaque plate rather than straight on the page. The
 * rail is fixed and the page is not one colour — it passes over the two cream
 * bands and both CTA bands — so cream numerals alone would be legible for two
 * thirds of a scroll and invisible for the rest. The plate makes the ground
 * under the rail constant, which means one palette that holds AA everywhere
 * (cream/60 and brand orange both clear 6:1 on it over every band) instead of
 * a tone that has to be tracked and swapped. On the dark bands it reads as
 * nothing but a hairline.
 *
 * `aria-hidden`, with the buttons out of the tab order: this is a redundant
 * view of a structure a screen reader already has as nine `h2`s, and offering
 * a nine-stop navigation of bare numbers would be worse than not offering it.
 *
 * Tracking is an IntersectionObserver rather than a scroll handler, so nothing
 * runs on a frame where no band boundary was crossed — this page is already
 * carrying Lenis, a WebGL hero and two carousels. When nothing is in the band
 * (the CTA bands and the logo belt sit between sections and carry no number)
 * the last entry simply holds, which is what a reader passing a gap expects.
 */
export function FuelScrollspy() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const elements = sectionList
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    /* Which sections currently cross the band. A Set rather than a single id:
       a short section can sit wholly inside the band while the next one is
       entering it, and the topmost of those is the one to show. */
    const crossing = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        }

        // sectionList is in page order, so `find` gives the topmost crossing
        // section. No match means a gap between bands — hold the last one.
        const next = sectionList.find((s) => crossing.has(s.id));
        if (next) setActiveId(next.id);
      },
      { rootMargin: ACTIVE_BAND, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jump = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      /* Through the Lenis context rather than el.scrollIntoView: Lenis owns the
         scroll position while it runs, and a native smooth scroll would be
         fought by its rAF loop. Outside Lenis — touch, or anyone who asked for
         reduced motion — the same call falls back to window.scrollTo with
         `behavior: auto`, so the jump lands instantly instead of animating. */
      scrollTo(el, JUMP_OFFSET);
      setActiveId(id);
    },
    [scrollTo],
  );

  const revealed = activeId !== null;

  return (
    <nav
      aria-hidden
      className={cn(
        /* 32px wide sitting 4px off the edge, so it stops exactly at the
           shell's 40px gutter: `fuelShell` is near-full-bleed, so there is no
           spare margin to float in and a wider rail lands on the first
           character of every display line. */
        "fixed top-1/2 left-1 z-40 hidden -translate-y-1/2 lg:block",
        "transition-opacity duration-500",
        // Held back until the first numbered section, so it never sits over
        // the hero image.
        revealed ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ol
        className={cn(
          fuelLabel,
          "flex w-8 flex-col items-center gap-3 rounded-full bg-ink/90 py-4 ring-1 ring-cream/10 backdrop-blur-sm",
        )}
      >
        {sectionList.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="flex">
              <button
                type="button"
                tabIndex={-1}
                onClick={() => jump(section.id)}
                title={`${section.num} — ${section.title}`}
                className={cn(
                  "block w-6 text-center transition-[color,transform] duration-300 ease-out",
                  active
                    ? "scale-125 text-primary"
                    : "text-cream/60 hover:text-cream",
                )}
              >
                {section.num}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default FuelScrollspy;
