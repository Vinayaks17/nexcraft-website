/**
 * About page copy. Headings use the *asterisk* accent convention parsed by
 * renderAccent (see components/ui/AccentWord).
 *
 * Photo paths are case-sensitive in production and mirror /public/team exactly.
 * Give a member a `photo` of null and the card renders a branded initials
 * avatar instead — swapping a headshot in later is a one-line change here.
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
 * looking without scrolling past the team and the office photos first.
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

/**
 * How one headshot sits inside the card's 4:5 frame.
 *
 * The three photographs were not shot as a set — they are a lecture snap, a
 * night portrait and a wide festival shot, at three different aspect ratios and
 * three different subject distances. Dropped into the same frame with a plain
 * `object-cover` they land with eye-lines 20 points apart and faces at very
 * different sizes, which is what made the row read as crooked.
 *
 * These two values pull them onto one eye-line. They live here rather than in
 * TeamCard so swapping a photo is a content edit: measure where the new face
 * sits, set the numbers, done.
 *
 * HOW TO TUNE A NEW PHOTO. Overlay a percentage grid on the raw file and read
 * off three things — the eye-line, the top of the hair, and the chin — as
 * fractions of the *image*. Then match the reference, which is Vinayak's card:
 * eyes at 20% of the frame height, face (hair to chin) about 28% of it, face
 * horizontally centred.
 *
 * - `position` is the CSS `object-position`. Its percentages address the part
 *   of the image that `object-cover` crops away, so it can only move the photo
 *   along the axis that actually overflows the frame: a portrait taller than
 *   4:5 can be slid vertically but not horizontally, and vice versa.
 * - `zoom` is for the photo that needs more than a slide. Namit's is a wide
 *   environmental shot: at 4:5 it overflows the frame by 6% of its height and
 *   not at all in width, so `position` alone cannot lift his eye-line by the
 *   19 points it needs, nor bring his face in from 38% of the width to the
 *   middle. `zoom` magnifies the cover fit about `position` (it is used as the
 *   `transform-origin` too), which re-crops the photo tighter and gives the
 *   slide something to work with. 1 — the default — means no magnification.
 */
export type PhotoFraming = {
  /** CSS object-position, and the transform-origin that `zoom` scales about. */
  position: string;
  /** Magnification on top of the cover fit. Omit for photos that don't need it. */
  zoom?: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  /** Path under /public/team, or null to render the initials avatar. */
  photo: string | null;
  /** How the photo is cropped into the 4:5 frame. See PhotoFraming. */
  framing?: PhotoFraming;
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
    photo: "/team/vinayak-c.jpg",
    /* 950x1057, so wider than 4:5 — the full height shows and only the sides
       crop. That fixes his eye-line at 20.5% of the frame with nothing to
       tune, which is why this card is again the reference the other two are
       matched to; the 49% only slides him onto the centre line. */
    framing: { position: "49% 50%" },
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
    photo: "/team/manish-c.jpg",
    /* 941x1672 — far taller than 4:5, so the frame shows the full width and
       crops 30% of the height. Measured on the new crop his eyes sit at 41% of
       the image; sliding to 90% lifts them onto the same 20.5% line as
       Vinayak's.

       His face sits about 4% of the frame width right of centre and stays
       there: the photo is taller than the frame, so cover uses its full width
       and the horizontal value is inert. A zoom would buy the centring back
       but would also blow his face up to 35% of the frame against the others'
       27%, and a head visibly larger than its neighbours is a worse break in
       the row than a head slightly off-centre. */
    framing: { position: "50% 90%" },
    initials: "MM",
    linkedin: "https://www.linkedin.com/in/manish-mishra-a39476249/",
  },
  {
    id: "namit-joshi",
    name: "Namit Joshi",
    role: "Technical Lead",
    blurb:
      "Architecting the tech, managing website development, and leading the intern engineering team.",
    photo: "/team/namit-c.jpg",
    /* 950x1187 — which is exactly 4:5, the frame's own aspect. That is the
       awkward case: cover crops nothing in either direction, so object-position
       has no overflow to move him through and is completely inert on its own.
       His eyes sit 9 points below the reference line and his face is a fifth
       of the frame rather than a quarter, so the correction has to come from
       the zoom, which scales about the same point the position names. */
    framing: { position: "35% 76%", zoom: 1.2 },
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
