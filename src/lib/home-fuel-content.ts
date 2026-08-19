/**
 * Copy for the Fuel-structured homepage (branch: fuel-redesign).
 *
 * The layout borrows Fuel's *structure* — numbered sections, a near-full-bleed
 * grid, a meta row over every band, oversized Swiss statements — but every word
 * here is ours. Nothing in this file is transcribed from the reference site.
 *
 * Headings use the *asterisk* accent convention parsed by renderAccent
 * (see components/ui/AccentWord).
 *
 * TODO markers below flag content that is a stand-in and must be replaced with
 * real material before this branch ships. Search "TODO" to find every one.
 */

import { projects } from "@/lib/portfolio-content";
import { routes } from "@/lib/site";

/** Rendered as `© 2026` in every section meta row and in the footer. */
export const YEAR = 2026;

/* -------------------------------------------------------------------------
   Section register
   The numbers are the page's spine — they appear in the meta row above each
   band and nowhere else, so renumbering a section is a one-line change.
   (08) is deliberately absent: Fuel's articles/blog band has no equivalent
   here, and skipping the number is more honest than resequencing.
------------------------------------------------------------------------- */

export type SectionId =
  | "about"
  | "portfolio"
  | "services"
  | "pricing"
  | "testimonial"
  | "archive"
  | "stats"
  | "faq";

export const sectionIndex: Record<SectionId, { num: string; label: string }> = {
  about: { num: "01", label: "About us" },
  portfolio: { num: "02", label: "Portfolio" },
  services: { num: "03", label: "Services" },
  pricing: { num: "04", label: "Pricing" },
  testimonial: { num: "05", label: "Testimonial" },
  archive: { num: "06", label: "Archive" },
  stats: { num: "07", label: "Stats" },
  faq: { num: "09", label: "Frequently asked questions" },
};

/* -------------------------------------------------------------------------
   HERO
------------------------------------------------------------------------- */

export const fuelHero = {
  /** Word-staggered through RevealHeading. */
  headline: "We build the website. Then we *automate* the business behind it.",
  /** Small mono block, bottom-left of the media frame — Fuel's "01/ …" list. */
  disciplineIndex: "01/",
  disciplines: ["Websites", "Automations", "E-commerce"],
  primaryCta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondaryCta: { label: "Get a quick estimate", href: "/estimate" },
  /** Sits in the frame instead of Fuel's photography. */
  video: {
    src: "/video-nex-one.mp4",
    poster: "/video-posters/nex-one.jpg",
    alt: "A website we shipped, scrolling",
  },
  /** Oversized wordmark bleeding off the bottom edge. */
  wordmark: "NEXCRAFT",
  locationTag: "New Delhi, IN",
} as const;

/* -------------------------------------------------------------------------
   VALUE LINE — the strip under the hero
------------------------------------------------------------------------- */

export const valueLine = {
  statement: "Pick a plan. Send the brief. We start within 24 hours.",
  items: ["Websites", "Automations", "E-commerce"],
} as const;

/* -------------------------------------------------------------------------
   (01) ABOUT
------------------------------------------------------------------------- */

export const fuelAbout = {
  /** The oversized two-line statement. */
  statement:
    "A studio that treats craft and automation as one job — built in *New Delhi,* shipping to the world.",
  /** Fuel's (Pre) / (+Post) / (=Results) label column, in our language. */
  blocks: [
    {
      label: "(Craft)",
      body: "Senior-grade design and engineering, priced like we want the relationship to last. Every build is structured, fast, and yours to own — no rented page builders, no template underneath.",
    },
    {
      label: "(+Automation)",
      body: "The half most studios skip. We wire the CRM, the follow-ups, the invoicing and the reporting so the site you just paid for keeps working after launch instead of sitting there.",
    },
  ],
  /**
   * Fills the reference's portrait slot beside the body copy. Ours is a real
   * candid from the studio rather than stock — same photo the /about page uses,
   * carried here with its literal filename (the space included: next/image
   * URL-encodes `src` itself, so pre-encoding would double-escape and 404).
   */
  photo: {
    src: "/team/nexcraft-team-pic-one-meeting.jpeg",
    alt: "The NexCRAFT team gathered around a table in a working meeting",
    width: 1008,
    height: 912,
  },
  /** Compact metrics row — mirrors `stats` in about-content.ts. */
  metrics: [
    { value: "10+", label: "Team" },
    { value: "15+", label: "Projects shipped" },
    { value: "2024", label: "Founded" },
  ],
  cta: { label: "Read our story", href: "/about" },
} as const;

/* -------------------------------------------------------------------------
   LOGO MARQUEE — tool logos, monochrome
   Drawn from lib/tech-graph so the marquee and the stack section can never
   drift apart.
------------------------------------------------------------------------- */

export const marqueeCaption = "The stack we build on";

/* -------------------------------------------------------------------------
   (02) PORTFOLIO — featured carousel
   Which projects appear is decided by the `featured` flag in
   portfolio-content.ts, so the carousel and the /portfolio grid can never
   disagree about what a project is called or what it links to.
------------------------------------------------------------------------- */

export const fuelPortfolio = {
  /** Fuel sets a short coded title here; ours names the year of work. */
  title: "NX-26'",
  intro: "Four we'd show a stranger first.",
  seeAll: { label: `See all (${projects.length})`, href: "/portfolio" },
  prevLabel: "Previous project",
  nextLabel: "Next project",
} as const;

/* -------------------------------------------------------------------------
   (03) SERVICES
------------------------------------------------------------------------- */

