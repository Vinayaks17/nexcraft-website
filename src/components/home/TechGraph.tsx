"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RevealHeading } from "@/components/ui/RevealHeading";
import {
  animate,
  motion,
  motionValue,
  useInView,
  useTransform,
  type MotionValue,
} from "framer-motion";

import {
  RINGS,
  edges,
  statusChips,
  techGraph,
  tiles,
  type Tile,
} from "@/lib/tech-graph";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Field inset and the clearance kept between any tile box and the heading. */
const PAD = 16;
const GAP = 30;

type Drift = { x: MotionValue<number>; y: MotionValue<number> };
type Placed = { tile: Tile; x: number; y: number; px: number };
type Chip = { id: string; text: string; x: number; y: number };

/* -------------------------------------------------------------------------
   Geometry
------------------------------------------------------------------------- */

/** Minimum gap between two tile boxes. */
const SEP = 14;

/** Radial seed: put the tile on its ring, pushed out clear of the heading. */
function seed(tile: Tile, W: number, H: number, headW: number, headH: number) {
  const { s, px } = RINGS[tile.ring];
  const half = px / 2;
  const theta = (tile.angle * Math.PI) / 180;
  // Ellipse basis: one unit of `scale` along `theta` covers this much per axis.
  const ax = (W / 2) * Math.abs(Math.cos(theta));
  const ay = (H / 2) * Math.abs(Math.sin(theta));

  const needs: number[] = [];
  if (ax > 1e-6) needs.push((headW / 2 + half + GAP) / ax);
  if (ay > 1e-6) needs.push((headH / 2 + half + GAP) / ay);
  // Clearing on either axis is enough to be outside the rectangle.
  const required = needs.length ? Math.min(...needs) : 0;

  const limits: number[] = [];
  if (ax > 1e-6) limits.push((W / 2 - half - PAD) / ax);
  if (ay > 1e-6) limits.push((H / 2 - half - PAD) / ay);
  const max = limits.length ? Math.min(...limits) : 1;

  const scale = Math.min(Math.max(s, required), max);
  return {
    x: W / 2 + scale * (W / 2) * Math.cos(theta),
    y: H / 2 + scale * (H / 2) * Math.sin(theta),
  };
}

/**
 * Lays out all 24 tiles: radial seed, then a relaxation pass that separates any
 * overlapping pair and re-applies the heading exclusion and field bounds.
 *
 * The seed alone isn't enough — three ring angles very nearly coincide at the
 * top of the field, and once the exclusion push converges their radii the tiles
 * stack. Relaxing pairwise fixes that at any viewport instead of relying on
 * hand-picked angles that only happen to work at one width. Runs once per
 * resize, not per frame.
 */
