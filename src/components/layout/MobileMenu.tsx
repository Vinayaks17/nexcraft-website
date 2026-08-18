"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { isActivePath } from "@/components/layout/Navbar";
import { navLinks, routes } from "@/lib/site";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

const panel = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
} as const;

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
} as const;

export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  // Close on route change.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll + wire up Escape while the menu is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="glass-strong fixed inset-0 z-[60] flex flex-col lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between px-5 sm:px-6">
            <Logo />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:bg-cream/10"
            >
              <X className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pt-4 sm:px-6">
            {navLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <motion.div key={link.href} variants={item}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-3 py-3.5 font-heading text-2xl font-semibold tracking-[-0.02em] transition-colors duration-200",
                      active
                        ? "bg-cream/10 text-cream"
                        : "text-cream/70 hover:bg-cream/5 hover:text-cream",
                    )}
                  >
                    <span
                      className={cn(
                        "h-6 w-[3px] rounded-full transition-opacity duration-200",
                        active ? "gradient-brand opacity-100" : "bg-primary opacity-0 group-hover:opacity-40",
                      )}
                      aria-hidden
                    />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div variants={item} className="mt-6 flex flex-col gap-3">
              <Button href={routes.estimate} variant="highlight" size="lg" className="w-full">
                Get a quick estimate
              </Button>
              <Button href={routes.bookCall} variant="primary" size="lg" className="w-full">
                Book a Call
              </Button>
            </motion.div>

            <motion.div variants={item} className="mt-8 mb-10 flex justify-center">
              <LanguageSwitcher className="text-base" />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
