"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";

import {
  HUB,
  type Diagram,
  type DiagramEdge,
  type DiagramNode,
} from "@/lib/automation-graph";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
   Geometry — all in the 0-100 canvas space the data file uses.
------------------------------------------------------------------------- */

type Pt = { x: number; y: number };

/** Waypoints for an orthogonal route, with degenerate corners dropped. */
function waypoints(a: Pt, b: Pt, route: DiagramEdge["route"]): Pt[] {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const raw: Pt[] =
    route === "HV"
      ? [a, { x: b.x, y: a.y }, b]
      : route === "VH"
        ? [a, { x: a.x, y: b.y }, b]
        : route === "ZH"
          ? [a, { x: mid.x, y: a.y }, { x: mid.x, y: b.y }, b]
          : [a, { x: a.x, y: mid.y }, { x: b.x, y: mid.y }, b];

  // A corner that sits on top of its neighbour isn't a corner.
  return raw.filter(
    (p, i) => i === 0 || Math.hypot(p.x - raw[i - 1].x, p.y - raw[i - 1].y) > 0.01,
  );
}

/** Polyline through `pts` with the corners rounded off — circuit-board feel. */
function roundedPath(pts: Pt[], radius = 3.5) {
  if (pts.length < 2) return "";
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const p = pts[i];
    const next = pts[i + 1];
    const inLen = Math.hypot(p.x - prev.x, p.y - prev.y);
    const outLen = Math.hypot(next.x - p.x, next.y - p.y);
    // Never eat more than half of either leg, or short legs invert.
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const vIn = { x: (p.x - prev.x) / inLen, y: (p.y - prev.y) / inLen };
    const vOut = { x: (next.x - p.x) / outLen, y: (next.y - p.y) / outLen };
    d += ` L ${p.x - vIn.x * r} ${p.y - vIn.y * r}`;
    d += ` Q ${p.x} ${p.y} ${p.x + vOut.x * r} ${p.y + vOut.y * r}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

/* -------------------------------------------------------------------------
   Variants
------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

const makeContainer = (still: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: still
      ? {}
      : { staggerChildren: 0.045, delayChildren: 0.08 },
  },
  exit: {
    transition: still ? {} : { staggerChildren: 0.022, staggerDirection: -1 },
  },
});

const wireVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.68 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 26, mass: 0.6 },
  },
  exit: { opacity: 0, scale: 0.82, transition: { duration: 0.18, ease: "easeIn" } },
};

/* -------------------------------------------------------------------------
   Node rendering
------------------------------------------------------------------------- */

function NodeChip({ node }: { node: DiagramNode }) {
  const isTile = node.kind === "tile";
  const onWhite = node.treatment === "white";

  return (
    <motion.div
      variants={nodeVariants}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div
        className={cn(
          "flex aspect-square items-center justify-center",
          isTile
            ? "w-[clamp(30px,9.5cqw,54px)] rounded-[26%] shadow-[0_8px_22px_-10px_rgba(0,0,0,0.85)]"
            : "w-[clamp(26px,7.8cqw,44px)] rounded-[28%] border border-cream/18 bg-ink text-cream/65",
        )}
        style={
          isTile
            ? { backgroundColor: onWhite ? "#ffffff" : `#${node.hex}` }
            : undefined
        }
      >
        {isTile ? (
          <svg
            viewBox="0 0 24 24"
            className="h-1/2 w-1/2"
            fill={onWhite ? `#${node.hex}` : "#ffffff"}
            aria-hidden
          >
            <path d={node.path} />
          </svg>
        ) : (
          node.icon && <node.icon className="h-1/2 w-1/2" strokeWidth={1.6} aria-hidden />
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   Canvas
------------------------------------------------------------------------- */

export function AutomationDiagram({
  diagram,
  reducedMotion,
  className,
}: {
  diagram: Diagram;
  reducedMotion: boolean;
  className?: string;
}) {
  const byId = new Map<string, Pt>(diagram.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
  byId.set("hub", { x: HUB.x, y: HUB.y });

  const routed = diagram.edges
    .map((e) => {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      if (!a || !b) return null;
      return { ...e, d: roundedPath(waypoints(a, b, e.route)) };
    })
    .filter((e): e is DiagramEdge & { d: string } => e !== null);

  const container = makeContainer(reducedMotion);

  return (
    <div
      className={cn("relative aspect-square w-full [container-type:inline-size]", className)}
      role="img"
      aria-label={`Schematic for ${diagram.id}: ${diagram.nodes.map((n) => n.label).join(", ")}, all connected to NexCRAFT.`}
    >
      {/* Dotted grid + faint centre square. Static: this is the board the
          diagrams get drawn onto, so it never animates. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,rgba(242,237,228,0.13)_1px,transparent_1px)] [background-size:clamp(18px,5.4cqw,30px)_clamp(18px,5.4cqw,30px)] [mask-image:radial-gradient(circle_at_50%_50%,#000_55%,transparent_88%)]"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cream/8"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/16 blur-2xl"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={diagram.id}
          variants={container}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Wires. preserveAspectRatio is safe to leave default because the
              canvas is locked square, so 100x100 user units map uniformly. */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {routed.map((e) => (
              <motion.path
                key={`${e.from}-${e.to}`}
                d={e.d}
                variants={wireVariants}
                fill="none"
                stroke="rgba(242,237,228,0.28)"
                strokeWidth={0.35}
                strokeDasharray="0.6 2.6"
                strokeLinecap="round"
              />
            ))}

            {/* Travelling pulse. A short lit segment slid along the wire via
                pathOffset — the same stroke-dashoffset mechanism, so it costs
                one animated attribute per edge. Runs once as the draw-in;
                `live` edges keep looping for ambient life. */}
            {!reducedMotion &&
              routed.map((e, i) => (
                <motion.path
                  key={`pulse-${e.from}-${e.to}`}
                  d={e.d}
                  fill="none"
                  stroke="#ff924d"
                  strokeWidth={0.55}
                  strokeLinecap="round"
                  initial={{ pathLength: 0.2, pathOffset: -0.2, opacity: 0 }}
                  animate={{
                    pathOffset: 1,
                    opacity: [0, 0.95, 0.95, 0],
                  }}
                  transition={{
                    duration: e.live ? 2.1 : 0.9,
                    ease: e.live ? "easeInOut" : EASE,
                    delay: 0.12 + i * 0.05,
                    ...(e.live
                      ? { repeat: Infinity, repeatDelay: 1.6 }
                      : {}),
                  }}
                />
              ))}
          </svg>

          {/* Nodes sit above the wires and are opaque, which is what hides the
              wire ends underneath them — no endpoint insetting needed. */}
          <div className="absolute inset-0">
            {diagram.nodes.map((n) => (
              <NodeChip key={n.id} node={n} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Hub. Lives outside AnimatePresence so it holds still while the
          constellation around it is swapped. */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-[55%] rounded-full bg-primary/25 blur-xl"
          />
          <div className="gradient-brand relative flex aspect-square w-[clamp(40px,12cqw,68px)] items-center justify-center rounded-[28%] shadow-[0_0_36px_-6px_rgba(255,146,77,0.75)]">
            <span className="font-heading text-[clamp(18px,5.4cqw,30px)] leading-none font-semibold text-on-brand">
              N
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutomationDiagram;
