import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Terms of *service.*"
      description="Full terms copy lands in a later stage."
    />
  );
}
