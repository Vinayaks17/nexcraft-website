import { Suspense } from "react";
import type { Metadata } from "next";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EstimateForm } from "@/components/estimate/EstimateForm";
import { EstimateSidebar } from "@/components/estimate/EstimateSidebar";
import { estimateHero } from "@/lib/estimate-content";

export const metadata: Metadata = {
  title: "Get a Quick Estimate",
  description:
    "Tell us what you need and we'll reply within 24 hours with a tailored quote for your website or business automation.",
};

/** Matches the real form's footprint so the swap-in costs no layout shift. */
function FormSkeleton() {
  return (
    <div
      className="rounded-2xl border border-white/8 bg-surface p-6 shadow-soft sm:p-8"
      aria-hidden
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 flex-1 animate-pulse rounded-full bg-cream/12" />
        ))}
      </div>
      <div className="mt-10 h-7 w-2/3 animate-pulse rounded-full bg-cream/12" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-cream/8" />
        ))}
      </div>
      <div className="mt-9 flex justify-end">
        <div className="h-13 w-40 animate-pulse rounded-full bg-cream/12" />
      </div>
    </div>
  );
}

export default function EstimatePage() {
  return (
    <>
      <SectionWrapper
        outerClassName="relative overflow-hidden"
        spacing="none"
        animate={false}
        width="wide"
        className="pt-32 pb-8 md:pt-40 md:pb-10"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(255,132,50,0.22),transparent_70%)]"
          aria-hidden
        />
        <SectionHeading
          eyebrow={estimateHero.eyebrow}
          heading={estimateHero.heading}
          intro={estimateHero.intro}
        />
      </SectionWrapper>

      <SectionWrapper spacing="none" animate={false} width="wide" className="pb-24 md:pb-32">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          {/* useSearchParams needs a Suspense boundary to keep this route static. */}
          <Suspense fallback={<FormSkeleton />}>
            <EstimateForm />
          </Suspense>
          <EstimateSidebar />
        </div>
      </SectionWrapper>
    </>
  );
}
