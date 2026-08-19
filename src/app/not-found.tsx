import {
  FuelBracketLink,
  FuelSectionMeta,
  fuelBody,
  fuelDisplay,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * 404 — the same numbered chrome as every other route, so a wrong URL still
 * lands somewhere that reads like the site rather than like an error screen.
 *
 * The nav is repeated here on purpose: someone who arrived at a dead link is
 * the one visitor most likely to want a list of what does exist, and the fixed
 * bar's links are small and easy to miss at this moment.
 */
export default function NotFound() {
  return (
    <section className={cn(fuelShell, "flex min-h-[70vh] flex-col pt-32 pb-24 sm:pt-36 lg:pt-40")}>
      <FuelSectionMeta label="Page not found" />

      <p className={cn(fuelDisplay, "mt-14 text-cream/15")} aria-hidden>
        404
      </p>

      <h1 className="mt-6 font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-cream">
        This page hasn&rsquo;t been crafted yet.
      </h1>

      <p className={cn(fuelBody, "mt-6 max-w-[46ch] text-cream/60")}>
        The link may be outdated, or the page has moved. Everything the site does
        have is one of these:
      </p>

      <ul className="mt-10 max-w-md border-t border-cream/12">
        {navLinks.map((link) => (
          <li key={link.href} className="border-b border-cream/12">
            <FuelBracketLink href={link.href} className="max-w-none py-4">
              {link.label}
            </FuelBracketLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
