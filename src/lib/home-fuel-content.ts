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

   The page's spine. Each entry carries everything the header block over a band
   needs — the number, the mono meta label, a plain-language title, and one
   mono line saying what the visitor is looking at — so a section can never
   drift out of sequence with its own heading.

   The numbers run 01..09 with no gaps. An earlier pass skipped (08) because
   Fuel's articles band has no equivalent here; in review that read as a
   numbering mistake rather than as an omission, so the register is now simply
   contiguous and `sectionOrder` is the single source for both the page and the
   scrollspy rail.

   `id` is the scroll target. The three that already had anchors — about, work,
   services, pricing, faqs — keep the ids they shipped with.
------------------------------------------------------------------------- */

export type SectionId =
  | "about"
  | "why"
  | "portfolio"
  | "services"
  | "pricing"
  | "testimonial"
  | "archive"
  | "stats"
  | "faq";

export type SectionEntry = {
  /** DOM id on the `<section>` — what the scrollspy jumps to. */
  id: string;
  /** Two digits, rendered as `(0N)`. */
  num: string;
  /** Mono label in the meta row's centre column. */
  label: string;
  /** Plain-language heading, set in Switzer. Says what the section *is*. */
  title: string;
  /** One mono line under the title: what the visitor is looking at. */
  subline: string;
};

export const sectionIndex: Record<SectionId, SectionEntry> = {
  about: {
    id: "about",
    num: "01",
    label: "About us",
    title: "Who we are",
    subline: "A studio in India building websites and the systems behind them",
  },
  why: {
    id: "why-nexcraft",
    num: "02",
    label: "Why us",
    title: "Why NexCRAFT",
    subline: "Four reasons clients pick us over a template shop",
  },
  portfolio: {
    id: "work",
    num: "03",
    label: "Portfolio",
    title: "Our work",
    subline: "Four builds we'd show a stranger first",
  },
  services: {
    id: "services",
    num: "04",
    label: "Services",
    title: "What we build",
    subline: "Three ways we take work off your plate",
  },
  pricing: {
    id: "pricing",
    num: "05",
    label: "Pricing",
    title: "Pricing",
    subline: "Four fixed-scope plans — pick one and we start",
  },
  testimonial: {
    id: "clients",
    num: "06",
    label: "Testimonial",
    title: "What clients say",
    subline: "In their words, after launch",
  },
  archive: {
    id: "archive",
    num: "07",
    label: "Archive",
    title: "Every project so far",
    subline: `${projects.length} projects, live and private, newest first`,
  },
  stats: {
    id: "numbers",
    num: "08",
    label: "Stats",
    title: "The numbers",
    subline: "The studio in four figures",
  },
  faq: {
    id: "faqs",
    num: "09",
    label: "FAQ",
    title: "Questions, answered",
    subline: "Still deciding? Start here",
  },
};

/**
 * Page order, top to bottom. The homepage renders in this order and the
 * scrollspy reads it directly, so there is exactly one place to reorder or
 * renumber the page.
 */
export const sectionOrder: SectionId[] = [
  "about",
  "why",
  "portfolio",
  "services",
  "pricing",
  "testimonial",
  "archive",
  "stats",
  "faq",
];

/** The register as a list, in page order — what the scrollspy rail renders. */
export const sectionList: SectionEntry[] = sectionOrder.map(
  (id) => sectionIndex[id],
);

/* -------------------------------------------------------------------------
   HERO
------------------------------------------------------------------------- */

