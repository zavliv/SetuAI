"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth, type User } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { buttonOutline, ErrorNote, formatDate, inputClass, Loading, PageHeader } from "./ui";

export default function UsersView() {
  const { user: me } = useAuth();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(id);
  }, [query]);

  const { data, error, loading, reload } = useApi<User[]>(`/api/admin/users?q=${encodeURIComponent(debounced)}`);

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setActionError("");
    try {
      await action();
      reload();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusyId("");
    }
  };

  const changeRole = (u: User, role: "user" | "admin") =>
    run(u.id, () => api(`/api/admin/users/${u.id}`, { method: "PATCH", body: { role } }));

  const remove = (u: User) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This cannot be undone.`)) return;
    run(u.id, () => api(`/api/admin/users/${u.id}`, { method: "DELETE" }));
  };

  return (
    <>
      <PageHeader title="Users" subtitle="Everyone who has created an account." />

      <div className="mb-4 max-w-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search users"
          className={inputClass}
        />
      </div>

      {actionError && (
        <div className="mb-4">
          <ErrorNote error={actionError} />
        </div>
      )}
      {error && <ErrorNote error={error} />}
      {loading && !data && <Loading />}

      {data && (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
              {data.map((u) => {
                const isMe = u.id === me?.id;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium">
                      {u.name}
                      {isMe && <span className="ml-2 rounded-full bg-tint px-2 py-0.5 text-xs font-medium text-brand">You</span>}
                    </td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={isMe || busyId === u.id}
                        onChange={(e) => changeRole(u, e.target.value as "user" | "admin")}
                        aria-label={`Role for ${u.name}`}
                        className="rounded-lg border border-ink/20 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand disabled:opacity-60"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => remove(u)}
                        disabled={isMe || busyId === u.id}
                        className={`${buttonOutline} !px-3 !py-1.5 text-red-700 hover:!border-red-400 hover:!text-red-700`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
