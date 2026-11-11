"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/lang";
import { schemes, type Profile } from "@/lib/schemes";
import { ExternalIcon } from "./icons";

const EMPTY: Profile = { age: null, income: "", work: "" };

const field =
  "mt-1.5 w-full rounded-xl border border-ink/20 bg-white px-3.5 py-3 text-base outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";

export default function SchemeFinder() {
  const { t, pick } = useLang();
  const [profile, setProfile] = useState<Profile>(EMPTY);

  const filled = profile.age !== null || profile.income !== "" || profile.work !== "";
  const answered = [profile.age !== null, profile.income !== "", profile.work !== ""].filter(Boolean).length;
  const results = useMemo(() => schemes.filter((s) => s.matches(profile)), [profile]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{t.schemes.title}</h1>
      <p className="mt-3 text-lg text-muted">{t.schemes.intro}</p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-5 self-start rounded-xl border border-line bg-white p-5 shadow-md"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-muted">
              <span>{t.ui.progress.replace("{n}", String(answered))}</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < answered ? "bg-brand" : "bg-line"}`} />
              ))}
            </div>
          </div>

          <label className="block text-sm font-semibold">
            {t.schemes.age}
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              value={profile.age ?? ""}
              onChange={(e) => setProfile({ ...profile, age: e.target.value === "" ? null : Number(e.target.value) })}
              className={`${field} font-normal`}
            />
          </label>

          <label className="block text-sm font-semibold">
            {t.schemes.income}
            <select
              value={profile.income}
              onChange={(e) => setProfile({ ...profile, income: e.target.value as Profile["income"] })}
              className={`${field} font-normal`}
            >
              <option value="">{t.schemes.choose}</option>
              {Object.entries(t.schemes.incomeOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold">
            {t.schemes.work}
            <select
              value={profile.work}
              onChange={(e) => setProfile({ ...profile, work: e.target.value as Profile["work"] })}
              className={`${field} font-normal`}
            >
              <option value="">{t.schemes.choose}</option>
              {Object.entries(t.schemes.workOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {filled && (
            <button type="button" onClick={() => setProfile(EMPTY)} className="text-sm font-medium text-brand hover:underline">
              {t.schemes.clear}
            </button>
          )}
        </form>

        <section aria-live="polite">
          <h2 className="font-serif text-2xl font-semibold">
            {filled && results.length > 0 ? t.ui.found.replace("{n}", String(results.length)) : t.schemes.results}
          </h2>

          {!filled && <p className="mt-4 rounded-md border border-dashed border-line p-6 text-muted">{t.schemes.empty}</p>}
          {filled && results.length === 0 && (
            <p className="mt-4 rounded-md border border-dashed border-line p-6 text-muted">{t.schemes.none}</p>
          )}

          <ul className="mt-4 space-y-4">
            {results.map((s) => (
              <li key={s.id} className="rounded-xl border border-line bg-white p-5 transition hover:border-brand hover:shadow-md">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-serif text-xl font-semibold">{pick(s.title)}</h3>
                  <span className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-medium text-brand">{t.schemes.may}</span>
                </div>
                <p className="mt-2 leading-7 text-muted">
                  <span className="font-medium text-ink">{t.schemes.why}: </span>
                  {pick(s.why)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium">
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-brand hover:underline">
                    {t.schemes.visit}
                    <ExternalIcon className="size-3.5" />
                  </a>
                  {s.serviceId && (
                    <Link href={`/services/${s.serviceId}`} className="text-brand hover:underline">
                      {t.schemes.steps}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-6 text-muted">{t.schemes.note}</p>
        </section>
      </div>
    </div>
  );
}