export const fuelHero = {
  /** Word-staggered through RevealHeading. */
  headline: "We build the website. Then we *automate* the business behind it.",
  /** Small mono block, bottom-left of the media frame — Fuel's "01/ …" list. */
  disciplineIndex: "01/",
  disciplines: ["Websites", "Automations", "E-commerce"],
  /**
   * Mono chip sitting directly over the primary CTA. The speed claim is the
   * single most persuasive thing we say, and it belongs where the decision is
   * being made rather than only in the USP band nine screens down.
   */
  highlight: "Delivered in as little as 2 days",
  primaryCta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondaryCta: { label: "Get a quick estimate", href: "/estimate" },
  /**
   * The full-bleed hero image, distorted under the cursor by HeroRipple.
   *
   * The client's own photograph. `background-two.png` is their original
   * (1535×1024, 1.7 MB); this is a web copy re-encoded to JPEG — same pixels,
   * 84 KB. The original stays in /public as the master.
   *
   * It suits the effect: dusk silhouettes against a low sun, so it is dark,
   * warm, and built from broad soft gradients rather than fine detail — which
   * is what the ripple needs, since it bends what is there and a busy image
   * reads as noise while a flat one shows nothing at all.
   *
   * The scrim in FuelHero is shaped to this image's particular tonal layout:
   * heavy over the sun in the top fifth, releasing through the middle, and
   * lifting again at the foot for the small mono type. Those stops do not
   * transfer — `background-one` (a bright daylight photo) needed nearly
   * double, and `background-three` (dark at the top, bright below) needed the
   * shape inverted. Any further swap wants the contrast sampling re-run rather
   * than the stops inherited; the method is written up in FuelHero.
   *
   * The one caveat: at 1535px it is below the ~2160px a 1440 viewport wants at
   * our 1.5x DPR cap, so it is upscaled slightly on large displays. A 2400px
   * master would be sharper.
   */
  background: { src: "/background-two.jpg" },
  /** Oversized wordmark bleeding off the bottom edge. */
  wordmark: "NEXCRAFT",
  locationTag: "India",
} as const;

/* -------------------------------------------------------------------------
   PREVIEW — the media band directly under the hero

   A beat rather than a numbered section, on the same reasoning as the value
   line below it: the register counts down the page from (01) About, so a band
   sitting above it can't take a number without making the sequence read
   backwards.
------------------------------------------------------------------------- */

export const fuelPreview = {
  /** Mono caption under the frame. */
  caption: "Real build — scroll preview",
  video: {
    src: "/video-nex-one.mp4",
    /**
     * Re-cut from the recording at 00:04 — the previous poster was grabbed
     * from a frame where the recorded page's own video embed had failed, so
     * the still that greeted every visitor read "this video isn't available".
     * Regenerate with:
     *   ffmpeg -ss 4 -i public/video-nex-one.mp4 -frames:v 1 -q:v 4 \
     *     public/video-posters/nex-one.jpg
     * Keep it a full 1080×1920 frame: it is object-cover'd exactly like the
     * video, so a pre-cropped poster would jump when playback starts.
     */
    poster: "/video-posters/nex-one.jpg",
    alt: "A website we shipped, scrolling",
  },
} as const;

/* -------------------------------------------------------------------------
   VALUE LINE — the strip under the hero
------------------------------------------------------------------------- */

export const valueLine = {
  statement: "Pick a plan. Send the brief. We start within 24 hours.",
  /** Mono qualifier under the statement — the "zero templates" USP, early. */
  note: "No templates — every build from scratch",
  items: ["Websites", "Automations", "E-commerce"],
} as const;

/* -------------------------------------------------------------------------
   (01) ABOUT
------------------------------------------------------------------------- */

