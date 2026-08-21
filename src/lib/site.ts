/**
 * Single source of truth for site-wide copy, navigation and contact details.
 *
 * Every contact detail below is real as of the Stage 5 launch pass. Nothing
 * here is a placeholder any more, and nothing should become one: the footer,
 * the floating buttons, the contact page, the estimate sidebar and every
 * "Book a Call" CTA on the site read from this file, so a channel changes in
 * exactly one place.
 */

export const site = {
  name: "NexCRAFT",
  tagline: "We craft high-converting websites and invisible business automations.",
  description:
    "NexCRAFT designs and builds high-converting websites and custom business automations that quietly run your operations.",
  /** Canonical origin. `metadataBase` in the root layout resolves against it. */
  url: "https://thenexcraft.com",
  /**
   * The origami fox mark, trimmed to its alpha bounding box and rasterised at
   * 640px tall — sized for the footer's 200px rendering on a 2x display, with
   * next/image deriving every smaller variant from it, so the navbar does not
   * pay for the footer's resolution.
   *
   * Rendered plain on every ground as of 6.1: no plate, no filter, no
   * recolouring. What that means on the dark bands is measured in the note on
   * the Logo component and pictured in design/logo-contrast-on-dark.png.
   *
   * No master lives in /public — it is served, and print-resolution files have
   * no business being fetchable. design/ holds all three: the 5120x3840
   * original, the 577x433 re-export delivered as "the version that works
   * without a plate" (same artwork, 3.76/255 mean channel difference), and the
   * plated square this replaced.
   */
  logoSrc: "/logo-mark.png" as string | null,
  /** Shared OG/Twitter card. 1200x630, generated in Stage 5. */
  ogImage: "/og.png",
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
  { label: "Pricing", num: "03", href: "/pricing" },
  { label: "About", num: "04", href: "/about" },
  { label: "Contact", num: "05", href: "/contact" },
];

/**
 * Secondary routes — reachable from the footer rather than the nav.
 *
 * Pricing was here until the homepage stopped carrying a pricing band. With
 * that band gone /pricing is the only place the numbers exist, so it moved up
 * into the primary nav; the footer still lists it because the footer renders
 * navLinks above this row.
 */
export const footerPages: NavLink[] = [
  { label: "Get an estimate", href: "/estimate" },
];

export const footerLegal: NavLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

/**
 * The real channels.
 *
 * `whatsapp` carries a prefilled message so the thread opens with context
 * rather than an empty box — wa.me wants it percent-encoded, hence the
 * pre-encoded literal rather than the readable string.
 *
 * NOTE: `phone` is the same line as WhatsApp. It is the only voice number we
 * have, and a contact page that lists a WhatsApp number but no phone reads as
 * an omission; if it should stay WhatsApp-only, delete the `phone` entry from
 * `contactChannels` below and this constant with it.
 */
export const contact = {
  email: "info@thenexcraft.com",
  phone: "+91 63786 39929",
  /** Company page, not a personal profile — the three personal ones live on /about. */
  linkedin: "https://www.linkedin.com/company/105422395/",
  whatsapp:
    "https://wa.me/916378639929?text=Hi%20NexCRAFT%20%E2%80%94%20I%27d%20like%20to%20talk%20about%20a%20project.",
  calendly: "https://calendly.com/vinayakvsj/meenting-with-nexcraft",
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
  /**
   * Every "Book Your Free Strategy Call" / "Book a Call" button on the site
   * points here. It is an absolute URL, which is what makes Button and
   * FuelBracketLink treat it as external and open it in a new tab — leaving
   * the site itself in the background tab, which is the point of a booking
   * link.
   */
  bookCall: contact.calendly,
} as const;
