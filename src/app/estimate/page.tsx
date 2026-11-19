import type { Metadata } from "next";

import { pageMeta } from "@/lib/seo";
import { seoPages } from "@/lib/seo-content";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

import { FuelPageHeader, fuelShell } from "@/components/fuel/FuelPrimitives";
import { EstimateForm } from "@/components/estimate/EstimateForm";
import { EstimateSidebar } from "@/components/estimate/EstimateSidebar";
import { estimateHero } from "@/lib/estimate-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMeta(seoPages.estimate);

/**
 * /estimate.
 *
 * The page header carries no number: the form's own steps run (01)–(03) a few
 * hundred pixels below, and a page number above them would compete with the one
 * sequence the visitor actually has to follow.
 */
export default function EstimatePage() {
  return (
    <>
      <BreadcrumbSchema name="Get an Estimate" path="/estimate" />

      <FuelPageHeader
        label="Quick estimate"
        heading={estimateHero.heading}
        intro={estimateHero.intro}
      />

      <section className={cn(fuelShell, "pt-14 pb-24 sm:pt-16 lg:pt-20 lg:pb-32")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <EstimateForm />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <EstimateSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