export const fuelAbout = {
  /**
   * The oversized two-line statement. It sits *under* the section header's
   * title, so it is a lead line rather than the heading — rendered as a `<p>`
   * for exactly that reason.
   */
  statement:
    "A studio that treats craft and automation as one job — built in *India,* shipping to the world.",
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
   (02) WHY NEXCRAFT — the page's thesis

   Four claims, each one a sentence a prospect could repeat to a colleague.
   These are commitments, not features: the two-day figure and the
   built-from-scratch promise are both echoed higher up the page (the hero chip
   and the value line), so anything edited here has to be edited there too.
------------------------------------------------------------------------- */

export type FuelUsp = {
  num: string;
  /** Big Switzer statement — the claim itself. */
  title: string;
  /** Mono supporting line, one clause. */
  kicker: string;
  /** The claim in plain language. */
  body: string;
};

export const fuelUsps: FuelUsp[] = [
  {
    num: "01",
    title: "Launch-ready in days, not months",
    kicker: "From brief to first version",
    body: "The first version of your website lands in as little as two days — a real, clickable build you can react to, not a mockup and a timeline.",
  },
  {
    num: "02",
    title: "Built to rank",
    kicker: "SEO-first structure and speed",
    body: "Search structure and performance are designed in from the first file, not retrofitted. The point is to move you up the results, not just onto the web.",
  },
  {
    num: "03",
    title: "Automations from scratch",
    kicker: "Workflows, not plugins",
    body: "Custom-built workflows wired into the tools you already run, so the repetitive work comes off your team's plate instead of moving around on it.",
  },
  {
    num: "04",
    title: "Zero templates",
    kicker: "Designed and built from nothing",
    body: "Every site is drawn and coded from scratch. No themes, no page-builder scaffolding, no copy-paste — the build is original and it is yours to own.",
  },
];

export const fuelWhy = {
  /** The oversized lead statement under the section header. */
  statement:
    "Four things we won't compromise on — and the reason clients stay past the *first build.*",
} as const;

/* -------------------------------------------------------------------------
   LOGO MARQUEE — tool logos, monochrome
   Drawn from lib/tech-graph so the marquee and the stack section can never
   drift apart.
------------------------------------------------------------------------- */

export const marqueeCaption = "The stack we build on";

/* -------------------------------------------------------------------------
   (03) PORTFOLIO — featured carousel
   Which projects appear is decided by the `featured` flag in
   portfolio-content.ts, so the carousel and the /portfolio grid can never
   disagree about what a project is called or what it links to.
------------------------------------------------------------------------- */

export const fuelPortfolio = {
  /**
   * The short coded title in the sticky rail — decoration, not the section
   * heading. "Our work" is the heading now, and it lives in the register.
   */
  code: "NX-26'",
  seeAll: { label: `See all (${projects.length})`, href: "/portfolio" },
  prevLabel: "Previous project",
  nextLabel: "Next project",
} as const;

/* -------------------------------------------------------------------------
   (04) SERVICES
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
   (05) PRICING
   Prices and feature lists come straight from pricing-content.ts — this file
   only carries the surrounding chrome.
------------------------------------------------------------------------- */

export const fuelPricing = {
  includedLabel: "What's included",
  addOnsLabel: "Add-ons",
  note: "Free strategy call · SEO-first build · Clickable prototype before you commit · No hidden fees",
} as const;

/* -------------------------------------------------------------------------
   CTA BANDS

   Two asks placed so nothing on the page runs more than three sections without
   one: band A after (03) Portfolio, band B after (06) Testimonial, and the
   footer's own CTA closing the last three. Same pair of actions in all three —
   a visitor who has decided shouldn't have to learn a new control — but the
   headline is written fresh each time so the repeat doesn't read as a
   duplicated component.
------------------------------------------------------------------------- */

export type FuelCtaBandContent = {
  eyebrow: string;
  heading: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const bandActions = {
  primary: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondary: { label: "Get a quick estimate", href: "/estimate" },
};

export const fuelCtaBands: Record<"work" | "clients", FuelCtaBandContent> = {
  /** After (03) Portfolio — the visitor has just seen the proof. */
  work: {
    eyebrow: "Next step",
    heading: "Like what you see?",
    body: "Thirty minutes, no deck. We'll scope what you need and tell you what it costs.",
    ...bandActions,
  },
  /** After (06) Testimonial — the visitor has just heard from someone else. */
  clients: {
    eyebrow: "Next step",
    heading: "Your project could be next.",
    body: "Send the brief and we start within 24 hours — first version in as little as two days.",
    ...bandActions,
  },
};

/* -------------------------------------------------------------------------
   (06) TESTIMONIAL
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
   (07) ARCHIVE — chronological, most recent first

   The years themselves live on `Project.year` in portfolio-content.ts, so the
   archive and the /portfolio grid can't disagree about when something shipped.
   They are still placeholders — see the TODO on that field.

   The one-line description of this band lives on `sectionIndex.archive.subline`
   with every other section's, so it can't drift from the heading above it.
------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------
   (08) STATS — real figures, straight from about-content.ts
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
      "Started in January 2024 in India and building for clients abroad from the first month.",
  },
  {
    value: "India",
    label: "Headquarters",
    description:
      "One studio, no account managers in between, online across European and US time zones.",
  },
] as const;

/* -------------------------------------------------------------------------
   (09) FAQ — the three from home-content.ts, in Fuel's numbered accordion
   Its intro line is `sectionIndex.faq.subline`.
------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------
   CTA + FOOTER
------------------------------------------------------------------------- */

export const fuelFooter = {
  lead: "Let's work together",
  cta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondary: { label: "Get a quick estimate", href: "/estimate" },
  wordmark: "NEXCRAFT",
  location: "Crafted in India, shipped worldwide",
} as const;
