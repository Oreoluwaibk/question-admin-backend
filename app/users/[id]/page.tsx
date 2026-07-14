"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Badge, Button, Card } from "@/components/ui";
import {
  clearUserDevices,
  getUser,
  removeUserDevice,
  setUserTier,
} from "@/lib/api";
import type { AdminUserDetail } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadUser() {
    if (!accessToken || !params.id) return;
    setLoading(true);
    setError("");

    try {
      const detail = await getUser(accessToken, params.id);
      setUser(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, [accessToken, params.id]);

  async function handleTierChange(tier: "PRO" | "FREE") {
    if (!accessToken || !user) return;
    setBusy(true);
    setActionMessage("");

    try {
      await setUserTier(accessToken, user.id, tier);
      setActionMessage(`Subscription updated to ${tier}`);
      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tier");
    } finally {
      setBusy(false);
    }
  }

  async function handleClearDevices() {
    if (!accessToken || !user) return;
    setBusy(true);
    setActionMessage("");

    try {
      await clearUserDevices(accessToken, user.id);
      setActionMessage("All device sessions cleared");
      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear devices");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveDevice(deviceId: string) {
    if (!accessToken || !user) return;
    setBusy(true);
    setActionMessage("");

    try {
      await removeUserDevice(accessToken, user.id, deviceId);
      setActionMessage("Device removed");
      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove device");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/users"
            className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ← Back to users
          </Link>
          <h1 className="mt-3 text-xl font-semibold tracking-tight break-words sm:text-2xl">
            {user?.name ?? "User"}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)] break-all">
            {user?.email ?? "Loading..."}
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading user...</p>
        ) : null}

        {error ? (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        ) : null}

        {actionMessage ? (
          <p className="rounded-xl border border-[var(--mint)] bg-[var(--mint-soft)] px-4 py-3 text-sm text-[var(--mint)]">
            {actionMessage}
          </p>
        ) : null}

        {user ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="font-medium">Profile</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Phone</dt>
                  <dd className="sm:text-right">{user.phoneNumber ?? "—"}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Field of study</dt>
                  <dd className="sm:text-right">{user.fieldOfStudy ?? "—"}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Occupation</dt>
                  <dd className="sm:text-right">{user.occupation ?? "—"}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Joined</dt>
                  <dd className="sm:text-right">{formatDate(user.createdAt)}</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Last sign in</dt>
                  <dd className="sm:text-right">{formatDate(user.lastSignInAt)}</dd>
                </div>
              </dl>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium">Subscription</h2>
                <Badge variant={user.subscription.isPro ? "mint" : "slate"}>
                  {user.subscription.tier}
                </Badge>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Billing status</dt>
                  <dd className="sm:text-right">
                    {user.subscription.billingStatus ?? "—"}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Materials used</dt>
                  <dd className="sm:text-right">
                    {user.subscription.usage.materials}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-[var(--muted)]">Attempts used</dt>
                  <dd className="sm:text-right">
                    {user.subscription.usage.attempts}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  variant="primary"
                  disabled={busy || user.subscription.isPro}
                  onClick={() => handleTierChange("PRO")}
                  className="w-full sm:w-auto"
                >
                  Grant Pro
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy || !user.subscription.isPro}
                  onClick={() => handleTierChange("FREE")}
                  className="w-full sm:w-auto"
                >
                  Set Free
                </Button>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-medium">Device sessions</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Users are limited to 2 active devices
                  </p>
                </div>
                <Button
                  variant="danger"
                  disabled={busy || user.devices.length === 0}
                  onClick={handleClearDevices}
                  className="w-full sm:w-auto"
                >
                  Clear all
                </Button>
              </div>

              <div className="mt-4 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
                {user.devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {device.device_name ?? "Unknown device"}
                      </p>
                      <p className="text-[var(--muted)]">
                        Last active {formatDate(device.last_active_at)}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      disabled={busy}
                      onClick={() => handleRemoveDevice(device.device_id)}
                      className="w-full sm:w-auto"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                {user.devices.length === 0 ? (
                  <p className="px-4 py-6 text-center text-[var(--muted)]">
                    No active device sessions
                  </p>
                ) : null}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </ProtectedLayout>
  );
}
