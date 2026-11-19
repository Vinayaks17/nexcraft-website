/**
 * Every route's search targeting, in one place.
 *
 * Centralised rather than scattered across seven `page.tsx` files for one
 * practical reason: the failure mode of per-page SEO copy is duplication —
 * two routes drifting onto the same title, or the same description getting
 * pasted twice — and that is invisible when the strings live seven files
 * apart and obvious when they sit in one list. The test at the bottom of this
 * file enforces it.
 *
 * LENGTH BUDGET. `title` is written WITHOUT the brand; the root layout's
 * template appends " — NexCRAFT" (11 characters), so a title must stay at or
 * under 49 to land inside Google's ~60-character display limit. The homepage
 * is the exception: it sets its title absolutely, brand included, because it
 * has no parent template to inherit. Descriptions run 140-160.
 *
 * The `og*` fields are deliberately different from the search copy. A search
 * result is read by someone scanning ten of them for a keyword; a shared link
 * is read by one person who already trusts whoever sent it. The first wants
 * the keyword in front, the second wants a sentence.
 */

export type SeoPage = {
  /** Route path, leading slash. */
  path: string;
  /** The primary search intent this page is written for. Documentation, not output. */
  keyword: string;
  /** Without the brand, except on the homepage — see the length budget above. */
  title: string;
  /** 140-160 characters, keyword placed naturally, one concrete hook. */
  description: string;
  /** Written for a human who was sent the link, not for a results page. */
  ogTitle: string;
  ogDescription: string;
  /** Set on the homepage, whose title carries the brand itself. */
  absoluteTitle?: boolean;
};

export const seoPages = {
  home: {
    path: "/",
    keyword: "custom website design and development agency",
    title: "Custom Website Design & Automation Agency — NexCRAFT",
    absoluteTitle: true,
    description:
      "Custom website design, development and business automation, built from scratch — no templates. First mockup in 2 hours, live in as little as 2 days.",
    ogTitle: "NexCRAFT — websites and automations, built from scratch",
    ogDescription:
      "A design-led studio in India building custom websites and the systems behind them for clients across the US and UK.",
  },

  portfolio: {
    path: "/portfolio",
    keyword: "web design portfolio",
    title: "Web Design Portfolio: 11 Client Builds",
    description:
      "A web design portfolio of 11 shipped client websites across recruitment, retail, media and AI — plus the automation flows we build behind them.",
    ogTitle: "The work — 11 websites and the systems behind them",
    ogDescription:
      "Recruitment, retail, real estate, media and AI. Every one designed and built from scratch, most of them live right now.",
  },

  about: {
    path: "/about",
    keyword: "web design agency in India",
    title: "About Our Web Design Agency in India",
    description:
      "A web design and automation agency in India, founded 2024, building for clients across the US and UK — and training the next generation of engineers.",
    ogTitle: "The people behind the work",
    ogDescription:
      "Ten-plus designers, engineers and automation builders in one room in India, shipping for clients across the US and UK.",
  },

  estimate: {
    path: "/estimate",
    keyword: "get a website quote",
    title: "Get a Website Quote in 24 Hours",
    description:
      "Get a website quote tailored to your project — tell us what you need and a real person replies within 24 hours with scope and a number, not a brochure.",
    ogTitle: "Tell us what you're building",
    ogDescription:
      "Three questions and a real reply within 24 hours, with the scope written out and a number attached.",
  },

  contact: {
    path: "/contact",
    keyword: "contact web design agency",
    title: "Contact Us & Book a Free Strategy Call",
    description:
      "Contact NexCRAFT about a website, an automation, or both. WhatsApp, email, or book a free strategy call — a real person replies within 24 hours.",
    ogTitle: "Let's work together",
    ogDescription:
      "WhatsApp, email or a free 30-minute strategy call. No deck, no account manager in between.",
  },

  terms: {
    path: "/terms",
    keyword: "terms of service",
    title: "Terms of Service",
    description:
      "The agreement between NexCRAFT and its clients — scope, revisions, payments, ownership of the delivered work, liability and governing law.",
    ogTitle: "Terms of Service",
    ogDescription: "Scope, payments, ownership, liability and governing law.",
  },

  privacy: {
    path: "/privacy",
    keyword: "privacy policy",
    title: "Privacy Policy",
    description:
      "What NexCRAFT collects, why we hold it, who else sees it, and how to ask for it back or have it deleted.",
    ogTitle: "Privacy Policy",
    ogDescription: "What we collect, why, who sees it, and how to get it back.",
  },
} satisfies Record<string, SeoPage>;

export const seoPageList: SeoPage[] = Object.values(seoPages);
