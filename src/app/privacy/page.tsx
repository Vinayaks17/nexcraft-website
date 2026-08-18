import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Privacy *policy.*"
      description="Full privacy copy lands in a later stage."
    />
  );
}
