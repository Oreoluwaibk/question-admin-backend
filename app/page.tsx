"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { StatCard } from "@/components/ui";
import { AdminApiError, getStats } from "@/lib/api";
import type { PlatformStats } from "@/lib/types";

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    getStats(accessToken)
      .then(setStats)
      .catch((err) => {
        if (err instanceof AdminApiError && err.status === 403) {
          router.replace("/login?error=not-admin");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load stats");
      })
      .finally(() => setLoading(false));
  }, [accessToken, router]);

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            Platform metrics at a glance
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading stats...</p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-danger bg-[rgba(229,72,77,0.08)] px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        {stats ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            <StatCard label="Total users" value={stats.totalUsers} />
            <StatCard
              label="Pro subscribers"
              value={stats.proUsers}
              hint={`${stats.freeUsers} on Free`}
            />
            <StatCard
              label="Signups (7 days)"
              value={stats.signupsLast7Days}
            />
            <StatCard label="Materials uploaded" value={stats.totalMaterials} />
            <StatCard label="Test attempts" value={stats.totalAttempts} />
            <StatCard label="Questions created" value={stats.totalQuestions} />
          </div>
        ) : null}
      </div>
    </ProtectedLayout>
  );
}
