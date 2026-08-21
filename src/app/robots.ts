import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Open to everything. There is nothing on this site that isn't meant to be
 * found, and the one route with any state — /estimate — is a client-side form
 * with no addressable results to crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
    host: site.url,
  };
}
