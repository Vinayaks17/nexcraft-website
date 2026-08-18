import { RevealHeading } from "@/components/ui/RevealHeading";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  /** Wrap the accent phrase in *asterisks* — see renderAccent. */
  heading: string;
  intro?: string;
  align?: "left" | "center";
  /** `onBrand` = sitting on the orange gradient band or the inverted cream section. */
  tone?: "dark" | "onBrand";
  className?: string;
};

/** Eyebrow + display heading + optional intro, shared by every section. */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const onBrand = tone === "onBrand";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.18em] uppercase",
            onBrand ? "text-on-brand" : "text-primary",
          )}
        >
          <span
            className={cn(
              "h-px w-6",
              onBrand ? "bg-on-brand/50" : "bg-primary",
            )}
            aria-hidden
          />
          {eyebrow}
        </span>
      )}
      <RevealHeading
        text={heading}
        as="h2"
        className={cn(
          "mt-5 text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]",
          onBrand && "text-on-brand",
        )}
      />
      {intro && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            onBrand ? "text-on-brand-soft" : "text-cream/70",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
