export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalDocument = {
  slug: "terms" | "privacy";
  version: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  updatedAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export async function fetchLegalDocument(
  slug: "terms" | "privacy"
): Promise<LegalDocument> {
  const response = await fetch(`${API_URL}/legal/${slug}`, {
    next: { revalidate: 300 },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load legal document");
  }

  return data as LegalDocument;
}
