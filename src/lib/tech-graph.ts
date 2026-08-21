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
 * The stack, as a flat list of tools.
 *
 * This was the data behind an orbiting-logo section; that section is gone and
 * the homepage's monochrome logo belt (FuelLogoMarquee) is the only consumer
 * left. `ring` and `angle` survive because they encode a deliberate ordering —
 * the tools we lead with first — which the belt renders in sequence. The ring
 * geometry, edge routing and section copy that went with the old layout have
 * been removed.
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
