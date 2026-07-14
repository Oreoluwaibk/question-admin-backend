import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { PublicSiteShell } from "@/components/PublicSiteShell";
import { fetchLegalDocument } from "@/lib/legal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy | Question Bank",
  description: "Privacy Policy for the Question Bank mobile application.",
};

export default async function PrivacyPage() {
  const document = await fetchLegalDocument("privacy");

  return (
    <PublicSiteShell>
      <LegalDocumentView document={document} />
    </PublicSiteShell>
  );
}
