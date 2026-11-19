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

/**
 * Whether (05) Proof shows the quote carousel.
 *
 * OFF for launch. Every quote in `fuelTestimonials` is written copy attributed
 * to "Client Name" — a stand-in that was safe while the site was unpublished
 * and is not safe on a live page, whatever badge sits next to it. The four
 * figures beside them are real, so the band keeps those and drops the words.
 *
 * Flip this to `true` the day signed-off quotes replace the placeholders, and
 * the carousel, its heading and its subline all come back together — the
 * register below reads from this constant so the section can't end up
 * promising words it isn't showing.
 */
export const showTestimonials = false;

/* -------------------------------------------------------------------------
   Section register

   The page's spine. Each entry carries everything the header block over a band
   needs — the number, the mono meta label, a plain-language title, and one
   mono line saying what the visitor is looking at — so a section can never
   drift out of sequence with its own heading.

   The order is show-first, talk-second: what we build and the work itself
   come before the studio's own story. Proof is front-loaded (the hero preview
   and (02) Our work), the argument follows in (03), and (04) Who we are is a
   compact band rather than the page's second-biggest section — the long
   version of it lives on /about, which is where someone who wants it goes.

   `id` is the scroll target. The ids that already had anchors — work,
   services, faqs — keep the ones they shipped with.
------------------------------------------------------------------------- */

export type SectionId =
  | "services"
  | "portfolio"
  | "why"
  | "about"
  | "proof"
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
  services: {
    id: "services",
    num: "01",
    label: "Services",
    title: "What we build",
    subline: "Three ways we take work off your plate",
  },
  portfolio: {
    id: "work",
    num: "02",
    label: "Portfolio",
    title: "Our work",
    subline: `Four builds we'd show a stranger first — ${projects.length} in the full index`,
  },
  why: {
    id: "why-nexcraft",
    num: "03",
    label: "Why us",
    title: "Why NexCRAFT",
    subline: "Five reasons clients pick us over a template shop",
  },
  about: {
    id: "about",
    num: "04",
    label: "About us",
    title: "Who we are",
    subline: "A studio in India building websites and the systems behind them",
  },
  proof: {
    id: "proof",
    num: "05",
    label: "Proof",
    title: showTestimonials ? "What clients say" : "The numbers",
    subline: showTestimonials
      ? "In their words, and the numbers behind them"
      : "The studio in four figures",
  },
  faq: {
    id: "faqs",
    num: "06",
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
  "services",
  "portfolio",
  "why",
  "about",
  "proof",
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
   * Mono chip sitting directly over the primary CTA — the sharpest hook we
   * have, on the decision. Two hours is a smaller promise than two days and a
   * far more surprising one, so it is the line that goes here; the two-day
   * launch claim keeps its place as (03) Why NexCRAFT's second USP.
   */
  highlight: "First mockup in 2 hours",
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
    alt: "Screen recording of a NexCRAFT-built website scrolling from top to bottom",
  },
} as const;

/* -------------------------------------------------------------------------
   VALUE LINE — the strip under the hero
------------------------------------------------------------------------- */

export const valueLine = {
  statement: "Send the brief. We start within 24 hours.",
  /**
   * Mono qualifier under the statement — (03) Why NexCRAFT's fifth USP, stated
   * early. Worded to echo that claim rather than paraphrase it: if the USP is
   * edited, this moves with it.
   */
  note: "No copy-paste websites — every build from scratch",
  items: ["Websites", "Automations", "E-commerce"],
  /**
   * The strip carries a real ask now. It sits directly under the hero and the
   * build preview, which is the first point on the page where a visitor has
   * seen enough to act.
   */
  primaryCta: { label: "Get a quick estimate", href: "/estimate" },
} as const;

/* -------------------------------------------------------------------------
   (01) SERVICES
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
  cta: { label: "Get a quick estimate", href: "/estimate" },
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
        alt: "Homepages of three websites designed and built by NexCRAFT — Aidify, The Big Media Studios and Ovalon",
      },
      href: "/estimate",
    },
    {
      num: "02",
      title: "Business Automation",
      kicker: "Systems & Bots",
      description:
        "Custom workflow mapping, CRM integrations, email sequences and AI bots — wired into the tools you already run so the repetitive work stops reaching a human.",
      media: { kind: "diagram", diagramId: "CRM" },
      href: "/estimate",
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
        alt: "Screen recording of a NexCRAFT client website scrolling, showing its page structure",
      },
      href: "/estimate",
    },
  ] satisfies FuelService[],
} as const;

/* -------------------------------------------------------------------------
   (02) PORTFOLIO — featured carousel
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
   (03) WHY NEXCRAFT — the page's thesis

   Five claims, each one a sentence a prospect could repeat to a colleague.
   These are commitments, not features. Two of them are echoed higher up the
   page — the two-hour mockup as the hero chip, the no-copy-paste promise in
   the value line — so anything edited here has to be edited there too.
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
    title: "First mockup in 2 hours",
    kicker: "Same call, same afternoon",
    body: "You see a first design mockup within two hours of your first call — something real to react to while the conversation is still warm.",
  },
  {
    num: "02",
    title: "Launch-ready in days",
    kicker: "Fast delivery, automated workflow",
    body: "An automated build pipeline behind a senior team: the first version goes live in as little as two days, not after a quarter of status meetings.",
  },
  {
    num: "03",
    title: "Built to rank",
    kicker: "SEO-first structure and speed",
    body: "Search structure and performance are designed in from the first file, not retrofitted. The point is to move you up the results, not just onto the web.",
  },
  {
    num: "04",
    title: "Automations from scratch",
    kicker: "Workflows, not plugins",
    body: "Custom-built workflows wired into the tools you already run, so the repetitive work comes off your team's plate instead of moving around on it.",
  },
  {
    num: "05",
    title: "No copy-paste websites",
    kicker: "Original by default",
    body: "Custom-built, made from scratch — no themes, no templates, one of one.",
  },
];

export const fuelWhy = {
  /** The oversized lead statement under the section header. */
  statement:
    "Five things we won't compromise on — and the reason clients stay past the *first build.*",
} as const;

