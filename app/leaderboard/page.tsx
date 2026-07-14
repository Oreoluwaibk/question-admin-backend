"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Badge } from "@/components/ui";
import { getLeaderboard } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";
import { Palette } from "@/lib/theme";

function RankBadge({ rank }: { rank: number }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={
        rank <= 3
          ? { background: Palette.mintSoft, color: Palette.mint }
          : { background: "var(--border)", color: "var(--muted)" }
      }
    >
      {rank}
    </div>
  );
}

export default function LeaderboardPage() {
  const { accessToken } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    getLeaderboard(accessToken, 50)
      .then(setEntries)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load leaderboard"
        )
      )
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Leaderboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top performers by best score and average accuracy
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading leaderboard...</p>
        ) : null}
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

        {/* Mobile card layout */}
        <div className="space-y-3 md:hidden">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-start gap-3">
                <RankBadge rank={entry.rank} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/users/${entry.userId}`}
                    className="font-medium text-[var(--mint)] hover:underline"
                  >
                    {entry.name}
                  </Link>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {entry.email ?? "No email"}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-[var(--background)] px-2 py-2">
                  <p className="text-[var(--muted)]">Best</p>
                  <p className="mt-1 font-semibold">{entry.bestScore}</p>
                </div>
                <div className="rounded-xl bg-[var(--background)] px-2 py-2">
                  <p className="text-[var(--muted)]">Attempts</p>
                  <p className="mt-1 font-semibold">{entry.attempts}</p>
                </div>
                <div className="rounded-xl bg-[var(--background)] px-2 py-2">
                  <p className="text-[var(--muted)]">Avg</p>
                  <p className="mt-1 font-semibold">
                    {Math.round(entry.averageAccuracy * 100)}%
                  </p>
                </div>
              </div>
            </div>
          ))}

          {!loading && entries.length === 0 ? (
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--muted)]">
              No completed attempts yet
            </p>
          ) : null}
        </div>

        {/* Desktop table layout */}
        <div className="hidden overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:block">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 border-b border-[var(--border)] px-5 py-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            <span>Rank</span>
            <span>User</span>
            <span className="text-right">Best</span>
            <span className="text-right">Attempts</span>
            <span className="text-right">Avg %</span>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-4 text-sm"
              >
                <RankBadge rank={entry.rank} />

                <div className="min-w-0">
                  <Link
                    href={`/users/${entry.userId}`}
                    className="truncate font-medium text-[var(--mint)] hover:underline"
                  >
                    {entry.name}
                  </Link>
                  <p className="truncate text-xs text-[var(--muted)]">
                    {entry.email ?? "No email"}
                  </p>
                </div>

                <div className="text-right font-medium">{entry.bestScore}</div>
                <div className="text-right text-[var(--muted)]">
                  {entry.attempts}
                </div>
                <div className="text-right">
                  <Badge variant="slate">
                    {Math.round(entry.averageAccuracy * 100)}%
                  </Badge>
                </div>
              </div>
            ))}

            {!loading && entries.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                No completed attempts yet
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
