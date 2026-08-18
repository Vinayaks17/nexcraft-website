import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <SectionWrapper
      outerClassName="min-h-screen flex items-center"
      spacing="none"
      className="pt-36 pb-24 text-center md:pt-44"
      animate={false}
    >
      <p className="text-gradient-brand font-display text-[6rem] leading-none font-medium tracking-[-0.01em] sm:text-[8rem]">
        404
      </p>
      <RevealHeading
        text={"This page hasn't been *crafted yet.*"}
        as="h1"
        className="mt-4 text-[2rem] sm:text-5xl"
      />
      <p className="mt-5 text-cream/70">
        The link may be outdated, or the page has moved.
      </p>
      <div className="mt-8 flex justify-center">
        <Button href="/" size="lg">
          Back to home
        </Button>
      </div>
    </SectionWrapper>
  );
}
