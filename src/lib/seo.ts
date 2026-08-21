import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Per-route metadata, in one shape.
 *
 * Next inherits `openGraph` from the root layout but does NOT merge it field by
 * field: declare `openGraph` on a page and the parent's object is replaced
 * whole, so a page that only wanted its own title would silently lose the card
 * image and the site name. Rather than restate the full block on eight pages,
 * every route calls this and gets a complete, self-consistent set.
 *
 * `canonical` is a path, not a URL — Next resolves it against `metadataBase`,
 * which is the one place the origin is written down.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  /** Without the site name — the title template appends it. */
  title: string;
  /** Keep under 160 characters; `assertDescriptions` in the tests below checks. */
  description: string;
  /** Route path, leading slash. "/" for the homepage. */
  path: string;
}): Metadata {
  /* The templated `%s — NexCRAFT` only applies to the tab title. Social cards
     have no template to inherit, so the full form is built here. */
  const full = path === "/" ? title : `${title} — ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: full,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: site.ogImage,
          width: 1200,
          height: 630,
          alt: `${site.name} — websites, automations, built from scratch`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [site.ogImage],
    },
  };
}
