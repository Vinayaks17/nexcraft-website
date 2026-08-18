import { Hero } from "@/components/home/Hero";
import { Industries } from "@/components/home/Industries";
import { Marquee } from "@/components/home/Marquee";
import { Services } from "@/components/home/Services";
import { CtaGradientBreak } from "@/components/home/CtaGradientBreak";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaMinimalBreak } from "@/components/home/CtaMinimalBreak";
import { TechGraph } from "@/components/home/TechGraph";
import { Faqs } from "@/components/home/Faqs";
import { marqueeItems } from "@/lib/home-content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Industries />
      {/* Thin belt between the two densest sections — gives the page a beat
          before Services opens up again. */}
      <Marquee items={marqueeItems} />
      <Services />
      <CtaGradientBreak />
      <HowItWorks />
      <CtaMinimalBreak />
      <TechGraph />
      <Faqs />
    </>
  );
}
