import { FuelHero } from "@/components/fuel/FuelHero";
import { FuelValueLine } from "@/components/fuel/FuelValueLine";
import { FuelAbout } from "@/components/fuel/FuelAbout";
import { FuelLogoMarquee } from "@/components/fuel/FuelLogoMarquee";
import { FuelPortfolio } from "@/components/fuel/FuelPortfolio";
import { FuelServices } from "@/components/fuel/FuelServices";
import { FuelPricing } from "@/components/fuel/FuelPricing";
import { FuelTestimonial } from "@/components/fuel/FuelTestimonial";
import { FuelArchive } from "@/components/fuel/FuelArchive";
import { FuelStats } from "@/components/fuel/FuelStats";
import { FuelFaqs } from "@/components/fuel/FuelFaqs";

/**
 * Homepage — fuel-redesign.
 *
 * Numbered bands with a meta row over each, alternating dark and cream, on a
 * near-full-bleed grid. The closing CTA/footer band is rendered by the shared
 * Footer, which stands aside for FuelFooter on this route (see
 * components/layout/Footer.tsx).
 *
 * (08) is absent by design: the reference's articles band has no equivalent
 * here, and skipping its number is more honest than resequencing the rest.
 */
export default function HomePage() {
  return (
    <>
      <FuelHero />
      <FuelValueLine />
      <FuelAbout />
      <FuelLogoMarquee />
      <FuelPortfolio />
      <FuelServices />
      <FuelPricing />
      <FuelTestimonial />
      <FuelArchive />
      <FuelStats />
      <FuelFaqs />
    </>
  );
}
