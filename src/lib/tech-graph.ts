import {
  siAirtable,
  siFigma,
  siFramer,
  siGithub,
  siHubspot,
  siJavascript,
  siMailchimp,
  siMake,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siNotion,
  siPython,
  siReact,
  siShopify,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWebflow,
  siWoocommerce,
  siWordpress,
  siZapier,
} from "simple-icons";

/**
 * The stack, drawn as a field of floating logos orbiting a centred heading.
 *
 * Tiles are placed on three concentric ellipses. Only the ring fraction and the
 * angle live here — the component resolves them to pixels against the measured
 * field and pushes any tile outward until it clears the heading box, so the
 * exclusion zone is guaranteed by construction rather than by hand-tuned
 * coordinates that only hold at one viewport.
 */

export type Tile = {
  id: string;
  label: string;
  /** simple-icons 24×24 glyph outline. */
  path: string;
  /** Official brand hex, without the leading #. */
  hex: string;
  /**
   * `white` = brand-coloured glyph on a white tile (near-black marks, light
   * marks, and filled-tile marks like Zapier whose logo *is* a coloured
   * square). `brand` = white glyph on a brand-coloured tile.
   */
  treatment: "white" | "brand";
  /** 0 inner / 1 middle / 2 outer. Drives size, radius, drift and opacity. */
  ring: 0 | 1 | 2;
  /** Degrees clockwise from 3 o'clock. */
  angle: number;
};

const RING_START = [12, 32, 0];

/** Spreads `names` evenly around its ring, starting at that ring's offset. */
function ring(
  r: 0 | 1 | 2,
  items: Array<[string, string, string, string, Tile["treatment"]]>,
): Tile[] {
  return items.map(([id, label, path, hex, treatment], i) => ({
    id,
    label,
    path,
    hex,
    treatment,
    ring: r,
    angle: RING_START[r] + (i * 360) / items.length,
  }));
}

export const tiles: Tile[] = [
  // Inner ring — largest tiles, the tools we lead with.
  ...ring(0, [
    ["figma", "Figma", siFigma.path, siFigma.hex, "brand"],
    ["wordpress", "WordPress", siWordpress.path, siWordpress.hex, "brand"],
    ["react", "React", siReact.path, siReact.hex, "white"],
    ["next", "Next.js", siNextdotjs.path, siNextdotjs.hex, "white"],
    ["webflow", "Webflow", siWebflow.path, siWebflow.hex, "brand"],
    ["python", "Python", siPython.path, siPython.hex, "brand"],
    // Zapier's mark is a filled rounded square with knockout lettering, so it
    // has to sit on white — filled brand-orange, that's the real logo.
    ["zapier", "Zapier", siZapier.path, siZapier.hex, "white"],
  ]),
  // Middle ring.
  ...ring(1, [
    ["typescript", "TypeScript", siTypescript.path, siTypescript.hex, "brand"],
    ["node", "Node.js", siNodedotjs.path, siNodedotjs.hex, "white"],
    ["tailwind", "Tailwind CSS", siTailwindcss.path, siTailwindcss.hex, "white"],
    ["vercel", "Vercel", siVercel.path, siVercel.hex, "white"],
    ["github", "GitHub", siGithub.path, siGithub.hex, "white"],
    ["make", "Make", siMake.path, siMake.hex, "brand"],
    ["shopify", "Shopify", siShopify.path, siShopify.hex, "white"],
    ["stripe", "Stripe", siStripe.path, siStripe.hex, "brand"],
    ["notion", "Notion", siNotion.path, siNotion.hex, "white"],
  ]),
  // Outer ring — smallest, dimmest, drifts most.
  ...ring(2, [
    ["javascript", "JavaScript", siJavascript.path, siJavascript.hex, "white"],
    ["woocommerce", "WooCommerce", siWoocommerce.path, siWoocommerce.hex, "brand"],
    ["framer", "Framer", siFramer.path, siFramer.hex, "brand"],
    ["n8n", "n8n", siN8n.path, siN8n.hex, "brand"],
    ["airtable", "Airtable", siAirtable.path, siAirtable.hex, "white"],
    // Substituted for Slack, which simple-icons no longer carries.
    ["supabase", "Supabase", siSupabase.path, siSupabase.hex, "white"],
    ["mailchimp", "Mailchimp", siMailchimp.path, siMailchimp.hex, "white"],
    ["hubspot", "HubSpot", siHubspot.path, siHubspot.hex, "white"],
  ]),
];

/** Per-ring geometry. `s` is the base fraction of the field's half-extents. */
export const RINGS = [
  { s: 0.62, px: 72, drift: 7, opacity: 1 },
  { s: 0.78, px: 56, drift: 10, opacity: 0.92 },
  { s: 0.93, px: 44, drift: 14, opacity: 0.78 },
] as const;

/**
 * Ring cycles for the two inner rings plus a few spokes outward — enough to
 * read as one connected system without turning into a cobweb.
 */
export const edges: [string, string][] = (() => {
  const byRing = [0, 1, 2].map((r) => tiles.filter((t) => t.ring === r));
  const out: [string, string][] = [];

  for (const r of [0, 1]) {
    const list = byRing[r];
    list.forEach((t, i) => out.push([t.id, list[(i + 1) % list.length].id]));
  }
  // Spokes: every inner tile reaches to the nearest middle tile by angle, and
  // every other middle tile reaches on out to the nearest outer one.
  const nearest = (angle: number, list: Tile[]) =>
    list.reduce((best, t) => {
      const d = (x: Tile) => Math.abs(((x.angle - angle + 540) % 360) - 180);
      return d(t) > d(best) ? t : best;
    }, list[0]);

  byRing[0].forEach((t) => out.push([t.id, nearest(t.angle, byRing[1]).id]));
  byRing[1].forEach((t, i) => {
    if (i % 2 === 0) out.push([t.id, nearest(t.angle, byRing[2]).id]);
  });

  return out;
})();

/** Mono micro-labels dropped between tiles, as fractions of the field. */
export const statusChips = [
  { id: "automated", text: "automated", fx: 0.2, fy: 0.24 },
  { id: "deployed", text: "deployed", fx: 0.81, fy: 0.72 },
  { id: "shipped", text: "shipped", fx: 0.28, fy: 0.79 },
] as const;

export const techGraph = {
  eyebrow: "Our stack",
  heading: "The tools we *use.*",
  sub: "And the ones we build on top of them.",
} as const;
