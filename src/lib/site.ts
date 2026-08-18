/**
 * Single source of truth for site-wide copy, navigation and contact details.
 * Placeholder values are marked — swap them once the real details land.
 */

export const site = {
  name: "NexCRAFT",
  tagline: "We craft high-converting websites and invisible business automations.",
  description:
    "NexCRAFT designs and builds high-converting websites and custom business automations that quietly run your operations.",
  url: "https://nexcraft.com", // placeholder
  /**
   * Drop a logo at /public/logo.png and set this to "/logo.png" — the Logo
   * component swaps the wordmark for the image automatically.
   */
  logoSrc: null as string | null,
} as const;

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
];

export const footerPages: NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/#services" },
];

export const footerLegal: NavLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

/** All placeholders for now. */
export const contact = {
  email: "hello@nexcraft.com",
  phone: "+31 6 00 00 00 00",
  linkedin: "#",
  whatsapp: "#",
  calendly: "#",
} as const;

export const routes = {
  estimate: "/estimate",
  bookCall: "#", // Calendly link lands here later
} as const;
