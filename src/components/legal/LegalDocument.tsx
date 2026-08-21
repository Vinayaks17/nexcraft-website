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
 *
 * The `TODO — PLACEHOLDER.` marker each paragraph is written with is stripped
 * here rather than in the data. It is there for whoever picks the drafting up —
 * it makes every unwritten clause greppable — but it is developer scaffolding,
 * and scaffolding on a public page reads as a site that was shipped unfinished
 * rather than as a document that is honestly still in draft. What is left is
 * the plain-English outline of what each clause will cover, which is true, and
 * the banner above says exactly what that is.
 */
const DRAFT_MARKER = /^TODO\s*—\s*PLACEHOLDER\.\s*/;

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
                fuelBody,
                "border border-primary/40 bg-primary/10 px-5 py-4 text-primary",
              )}
            >
              <strong className="font-semibold">
                Draft — not binding.
              </strong>{" "}
              What follows is an outline of what each clause will cover, not the
              clauses themselves. The finished document is with counsel; until it
              is published here, nothing on this page forms part of an agreement.
              Questions in the meantime: info@thenexcraft.com.
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
                    {section.body.map((paragraph, i) => {
                      /* Strip first, then use the stripped text. The key was
                         the raw paragraph, which put the marker back into the
                         RSC flight payload embedded in the page even though
                         the rendered <p> never showed it — invisible on screen,
                         plainly there in view-source. */
                      const text = paragraph.replace(DRAFT_MARKER, "");
                      return (
                        <p
                          key={`${section.num}-${i}`}
                          className={cn(fuelBody, "mt-5 text-cream/65")}
                        >
                          {text}
                        </p>
                      );
                    })}
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
