"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Magnetic } from "@/components/ui/Magnetic";
import { contact } from "@/lib/site";
import { springSnappy } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

type ContactButton = {
  label: string;
  href: string;
  className: string;
  icon: React.ComponentType<{ className?: string }>;
};

const BUTTONS: ContactButton[] = [
  {
    label: "Chat on WhatsApp",
    href: contact.whatsapp,
    /* WhatsApp's darker brand green rather than #25D366: a white glyph on the
       bright green is only 2:1, short of the 3:1 that 1.4.11 asks of an icon
       carrying the button's whole meaning. */
    className: "bg-[#128C7E] text-white shadow-[0_10px_28px_-8px_rgba(18,140,126,0.75)]",
    icon: WhatsAppIcon,
  },
  {
    label: `Email us at ${contact.email}`,
    href: `mailto:${contact.email}`,
    className: "gradient-brand text-on-brand shadow-glow",
    icon: Mail,
  },
];

/** How long the page must sit still before the buttons come back. */
const IDLE_MS = 800;

/**
 * Persistent contact affordances, fixed bottom-right on every page.
 *
 * They slide out of the way while the reader is scrolling down and return once
 * scrolling stops or reverses — the buttons sit over the right-hand gutter,
 * which is exactly where right-aligned content (the portfolio's "view project"
 * links worst of all) lives.
 */
export function FloatingContact() {
  const { scrollY } = useScroll();
  const [tucked, setTucked] = useState(false);
  const lastY = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => {
    if (reduceMotion) return;

    const delta = y - lastY.current;
    lastY.current = y;

    // Small deltas are momentum noise, not intent.
    if (Math.abs(delta) < 4) return;

    // Scrolling up brings them straight back; near the top they always show.
    if (delta < 0 || y < 120) setTucked(false);
    else setTucked(true);

    if (idle.current) clearTimeout(idle.current);
    idle.current = setTimeout(() => setTucked(false), IDLE_MS);
  });

  useEffect(() => () => {
    if (idle.current) clearTimeout(idle.current);
  }, []);

  return (
    <motion.div
      animate={
        reduceMotion ? undefined : { x: tucked ? 96 : 0, opacity: tucked ? 0 : 1 }
      }
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="fixed right-5 bottom-5 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      {BUTTONS.map(({ label, href, className, icon: Icon }, i) => (
        /* Shorter range than a page CTA: these sit in the corner, and a wide
           catchment would have them drifting at any cursor position. */
        <Magnetic key={label} strength={7} range={110}>
          <motion.a
            href={href}
            {...(href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-label={label}
            title={label}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...springSnappy, delay: 0.6 + i * 0.1 }}
            whileHover={{ scale: 1.09 }}
            whileTap={{ scale: 0.94 }}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-shadow duration-300 sm:h-[52px] sm:w-[52px] ${className}`}
          >
            <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          </motion.a>
        </Magnetic>
      ))}
    </motion.div>
  );
}

export default FloatingContact;
