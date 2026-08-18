"use client";

import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { AutomationDiagram } from "@/components/home/AutomationDiagram";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { diagramById, diagrams } from "@/lib/automation-graph";
import { services } from "@/lib/home-content";
import { EASE } from "@/lib/motion";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const TOTAL = services.items.length;
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/* -------------------------------------------------------------------------
   Rail — progress dots between two chevrons
------------------------------------------------------------------------- */

function Rail({
  activeIndex,
  onPick,
  reducedMotion,
}: {
  activeIndex: number;
  onPick: (i: number) => void;
  reducedMotion: boolean;
}) {
  const step = (delta: number) => onPick(clamp(activeIndex + delta, 0, TOTAL - 1));

  const chevron =
    "flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-cream/60 " +
    "transition-colors duration-200 hover:border-primary/60 hover:text-primary " +
    "disabled:pointer-events-none disabled:opacity-30 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div className="hidden shrink-0 flex-col items-center gap-4 sm:flex">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={activeIndex === 0}
        aria-label="Previous automation"
        className={chevron}
      >
        <ChevronUp className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-2.5">
        {services.items.map((service, i) => {
          const active = i === activeIndex;
          return (
            <button
              key={service.title}
              type="button"
              onClick={() => onPick(i)}
              aria-label={`Go to ${service.title}`}
              aria-current={active ? "true" : undefined}
              className="group flex h-5 w-4 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <motion.span
                initial={false}
                animate={{ height: active ? 22 : 6 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 32 }
                }
                className={cn(
                  "w-[3px] rounded-full transition-colors duration-300",
                  active
                    ? "gradient-brand"
                    : "bg-cream/25 group-hover:bg-cream/50",
                )}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={activeIndex === TOTAL - 1}
        aria-label="Next automation"
        className={chevron}
      >
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Accordion
------------------------------------------------------------------------- */

function ServiceRow({
  service,
  index,
  active,
  onSelect,
  reducedMotion,
  idBase,
}: {
  service: (typeof services.items)[number];
  index: number;
  active: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
  idBase: string;
}) {
  const panelId = `${idBase}-panel-${index}`;
  const buttonId = `${idBase}-row-${index}`;

  return (
    <li className="border-b border-white/10">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onSelect}
          aria-expanded={active}
          aria-controls={panelId}
          className="group flex w-full items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:py-5"
        >
          <span
            className={cn(
              "font-mono text-[0.625rem] tracking-[0.18em] transition-colors duration-300",
              active ? "text-primary" : "text-cream/35",
            )}
          >
            {pad(index + 1)}
          </span>

          <span
            className={cn(
              "flex-1 font-display text-lg leading-tight font-medium tracking-[-0.01em] transition-colors duration-300 sm:text-xl",
              active ? "text-cream" : "text-cream/45 group-hover:text-cream/75",
            )}
          >
            {service.title}
          </span>

          {/* Outlined glyph chip, echoing the diagram's own chips. */}
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
              active
                ? "border-primary/45 bg-primary/12 text-primary"
                : "border-white/12 text-cream/40 group-hover:border-white/25 group-hover:text-cream/70",
            )}
          >
            <Icon name={service.icon as IconName} className="h-4 w-4" />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.38, ease: EASE },
                    opacity: { duration: 0.25 },
                  }
            }
            className="overflow-hidden"
          >
            <div className="pr-2 pb-5 pl-9">
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-cream/70">
                {service.description}
              </p>
              <p className="mono-caption mt-3 text-primary/80">{service.tag}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* -------------------------------------------------------------------------
   Section
------------------------------------------------------------------------- */

export function AutomationShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const idBase = useId();

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = usePrefersReducedMotion();
  const { scrollTo } = useSmoothScroll();

  /* Progress through the tall scroll track. The sticky panel inside it stays
     put while this runs 0 -> 1, which is what turns vertical distance into
     steps. Works identically in both directions, unlike per-item whileInView. */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!isDesktop) return;
    const next = clamp(Math.floor(p * TOTAL), 0, TOTAL - 1);
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  /* Below lg there is no scroll track to move through, so selection is purely
     a tap. On desktop we scroll the track to the middle of the target step and
     let the progress listener above set the index — same path a manual scroll
     takes, so the two can never disagree. */
  const goTo = useCallback(
    (i: number) => {
      if (!isDesktop) {
        setActiveIndex(i);
        return;
      }
      const el = scrollRef.current;
      if (!el) return;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) {
        setActiveIndex(i);
        return;
      }
      scrollTo(el.offsetTop + ((i + 0.5) / TOTAL) * travel);
    },
    [isDesktop, scrollTo],
  );

  /* Paired by key, not by array position, so reordering the services list
     can't silently hand a service somebody else's schematic. */
  const diagram = diagramById.get(services.items[activeIndex].short) ?? diagrams[0];

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow={services.automation.eyebrow}
          heading={services.automation.title}
          intro={services.automation.description}
        />
      </div>

      {/* The scroll track. Only tall on desktop — on mobile this collapses to
          its natural height and the panel below stops being sticky. */}
      <div ref={scrollRef} className="relative mt-10 lg:mt-14 lg:h-[500vh]">
        <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh-7rem)] lg:items-center">
          <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              {/* Diagram */}
              <div className="order-1 mx-auto w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[520px]">
                <AutomationDiagram
                  diagram={diagram}
                  reducedMotion={reducedMotion}
                />
              </div>

              {/* List */}
              <div className="order-2 flex gap-5 lg:gap-7">
                <Rail
                  activeIndex={activeIndex}
                  onPick={goTo}
                  reducedMotion={reducedMotion}
                />
                <ol className="min-w-0 flex-1 border-t border-white/10">
                  {services.items.map((service, i) => (
                    <ServiceRow
                      key={service.title}
                      service={service}
                      index={i}
                      active={i === activeIndex}
                      onSelect={() => goTo(i)}
                      reducedMotion={reducedMotion}
                      idBase={idBase}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutomationShowcase;
