/**
 * Pricing page copy. Prices are plain strings so they can carry "Starts at",
 * ranges, and per-month suffixes without any formatting logic in components.
 */

import { routes } from "@/lib/site";


export type AddOn = {
  label: string;
  price: string;
};

export type PricingTier = {
  /** Matches the ?plan= value handed to the estimate form. */
  id: "basic" | "business" | "enterprise" | "automation";
  name: string;
  price: string;
  bestFor?: string;
  included: string[];
  addOns: AddOn[];
  cta: { label: string; href: string };
  featured?: boolean;
  badge?: string;
};

export const pricingHero = {
  eyebrow: "Pricing",
  heading: "Competitive pricing. No hidden *fees.*",
  intro:
    "Clear starting points for every stage of growth — quoted properly once we understand your scope, never padded after the fact.",
} as const;

/** The three website tiers, rendered as a row on desktop. */
export const websiteTiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic Website",
    price: "Starts at €799",
    included: [
      "Up to 3 static pages",
      "Responsive design (desktop & mobile)",
      "Clickable Figma prototype (pre-launch)",
      "UX structured layout + clear content",
      "Launch-ready website",
    ],
    addOns: [
      { label: "Foundational SEO setup", price: "€200" },
      { label: "Logo design/creation", price: "€200" },
      { label: "Domain & hosting setup", price: "€20" },
      { label: "Website (basic) maintenance", price: "€100/month" },
    ],
    cta: { label: "Customise this plan", href: "/estimate?plan=basic" },
  },
  {
    id: "business",
    name: "Business Website",
    price: "Starts at €2499",
    bestFor:
      "Growing businesses and e-commerce websites that need flexibility, scalability, and conversion focus.",
    included: [
      "5–8 dynamic pages (best for ecommerce)",
      "Responsive design (desktop & mobile)",
      "Clickable Figma prototype (pre-launch)",
      "UX structured layout + clear content",
      "Launch-ready website",
      "Built and launched on a modern platform",
      "Conversion-focused UX & UI design",
    ],
    addOns: [
      { label: "Foundational SEO setup", price: "€500" },
      { label: "Logo design/creation", price: "€200" },
      { label: "Domain & hosting setup", price: "€50" },
      { label: "Priority support", price: "€500/month" },
    ],
    cta: { label: "Customise this plan", href: "/estimate?plan=business" },
    featured: true,
    badge: "Most Preferred",
  },
  {
    id: "enterprise",
    name: "Enterprise Website",
    price: "Starts at €4999",
    bestFor:
      "Large-scale websites with complex content, multiple flows, and long-term UX needs.",
    included: [
      "10+ dynamic pages or 1–2 web apps",
      "Advanced flowchart architecture",
      "Lo-fi wireframes for structure and flow",
      "Hi-fi wireframes for design clarity",
      "Responsive design",
      "Advanced interactive Figma prototyping",
      "UX strategy and experience planning",
      "Launch-ready website",
      "Built and launched on a modern platform",
      "Priority collaboration and planning",
    ],
    addOns: [
      { label: "Foundational SEO setup", price: "€800" },
      { label: "Logo design/creation", price: "€200" },
      { label: "Domain & hosting setup", price: "€100" },
      { label: "VIP Support & Maintenance", price: "€900/month" },
    ],
    cta: { label: "Customise this plan", href: "/estimate?plan=enterprise" },
  },
];

/** Rendered full-width and dark, to read as a different kind of offer. */
export const automationTier: PricingTier = {
  id: "automation",
  name: "Custom Business Automation",
  price: "Setup from €300 – €3,500",
  bestFor:
    "Teams losing hours a week to work a system should be doing on its own.",
  included: [
    "Custom workflow mapping",
    "CRM integrations",
    "Email automation setup",
    "AI-bot development",
  ],
  addOns: [
    {
      label: "Monthly retainer for reporting, maintenance, and ongoing optimization",
      price: "€300–€800/month",
    },
  ],
  cta: { label: "Customise this plan", href: "/estimate?plan=automation" },
};

/**
 * All four tiers in one list, websites first.
 *
 * Both the homepage band and /pricing render from this, so the set and its
 * order can't drift between the two. `websiteTiers` and `automationTier` stay
 * exported separately because the automation tier is a different kind of offer
 * and some layouts still want to treat it that way.
 */
export const pricingTiers: PricingTier[] = [...websiteTiers, automationTier];

/**
 * Chrome around the tier cards. It lived in home-fuel-content while pricing was
 * a homepage band; that band is gone (the client asked for one place to talk
 * about money, and /pricing is it), so it lives with the prices now.
 */
export const fuelPricing = {
  includedLabel: "What's included",
  addOnsLabel: "Add-ons",
  note: "Free strategy call · SEO-first build · Clickable prototype before you commit · No hidden fees",
} as const;

export const reassurances = [
  "Free strategy call",
  "SEO-first build, from the first file",
  "Clickable prototype before you commit",
  "No hidden fees",
] as const;

export const pricingCta = {
  heading: "Not sure which plan *fits?*",
  description:
    "Walk us through the project on a free call — we'll point you at the right tier, even if it's the smaller one.",
  cta: { label: "Book Your Free Strategy Call", href: routes.bookCall },
  /**
   * A price means nothing without the work behind it, and this page had no
   * route to that work except the navbar. Somebody weighing four numbers wants
   * to see what the numbers bought.
   */
  secondary: { label: "See what these plans have built", href: "/portfolio" },
} as const;
