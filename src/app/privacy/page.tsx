import type { Metadata } from "next";

import { pageMeta } from "@/lib/seo";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacy } from "@/lib/legal-content";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What NexCRAFT collects, why we hold it, who else sees it, and how to get it back or get it deleted.",
  path: "/privacy",
});

/* Draft documents stay out of the index. A search result that leads
   straight to an outline of unwritten terms is worse than no result,
   and the sitemap keeps them at the lowest priority for the same
   reason. Remove this once counsel signs the real wording off. */
metadata.robots = { index: false, follow: true };

export default function PrivacyPage() {
  return <LegalDocument doc={privacy} />;
}
