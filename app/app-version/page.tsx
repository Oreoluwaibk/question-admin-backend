"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Button, Card, Input } from "@/components/ui";
import { getAppVersionConfig, updateAppVersionConfig } from "@/lib/api";
import type { AppVersionConfig } from "@/lib/appVersion";

type VersionForm = {
  latestVersion: string;
  minVersion: string;
  forceUpdate: boolean;
  updateMessage: string;
  iosStoreUrl: string;
  androidStoreUrl: string;
};

function toForm(config: AppVersionConfig): VersionForm {
  return {
    latestVersion: config.latestVersion,
    minVersion: config.minVersion,
    forceUpdate: config.forceUpdate,
    updateMessage: config.updateMessage ?? "",
    iosStoreUrl: config.iosStoreUrl ?? "",
    androidStoreUrl: config.androidStoreUrl ?? "",
  };
}

export default function AppVersionPage() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState<VersionForm | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadConfig() {
    if (!accessToken) return;
    setLoading(true);
    setError("");

    try {
      const result = await getAppVersionConfig(accessToken);
      setForm(toForm(result.config));
      setUpdatedAt(result.config.updatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load app version");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, [accessToken]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken || !form) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await updateAppVersionConfig(accessToken, {
        latestVersion: form.latestVersion,
        minVersion: form.minVersion,
        forceUpdate: form.forceUpdate,
        updateMessage: form.updateMessage || null,
        iosStoreUrl: form.iosStoreUrl || null,
        androidStoreUrl: form.androidStoreUrl || null,
      });
      setForm(toForm(result.config));
      setUpdatedAt(result.config.updatedAt);
      setMessage(
        `Version ${result.config.latestVersion} published. Users on older versions will be prompted to update.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish app version"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">App version</h1>
          <p className="mt-1 text-sm text-muted">
            Publish a new version when you release a build to the App Store or
            Play Store. Users below the minimum version will see an update
            prompt in the mobile app.
          </p>
        </div>

        {loading ? (
          <Card>
            <p className="text-sm text-muted">Loading version config…</p>
          </Card>
        ) : form ? (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Latest version
                  </label>
                  <Input
                    value={form.latestVersion}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, latestVersion: event.target.value }
                          : current
                      )
                    }
                    placeholder="1.1.0"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Minimum required version
                  </label>
                  <Input
                    value={form.minVersion}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, minVersion: event.target.value }
                          : current
                      )
                    }
                    placeholder="1.0.0"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.forceUpdate}
                  onChange={(event) =>
                    setForm((current) =>
                      current
                        ? { ...current, forceUpdate: event.target.checked }
                        : current
                    )
                  }
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-foreground">
                    Force update
                  </span>
                  <span className="mt-0.5 block text-muted">
                    When enabled, users below the latest version see a stronger
                    update recommendation, but can still continue on their current
                    version.
                  </span>
                </span>
              </label>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Update message
                </label>
                <Input
                  value={form.updateMessage}
                  onChange={(event) =>
                    setForm((current) =>
                      current
                        ? { ...current, updateMessage: event.target.value }
                        : current
                    )
                  }
                  placeholder="A new version is available with important fixes."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    iOS App Store URL
                  </label>
                  <Input
                    value={form.iosStoreUrl}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, iosStoreUrl: event.target.value }
                          : current
                      )
                    }
                    placeholder="https://apps.apple.com/app/..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Google Play Store URL
                  </label>
                  <Input
                    value={form.androidStoreUrl}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? { ...current, androidStoreUrl: event.target.value }
                          : current
                      )
                    }
                    placeholder="https://play.google.com/store/apps/details?id=..."
                  />
                </div>
              </div>

              {updatedAt ? (
                <p className="text-xs text-muted">
                  Last published: {new Date(updatedAt).toLocaleString()}
                </p>
              ) : null}

              {error ? (
                <p className="text-sm text-[var(--danger)]">{error}</p>
              ) : null}
              {message ? (
                <p className="text-sm text-[var(--mint)]">{message}</p>
              ) : null}

              <Button type="submit" disabled={saving}>
                {saving ? "Publishing…" : "Publish new version"}
              </Button>
            </form>
          </Card>
        ) : null}
      </div>
    </ProtectedLayout>
  );
}
