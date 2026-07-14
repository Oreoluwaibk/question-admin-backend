"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Badge, Card } from "@/components/ui";
import { getMaterial } from "@/lib/api";
import type { AdminMaterialDetail } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export default function MaterialDetailPage() {
  const params = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [material, setMaterial] = useState<AdminMaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken || !params.id) return;

    setLoading(true);
    setError("");

    getMaterial(accessToken, params.id)
      .then(setMaterial)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load material")
      )
      .finally(() => setLoading(false));
  }, [accessToken, params.id]);

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/materials"
            className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ← Back to materials
          </Link>
          <h1 className="mt-3 text-xl font-semibold tracking-tight break-words sm:text-2xl">
            {material?.title ?? "Material"}
          </h1>
          {material ? (
            <p className="mt-1 text-sm text-[var(--muted)] break-words">
              Uploaded by{" "}
              <Link
                href={`/users/${material.uploader.id}`}
                className="text-[var(--mint)] hover:underline"
              >
                {material.uploader.name}
              </Link>
              {material.uploader.email ? (
                <span className="block break-all sm:inline">
                  {` · ${material.uploader.email}`}
                </span>
              ) : null}
            </p>
          ) : null}
        </div>

        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading material...</p>
        ) : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

        {material ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              <Card>
                <p className="text-sm text-[var(--muted)]">Questions</p>
                <p className="mt-2 text-2xl font-semibold">
                  {material.questionCount}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-[var(--muted)]">Completed attempts</p>
                <p className="mt-2 text-2xl font-semibold">
                  {material.stats.completedAttempts}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-[var(--muted)]">Best score</p>
                <p className="mt-2 text-2xl font-semibold">
                  {material.stats.bestScore ?? "—"}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-[var(--muted)]">Avg accuracy</p>
                <p className="mt-2 text-2xl font-semibold">
                  {material.stats.averageAccuracy !== null
                    ? `${Math.round(material.stats.averageAccuracy * 100)}%`
                    : "—"}
                </p>
              </Card>
            </div>

            <Card>
              <h2 className="font-medium">Material info</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[var(--muted)]">Source file</dt>
                  <dd className="mt-1">{material.sourceFile ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Uploaded</dt>
                  <dd className="mt-1">{formatDate(material.createdAt)}</dd>
                </div>
              </dl>
            </Card>

            <div className="space-y-3">
              <h2 className="text-lg font-medium">
                Questions ({material.questions.length})
              </h2>
              <div className="space-y-3">
                {material.questions.map((question, index) => (
                  <Card key={question.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[var(--muted)]">
                        #{index + 1}
                      </span>
                      <Badge variant="mint">{question.type}</Badge>
                      {question.topic ? (
                        <Badge variant="slate">{question.topic}</Badge>
                      ) : null}
                      <Badge variant="slate">{question.domain}</Badge>
                      {!question.isPublished ? (
                        <Badge variant="danger">Draft</Badge>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6">
                      {truncate(question.question)}
                    </p>
                  </Card>
                ))}

                {material.questions.length === 0 ? (
                  <Card>
                    <p className="text-sm text-[var(--muted)]">
                      No questions for this material
                    </p>
                  </Card>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-medium">
                Attempts ({material.attempts.length})
              </h2>
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <div className="divide-y divide-[var(--border)]">
                  {material.attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex flex-col gap-3 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/users/${attempt.userId}`}
                          className="font-medium text-[var(--mint)] hover:underline"
                        >
                          {attempt.userName}
                        </Link>
                        <p className="break-all text-[var(--muted)] sm:break-normal">
                          {attempt.userEmail ?? "No email"}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {formatDate(attempt.completedAt ?? attempt.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {attempt.questionType ? (
                          <Badge variant="slate">{attempt.questionType}</Badge>
                        ) : null}
                        {attempt.isTimed ? (
                          <Badge variant="slate">Timed</Badge>
                        ) : null}
                        <Badge variant="mint">
                          {attempt.score ?? 0}/{attempt.maxScore ?? 0}
                        </Badge>
                        {attempt.accuracy !== null ? (
                          <Badge variant="slate">
                            {(attempt.accuracy * 100).toFixed(0)}%
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {material.attempts.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                      No attempts yet
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </ProtectedLayout>
  );
}