export type FuelService = {
  num: string;
  title: string;
  /** Mono sub-label under the title. */
  kicker: string;
  description: string;
  /** How the card's media block is rendered. */
  media:
    | { kind: "video"; src: string; poster: string; alt: string }
    | { kind: "collage"; screenshots: string[]; alt: string }
    | { kind: "diagram"; diagramId: string };
  href: string;
};

export const fuelServices = {
  statement:
    "Design-led studio shipping websites, the systems behind them, and the *search presence* that feeds both.",
  cta: { label: "See what it costs", href: "/pricing" },
  items: [
    {
      num: "01",
      title: "Website Development",
      kicker: "Design & Build",
      description:
        "Fast, responsive, conversion-led builds on a modern platform. Clickable prototype before a line of production code, and a launch you own outright.",
      media: {
        kind: "collage",
        screenshots: [
          "/portfolio-screenshots/Aidify.png",
          "/portfolio-screenshots/thebigmedia.png",
          "/portfolio-screenshots/Ovalon.png",
        ],
        alt: "Three websites we designed and built",
      },
      href: "/pricing",
    },
    {
      num: "02",
      title: "Business Automation",
      kicker: "Systems & Bots",
      description:
        "Custom workflow mapping, CRM integrations, email sequences and AI bots — wired into the tools you already run so the repetitive work stops reaching a human.",
      media: { kind: "diagram", diagramId: "CRM" },
      href: "/estimate?plan=automation",
    },
    {
      num: "03",
      title: "SEO & Growth",
      kicker: "Search & Reach",
      description:
        "Foundational SEO built into the structure rather than bolted on afterwards, plus the tracking and reporting that shows what the site is actually returning.",
      media: {
        kind: "video",
        src: "/video-nex-two.mp4",
        poster: "/video-posters/nex-two.jpg",
        alt: "A website we shipped, scrolling",
      },
      href: "/estimate",
    },
  ] satisfies FuelService[],
} as const;

/* -------------------------------------------------------------------------
   (04) PRICING
   Prices and feature lists come straight from pricing-content.ts — this file
   only carries the surrounding chrome.
------------------------------------------------------------------------- */

export const fuelPricing = {
  includedLabel: "What's included",
  addOnsLabel: "Add-ons",
  note: "Free strategy call · Clickable prototype before you commit · No hidden fees",
} as const;

/* -------------------------------------------------------------------------
   (05) TESTIMONIAL
   TODO — every quote, name, company and role below is a PLACEHOLDER. The
   names are deliberately obviously fake ("Client Name") so none of this can
   reach production mistaken for a real endorsement. Replace with signed-off
   client quotes before merging.
------------------------------------------------------------------------- */

export type FuelTestimonial = {
  quote: string;
  name: string;
  role: string;
};

export const fuelTestimonials: FuelTestimonial[] = [
  {
    // TODO: placeholder quote — replace with a real, approved client quote.
    quote:
      "They shipped the site in four weeks and then kept going — the follow-up sequence they wired up now handles work two people used to do by hand.",
    name: "Client Name",
    role: "Company — Role",
  },
  {
    // TODO: placeholder quote — replace with a real, approved client quote.
    quote:
      "We came for a redesign and left with a system. Enquiries land in the CRM, get qualified, and reach us already sorted.",
    name: "Client Name",
    role: "Company — Role",
  },
  {
    // TODO: placeholder quote — replace with a real, approved client quote.
    quote:
      "The prototype answered every question before we committed a budget. Nothing about the build after that was a surprise.",
    name: "Client Name",
    role: "Company — Role",
  },
];

export const fuelTestimonialSection = {
  /** TODO: these two figures are placeholders — confirm or remove. */
  stats: [
    { value: "24h", label: "Kickoff", sub: "From signed brief" },
    { value: "15+", label: "Projects shipped", sub: "Since 2024" },
  ],
  prevLabel: "Previous testimonial",
  nextLabel: "Next testimonial",
} as const;

/* -------------------------------------------------------------------------
   (06) ARCHIVE — chronological, most recent first

   The years themselves live on `Project.year` in portfolio-content.ts, so the
   archive and the /portfolio grid can't disagree about when something shipped.
   They are still placeholders — see the TODO on that field.
------------------------------------------------------------------------- */

export const fuelArchive = {
  intro: "Everything we've shipped, newest first.",
} as const;

/* -------------------------------------------------------------------------
   (07) STATS — real figures, straight from about-content.ts
------------------------------------------------------------------------- */

export const fuelStats = [
  {
    value: "15+",
    label: "Projects shipped",
    description:
      "Websites, stores, booking systems and automations delivered for clients across Europe, the US and India.",
  },
  {
    value: "10+",
    label: "Team",
    description:
      "A small senior core plus a bench of engineers we're training on production work, all in one room.",
  },
  {
    value: "2024",
    label: "Founded",
    description:
      "Started in January 2024 in New Delhi and building for clients abroad from the first month.",
  },
  {
    value: "New Delhi",
    label: "Headquarters",
    description:
      "One studio, no account managers in between, online across European and US time zones.",
  },
] as const;

/* -------------------------------------------------------------------------
   (09) FAQ — the three from home-content.ts, in Fuel's numbered accordion
------------------------------------------------------------------------- */

export const fuelFaq = {
  intro: "Still deciding? Start here.",
} as const;

/* -------------------------------------------------------------------------
   CTA + FOOTER
------------------------------------------------------------------------- */

export const fuelFooter = {
  lead: "Let's work together",
  cta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondary: { label: "Get a quick estimate", href: "/estimate" },
  wordmark: "NEXCRAFT",
  location: "Crafted in New Delhi, India",
} as const;
