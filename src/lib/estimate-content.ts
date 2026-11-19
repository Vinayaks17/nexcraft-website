import type { BudgetId, NeedId, TimelineId } from "@/lib/estimate";

export const estimateHero = {
  eyebrow: "Quick estimate",
  heading: "Get a quick *estimate.*",
  intro:
    "Tell us what you need — we'll reply within 24 hours with a tailored quote.",
} as const;

/**
 * `num` is presentational — the form's logic indexes this array positionally,
 * so reordering the steps renumbers them without any code change.
 */
export const steps = [
  { id: "need", num: "01", title: "What do you need?", short: "Needs" },
  { id: "details", num: "02", title: "Project details", short: "Details" },
  { id: "contact", num: "03", title: "How do we reach you?", short: "Contact" },
] as const;

export const needOptions: {
  id: NeedId;
  title: string;
  description: string;
  icon: "Monitor" | "Workflow" | "Layers";
}[] = [
  {
    id: "website",
    title: "Website",
    description: "A new site, a rebuild, or a redesign of what you have.",
    icon: "Monitor",
  },
  {
    id: "automation",
    title: "Automation",
    description: "Bots and workflows that handle the repetitive work.",
    icon: "Workflow",
  },
  {
    id: "both",
    title: "Both",
    description: "A site that captures leads and a system that processes them.",
    icon: "Layers",
  },
];

export const budgetOptions: { id: BudgetId; label: string }[] = [
  { id: "under-1000", label: "< $1k" },
  { id: "1000-3000", label: "$1k – $3k" },
  { id: "3000-6000", label: "$3k – $6k" },
  { id: "6000-plus", label: "$6k+" },
  { id: "unsure", label: "Not sure" },
];

export const timelineOptions: { id: TimelineId; label: string }[] = [
  { id: "asap", label: "ASAP" },
  { id: "1-2-months", label: "1–2 months" },
  { id: "flexible", label: "Flexible" },
];

export const whatHappensNext = {
  heading: "What happens next",
  steps: [
    {
      number: "01",
      title: "We review your brief",
      description: "A real person reads it — no auto-responder quotes.",
    },
    {
      number: "02",
      title: "We reply within 24h",
      description: "You get a tailored quote with the scope written out.",
    },
    {
      number: "03",
      title: "Free strategy call",
      description: "We walk through it together and finalize the details.",
    },
  ],
} as const;

export const contactFallback = {
  heading: "Prefer email?",
  description: "Send us the details directly and we'll pick it up from there.",
} as const;

export const successState = {
  heading: "Thanks — we'll get back to you within *24 hours.*",
  description:
    "Your brief is with the team. Keep an eye on your inbox; if it hasn't landed by tomorrow, check your spam folder.",
  cta: { label: "Back to home", href: "/" },
} as const;
