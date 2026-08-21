import { Suspense } from "react";
import type { Metadata } from "next";

import { pageMeta } from "@/lib/seo";

import { FuelPageHeader, fuelShell } from "@/components/fuel/FuelPrimitives";
import { EstimateForm } from "@/components/estimate/EstimateForm";
import { EstimateSidebar } from "@/components/estimate/EstimateSidebar";
import { estimateHero } from "@/lib/estimate-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Get a Quick Estimate",
  description:
    "Tell us what you need and we'll reply within 24 hours with a tailored quote for your website or business automation.",
  path: "/estimate",
});

/** Matches the real form's footprint so the swap-in costs no layout shift. */
function FormSkeleton() {
  return (
    <div
      className="rounded-[3px] border border-cream/12 bg-surface p-6 sm:p-8"
      aria-hidden
    >
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[2px] flex-1 animate-pulse bg-cream/12" />
        ))}
      </div>
      <div className="mt-12 h-8 w-2/3 animate-pulse rounded-[3px] bg-cream/12" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-[3px] bg-cream/8" />
        ))}
      </div>
      <div className="mt-9 flex justify-end">
        <div className="h-13 w-40 animate-pulse rounded-full bg-cream/12" />
      </div>
    </div>
  );
}

/**
 * /estimate — the form is untouched; only its surroundings changed.
 *
 * The page header carries no number: the form's own steps run (01)–(03) a few
 * hundred pixels below, and a page number above them would compete with the one
 * sequence the visitor actually has to follow.
 */
export default function EstimatePage() {
  return (
    <>
      <FuelPageHeader
        label="Quick estimate"
        heading={estimateHero.heading}
        intro={estimateHero.intro}
      />

      <section className={cn(fuelShell, "pt-14 pb-24 sm:pt-16 lg:pt-20 lg:pb-32")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            {/* useSearchParams needs a Suspense boundary to keep this route static. */}
            <Suspense fallback={<FormSkeleton />}>
              <EstimateForm />
            </Suspense>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <EstimateSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