/* -------------------------------------------------------------------------
   LOGO MARQUEE — tool logos, monochrome
   Drawn from lib/tech-graph so the marquee and the stack section can never
   drift apart.
------------------------------------------------------------------------- */

export const marqueeCaption = "The stack we build on";

/* -------------------------------------------------------------------------
   (04) WHO WE ARE — compact
------------------------------------------------------------------------- */

export const fuelAbout = {
  /**
   * The whole band, near enough. It is capped at two lines on purpose — the
   * statement, the metrics and one link out, and nothing else.
   *
   * The portrait, the (Craft) / (+Automation) prose blocks and the "Read our
   * story" bracket link that used to sit here are gone rather than moved:
   * every one of them already exists on /about, in longer and better form, and
   * carrying a second copy on the homepage was most of what made this the
   * page's second-tallest band. What is left is the smallest thing that still
   * answers "who are these people" before handing the question to /about.
   */
  /**
   * Two lines, and the measure is what enforces it: at `fuelStatement`'s
   * 76px a column of this width takes about 18 characters, so anything past
   * ~36 wraps to a third line and the band stops being compact. The India
   * claim moved to the section subline, which is where the geography reads
   * better anyway.
   */
  statement: "Craft and automation, *one job.*",
  /** Compact metrics row — mirrors `stats` in about-content.ts. */
  metrics: [
    { value: "10+", label: "Team" },
    { value: "15+", label: "Projects shipped" },
    { value: "2024", label: "Founded" },
  ],
  cta: { label: "More about us", href: "/about" },
} as const;

/* -------------------------------------------------------------------------
   CTA BANDS

   The page now opens its asking with the value strip, directly under the
   preview, so these two are the second and third of four. Band A lands after
   (02) Our work — the visitor has just seen the proof — and band B after
   (05) Proof, with the footer closing (06). That puts an ask after at most
   three numbered sections anywhere on the page, which is the whole rule:
   dropping band A, as the reorder first suggested, would have left a
   five-section run between the value strip and band B.

   Same pair of actions every time — a visitor who has decided shouldn't have
   to learn a new control — but the headline is written fresh each time so the
   repeat doesn't read as a duplicated component.
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
  /** After (02) Our work — the visitor has just seen the proof. */
  work: {
    eyebrow: "Next step",
    heading: "Like what you see?",
    body: "Thirty minutes, no deck. We'll scope what you need and tell you what it costs.",
    ...bandActions,
  },
  /** After (05) Proof — the visitor has just heard from someone else. */
  clients: {
    eyebrow: "Next step",
    heading: "Your project could be next.",
    body: "Send the brief and we start within 24 hours — first version in as little as two days.",
    ...bandActions,
  },
};

/* -------------------------------------------------------------------------
   (05) PROOF — one social-proof band

   The rotating quote and the studio's four figures used to be two sections
   with two headers and two meta rows between them, arguing the same point
   twice over. They are one band now: the quote carries it, the numerals sit
   under it as the evidence, and the page loses a header, a hairline and about
   a screen of height without losing a word of content.

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

export const fuelProof = {
  /** Re-exported so the component reads one name rather than two modules. */
  showTestimonials,
  prevLabel: "Previous testimonial",
  nextLabel: "Next testimonial",
  /**
   * The four figures under the quote. Real, and the same set /about carries in
   * its own numbers grid — CountUp animates the three with digits and leaves
   * "India" alone.
   *
   * These are the descriptions the deleted stats band used to spell out at
   * paragraph length; at this size the label carries them, so only the short
   * qualifier survives.
   */
  stats: [
    { value: "15+", label: "Projects shipped", sub: "Since 2024" },
    { value: "10+", label: "Team", sub: "One room, no account managers" },
    { value: "24h", label: "Kickoff", sub: "From signed brief" },
    { value: "India", label: "Headquarters", sub: "Across EU and US hours" },
  ],
} as const;

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
