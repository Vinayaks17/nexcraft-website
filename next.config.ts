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
};

export default nextConfig;