function layout(
  W: number,
  H: number,
  headW: number,
  headH: number,
): { placed: Map<string, Placed>; chips: Chip[] } {
  const pts = tiles.map((t) => seed(t, W, H, headW, headH));

  for (let iter = 0; iter < 40; iter++) {
    let moved = false;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const hi = RINGS[tiles[i].ring].px / 2;
        const hj = RINGS[tiles[j].ring].px / 2;
        const need = hi + hj + SEP;
        const dx = pts[j].x - pts[i].x;
        const dy = pts[j].y - pts[i].y;
        const ox = need - Math.abs(dx);
        const oy = need - Math.abs(dy);
        // Axis-aligned boxes only overlap when BOTH axes do; separate along the
        // shallower one so tiles slide apart rather than leaping.
        if (ox > 0 && oy > 0) {
          moved = true;
          if (ox < oy) {
            const s = (ox / 2) * (dx >= 0 ? 1 : -1);
            pts[i].x -= s;
            pts[j].x += s;
          } else {
            const s = (oy / 2) * (dy >= 0 ? 1 : -1);
            pts[i].y -= s;
            pts[j].y += s;
          }
        }
      }
    }

    for (let k = 0; k < pts.length; k++) {
      const half = RINGS[tiles[k].ring].px / 2;
      const p = pts[k];

      // Re-assert the heading exclusion, escaping on the shallower axis.
      const ox = headW / 2 + half + GAP - Math.abs(p.x - W / 2);
      const oy = headH / 2 + half + GAP - Math.abs(p.y - H / 2);
      if (ox > 0 && oy > 0) {
        if (ox < oy) p.x += p.x >= W / 2 ? ox : -ox;
        else p.y += p.y >= H / 2 ? oy : -oy;
      }

      p.x = Math.min(Math.max(p.x, half + PAD), W - half - PAD);
      p.y = Math.min(Math.max(p.y, half + PAD), H - half - PAD);
    }

    if (!moved) break;
  }

  const placed = new Map(
    tiles.map((t, i) => [
      t.id,
      { tile: t, x: pts[i].x, y: pts[i].y, px: RINGS[t.ring].px },
    ]),
  );

  /* Chips are placed last, by search rather than by nudging: a nudge can
     oscillate between two tiles and never settle. Sampling the field and
     taking the free point nearest the chip's seed always converges, and it
     re-solves per width instead of relying on fractions that only work once. */
  const chips = statusChips.map((c) => {
    const cw = 16 + c.text.length * 6.6;
    const ch = 24;
    const seedX = c.fx * W;
    const seedY = c.fy * H;

    const free = (x: number, y: number) => {
      if (x - cw / 2 < PAD || x + cw / 2 > W - PAD) return false;
      if (y - ch / 2 < PAD || y + ch / 2 > H - PAD) return false;
      if (
        Math.abs(x - W / 2) < headW / 2 + cw / 2 + 12 &&
        Math.abs(y - H / 2) < headH / 2 + ch / 2 + 12
      ) {
        return false;
      }
      for (const tile of placed.values()) {
        const half = tile.px / 2;
        if (
          Math.abs(x - tile.x) < cw / 2 + half + 10 &&
          Math.abs(y - tile.y) < ch / 2 + half + 10
        ) {
          return false;
        }
      }
      return true;
    };

    let best = { x: seedX, y: seedY, d: Infinity };
    const STEP = 12;
    for (let x = PAD + cw / 2; x <= W - PAD - cw / 2; x += STEP) {
      for (let y = PAD + ch / 2; y <= H - PAD - ch / 2; y += STEP) {
        if (!free(x, y)) continue;
        const d = (x - seedX) ** 2 + (y - seedY) ** 2;
        if (d < best.d) best = { x, y, d };
      }
    }

    return { id: c.id, text: c.text, x: best.x, y: best.y };
  });

  return { placed, chips };
}

/* -------------------------------------------------------------------------
   Pieces
------------------------------------------------------------------------- */

function TileFace({ tile, px }: { tile: Tile; px: number }) {
  const brand = `#${tile.hex}`;
  const onWhite = tile.treatment === "white";
  return (
    <span
      style={{ width: px, height: px, backgroundColor: onWhite ? "#ffffff" : brand }}
      className="flex items-center justify-center rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.75)]"
    >
      <svg
        viewBox="0 0 24 24"
        width={Math.round(px * 0.5)}
        height={Math.round(px * 0.5)}
        fill={onWhite ? brand : "#ffffff"}
        aria-hidden
      >
        <path d={tile.path} />
      </svg>
    </span>
  );
}

/**
 * One hairline. Endpoints derive from both tiles' drift motion values, so the
 * line stays welded to what it connects instead of drifting loose.
 *
 * `live` adds the ambient pass: a short orange dash that travels the length of
 * the line like a packet moving between two tools. Only a handful of edges are
 * live at once (see LIVE_EVERY) and each is offset, so the field reads as
 * quietly busy rather than as a synchronised light show. Hover still wins.
 */
