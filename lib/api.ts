import type {
  AdminMaterialDetail,
  AdminUserDetail,
  LeaderboardEntry,
  MaterialSearchResult,
  PlatformStats,
  UserSearchResult,
} from "./types";

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
