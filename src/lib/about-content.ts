/**
 * About page copy. Headings use the *asterisk* accent convention parsed by
 * renderAccent (see components/ui/AccentWord).
 *
 * Photo paths are case-sensitive in production and mirror /public/team exactly.
 * Give a member a `photo` of null and the card renders a branded initials
 * avatar instead — swapping a headshot in later is a one-line change here.
 */

export const aboutHero = {
  eyebrow: "About NexCRAFT",
  heading: "Built in India. *Crafted* for the world.",
  intro:
    "Founded in January 2024 in New Delhi, we're a team of 10+ designers, engineers, and automation builders shipping for clients across Europe and beyond.",
} as const;

export const story = {
  eyebrow: "Our story",
  heading: "One mission, *two* beneficiaries.",
  paragraphs: [
    "NexCRAFT started with a simple observation: the studios doing genuinely excellent web and automation work were charging like it was a luxury, and the ones charging fairly were shipping templates. We decided to be the third option — senior-grade craft, delivered from New Delhi, priced like we want the relationship to last.",
    "The second half of the mission is closer to home. Every project we take on becomes a training ground for young Indian engineers who have the talent but not the reps. They build real products for real clients with real mentorship beside them — and our clients get a team that is genuinely invested in the outcome. That isn't charity. It's how we build people who are world-class, and how we stay that way ourselves.",
  ],
} as const;

/** Stat strip under the story. Update the numbers here. */
export const stats = [
  { value: "2024", label: "Founded" },
  { value: "New Delhi", label: "HQ" },
  { value: "10+", label: "Team" },
  { value: "15+", label: "Projects shipped" },
] as const;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  /** Path under /public/team, or null to render the initials avatar. */
  photo: string | null;
  /** Fallback monogram, used when `photo` is null. */
  initials: string;
  linkedin: string;
  /** Link text for the LinkedIn row; falls back to a neutral default. */
  linkedinLabel?: string;
  /** Optional second link rendered under the LinkedIn row. */
  site?: { label: string; href: string };
};

export const team: TeamMember[] = [
  {
    id: "vinayak-singh",
    name: "Vinayak Singh",
    role: "Founder & CEO",
    blurb: "Leading strategy, client relations, and overall business operations.",
    photo: "/team/vinayak.jpeg",
    initials: "VS",
    linkedin: "https://www.linkedin.com/in/vinayak08/",
    linkedinLabel: "Connect with me on LinkedIn",
    site: { label: "vinayaksingh.us", href: "https://www.vinayaksingh.us/" },
  },
  {
    id: "manish-mishra",
    name: "Manish Mishra",
    role: "Growth & Lead Generation",
    blurb: "Driving scalable acquisition and managing the sales pipeline.",
    photo: "/team/manish.png",
    initials: "MM",
    linkedin: "https://www.linkedin.com/in/manish-mishra-a39476249/",
  },
  {
    id: "namit-joshi",
    name: "Namit Joshi",
    role: "Technical Lead",
    blurb:
      "Architecting the tech, managing website development, and leading the intern engineering team.",
    // No headshot yet — the card renders the `initials` monogram until one lands.
    photo: null,
    initials: "NJ",
    linkedin: "https://www.linkedin.com/in/namit-joshi-b39487270/",
  },
];

export const teamSection = {
  eyebrow: "The team",
  heading: "The people behind the *work.*",
  intro:
    "A small senior core, a bench of engineers we're training up, and no account managers in between.",
} as const;

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
    "We work out of one room in New Delhi, which means decisions happen in conversation rather than in ticket queues. Most days that room is a mix of senior engineers shipping client work and interns two months into their first real codebase, arguing about the same problem.",
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
  primary: { label: "Book Your Free Strategy Call", href: "#" },
  secondary: { label: "Get a quick estimate", href: "/estimate" },
} as const;
