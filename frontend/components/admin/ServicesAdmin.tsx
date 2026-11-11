"use client";

import Link from "next/link";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { strings } from "@/lib/i18n";
import { useApi } from "@/lib/useApi";
import type { ServiceDoc } from "./ServiceForm";
import { buttonOutline, buttonPrimary, ErrorNote, formatDate, Loading, PageHeader } from "./ui";

export default function ServicesAdmin() {
  const { data, error, loading, reload } = useApi<ServiceDoc[]>("/api/admin/services");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setActionError("");
    setMessage("");
    try {
      await action();
      reload();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const seed = () =>
    run(async () => {
      const result = await api<{ inserted: number }>("/api/admin/services/seed", { method: "POST" });
      setMessage(result.inserted === 0 ? "All sample services are already added." : `Added ${result.inserted} sample services.`);
    });

  const remove = (s: ServiceDoc) => {
    if (!window.confirm(`Delete "${s.title.en}"? This cannot be undone.`)) return;
    run(() => api(`/api/admin/services/${s.slug}`, { method: "DELETE" }));
  };

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="The records SetuAI answers from."
        actions={
          <>
            <button type="button" onClick={seed} disabled={busy} className={buttonOutline}>
              Add sample services
            </button>
            <Link href="/admin/services/new" className={buttonPrimary}>
              New service
            </Link>
          </>
        }
      />

      {message && <p className="mb-4 rounded-lg border border-brand/20 bg-tint px-4 py-3 text-sm">{message}</p>}
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
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No services yet. Add the sample services or create a new one.
                  </td>
                </tr>
              )}
              {data.map((s) => (
                <tr key={s.slug}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{s.title.en}</p>
                    {s.title.hi && <p className="text-muted">{s.title.hi}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{s.slug}</td>
                  <td className="px-4 py-3 text-muted">{strings.en.ui.categories[s.category]}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(s.updated_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={`/admin/services/${s.slug}`} className={`${buttonOutline} !px-3 !py-1.5`}>
                      Edit
                    </Link>{" "}
                    <button
                      type="button"
                      onClick={() => remove(s)}
                      disabled={busy}
                      className={`${buttonOutline} !px-3 !py-1.5 text-red-700 hover:!border-red-400 hover:!text-red-700`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
