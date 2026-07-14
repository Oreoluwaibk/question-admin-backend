"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Badge, Button, Input } from "@/components/ui";
import { listMaterials } from "@/lib/api";
import type { AdminMaterialSummary } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export default function MaterialsPage() {
  const { accessToken } = useAuth();
  const [query, setQuery] = useState("");
  const [materials, setMaterials] = useState<AdminMaterialSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMaterials(search = "") {
    if (!accessToken) return;
    setLoading(true);
    setError("");

    try {
      const result = await listMaterials(accessToken, {
        q: search,
        page: 1,
        limit: 30,
      });
      setMaterials(result.materials);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load materials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaterials();
  }, [accessToken]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    loadMaterials(query.trim());
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Materials</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Uploaded study materials across all users
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by material title..."
          />
          <Button type="submit" className="w-full sm:w-auto sm:shrink-0">
            Search
          </Button>
        </form>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] sm:px-5">
            {loading
              ? "Loading..."
              : `${total} material${total === 1 ? "" : "s"}`}
          </div>

          <div className="divide-y divide-[var(--border)]">
            {materials.map((material) => (
              <Link
                key={material.id}
                href={`/materials/${material.id}`}
                className="block px-4 py-4 transition hover:bg-[var(--mint-soft)] sm:px-5"
              >
                <div className="flex flex-col gap-3">
                  <div className="min-w-0">
                    <p className="font-medium break-words">{material.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Uploaded by{" "}
                      <span className="text-[var(--foreground)]">
                        {material.uploader.name}
                      </span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted)] sm:hidden">
                      {material.uploader.email ?? ""}
                    </p>
                    <p className="mt-1 hidden text-sm text-[var(--muted)] sm:block">
                      {material.uploader.email ?? "No email"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {formatDate(material.createdAt)}
                      {material.sourceFile ? (
                        <span className="block truncate sm:inline">
                          {material.sourceFile ? ` · ${material.sourceFile}` : ""}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="mint">
                      {material.questionCount} questions
                    </Badge>
                    <Badge variant="slate">
                      {material.attempts.completedAttempts} attempts
                    </Badge>
                    {material.attempts.averageAccuracy !== null ? (
                      <Badge variant="slate">
                        {Math.round(material.attempts.averageAccuracy * 100)}% avg
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}

            {!loading && materials.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                No materials found
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
