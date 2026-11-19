import type { Metadata } from "next";

import type { SeoPage } from "@/lib/seo-content";
import { site } from "@/lib/site";

/**
 * Per-route metadata, in one shape.
 *
 * Next inherits `openGraph` from the root layout but does NOT merge it field by
 * field: declare `openGraph` on a page and the parent's object is replaced
 * whole, so a page that only wanted its own title would silently lose the card
 * image and the site name. Rather than restate the full block on seven pages,
 * every route calls this and gets a complete, self-consistent set.
 *
 * `canonical` is a path, not a URL — Next resolves it against `metadataBase`,
 * which is the one place the origin is written down.
 *
 * The copy itself lives in seo-content.ts, not here: this decides the *shape*
 * of a route's metadata, that file decides what each route says.
 */
export function pageMeta(page: SeoPage): Metadata {
  const { path, title, description, ogTitle, ogDescription, absoluteTitle } = page;

  return {
    /* The homepage carries the brand in its own title and has no parent
       template to inherit, so it declares the string absolutely; every other
       route hands over the bare title and lets the root layout append the
       brand. Passing the homepage's title as a plain string would run it
       through that template and print the brand twice. */
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      /* Deliberately not the search title — see the note in seo-content. */
      title: ogTitle,
      description: ogDescription,
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
      title: ogTitle,
      description: ogDescription,
      images: [site.ogImage],
    },
  };
}
