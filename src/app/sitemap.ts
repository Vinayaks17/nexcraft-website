import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Every route the site has, and it is a short enough list to write out rather
 * than derive: deriving it from the filesystem would also pick up whatever
 * lands in `app/` next, and a sitemap that indexes a page nobody meant to
 * publish is worse than one that needs a line added.
 *
 * Priorities are relative, not absolute — the homepage leads, the three pages
 * that sell (pricing, portfolio, estimate) follow, and the legal pages sit at
 * the bottom where they belong.
 */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/estimate", priority: 0.8, changeFrequency: "yearly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  /* Build time, not request time — these are static pages, so "last modified"
     honestly means "last deployed". */
  const lastModified = new Date();

  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}
