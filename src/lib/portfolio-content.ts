/**
 * Portfolio page copy. Headings use the *asterisk* accent convention parsed by
 * renderAccent (see components/ui/AccentWord).
 *
 * `screenshot` paths are case-sensitive in production — they mirror the exact
 * filenames in /public/portfolio-screenshots. Set it to `null` and the card
 * falls back to a branded gradient panel rather than a broken image.
 */

import { routes } from "@/lib/site";


export type Project = {
  id: string;
  name: string;
  industry: string;
  blurb: string;
  /** Exact path under /public, or null to render the fallback panel. */
  screenshot: string | null;
  /** Intrinsic size of the screenshot — lets next/image reserve space (no CLS). */
  width: number;
  height: number;
  /** Live projects link out; private builds carry a badge instead. */
  url: string | null;
  /** Display form of `url`, without protocol. */
  domain: string | null;
  /** 1-3 mono chips laid over the image, bottom-right. */
  tags: string[];
  /**
   * Surfaced in the homepage's featured carousel. Purely additive — the
   * /portfolio grid still renders every project regardless.
   */
  featured?: boolean;
  /**
   * TODO — PLACEHOLDER. Ship year. No real dates were recorded for these
   * builds, so every value below is a plausible guess against a Jan-2024
   * founding.
   *
   * As of the Stage 5 launch pass it is NOT displayed anywhere — it only sorts
   * the archive on /portfolio, where being approximately right is harmless.
   * Confirm the real dates and the archive rows and the /portfolio grid can
   * both show it again (FuelArchive and ProjectShowcase each carry a note
   * where it was removed).
   */
  year: string;
};

/**
 * Alt text for a project screenshot.
 *
 * Every one of these images is a capture of the project's homepage, so the alt
 * says that rather than saying "screenshot" — which describes the file, not the
 * picture. Name and sector are both in it because that is what someone who
 * cannot see the image would want: which client, and what kind of business.
 *
 * One builder rather than three template literals: the archive, the homepage
 * carousel and the /portfolio grid all show the same images, and alt text that
 * disagrees between them is alt text nobody is maintaining.
 */
export function projectAlt(project: Pick<Project, "name" | "industry">) {
  /* The industry is NOT lowercased: these strings carry acronyms — "AI Voice
     Services", "Recruitment (RPO)" — and folding the case turns them into "ai
     voice services", which a screen reader then reads letter-blurred. */
  return `${project.name} homepage — ${project.industry} website designed and built by NexCRAFT`;
}

export const portfolioHero = {
  eyebrow: "Portfolio",
  heading: "Work that *works.*",
  intro:
    "Websites and automations built to bring our clients real business — enquiries, bookings, orders, and hours given back. Not just pixels.",
} as const;

export const projectsSection = {
  heading: "Selected *projects.*",
} as const;

/** Filter pills above the grid. `id` is matched against a project's liveness. */
export const projectFilters = [
  { id: "all", label: "All works" },
  { id: "live", label: "Live sites" },
  { id: "private", label: "Private builds" },
] as const;

export type ProjectFilterId = (typeof projectFilters)[number]["id"];