function Edge({
  from,
  to,
  fromDrift,
  toDrift,
  warm,
  live,
  index,
  reduceMotion,
}: {
  from: Placed;
  to: Placed;
  fromDrift: Drift;
  toDrift: Drift;
  warm: boolean;
  live: boolean;
  index: number;
  reduceMotion: boolean;
}) {
  const x1 = useTransform(fromDrift.x, (v) => from.x + v);
  const y1 = useTransform(fromDrift.y, (v) => from.y + v);
  const x2 = useTransform(toDrift.x, (v) => to.x + v);
  const y2 = useTransform(toDrift.y, (v) => to.y + v);

  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const seg = Math.min(90, len * 0.32);

  return (
    <>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={warm ? "var(--color-primary)" : "rgba(242,237,228,0.08)"}
        strokeWidth={1}
        style={{ transition: "stroke 300ms ease" }}
      />

      {/* Ambient pass. Reduced motion keeps the warmth but drops the travel. */}
      {live && !warm && (
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--color-primary)"
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={reduceMotion ? { opacity: 0.22 } : { opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.22 }
              : { opacity: [0, 0.75, 0.75, 0], strokeDashoffset: [len, -seg] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 2.6,
                  ease: "easeInOut",
                  times: [0, 0.22, 0.7, 1],
                  delay: (index % 5) * 0.22,
                }
          }
          style={
            reduceMotion ? undefined : { strokeDasharray: `${seg} ${len + seg}` }
          }
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------
   Desktop field
------------------------------------------------------------------------- */

function Field() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const inView = useInView(fieldRef, { once: true, amount: 0.2 });

  const [box, setBox] = useState({ w: 0, h: 0, headW: 0, headH: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  // Rotates which edges carry the ambient glow. One counter drives the whole
  // field, so there is a single timer rather than one per edge.
  const [tick, setTick] = useState(0);

  // One drift pair per tile, created once and shared by the tile and its lines.
  const drifts = useMemo<Drift[]>(
    () => tiles.map(() => ({ x: motionValue(0), y: motionValue(0) })),
    [],
  );
  const driftOf = useMemo(
    () => Object.fromEntries(tiles.map((t, i) => [t.id, drifts[i]])),
    [drifts],
  );

  // Measure the field and the real heading box together, so placement reacts to
  // the heading actually growing rather than to a guessed size.
  useEffect(() => {
    const field = fieldRef.current;
    const head = headRef.current;
    if (!field || !head) return;

    const read = () => {
      const f = field.getBoundingClientRect();
      const h = head.getBoundingClientRect();
      setBox({ w: f.width, h: f.height, headW: h.width, headH: h.height });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(field);
    ro.observe(head);
    return () => ro.disconnect();
  }, []);

  // Autonomous drift — framer writes the motion values directly, so React never
  // re-renders per frame. Outer rings travel further for parallax depth.
  useEffect(() => {
    if (reduceMotion) return;

    const controls = tiles.flatMap((t, i) => {
      const amp = RINGS[t.ring].drift;
      // Deterministic per-tile period and phase (no Math.random), so server and
      // client agree and every reload looks the same.
      const period = 15 + ((i * 7) % 11);
      const phase = ((i * 13) % 10) / 10;
      return [
        animate(drifts[i].x, [0, amp, 0, -amp, 0], {
          duration: period,
          repeat: Infinity,
          ease: "easeInOut",
          delay: -phase * period,
        }),
        animate(drifts[i].y, [0, -amp * 0.8, 0, amp * 0.8, 0], {
          duration: period * 1.31,
          repeat: Infinity,
          ease: "easeInOut",
          delay: -phase * period * 0.6,
        }),
      ];
    });

    return () => controls.forEach((c) => c.stop());
  }, [reduceMotion, drifts]);

  const solved = useMemo(
    () => (box.w && box.h ? layout(box.w, box.h, box.headW, box.headH) : null),
    [box],
  );
  const placed = solved?.placed ?? null;

  /* ~4 edges live at any moment, rotating. The modulus is derived from the edge
     count so the density holds if the graph changes shape. */
  const liveEvery = Math.max(2, Math.ceil(edges.length / 4));

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setTick((n) => n + 1), 1700);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const neighbours = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const [a, b] of edges) {
      if (!m.has(a)) m.set(a, new Set());
      if (!m.has(b)) m.set(b, new Set());
      m.get(a)!.add(b);
      m.get(b)!.add(a);
    }
    return m;
  }, []);

  return (
    <div
      ref={fieldRef}
      /* Fills what's left of the viewport under the heading block. The h<800
         clamp is the laptop case: at 1366x768 a full-height field pushes the
         outer rings past the fold, so it caps instead of overflowing. */
      className="relative h-[min(78svh,760px)] max-h-[760px] min-h-[520px] w-full"
    >
      {/* Hairlines behind everything. No viewBox → user units are CSS px. */}
      {placed && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          {edges.map(([a, b], ei) => {
            const pa = placed.get(a);
            const pb = placed.get(b);
            if (!pa || !pb) return null;
            return (
              <Edge
                key={`${a}-${b}-${(tick + ei) % liveEvery === 0 ? tick : 'idle'}`}
                from={pa}
                to={pb}
                fromDrift={driftOf[a]}
                toDrift={driftOf[b]}
                warm={hovered === a || hovered === b}
                live={(tick + ei) % liveEvery === 0}
                index={ei}
                reduceMotion={reduceMotion}
              />
            );
          })}
        </svg>
      )}

      {/* Status chips, nudged clear of the settled tiles */}
      {solved?.chips.map((chip) => (
        <span
          key={chip.id}
          style={{ left: chip.x, top: chip.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 bg-ink/70 px-2.5 py-1 font-mono text-[0.625rem] whitespace-nowrap tracking-[0.06em] text-cream/55 backdrop-blur-sm"
        >
          {chip.text}
        </span>
      ))}

      {/* Tiles */}
      {placed &&
        tiles.map((tile, i) => {
          const p = placed.get(tile.id)!;
          const isHot =
            hovered === tile.id ||
            (hovered ? (neighbours.get(hovered)?.has(tile.id) ?? false) : false);
          // Radiate outward from the centre: ring first, then position in ring.
          const delay = tile.ring * 0.16 + (i % 9) * 0.035;

          return (
            <motion.div
              key={tile.id}
              style={{
                left: p.x,
                top: p.y,
                x: drifts[i].x,
                y: drifts[i].y,
                marginLeft: -p.px / 2,
                marginTop: -p.px / 2,
              }}
              className="absolute"
              onHoverStart={() => setHovered(tile.id)}
              onHoverEnd={() => setHovered((h) => (h === tile.id ? null : h))}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={
                  inView
                    ? { opacity: RINGS[tile.ring].opacity, scale: 1 }
                    : { opacity: 0, scale: 0.4 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 20 }}
                  className={cn(
                    "cursor-default rounded-2xl transition-shadow duration-300",
                    isHot && "shadow-glow",
                  )}
                >
                  <TileFace tile={tile} px={p.px} />
                </motion.div>

                <span
                  className={cn(
                    "pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full",
                    "border border-white/10 bg-ink px-2.5 py-1 font-mono text-[0.625rem] whitespace-nowrap text-cream",
                    "transition-opacity duration-200",
                    hovered === tile.id ? "opacity-100" : "opacity-0",
                  )}
                >
                  {tile.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}

      {/* Centred heading — the exclusion zone is solved against this box. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5">
        <div ref={headRef} className="max-w-[34rem] text-center">
          <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
            <span className="h-px w-6 bg-primary" aria-hidden />
            {techGraph.eyebrow}
          </span>
          <RevealHeading
            text={techGraph.heading}
            as="h2"
            className="mt-5 text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem]"
          />
          <p className="mono-caption mt-5 text-cream/70">{techGraph.sub}</p>
        </div>
      </div>

      {/* The field is decorative; this is its accessible equivalent. */}
      <ul className="sr-only">
        {tiles.map((t) => (
          <li key={t.id}>{t.label}</li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Mobile — heading on top, then a static grid of all 24 tiles.
------------------------------------------------------------------------- */

function CompactGrid() {
  return (
    <div>
      <div className="text-center">
        <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
          <span className="h-px w-6 bg-primary" aria-hidden />
          {techGraph.eyebrow}
        </span>
        <RevealHeading
          text={techGraph.heading}
          as="h2"
          className="mt-5 text-[2rem]"
        />
        <p className="mono-caption mt-5 text-cream/70">{techGraph.sub}</p>
      </div>

      <ul className="mx-auto mt-10 grid max-w-sm grid-cols-5 justify-items-center gap-3">
        {tiles.map((tile) => (
          <li key={tile.id} aria-label={tile.label}>
            <TileFace tile={tile} px={48} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechGraph() {
  // false during SSR and hydration, so mobile is the default render and the
  // field only mounts once we know there's room for it.
  const isWide = useMediaQuery("(min-width: 768px)");

  return (
    <section className="relative w-full overflow-hidden bg-void py-20 md:min-h-[100svh] md:py-24">
      {/* The neighbours are #0a0a0a. Fading into pure black over ~120px makes
          this read as deliberate deep space instead of a mismatched slab. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-ink to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-ink to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col justify-center px-5 sm:px-8 md:min-h-[calc(100svh-12rem)] lg:px-10">
        {isWide ? <Field /> : <CompactGrid />}
      </div>
    </section>
  );
}

export default TechGraph;
