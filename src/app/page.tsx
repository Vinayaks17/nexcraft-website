import { FuelHero } from "@/components/fuel/FuelHero";
import { FuelPreview } from "@/components/fuel/FuelPreview";
import { FuelValueLine } from "@/components/fuel/FuelValueLine";
import { FuelServices } from "@/components/fuel/FuelServices";
import { FuelPortfolio } from "@/components/fuel/FuelPortfolio";
import { FuelCtaBand } from "@/components/fuel/FuelCtaBand";
import { FuelUsps } from "@/components/fuel/FuelUsps";
import { FuelLogoMarquee } from "@/components/fuel/FuelLogoMarquee";
import { FuelAbout } from "@/components/fuel/FuelAbout";
import { FuelProof } from "@/components/fuel/FuelProof";
import { FuelFaqs } from "@/components/fuel/FuelFaqs";
import { FuelScrollspy } from "@/components/fuel/FuelScrollspy";
import { SectionRollover } from "@/components/fuel/SectionRollover";
import { fuelCtaBands } from "@/lib/home-fuel-content";
import { FaqSchema } from "@/components/seo/FaqSchema";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { ServicesSchema } from "@/components/seo/ServicesSchema";
import { pageMeta } from "@/lib/seo";
import { seoPages } from "@/lib/seo-content";

/**
 * Homepage — fuel-redesign.
 *
 * Show first, talk second. The old order opened with the studio's own story
 * and reached the work four bands later; this one puts a build on screen
 * before the fold has finished scrolling, follows it with what we make and who
 * we made it for, and only then argues. The closing CTA/footer band is
 * rendered by FuelFooter from the root layout.
 *
 *   01 What we build         04 Who we are
 *   02 Our work              05 What clients say
 *   03 Why NexCRAFT          06 Questions, answered
 *
 * The register is declared once in `sectionOrder` (lib/home-fuel-content), not
 * here: the page, every band's own header and the scrollspy rail all read from
 * that one list, so a section can't end up numbered differently in two places.
 *
 * (04) and (05) are stacked rather than stacked end to end: (04) pins and
 * (05) rides up over it. That run is the page's one piece of scroll theatre
 * and it is deliberately small — SectionRollover documents the height rule
 * that picked those two sections and disqualified every other pair.
 *
 * Four bands carry no number. The preview and the value strip sit above (01),
 * and the register counts down the page, so anything above its first entry
 * would have to count backwards to fit; the logo belt is a divider; and the
 * two CTA bands are punctuation between sections rather than sections.
 *
 * Asks land after the preview (the value strip), after (02), after (05) and in
 * the footer — never more than three numbered sections apart. Dropping band A
 * was on the table when the reorder was drawn up, but it would have left the
 * value strip and band B five sections apart, which is the gap the rhythm rule
 * exists to prevent.
 *
 * Two things that used to be here are not: the pricing band, which /pricing
 * carries alone now (and which the navbar numbers 03), and the project
 * archive, which moved to the foot of /portfolio where the full index belongs.
 */
export const metadata = pageMeta(seoPages.home);

export default function HomePage() {
  return (
    <>
      {/* Structured data. The Organization is the site rather than a page, so
          it is declared here once instead of on every route; the services and
          the FAQ are both rendered on this page, and Google requires marked-up
          FAQ text to be text the visitor can actually see. */}
      <OrganizationSchema />
      <ServicesSchema />
      <FaqSchema />

      <FuelScrollspy />

      <FuelHero />
      <FuelPreview />
      <FuelValueLine />

      <FuelServices />
      <FuelPortfolio />

      {/* Ask 2 of 4 — orange, straight off the back of the work. */}
      <FuelCtaBand content={fuelCtaBands.work} tone="brand" />

      <FuelUsps />
      <FuelLogoMarquee />

      {/* The one stacked run on the page. (04) pins and (05) is laid over it
          like a card on a deck — see SectionRollover for why this pair and no
          other, and for what pinning costs the scrollspy. */}
      <SectionRollover base={<FuelAbout />} over={<FuelProof />} />

      {/* Ask 3 of 4 — the cream inversion, so the two never read as one
          component pasted twice. */}
      <FuelCtaBand content={fuelCtaBands.clients} tone="cream" />

      <FuelFaqs />
    </>
  );
}