export const projects: Project[] = [
  {
    id: "aidify",
    year: "2026",
    featured: true,
    tags: ["Web design", "AI voice"],
    name: "Aidify",
    industry: "AI Voice Services",
    blurb: "A sharp, conversion-focused site for an AI voice services company.",
    screenshot: "/portfolio-screenshots/Aidify.png",
    width: 2004,
    height: 1122,
    url: "https://aidify.us",
    domain: "aidify.us",
  },
  {
    id: "ans-rpo",
    year: "2026",
    tags: ["Web design", "Recruitment"],
    name: "ANS RPO",
    industry: "Recruitment (RPO)",
    blurb:
      "A credibility-first portfolio site for a recruitment process outsourcing firm.",
    screenshot: "/portfolio-screenshots/ANSrpo.png",
    width: 2930,
    height: 1572,
    url: "https://ansrpo.com",
    domain: "ansrpo.com",
  },
  {
    id: "the-big-media",
    year: "2025",
    featured: true,
    tags: ["Web design", "Showcase"],
    name: "The Big Media Studios",
    industry: "Video Editing Studio",
    blurb:
      "A bold showcase site for a video editing studio — big content, built to grow.",
    screenshot: "/portfolio-screenshots/thebigmedia.png",
    width: 2932,
    height: 1512,
    url: "https://thebigmediastudio.com",
    domain: "thebigmediastudio.com",
  },
  {
    id: "ovalon",
    year: "2025",
    tags: ["Web design", "Corporate"],
    name: "Ovalon",
    industry: "Tech Company",
    blurb: "A clean corporate presence for a growing tech company.",
    screenshot: "/portfolio-screenshots/Ovalon.png",
    width: 2860,
    height: 1576,
    url: "https://ovalon.org",
    domain: "ovalon.org",
  },
  {
    id: "visual-view-media",
    year: "2025",
    tags: ["Web design", "Agency"],
    name: "Visual View Media",
    industry: "Digital Agency",
    blurb: "A content-agency site built around the work itself.",
    screenshot: "/portfolio-screenshots/Visualviewmedia.png",
    width: 2014,
    height: 1122,
    url: "https://visualviewmedia.com",
    domain: "visualviewmedia.com",
  },
  {
    id: "sony-video-vision",
    year: "2025",
    tags: ["Web design", "Retail"],
    name: "Sony Video Vision",
    industry: "Retail",
    blurb:
      "An elevated retail showcase — “Elevate every room. Elevate every day.”",
    screenshot: "/portfolio-screenshots/sonyvideovision.png",
    width: 2930,
    height: 1592,
    url: "https://sony-videovision.vercel.app",
    domain: "sony-videovision.vercel.app",
  },
  {
    id: "vinayak-singh",
    year: "2025",
    tags: ["Web design", "Portfolio"],
    name: "Vinayak Singh",
    industry: "Personal Portfolio",
    blurb:
      "Our founder's own portfolio — the same craft we sell, applied to ourselves.",
    screenshot: "/portfolio-screenshots/vinayaksingh.png",
    width: 2938,
    height: 1596,
    url: "https://vinayaksingh.us",
    domain: "vinayaksingh.us",
  },
  {
    id: "qadira",
    year: "2024",
    featured: true,
    tags: ["E-commerce", "Checkout"],
    name: "Qadira",
    industry: "E-commerce, Women's Health",
    blurb:
      "A complete e-commerce store for a sanitary-pad brand — catalog, cart, and checkout.",
    screenshot: "/portfolio-screenshots/Qadira.png",
    width: 3404,
    height: 1830,
    url: null,
    domain: null,
  },
  {
    id: "jvb-testing",
    year: "2024",
    tags: ["Web design", "Corporate"],
    name: "JVB Testing",
    industry: "Hardware Testing (US)",
    blurb: "A trust-building company portfolio for a US hardware testing firm.",
    screenshot: "/portfolio-screenshots/JVBtesting.png",
    width: 2018,
    height: 1130,
    url: null,
    domain: null,
  },
  {
    id: "sportikon",
    year: "2024",
    featured: true,
    tags: ["Booking system", "Web design"],
    name: "Sportikon",
    industry: "University Sports Fest",
    blurb:
      "Website plus a full booking & tracking system for Bennett University's sports fest.",
    screenshot: "/portfolio-screenshots/Sportikon.png",
    width: 2008,
    height: 1132,
    url: null,
    domain: null,
  },
  {
    id: "reality-sphere",
    year: "2024",
    tags: ["Real estate", "Booking system"],
    name: "Reality Sphere",
    industry: "Real Estate (US)",
    blurb:
      "A property portfolio where visitors browse listings and book & register directly.",
    screenshot: "/portfolio-screenshots/Realitysphere.png",
    width: 2000,
    height: 1132,
    url: null,
    domain: null,
  },
];

/* -------------------------------------------------------------------------
   Automations — internal capability builds, shown as flows rather than
   client projects.
------------------------------------------------------------------------- */

export type Flow = {
  id: string;
  title: string;
  description: string;
  steps: string[];
};

export const automationsSection = {
  eyebrow: "AI & Automation",
  heading: "We don't just use tools. We *build the ones* that do the work.",
  note: "Built in-house for our clients. Ask us for a walkthrough on your strategy call.",
  cta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
} as const;

export const flows: Flow[] = [
  {
    id: "workflow",
    title: "Workflow Automation",
    description:
      "Connecting tools and triggers so repetitive ops run themselves — no manual handoffs.",
    steps: ["Trigger", "Process", "Route", "Notify", "Done"],
  },
  {
    id: "marketing",
    title: "Marketing Automation",
    description:
      "Campaign, content, and outreach sequences that run and adapt automatically.",
    steps: ["Lead in", "Segment", "Personalize", "Send", "Track"],
  },
  {
    id: "sales",
    title: "Sales & Lead Automation",
    description:
      "Capture, qualify, enrich, and route leads to close faster with zero leakage.",
    steps: ["Capture", "Qualify", "Enrich", "Route", "Close"],
  },
  {
    id: "internal",
    title: "Internal / Team-Ops Automation",
    description:
      "Internal workflows, approvals, and reporting that keep the team moving without chasing.",
    steps: ["Request", "Approve", "Assign", "Update", "Report"],
  },
];

/**
 * The chronological index at the foot of /portfolio.
 *
 * It was a homepage band until F6. It never belonged there — it is the full
 * list, and the homepage already shows four of these in a carousel two
 * sections earlier — but at the foot of the portfolio page, after the featured
 * grid and the automation flows, it reads as what it is: the complete index.
 */
export const archiveSection = {
  num: "03",
  label: "Archive",
  title: "Every project so far",
  subline: `All ${projects.length} projects, live and private, newest first`,
} as const;

export const portfolioCta = {
  heading: "Want *yours* on this page?",
  description:
    "Tell us what you're building. We'll come back within 24 hours with scope and a number.",
  cta: { label: "Get a quick estimate", href: "/estimate" },
  /**
   * The one contextual route out of this page other than the estimate form.
   * Somebody who has just scrolled eleven builds is asking what one costs, and
   * before this the only way from here to /pricing was the navbar.
   */
  secondary: { label: "See what a build costs", href: "/pricing" },
} as const;
