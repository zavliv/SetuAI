"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { User } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { buttonOutline, buttonPrimary, ErrorNote, formatDate, Loading, PageHeader } from "./ui";

type Stats = { users: number; admins: number; services: number; recent_users: User[] };

export default function DashboardView() {
  const { data, error, loading, reload } = useApi<Stats>("/api/admin/stats");
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState("");

  const seed = async () => {
    setSeeding(true);
    setSeedError("");
    try {
      await api("/api/admin/services/seed", { method: "POST" });
      reload();
    } catch (e) {
      setSeedError(e instanceof ApiError ? e.message : "Could not add sample services.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A quick look at SetuAI." />

      {loading && !data && <Loading />}
      {error && !data && <ErrorNote error={error} />}

      {data && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Users", value: data.users },
              { label: "Admins", value: data.admins },
              { label: "Services", value: data.services },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-line bg-white p-5 shadow-sm">
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-1 font-serif text-4xl font-semibold text-brand">{card.value}</p>
              </div>
            ))}
          </div>

          {data.services === 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand/20 bg-tint p-5">
              <p className="max-w-xl text-sm leading-6">
                No services are stored in the database yet. Add the 10 sample services to start managing them here.
              </p>
              <button type="button" onClick={seed} disabled={seeding} className={buttonPrimary}>
                {seeding ? "Adding..." : "Add sample services"}
              </button>
            </div>
          )}
          {seedError && <ErrorNote error={seedError} />}

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Recent sign-ups</h2>
              <Link href="/admin/users" className={buttonOutline}>
                All users
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {data.recent_users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-muted">
                        No users yet.
                      </td>
                    </tr>
                  )}
                  {data.recent_users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3 text-muted">{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
