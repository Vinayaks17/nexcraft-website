/**
 * All homepage copy lives here so wording can change without touching layout.
 * Icons are referenced by name and resolved in the components (keeps this file
 * a plain data module, importable from server components).
 */

import { routes } from "@/lib/site";


export const hero = {
  /** Small letter-spaced orange eyebrow above the headline. */
  eyebrow: "AI & Automation",
  /**
   * Animated word by word, sentence case. The one `accent: true` entry is set
   * in italic and painted orange (see <AccentWord>).
   */
  headline: [
    { text: "We build,", accent: false },
    { text: "automate", accent: false },
    { text: "and", accent: false },
    { text: "scale.", accent: true },
  ],
  subheadline:
    "Your digital foundation, built right. We craft high-converting websites and invisible business automations so you can focus on what you do best.",
  primaryCta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondaryCta: { label: "Get a quick estimate", href: "/estimate" },
  scrollHint: "Scroll to explore",
} as const;

export const industries = {
  eyebrow: "Industries",
  heading: "Built for the businesses we know *best.*",
  intro:
    "We go deep in a handful of industries instead of shallow in all of them — so your site speaks your customers' language from day one.",
  items: [
    {
      icon: "Wrench",
      title: "Trades & Home Services",
      description:
        "Plumbers, electricians, and contractors needing reliable lead-gen portfolios.",
    },
    {
      icon: "HardHat",
      title: "Construction Companies",
      description: "Professional digital showcases for your biggest builds.",
    },
    {
      icon: "BriefcaseBusiness",
      title: "Working Professionals",
      description:
        "Sleek, personal portfolio websites to establish your industry authority.",
    },
    {
      icon: "Church",
      title: "Churches & Communities",
      description: "Accessible, easy-to-navigate platforms for your congregation.",
    },
  ],
} as const;

export const services = {
  eyebrow: "What We Do",
  heading: "Stop doing manual work. Start *scaling.*",
  web: {
    eyebrow: "Website Development",
    title: "A digital presence that earns its *keep.*",
    description:
      "We build fast, clean, and responsive digital presences designed to capture leads and build trust.",
    highlights: [
      "Built for speed and search from the first line of code",
      "Conversion-led layouts, not decoration",
      "Yours to own — no rented page builders",
    ],
    /**
     * Portrait screen-recordings of shipped sites, shown in phone frames.
     * Sources are 1080x1920; the poster is a frame grabbed at 1s so the frame
     * shown before playback isn't the recording's opening flash.
     */
    videos: [
      {
        src: "/video-nex-one.mp4",
        poster: "/video-posters/nex-one.jpg",
        alt: "Website we built — scroll preview",
      },
      {
        src: "/video-nex-two.mp4",
        poster: "/video-posters/nex-two.jpg",
        alt: "Website we built — scroll preview",
      },
    ],
    videoCaption: "Real builds · Real scroll",
  },
  automation: {
    eyebrow: "Business Automation",
    title: "Six bots for the work nobody *wants.*",
    description:
      "Six systems we can wire into your business. Scroll to see how each one is put together.",
  },
  /**
   * `short` is the key that pairs a service with its schematic — it must match
   * a diagram `id` in lib/automation-graph. `tag` is the mono kicker shown
   * under the description when a row is expanded.
   */
  items: [
    {
      short: "CRM",
      tag: "System — CRM",
      icon: "Users",
      title: "Custom CRM Setup",
      description:
        "Streamline your client management and never lose a lead in your inbox again.",
    },
    {
      short: "Lead Bot",
      tag: "Bot — Qualify",
      icon: "Bot",
      title: "Lead Qualification Bot",
      description:
        "Pre-screen your prospects 24/7 so you only talk to people ready to buy.",
    },
    {
      short: "SEO Bot",
      tag: "Bot — Search",
      icon: "TrendingUp",
      title: "SEO Automation Bot",
      description:
        "Automatically track your rankings and optimize content without lifting a finger.",
    },
    {
      short: "Social",
      tag: "Bot — Social",
      icon: "Share2",
      title: "Social Media Manager Bot",
      description: "Auto-post, engage, and grow your audience while you sleep.",
    },
    {
      short: "Email",
      tag: "Flow — Email",
      icon: "Mail",
      title: "Email Marketing Automations",
      description:
        "Nurture leads with personalized sequences that trigger based on client behavior.",
    },
    {
      short: "Billing",
      tag: "Flow — Billing",
      icon: "Receipt",
      title: "Invoicing & Billing",
      description:
        "Get paid faster by automating your follow-ups and invoice generation.",
    },
  ],
} as const;

export const ctaPrimary = {
  /** Oversized outlined word sitting behind the headline. */
  ghostWord: "AUTOMATE",
  heading: "Ready to eliminate repetitive *tasks?*",
  description:
    "Tell us where your week disappears. We'll show you what it costs to get it back.",
  cta: { label: "Get a quick estimate", href: "/estimate" },
} as const;

export const howItWorks = {
  eyebrow: "How It Works",
  heading: "We make going digital *effortless.*",
  intro:
    "Three steps, no jargon, and no month-long silences. You always know what we're building and why.",
  steps: [
    {
      number: "01",
      title: "Discovery",
      description:
        "We map out your exact needs, from web pages to workflow bottlenecks.",
    },
    {
      number: "02",
      title: "Build & Automate",
      description: "We design your site and set up your bots in the background.",
    },
    {
      number: "03",
      title: "Launch & Scale",
      description:
        "You get the keys to a system that brings in leads and processes them automatically.",
    },
  ],
} as const;

export const ctaMinimal = {
  heading: "Don't see what you're *looking for?*",
  description:
    "Every business is shaped a little differently. Tell us yours and we'll build the plan around it.",
  cta: { label: "Customize your plan", href: "/estimate" },
} as const;

export const faqs = {
  eyebrow: "FAQs",
  heading: "Questions, *answered.*",
  items: [
    {
      question: "How long does a website take?",
      answer:
        "Most projects land between 2 and 6 weeks, depending on scope. A focused brochure or portfolio site moves fast; multi-page builds with custom functionality and integrations sit at the longer end. You get a firm timeline at kickoff, and we hold ourselves to it.",
    },
    {
      question: "What is a business automation?",
      answer:
        "It's software that quietly handles the repetitive work you'd otherwise do by hand — chasing lead follow-ups, generating invoices, posting to social, keeping your CRM current. You set the rules once, and nothing falls through the cracks after that.",
    },
    {
      question: "Do you provide hosting?",
      answer:
        "Yes. We can take care of domain and hosting setup as part of your project, so you're never left wrangling DNS records on your own. Ongoing maintenance goes a step further and keeps the platform, plugins, and security patches up to date for you.",
    },
  ],
} as const;

/**
 * Ticker strip between Industries and Services. Sentence case here — the strip
 * renders through .mono-caption, which uppercases.
 */
export const marqueeItems = [
  "Websites",
  "Automations",
  "E-commerce",
  "SEO",
  "Booking systems",
  "CRM",
] as const;
