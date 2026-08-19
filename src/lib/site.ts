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

/**
 * Primary navigation, in the numbered convention the whole site now uses.
 * The number is presentational — it is the reading order, not an id — so
 * reordering this array is all that's needed to renumber the nav.
 */
export type NumberedNavLink = NavLink & { num: string };

export const navLinks: NumberedNavLink[] = [
  { label: "Home", num: "01", href: "/" },
  { label: "Portfolio", num: "02", href: "/portfolio" },
  { label: "About", num: "03", href: "/about" },
  { label: "Contact", num: "04", href: "/contact" },
];

/** Secondary routes — reachable from the footer rather than the nav. */
export const footerPages: NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Get an estimate", href: "/estimate" },
];

export const footerLegal: NavLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

/**
 * TODO — every value here is a placeholder. This is the single place they are
 * defined; the contact page, the footer and the floating buttons all read from
 * it, so filling these in once updates the whole site.
 */
export const contact = {
  email: "hello@nexcraft.com",
  phone: "+31 6 00 00 00 00",
  linkedin: "#",
  whatsapp: "#",
  calendly: "#",
} as const;

/**
 * The contact channels as a list, so the contact page renders them in one pass
 * instead of hand-writing four near-identical rows. `href` is derived here
 * rather than at the call site — the mailto:/tel: prefixes are part of what the
 * channel *is*.
 */
export const contactChannels = [
  {
    id: "email",
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    external: false,
  },
  {
    id: "phone",
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\s/g, "")}`,
    external: false,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "Message us directly",
    href: contact.whatsapp,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "NexCRAFT",
    href: contact.linkedin,
    external: true,
  },
] as const;

export const routes = {
  estimate: "/estimate",
  contact: "/contact",
  bookCall: "#", // TODO: Calendly link lands here
} as const;
