"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { Badge, Button, Input } from "@/components/ui";
import { searchUsers } from "@/lib/api";
import type { AdminUserSummary } from "@/lib/types";

export default function UsersPage() {
  const { accessToken } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers(search = "") {
    if (!accessToken) return;
    setLoading(true);
    setError("");

    try {
      const result = await searchUsers(accessToken, { q: search, page: 1, limit: 25 });
      setUsers(result.users);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [accessToken]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    loadUsers(query.trim());
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Users</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Search by name, phone, or email
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
          />
          <Button type="submit" className="w-full sm:w-auto sm:shrink-0">
            Search
          </Button>
        </form>

        {error ? (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] sm:px-5">
            {loading ? "Loading..." : `${total} user${total === 1 ? "" : "s"}`}
          </div>

          <div className="divide-y divide-[var(--border)]">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="block px-4 py-4 transition hover:bg-[var(--mint-soft)] sm:px-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-sm text-[var(--muted)]">
                      {user.email ?? "No email"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={user.isPro ? "mint" : "slate"}>
                      {user.tier}
                    </Badge>
                    <span className="text-xs text-[var(--muted)]">
                      {user.usage.attempts} attempts
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {!loading && users.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                No users found
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
