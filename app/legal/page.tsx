"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Button, Card, Input } from "@/components/ui";
import { getLegalDocuments, updateLegalDocument } from "@/lib/api";
import type { LegalDocument } from "@/lib/legal";

type EditableDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sectionsJson: string;
};

function toEditable(document: LegalDocument): EditableDocument {
  return {
    title: document.title,
    lastUpdated: document.lastUpdated,
    intro: document.intro,
    sectionsJson: JSON.stringify(document.sections, null, 2),
  };
}

export default function LegalEditorPage() {
  const { accessToken } = useAuth();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [activeSlug, setActiveSlug] = useState<"terms" | "privacy">("privacy");
  const [form, setForm] = useState<EditableDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDocuments() {
    if (!accessToken) return;
    setLoading(true);
    setError("");

    try {
      const result = await getLegalDocuments(accessToken);
      setDocuments(result.documents);
      const current =
        result.documents.find((doc) => doc.slug === activeSlug) ??
        result.documents[0];
      if (current) {
        setActiveSlug(current.slug);
        setForm(toEditable(current));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [accessToken]);

  useEffect(() => {
    const current = documents.find((doc) => doc.slug === activeSlug);
    if (current) {
      setForm(toEditable(current));
    }
  }, [activeSlug, documents]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken || !form) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const sections = JSON.parse(form.sectionsJson);
      const result = await updateLegalDocument(accessToken, activeSlug, {
        title: form.title,
        lastUpdated: form.lastUpdated,
        intro: form.intro,
        sections,
      });
      setMessage(
        `${result.document.title} published (version ${result.document.version})`
      );
      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish legal document"
      );
    } finally {
      setSaving(false);
    }
  }

  const activeDocument = documents.find((doc) => doc.slug === activeSlug);

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Legal documents
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Edit terms and privacy policy. Public pages:{" "}
            <a href="/privacy" className="text-[var(--mint)] underline">
              /privacy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-[var(--mint)] underline">
              /terms
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={activeSlug === "privacy" ? "primary" : "secondary"}
            onClick={() => setActiveSlug("privacy")}
          >
            Privacy Policy
          </Button>
          <Button
            type="button"
            variant={activeSlug === "terms" ? "primary" : "secondary"}
            onClick={() => setActiveSlug("terms")}
          >
            Terms & Conditions
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading...</p>
        ) : null}

        {error ? (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-[var(--mint)] bg-[var(--mint-soft)] px-4 py-3 text-sm text-[var(--mint)]">
            {message}
          </p>
        ) : null}

        {form ? (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeDocument ? (
                <p className="text-sm text-[var(--muted)]">
                  Current version: {activeDocument.version} · Updated{" "}
                  {new Date(activeDocument.updatedAt).toLocaleString()}
                </p>
              ) : null}

              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((current) =>
                    current ? { ...current, title: e.target.value } : current
                  )
                }
                placeholder="Document title"
              />

              <Input
                value={form.lastUpdated}
                onChange={(e) =>
                  setForm((current) =>
                    current
                      ? { ...current, lastUpdated: e.target.value }
                      : current
                  )
                }
                placeholder="Last updated label (e.g. July 14, 2026)"
              />

              <div>
                <label className="mb-2 block text-sm font-medium">Intro</label>
                <textarea
                  value={form.intro}
                  onChange={(e) =>
                    setForm((current) =>
                      current ? { ...current, intro: e.target.value } : current
                    )
                  }
                  rows={4}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none focus:border-[var(--mint)]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sections (JSON)
                </label>
                <textarea
                  value={form.sectionsJson}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? { ...current, sectionsJson: e.target.value }
                        : current
                    )
                  }
                  rows={18}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 font-mono text-xs outline-none focus:border-[var(--mint)]"
                />
              </div>

              <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                {saving ? "Publishing..." : "Publish changes"}
              </Button>
            </form>
          </Card>
        ) : null}
      </div>
    </ProtectedLayout>
  );
}
