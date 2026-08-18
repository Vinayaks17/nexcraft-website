"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { SlideLabel } from "@/components/ui/SlideLabel";
import { LinkedInIcon } from "@/components/ui/BrandIcons";
import { contact, footerLegal, footerPages, routes, site } from "@/lib/site";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

const year = 2026;
const EASE = [0.22, 1, 0.36, 1] as const;

const footerCta = {
  heading: "Let's build something that *works.*",
} as const;

/** Shared entrance: each block lifts in a beat after the one above it. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: EASE, delay },
});

function LinkColumn({
  title,
  links,
  delay,
}: {
  title: string;
  links: { label: string; href: string }[];
  delay: number;
}) {
  return (
    <motion.div {...rise(delay)}>
      <h3 className="font-mono text-[0.625rem] font-medium tracking-[0.22em] text-primary uppercase">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link
              href={link.href}
              className="group/link inline-flex items-center gap-1.5 text-sm text-cream/70"
            >
              <SlideLabel>{link.label}</SlideLabel>
              <ArrowUpRight
                className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                strokeWidth={2.25}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * The oversized wordmark. Two stacked copies: a cream stroke that is always
 * there, and an orange stroke revealed only inside a radial mask that follows
 * the cursor — so the letters warm where the pointer is.
 *
 * The mask is built with useMotionTemplate from motion values, which keeps the
 * whole effect off React's render path: a pointermove updates a CSS string, not
 * component state.
 */
function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const mask = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, #000 0%, rgba(0,0,0,0.35) 45%, transparent 72%)`;

  const active = fine && !reduceMotion;

  const onMove = (e: React.PointerEvent) => {
    if (!active) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  /* Sized from the real advance width — re-measured for Switzer, which is a
     normal-width face and so runs wider than the condensed one this replaced.
     See the vw value below; it holds at every width because text and viewport
     both scale in vw. Bumped to 700 so the outline has enough presence at this
     size. */
  const stroke =
    "font-display text-[14.5vw] leading-[0.8] font-bold tracking-[-0.03em] whitespace-nowrap uppercase select-none";

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(-9999);
        my.set(-9999);
      }}
      // Clipped so the wordmark can bleed off the bottom edge without ever
      // widening the page.
      className="pointer-events-auto relative mt-14 h-[10.5vw] w-full overflow-hidden select-none"
      aria-hidden
    >
      <span
        className={`${stroke} absolute inset-x-0 bottom-[-0.16em] block text-center text-transparent [-webkit-text-stroke:1px_rgba(242,237,228,0.16)]`}
      >
        {site.name}
      </span>

      {active && (
        <motion.span
          style={{ WebkitMaskImage: mask, maskImage: mask }}
          className={`${stroke} absolute inset-x-0 bottom-[-0.16em] block text-center text-transparent [-webkit-text-stroke:1px_rgba(255,146,77,0.85)]`}
        >
          {site.name}
        </motion.span>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-void text-cream">
      {/* Signature gradient hairline across the top edge */}
      <div className="gradient-brand absolute inset-x-0 top-0 h-[3px]" aria-hidden />
      <div
        className="pointer-events-none absolute -top-16 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-20 sm:px-8 lg:px-10 lg:pt-28">
        {/* 1 — the site's last conversion moment */}
        <motion.div
          {...rise(0)}
          className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <RevealHeading
            text={footerCta.heading}
            as="h2"
            className="max-w-2xl text-[2.25rem] sm:text-5xl lg:text-[3.5rem]"
          />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href={routes.bookCall} size="lg" magnetic>
              Book Your Free Strategy Call
            </Button>
            <Button href={routes.estimate} variant="secondary" size="lg" magnetic>
              Get a quick estimate
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 h-px w-full bg-cream/10" aria-hidden />

        {/* 2 — link columns */}
        <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4 lg:gap-8">
          <LinkColumn title="Pages" links={footerPages} delay={0.05} />
          <LinkColumn title="Legal" links={footerLegal} delay={0.1} />

          <motion.div {...rise(0.15)}>
            <h3 className="font-mono text-[0.625rem] font-medium tracking-[0.22em] text-primary uppercase">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2.5 text-cream/70 transition-colors duration-200 hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 text-cream/70 transition-colors duration-200 hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {contact.phone}
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div {...rise(0.2)}>
            <h3 className="font-mono text-[0.625rem] font-medium tracking-[0.22em] text-primary uppercase">
              Social
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={contact.linkedin}
                  className="group inline-flex items-center gap-2.5 text-cream/70 transition-colors duration-200 hover:text-primary"
                >
                  <LinkedInIcon className="h-4 w-4 shrink-0 text-primary" />
                  LinkedIn
                  <ArrowUpRight
                    className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

      </div>

      {/* 3 — the signature, full-bleed rather than gutter-bound */}
      <Wordmark />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
        {/* 4 — bottom bar */}
        <div className="flex flex-col items-center gap-3 border-t border-cream/10 py-6 sm:flex-row sm:justify-between">
          <p className="font-mono text-[0.625rem] tracking-[0.12em] text-cream/55">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.625rem] tracking-[0.12em] text-cream/55">
            Crafted in New Delhi, India
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
