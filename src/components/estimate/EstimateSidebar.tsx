import { FuelNextSteps } from "@/components/fuel/FuelNextSteps";
import { fuelBody, fuelLabel } from "@/components/fuel/FuelPrimitives";
import { contactFallback } from "@/lib/estimate-content";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The column beside the form: what happens after you send it, and a way out for
 * anyone who would rather just write an email.
 *
 * The two panels it used to draw are gone — on a page whose form is already one
 * bordered card, two more cards beside it made the layout read as three equal
 * things rather than as a form with a margin note.
 */
export function EstimateSidebar() {
  return (
    <aside className="flex flex-col gap-12 lg:sticky lg:top-28 lg:self-start">
      <FuelNextSteps />

      <div>
        <h2 className={cn(fuelLabel, "text-cream/55")}>
          {contactFallback.heading}
        </h2>
        <p className={cn(fuelBody, "mt-4 text-cream/60")}>
          {contactFallback.description}
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="mt-4 inline-block text-[0.9375rem] font-medium tracking-[-0.01em] text-cream underline decoration-cream/20 underline-offset-[6px] transition-colors duration-200 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {contact.email}
        </a>
      </div>
    </aside>
  );
}

export default EstimateSidebar;
