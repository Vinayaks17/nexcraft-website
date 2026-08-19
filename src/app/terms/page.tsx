import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { terms } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement between NexCRAFT and its clients — scope, payments, ownership, liability and governing law.",
};

export default function TermsPage() {
  return <LegalDocument doc={terms} />;
}
