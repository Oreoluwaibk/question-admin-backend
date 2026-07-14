import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { PublicSiteShell } from "@/components/PublicSiteShell";
import { fetchLegalDocument } from "@/lib/legal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions | Question Bank",
  description: "Terms and Conditions for the Question Bank mobile application.",
};

export default async function TermsPage() {
  const document = await fetchLegalDocument("terms");

  return (
    <PublicSiteShell>
      <LegalDocumentView document={document} />
    </PublicSiteShell>
  );
}
