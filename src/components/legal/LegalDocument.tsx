import {
  FuelPageHeader,
  fuelBody,
  fuelLabel,
  fuelShell,
} from "@/components/fuel/FuelPrimitives";
import {
  NOT_YET_PUBLISHED,
  type LegalDocument as LegalDocumentType,
} from "@/lib/legal-content";
import { cn } from "@/lib/utils";

/**
 * Shared shell for /terms and /privacy.
 *
 * Numbered sections in the same register as the rest of the site, on a single
 * measure — legal copy is read, not scanned, so this is the one place on the
 * site that keeps a narrow column rather than the full-bleed grid.
 *
 * The draft banner is not decoration: the body text is placeholder wording, and
 * a document that looks finished but isn't is worse than one that says so.
 */
export function LegalDocument({ doc }: { doc: LegalDocumentType }) {
  return (
    <>
      <FuelPageHeader label={doc.label} heading={doc.heading} intro={doc.intro}>
        <p className={cn(fuelLabel, "mt-8 text-cream/55")}>
          Last updated: {doc.lastUpdated ?? NOT_YET_PUBLISHED}
        </p>
      </FuelPageHeader>

      <section className={cn(fuelShell, "pt-12 pb-24 sm:pt-16 lg:pb-32")}>
        <div className="max-w-[68ch]">
          {!doc.lastUpdated && (
            <p
              role="note"
              className={cn(
                fuelLabel,
                "border border-primary/40 bg-primary/10 px-4 py-3 leading-[1.6] text-primary",
              )}
            >
              Draft — placeholder wording, pending legal review. Not binding.
            </p>
          )}

          <div className="mt-14 border-t border-cream/12">
            {doc.sections.map((section) => (
              <section
                key={section.num}
                className="border-b border-cream/12 py-10 sm:py-12"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-8">
                  <p className={cn(fuelLabel, "text-primary sm:col-span-3")}>
                    ({section.num})
                  </p>
                  <div className="sm:col-span-9">
                    <h2 className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-cream">
                      {section.title}
                    </h2>
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className={cn(fuelBody, "mt-5 text-cream/65")}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default LegalDocument;
