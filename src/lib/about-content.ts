/**
 * About page copy. Headings use the *asterisk* accent convention parsed by
 * renderAccent (see components/ui/AccentWord).
 *
 * Photo paths are case-sensitive in production and mirror /public/team exactly.
 */

import { routes } from "@/lib/site";


export const aboutHero = {
  eyebrow: "About NexCRAFT",
  heading: "Built in India. *Crafted* for the world.",
  intro:
    "Founded in January 2024 in India, we're a team of 10+ designers, engineers, and automation builders shipping for clients across Europe and beyond.",
} as const;

/**
 * The one contextual route from the story out to the work.
 *
 * /about talked about what the studio believes and never once pointed at the
 * thing it had made — the navbar was the only way across. This closes the
 * story section rather than the page, so a reader who is convinced can go
 * looking without scrolling past the office photos first.
 */
export const storyLink = {
  label: "See the work it produced",
  href: "/portfolio",
} as const;

export const story = {
  eyebrow: "Our story",
  heading: "One mission, *two* beneficiaries.",
  paragraphs: [
    "NexCRAFT started with a simple observation: the studios doing genuinely excellent web and automation work were charging like it was a luxury, and the ones charging fairly were shipping templates. We decided to be the third option — senior-grade craft, delivered from India, priced like we want the relationship to last.",
    "The second half of the mission is closer to home. Every project we take on becomes a training ground for young Indian engineers who have the talent but not the reps. They build real products for real clients with real mentorship beside them — and our clients get a team that is genuinely invested in the outcome. That isn't charity. It's how we build people who are world-class, and how we stay that way ourselves.",
  ],
} as const;

/** Stat strip under the story. Update the numbers here. */
export const stats = [
  { value: "2024", label: "Founded" },
  { value: "India", label: "HQ" },
  { value: "10+", label: "Team" },
  { value: "15+", label: "Projects shipped" },
] as const;

export type LifePhoto = {
  src: string;
  alt: string;
  /** Intrinsic size — these are candid shots, so don't render them larger. */
  width: number;
  height: number;
};

/**
 * Candid team photos. Paths carry their literal filenames — including the
 * space in the second one. next/image URL-encodes `src` itself, so pre-encoding
 * it here would double-escape the `%` and 404.
 *
 * Annotated rather than `as const` so `photos.length` stays a plain number:
 * the band's "no photos, skip the section" guard has to remain live code.
 */
export const lifeAt: {
  heading: string;
  paragraphs: string[];
  photos: LifePhoto[];
} = {
  heading: "Builders, *not vendors.*",
  paragraphs: [
    "We work out of one room in India, which means decisions happen in conversation rather than in ticket queues. Most days that room is a mix of senior engineers shipping client work and interns two months into their first real codebase, arguing about the same problem.",
    "We're online across time zones for clients in Europe and the US, and we run an intern engineering program that puts young talent on production work from week one — supervised, reviewed, and held to the standard our clients pay for.",
  ],
  photos: [
    {
      src: "/team/nexcraft-team-pic-one-meeting.jpeg",
      alt: "The NexCRAFT team gathered around a table in a working meeting",
      width: 1008,
      height: 912,
    },
    {
      src: "/team/nexcraft-team-pic-two-working together.jpeg",
      alt: "NexCRAFT engineers working together at their desks",
      width: 750,
      height: 416,
    },
  ],
};

export const aboutCta = {
  heading: "Come build *with us.*",
  description:
    "Whether you know exactly what you need or you're still shaping it, the first conversation is free.",
  primary: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  secondary: { label: "Get a quick estimate", href: "/estimate" },
} as const;
