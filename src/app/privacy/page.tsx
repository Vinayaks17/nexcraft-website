import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What NexCRAFT collects, why we hold it, who else sees it, and how to get it back or get it deleted.",
};

export default function PrivacyPage() {
  return <LegalDocument doc={privacy} />;
}
