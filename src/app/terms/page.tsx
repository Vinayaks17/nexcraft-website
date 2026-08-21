import type { Metadata } from "next";

import { pageMeta } from "@/lib/seo";
import { seoPages } from "@/lib/seo-content";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { terms } from "@/lib/legal-content";

export const metadata: Metadata = pageMeta(seoPages.terms);

/* Draft documents stay out of the index. A search result that leads
   straight to an outline of unwritten terms is worse than no result,
   and the sitemap keeps them at the lowest priority for the same
   reason. Remove this once counsel signs the real wording off. */
metadata.robots = { index: false, follow: true };

export default function TermsPage() {
  return <LegalDocument doc={terms} />;
}
