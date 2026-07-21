import type {
  AdminMaterialDetail,
  AdminUserDetail,
  LeaderboardEntry,
  MaterialSearchResult,
  PlatformStats,
  UserSearchResult,
} from "./types";
import type { LegalDocument } from "./legal";
import type { AppVersionConfig } from "./appVersion";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function adminFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AdminApiError(
      data.error ?? "Request failed",
      response.status
    );
  }

  return data as T;
}

export function getStats(token: string) {
  return adminFetch<PlatformStats>("/stats", token);
}

export function searchUsers(
  token: string,
  params?: { q?: string; page?: number; limit?: number }
) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  return adminFetch<UserSearchResult>(
    `/users${query ? `?${query}` : ""}`,
    token
  );
}

export function getUser(token: string, userId: string) {
  return adminFetch<AdminUserDetail>(`/users/${userId}`, token);
}

export function reactivateUser(token: string, userId: string) {
  return adminFetch<{ message: string; user: AdminUserDetail }>(
    `/users/${userId}/reactivate`,
    token,
    { method: "PATCH" }
  );
}

export function deactivateUser(token: string, userId: string) {
  return adminFetch<{ message: string; user: AdminUserDetail }>(
    `/users/${userId}/deactivate`,
    token,
    { method: "PATCH" }
  );
}

export function setUserTier(
  token: string,
  userId: string,
  tier: "PRO" | "FREE"
) {
  return adminFetch<{ message: string }>(`/users/${userId}/subscription`, token, {
    method: "PATCH",
    body: JSON.stringify({ tier }),
  });
}

export function clearUserDevices(token: string, userId: string) {
  return adminFetch<{ message: string }>(`/users/${userId}/devices`, token, {
    method: "DELETE",
  });
}

export function removeUserDevice(
  token: string,
  userId: string,
  deviceId: string
) {
  return adminFetch<{ message: string }>(
    `/users/${userId}/devices/${encodeURIComponent(deviceId)}`,
    token,
    { method: "DELETE" }
  );
}

export function listMaterials(
  token: string,
  params?: { q?: string; page?: number; limit?: number }
) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  return adminFetch<MaterialSearchResult>(
    `/materials${query ? `?${query}` : ""}`,
    token
  );
}

export function getMaterial(token: string, materialId: string) {
  return adminFetch<AdminMaterialDetail>(`/materials/${materialId}`, token);
}

export function getLeaderboard(token: string, limit = 50) {
  return adminFetch<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`, token);
}

export function getLegalDocuments(token: string) {
  return adminFetch<{ documents: LegalDocument[] }>("/legal", token);
}

export function updateLegalDocument(
  token: string,
  slug: "terms" | "privacy",
  content: {
    title: string;
    lastUpdated: string;
    intro: string;
    sections: LegalDocument["sections"];
  }
) {
  return adminFetch<{ message: string; document: LegalDocument }>(
    `/legal/${slug}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify(content),
    }
  );
}

export function listDeletionRequests(
  token: string,
  params?: { status?: string; page?: number; limit?: number }
) {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  const query = search.toString();
  return adminFetch<import("./types").DeletionRequestListResult>(
    `/deletion-requests${query ? `?${query}` : ""}`,
    token
  );
}

export function completeDeletionRequest(
  token: string,
  requestId: string,
  adminNotes?: string
) {
  return adminFetch<{ message: string }>(
    `/deletion-requests/${requestId}/complete`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ adminNotes }),
    }
  );
}

export function rejectDeletionRequest(
  token: string,
  requestId: string,
  adminNotes?: string
) {
  return adminFetch<{ message: string }>(
    `/deletion-requests/${requestId}/reject`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ adminNotes }),
    }
  );
}

export function getAppVersionConfig(token: string) {
  return adminFetch<{ config: AppVersionConfig }>("/app-version", token);
}

export function updateAppVersionConfig(
  token: string,
  payload: {
    latestVersion: string;
    minVersion: string;
    forceUpdate: boolean;
    updateMessage?: string | null;
    iosStoreUrl?: string | null;
    androidStoreUrl?: string | null;
  }
) {
  return adminFetch<{ message: string; config: AppVersionConfig }>(
    "/app-version",
    token,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}
