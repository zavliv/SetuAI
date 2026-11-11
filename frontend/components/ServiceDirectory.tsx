"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { services, type Category } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { ArrowRightIcon, SearchIcon } from "./icons";
import ServiceIcon from "./ServiceIcon";

const CATEGORIES: Category[] = ["identity", "travel", "money", "health", "farm", "certificate"];

export default function ServiceDirectory({ showFilters = false, chips = false }: { showFilters?: boolean; chips?: boolean }) {
  const { t, pick } = useLang();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (!q) return true;
      return [s.title.en, s.title.hi, s.note.en, s.note.hi].join(" ").toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <div>
      {(showFilters || chips) && (
        <div className="mb-6 space-y-4">
          {showFilters && (
            <div className="group flex items-center gap-3 rounded-2xl border border-ink/20 bg-white px-5 shadow-sm transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15">
              <SearchIcon className="size-5 shrink-0 text-muted transition-colors group-focus-within:text-brand" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.ui.search}
                aria-label={t.ui.search}
                className="w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.ui.categories.identity}>
            {(["all", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  category === c
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink hover:border-brand hover:text-brand"
                }`}
              >
                {c === "all" ? t.ui.all : t.ui.categories[c]}
              </button>
            ))}
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-8 text-center text-muted">
          {t.ui.noResult}{" "}
          <Link href="/chat" className="font-medium text-brand hover:underline">
            {t.nav.ask}
          </Link>
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <li key={s.id}>
              <Link
                href={`/services/${s.id}`}
                className="group flex h-full items-start gap-4 rounded-lg border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-tint text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <ServiceIcon id={s.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted">
                    {t.ui.categories[s.category]}
                  </span>
                  <span className="mt-0.5 block font-serif text-lg font-semibold leading-snug group-hover:text-brand">
                    {pick(s.title)}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted">{pick(s.note)}</span>
                  <span className="mt-3 block text-xs font-medium text-brand">
                    {t.ui.meta.replace("{p}", String(s.docs.length)).replace("{s}", String(s.steps.length))}
                  </span>
                </span>
                <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
