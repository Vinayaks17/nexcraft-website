/**
 * Contact page copy.
 *
 * The channels themselves are NOT here — they live in site.ts (`contactChannels`)
 * so the email, phone, WhatsApp and LinkedIn values are defined exactly once for
 * the whole site. This file only carries the surrounding words.
 */

import { navLinks, routes } from "@/lib/site";


export const contactPage = {
  /** The page's own number in the nav, read from it so the two can't disagree. */
  num: navLinks.find((link) => link.href === routes.contact)?.num,
  label: "Contact",
  heading: "Let's work *together.*",
  intro:
    "Tell us what you're building. A real person reads every message, and you'll hear back within 24 hours — with a scope and a number, not a brochure.",
  channelsLabel: "Reach us",
  actionsLabel: "Start here",
  primary: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondary: { label: "Get a quick estimate", href: "/estimate" },
  location: {
    label: "Studio",
    value: "India",
    note: "Online across US and UK hours.",
  },
} as const;
