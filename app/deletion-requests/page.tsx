"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Badge, Button } from "@/components/ui";
import {
  completeDeletionRequest,
  listDeletionRequests,
  rejectDeletionRequest,
} from "@/lib/api";
import type { DeletionRequest } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function statusVariant(status: DeletionRequest["status"]) {
  switch (status) {
    case "pending":
      return "slate" as const;
    case "completed":
      return "mint" as const;
    case "rejected":
      return "danger" as const;
    default:
      return "slate" as const;
  }
}

export default function DeletionRequestsPage() {
  const { accessToken } = useAuth();
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadRequests() {
    if (!accessToken) return;
    setLoading(true);
    setError("");

    try {
      const result = await listDeletionRequests(accessToken, { limit: 50 });
      setRequests(result.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [accessToken]);

  async function handleComplete(id: string) {
    if (!accessToken) return;
    if (
      !window.confirm(
        "Permanently delete this user's account and all associated data?"
      )
    ) {
      return;
    }

    setActionId(id);
    setMessage("");
    try {
      await completeDeletionRequest(accessToken, id);
      setMessage("Account deleted and request marked completed.");
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id: string) {
    if (!accessToken) return;
    const adminNotes = window.prompt("Optional note for rejection:") ?? "";

    setActionId(id);
    setMessage("");
    try {
      await rejectDeletionRequest(accessToken, id, adminNotes);
      setMessage("Request rejected.");
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reject request");
    } finally {
      setActionId(null);
    }
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Deletion requests
            </h1>
            <p className="mt-1 text-sm text-muted">
              Review Play Store / privacy deletion requests and permanently delete
              accounts.
            </p>
          </div>
          <Link
            href="/delete-account"
            className="text-sm font-medium text-mint hover:underline"
            target="_blank"
          >
            Public deletion page ↗
          </Link>
        </div>

        {message ? (
          <p className="rounded-xl border border-mint/30 bg-[rgba(45,212,191,0.08)] px-4 py-3 text-sm">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-danger bg-[rgba(229,72,77,0.08)] px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        {loading ? <p className="text-sm text-muted">Loading requests...</p> : null}

        {!loading && requests.length === 0 ? (
          <p className="text-sm text-muted">No deletion requests yet.</p>
        ) : null}

        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{request.email}</p>
                  <p className="mt-1 text-sm text-muted">
                    Requested {formatDate(request.requested_at)} · Source:{" "}
                    {request.source}
                  </p>
                  {request.user_id ? (
                    <Link
                      href={`/users/${request.user_id}`}
                      className="mt-1 inline-block text-sm text-mint hover:underline"
                    >
                      View user profile
                    </Link>
                  ) : (
                    <p className="mt-1 text-sm text-muted">
                      No matching account found yet
                    </p>
                  )}
                </div>
                <Badge variant={statusVariant(request.status)}>
                  {request.status}
                </Badge>
              </div>

              {request.reason ? (
                <p className="mt-3 text-sm text-muted">
                  <span className="font-medium text-foreground">Reason:</span>{" "}
                  {request.reason}
                </p>
              ) : null}

              {request.status === "pending" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleComplete(request.id)}
                    disabled={actionId === request.id}
                  >
                    {actionId === request.id
                      ? "Deleting..."
                      : "Delete account & data"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleReject(request.id)}
                    disabled={actionId === request.id}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted">
                  Processed {formatDate(request.processed_at)}
                  {request.admin_notes ? ` · ${request.admin_notes}` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}
