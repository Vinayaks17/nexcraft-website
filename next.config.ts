import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * One canonical URL form: no trailing slash.
   *
   * This is already Next's default, and it is written down anyway because the
   * canonical tags, the sitemap and the internal links are all built without
   * trailing slashes — if this ever flipped, every one of those would point at
   * a URL that 308s, and the redirect chain would sit between a crawler and
   * every page on the site. `/about/` redirects to `/about`; the apex/www
   * choice is handled at the DNS and hosting layer.
   */
  trailingSlash: false,

  /**
   * /pricing was removed; the estimate form is where a visitor who wants a
   * number goes now. Permanent (308), so links and search results that still
   * point at the old page pass their visitors — and their ranking — along
   * instead of landing on a 404.
   */
  async redirects() {
    return [
      { source: "/pricing", destination: "/estimate", permanent: true },
    ];
  },
};

export default nextConfig;
