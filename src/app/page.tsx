import { FuelHero } from "@/components/fuel/FuelHero";
import { FuelPreview } from "@/components/fuel/FuelPreview";
import { FuelValueLine } from "@/components/fuel/FuelValueLine";
import { FuelAbout } from "@/components/fuel/FuelAbout";
import { FuelUsps } from "@/components/fuel/FuelUsps";
import { FuelLogoMarquee } from "@/components/fuel/FuelLogoMarquee";
import { FuelPortfolio } from "@/components/fuel/FuelPortfolio";
import { FuelCtaBand } from "@/components/fuel/FuelCtaBand";
import { FuelServices } from "@/components/fuel/FuelServices";
import { FuelPricing } from "@/components/fuel/FuelPricing";
import { FuelTestimonial } from "@/components/fuel/FuelTestimonial";
import { FuelArchive } from "@/components/fuel/FuelArchive";
import { FuelStats } from "@/components/fuel/FuelStats";
import { FuelFaqs } from "@/components/fuel/FuelFaqs";
import { FuelScrollspy } from "@/components/fuel/FuelScrollspy";
import { fuelCtaBands } from "@/lib/home-fuel-content";

/**
 * Homepage — fuel-redesign.
 *
 * Numbered bands with a header block over each — number, plain-language title,
 * one mono line of orientation — alternating dark and cream on a
 * near-full-bleed grid. The closing CTA/footer band is rendered by FuelFooter
 * from the root layout.
 *
 * The register runs 01..09 with no gaps, in the order below, and it is
 * declared once in `sectionOrder` (lib/home-fuel-content) rather than here:
 * the page, every band's own header and the scrollspy rail all read from that
 * one list, so a section can't end up numbered differently in two places.
 *
 *   01 Who we are            06 What clients say
 *   02 Why NexCRAFT          07 Every project so far
 *   03 Our work              08 The numbers
 *   04 What we build         09 Questions, answered
 *   05 Pricing
 *
 * Three bands carry no number. The preview and the value line sit above (01),
 * and the register counts down the page, so anything above its first entry
 * would have to count backwards to fit. The two CTA bands are punctuation
 * between sections rather than sections — they land after (03) and after (06),
 * which with the footer's own CTA means nothing here runs more than three
 * bands without an ask.
 */
export default function HomePage() {
  return (
    <>
      <FuelScrollspy />

      <FuelHero />
      <FuelPreview />
      <FuelValueLine />

      <FuelAbout />
      <FuelUsps />
      <FuelLogoMarquee />
      <FuelPortfolio />

      {/* Ask 1 of 3 — orange, between two dark bands. */}
      <FuelCtaBand content={fuelCtaBands.work} tone="brand" />

      <FuelServices />
      <FuelPricing />
      <FuelTestimonial />

      {/* Ask 2 of 3 — the cream inversion, so the two never read as one
          component pasted twice. */}
      <FuelCtaBand content={fuelCtaBands.clients} tone="cream" />

      <FuelArchive />
      <FuelStats />
      <FuelFaqs />
    </>
  );
}
