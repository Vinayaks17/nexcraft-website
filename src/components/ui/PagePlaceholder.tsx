import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { RevealHeading } from "@/components/ui/RevealHeading";

type PagePlaceholderProps = {
  /** Wrap the accent phrase in *asterisks* — see renderAccent. */
  title: string;
  eyebrow?: string;
  description?: string;
};

/**
 * Temporary shell for routes whose content arrives in a later stage. It keeps
 * navigation testable and clears the fixed navbar.
 */
export function PagePlaceholder({ title, eyebrow, description }: PagePlaceholderProps) {
  return (
    <SectionWrapper
      outerClassName="min-h-screen flex items-center"
      spacing="none"
      className="pt-36 pb-24 md:pt-44"
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] text-primary uppercase">
          <span className="h-px w-6 bg-primary" aria-hidden />
          {eyebrow}
        </span>
      )}
      <RevealHeading
        text={title}
        as="h1"
        className="mt-5 text-[2.5rem] sm:text-6xl lg:text-7xl"
      />
      {description && (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70">
          {description}
        </p>
      )}
    </SectionWrapper>
  );
}

export default PagePlaceholder;
