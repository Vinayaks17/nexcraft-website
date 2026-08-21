import { whatHappensNext } from "@/lib/estimate-content";
import { fuelLabel } from "@/components/fuel/FuelPrimitives";
import { cn } from "@/lib/utils";

/**
 * The "what happens next" three-step block.
 *
 * Shared by /contact and /estimate — the promise has to be worded identically
 * in both places or it stops reading as a promise, so both render this rather
 * than each restating the steps.
 *
 * A plain `<ol>` with mono indices and a hairline per row, instead of the
 * gradient circles and connector line it replaced: at this scale the numbers
 * are already sequential, and the connector was drawing a diagram of something
 * the list format says on its own.
 */
export function FuelNextSteps({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const ink = tone === "light" ? "text-ink" : "text-cream";
  const muted = tone === "light" ? "text-ink/65" : "text-cream/60";
  const faint = tone === "light" ? "text-ink/65" : "text-cream/55";
  const rule = tone === "light" ? "border-ink/15" : "border-cream/12";

  return (
    <div className={className}>
      <h2 className={cn(fuelLabel, faint)}>{whatHappensNext.heading}</h2>

      <ol className={cn("mt-5 border-t", rule)}>
        {whatHappensNext.steps.map((step) => (
          <li
            key={step.number}
            className={cn("flex gap-5 border-b py-5 sm:gap-8", rule)}
          >
            <span className={cn(fuelLabel, "mt-1 shrink-0 text-primary")}>
              ({step.number})
            </span>
            <div>
              <h3
                className={cn(
                  "text-[0.9375rem] font-medium tracking-[-0.01em]",
                  ink,
                )}
              >
                {step.title}
              </h3>
              <p className={cn("mt-1.5 text-[0.8125rem] leading-[1.5]", muted)}>
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default FuelNextSteps;
