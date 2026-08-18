"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SlideLabel } from "@/components/ui/SlideLabel";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks, routes } from "@/lib/site";
import { fuelNav } from "@/lib/home-fuel-content";
import { springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Scroll distance at which the bar detaches into its floating pill state. */
const SCROLL_THRESHOLD = 50;

export function isActivePath(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* See the desktop-links block below — the homepage runs the numbered nav. */
  const fuel = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Small hysteresis band so a bar sitting exactly on the threshold can't flicker.
    setScrolled((prev) => (prev ? latest > SCROLL_THRESHOLD - 20 : latest > SCROLL_THRESHOLD));
  });

  return (
    <>
      <motion.header
        initial={false}
        animate={scrolled ? "floating" : "top"}
        className="fixed inset-x-0 top-0 z-50 w-full"
      >
        <motion.div
          variants={{
            top: { paddingTop: 0, paddingLeft: 0, paddingRight: 0, maxWidth: 1440 },
            floating: { paddingTop: 14, paddingLeft: 16, paddingRight: 16, maxWidth: 1200 },
          }}
          transition={springSoft}
          className="mx-auto w-full"
        >
          <div className="relative">
            {/* Glass panel — fades in instead of animating backdrop-filter, which keeps it jank-free. */}
            <motion.div
              variants={{ top: { opacity: 0 }, floating: { opacity: 1 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass pointer-events-none absolute inset-0 rounded-full shadow-glass ring-1 ring-cream/10"
              aria-hidden
            />

            <motion.nav
              variants={{ top: { height: 76 }, floating: { height: 62 } }}
              transition={springSoft}
              className="relative flex items-center justify-between gap-3 px-5 sm:px-6 lg:px-7"
            >
              <Logo />

              {/* Desktop links.

                  On the fuel-redesign homepage these switch to the numbered
                  convention — label with its index set as a superscript — and
                  to that page's own link set. Scoped to "/" so every other
                  route keeps the existing nav while the direction is reviewed. */}
              <div className="hidden items-center lg:flex">
                {(fuel ? fuelNav : navLinks).map((link) => {
                  const active = isActivePath(pathname, link.href);
                  const num = "num" in link ? link.num : null;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group/link relative rounded-full py-2 font-mono text-[0.8125rem] font-normal tracking-[0.01em]",
                        num ? "px-3.5 pr-5" : "px-3.5",
                        active ? "text-cream" : "text-cream/70",
                      )}
                    >
                      <SlideLabel className="relative z-10">{link.label}</SlideLabel>
                      {num && (
                        <sup
                          aria-hidden
                          className="relative z-10 ml-1 align-super text-[0.5625rem] tracking-[0.08em] text-cream/45"
                        >
                          {num}
                        </sup>
                      )}
                      {active && (
                        <motion.span
                          layoutId="navbar-active-indicator"
                          className="gradient-brand absolute inset-x-0 -bottom-0.5 z-10 mx-auto h-[3px] w-5 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Desktop actions */}
              <div className="hidden items-center gap-2.5 lg:flex">
                <Button href={routes.estimate} variant="highlight" size="sm" magnetic>
                  Get a quick estimate
                </Button>
                <Button href={routes.bookCall} variant="primary" size="sm" magnetic>
                  Book a Call
                </Button>
                <LanguageSwitcher className="ml-1.5" />
              </div>

              {/* Mobile trigger */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors duration-200 hover:bg-cream/10 lg:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </motion.nav>
          </div>
        </motion.div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

export default Navbar;
